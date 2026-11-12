-- Confirmed remote migration after a transient connector disconnect.
create or replace function cms_private.console_query(p_kind text,p_filters jsonb default '{}') returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;offset_n integer:=greatest(0,least(10000,coalesce((p_filters->>'page')::integer,1)-1))*25;q text:=left(coalesce(p_filters->>'q',''),120);doc uuid;
begin
 if not cms_private.can_perform('read') then raise exception 'CMS access denied' using errcode='42501';end if;
 if p_kind='users' then
  if not cms_private.can_perform('users') then raise exception 'CMS access denied' using errcode='42501';end if;
  select coalesce(jsonb_agg(row_to_json(t)),'[]') into result from (
   select p.id,p.display_name,p.role,p.status,p.can_publish,p.created_at,p.last_login_at,u.email,u.email_confirmed_at is not null as confirmed
   from public.admin_profiles p join auth.users u on u.id=p.id order by p.created_at desc limit 25 offset offset_n)t;
 elsif p_kind='history' then
  select coalesce(jsonb_agg(row_to_json(t)),'[]') into result from (
   select a.id,a.actor_id,coalesce(p.display_name,case when a.actor_kind='migration' then 'Importación' else 'Usuario anterior' end) actor_name,a.action,a.entity_type,a.entity_id,a.metadata,a.created_at,d.state,d.published_version,d.entity_key,
    coalesce(d.draft->'data'->>'name',d.draft->'data'->>'degree',d.entity_key,a.entity_type) entity_name
   from public.cms_audit_logs a left join public.admin_profiles p on p.id=a.actor_id left join public.cms_documents d on d.id=a.entity_id
   where (d.id is null and a.entity_type not in ('users','auth','design','settings') or cms_private.can_content(coalesce(d.module_id,a.entity_type),'read'))
    and (a.entity_type<>'users' or cms_private.can_perform('users'))
    and (coalesce(p_filters->>'action','')='' or a.action=p_filters->>'action')
    and (coalesce(p_filters->>'type','')='' or a.entity_type=p_filters->>'type')
    and (coalesce(p_filters->>'user','')='' or a.actor_id::text=p_filters->>'user')
    and (coalesce(p_filters->>'entity','')='' or a.entity_id::text=p_filters->>'entity')
    and (coalesce(p_filters->>'from','')='' or a.created_at>=(p_filters->>'from')::date)
    and (coalesce(p_filters->>'to','')='' or a.created_at<(p_filters->>'to')::date+interval '1 day')
   order by a.created_at desc,a.id desc limit 25 offset offset_n)t;
 elsif p_kind='search' then
  select coalesce(jsonb_agg(row_to_json(t)),'[]') into result from (
   select d.id,d.module_id,d.entity_key,d.state,jsonb_build_object('_kind',d.draft->>'_kind') draft,
    coalesce(d.draft->'data'->>'name',b.draft->'data'->>'name',d.draft->'data'->>'degree',d.entity_key) name
   from public.cms_documents d left join public.cms_documents b on b.draft->'data'->>'id'=coalesce(d.draft->'data'->>'brandId',d.draft->'data'->>'careerId',d.draft->'data'->>'trainingProgramId')
   where d.draft->>'_kind' in ('city','institution','offering','event','service','training-offering') and d.state<>'archived'
    and (d.draft->'data'->>'name' ilike '%'||q||'%' or d.draft->'data'->>'degree' ilike '%'||q||'%' or b.draft->'data'->>'name' ilike '%'||q||'%')
   order by d.updated_at desc limit 20)t;
 elsif p_kind='seo' then
  select coalesce(jsonb_agg(row_to_json(t)),'[]') into result from (
   select d.id,d.module_id,d.entity_key,d.state,d.revision,d.published_version,d.updated_at,d.draft, v.snapshot published,
     coalesce(p.display_name,'Importación') editor_name
   from public.cms_documents d left join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
    left join public.admin_profiles p on p.id=d.updated_by
   where d.draft->>'_kind' in ('home','city','brand','institution','career','offering','event','events-page','service','services-page','training-offering','about')
    and (coalesce(p_filters->>'type','')='' or d.module_id=p_filters->>'type')
    and (coalesce(p_filters->>'state','')='' or d.state=p_filters->>'state')
    and (coalesce(p_filters->>'city','')='' or coalesce(d.draft->'data'->>'cityId',d.draft->'data'->>'city')=p_filters->>'city')
    and (q='' or coalesce(d.draft->'data'->>'name',d.draft->'data'->>'degree',d.entity_key) ilike '%'||q||'%')
   order by d.updated_at desc limit 25 offset offset_n)t;
 elsif p_kind='seo-metrics' then
 select jsonb_build_object('total',count(*),'published',count(*) filter(where d.published_version is not null and d.state<>'archived'),
 'noindex',count(*) filter(where v.snapshot->'seo'->>'noindex'='true'),
 'missingTitles',count(*) filter(where coalesce(v.snapshot->'seo'->>'title',v.snapshot->'data'->>'name',v.snapshot->'data'->>'degree','')=''),
 'missingDescriptions',count(*) filter(where coalesce(v.snapshot->'seo'->>'description',v.snapshot->'data'->>'description',v.snapshot->'data'->>'heroDescription','')=''),
 'missingImages',count(*) filter(where coalesce(v.snapshot->'seo'->>'image',v.snapshot->'data'->>'image',v.snapshot->'data'->>'heroImage','')=''))
 into result from public.cms_documents d left join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
 where d.draft->>'_kind' in ('home','city','brand','institution','career','offering','event','events-page','service','services-page','training-offering','about');
 elsif p_kind='summary' then
  select jsonb_build_object('kinds',(select coalesce(jsonb_object_agg(k,n),'{}') from(select draft->>'_kind' k,count(*) n from public.cms_documents where state<>'archived' and draft ? '_kind' group by draft->>'_kind')a),
   'states',(select jsonb_object_agg(state,n) from(select state,count(*) n from public.cms_documents where cms_private.can_content(module_id,'read') group by state)a),
   'media',(select count(*) from public.cms_media_assets where state='ready')) into result;
 else raise exception 'Unknown query' using errcode='22023';end if;
 return result;
end; $$;

create or replace function cms_private.manage_profile(p_id uuid,p_name text,p_role text,p_status text,p_can_publish boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor public.admin_profiles;result public.admin_profiles;previous public.admin_profiles;
begin
 if not cms_private.can_perform('users') then raise exception 'CMS access denied' using errcode='42501';end if;
 actor:=cms_private.current_profile();
 lock table public.admin_profiles in share row exclusive mode;
 select * into previous from public.admin_profiles where id=p_id;
 if p_role is null or p_role not in ('SUPERADMIN','ADMIN','EDITOR') or p_status is null or p_status not in ('active','disabled') or p_can_publish is null or length(btrim(p_name)) not between 1 and 120 then raise exception 'Invalid profile' using errcode='22023';end if;
 if not exists(select 1 from auth.users where id=p_id and email_confirmed_at is not null and not coalesce(is_anonymous,false)) then raise exception 'Verified user required' using errcode='22023';end if;
 if previous.role='SUPERADMIN' and previous.status='active' and (p_role<>'SUPERADMIN' or p_status<>'active') and (select count(*) from public.admin_profiles where role='SUPERADMIN' and status='active')<=1 then raise exception 'Cannot disable last superadmin' using errcode='22023';end if;
 insert into public.admin_profiles(id,display_name,role,status,can_publish) values(p_id,p_name,p_role,p_status,p_can_publish)
 on conflict(id) do update set display_name=excluded.display_name,role=excluded.role,status=excluded.status,can_publish=excluded.can_publish returning * into result;
 insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id,metadata) values(actor.id,'MANAGE_PROFILE','users',p_id,jsonb_build_object('before',to_jsonb(previous),'after',to_jsonb(result)));
 return to_jsonb(result);
end; $$;
