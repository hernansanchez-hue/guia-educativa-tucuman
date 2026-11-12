
-- Final CMS console: additive, no public copy or legal/lead changes. Remote timestamp aligned.
alter table public.cms_audit_logs drop constraint cms_audit_logs_action_check;
alter table public.cms_audit_logs add constraint cms_audit_logs_action_check check(action in ('LOGIN','LOGOUT','CREATE','UPDATE_DRAFT','PUBLISH','UNPUBLISH','ARCHIVE','RESTORE','MANAGE_PROFILE','BOOTSTRAP','IMPORT','MANAGE_MEDIA','INVITE_USER','MANAGE_REDIRECT'));
alter table public.cms_redirects add column status_code integer not null default 308 check(status_code in (301,302,307,308));
alter table public.cms_redirects add column origin text not null default 'slug' check(origin in ('slug','manual'));
create index cms_audit_created_idx on public.cms_audit_logs(created_at desc);
create index cms_documents_kind_updated_idx on public.cms_documents((draft->>'_kind'),updated_at desc);
create function cms_private.final_guard() returns trigger language plpgsql set search_path='' as $$
declare k text;v jsonb;d jsonb:=new.draft->'data';s jsonb:=new.draft->'seo';
begin
 if new.module_id in ('design','settings') then
  if new.entity_key<>'main' or jsonb_typeof(d)<>'object' or new.draft ? '_kind' or exists(select 1 from jsonb_object_keys(new.draft) a where a<>'data') then raise exception 'Invalid global configuration' using errcode='22023';end if;
  if tg_op='UPDATE' and old.published_version is not null and (new.published_version is null or new.state='archived') then raise exception 'Global configuration cannot be withdrawn' using errcode='22023';end if;
  for k,v in select key,value from jsonb_each(d) loop
   if new.module_id='design' then
    if k in ('primary','accent','text','muted') then if jsonb_typeof(v)<>'string' or v#>>'{}' !~ '^#[0-9a-fA-F]{6}$' then raise exception 'Invalid token' using errcode='22023';end if;
    elsif k in ('bodySize','headingSize','radius') then if jsonb_typeof(v)<>'number' or (k='bodySize' and (v#>>'{}')::numeric not between 14 and 20) or (k='headingSize' and (v#>>'{}')::numeric not between 32 and 80) or (k='radius' and (v#>>'{}')::numeric not between 4 and 24) then raise exception 'Invalid size' using errcode='22023';end if;
    elsif k='font' then if v#>>'{}' not in ('Poppins','Geist','Arial') then raise exception 'Unsupported font' using errcode='22023';end if;
    elsif k='shadow' then if v#>>'{}' not in ('suave','actual','sin') then raise exception 'Unsupported shadow' using errcode='22023';end if;
    elsif k in ('button','spacing') then if v#>>'{}' not in ('compacto','actual','amplio') then raise exception 'Unsupported preset' using errcode='22023';end if;
    else raise exception 'Unsupported token' using errcode='22023';end if;
   else
    if k not in ('siteName','description','ogImage','favicon') or jsonb_typeof(v)<>'string' then raise exception 'Unsupported setting' using errcode='22023';end if;
    if k='siteName' and length(btrim(v#>>'{}')) not between 1 and 120 then raise exception 'Invalid site name' using errcode='22023';end if;
    if k='description' and length(v#>>'{}')>500 then raise exception 'Invalid description' using errcode='22023';end if;
    if k in ('ogImage','favicon') and v#>>'{}'<>'' and not cms_private.content_resources_safe(jsonb_build_object('image',v)) then raise exception 'Invalid resource' using errcode='22023';end if;
   end if;
  end loop;
  if new.module_id='settings' and not(d ?& array['siteName','description','ogImage','favicon']) then raise exception 'Incomplete settings' using errcode='22023';end if;
 end if;
 if s is not null then
  if jsonb_typeof(s)<>'object' or exists(select 1 from jsonb_object_keys(s) a where a<>all(array['title','description','ogTitle','ogDescription','image','canonical','noindex'])) then raise exception 'Unsupported SEO' using errcode='22023';end if;
  for k,v in select key,value from jsonb_each(s) loop
   if k='noindex' then if jsonb_typeof(v)<>'boolean' then raise exception 'Invalid index flag' using errcode='22023';end if;
   elsif jsonb_typeof(v)<>'string' or length(v#>>'{}')>1000 then raise exception 'Invalid SEO text' using errcode='22023';end if;
  end loop;
  if s->>'canonical' is not null and s->>'canonical'<>'' and (s->>'canonical' !~ '^/$|^(/[a-z0-9-]+)+$' or s->>'canonical' ~ '^/(admin|api|media|docs)(/|$)') then raise exception 'Invalid canonical' using errcode='22023';end if;
  if not cms_private.content_resources_safe(s) then raise exception 'Unsafe SEO resource' using errcode='22023';end if;
 end if;
 return new;
end; $$;
create trigger cms_final_guard before insert or update on public.cms_documents for each row execute function cms_private.final_guard();
-- Only two safe public projections, validated by the guard; never return drafts/settings secrets.
create function cms_private.site_configuration() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_object_agg(d.module_id,v.snapshot->'data'),'{}')
 from public.cms_documents d join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
 where d.module_id in ('design','settings') and d.entity_key='main' and d.state<>'archived'
$$;
create function public.cms_site_configuration() returns jsonb language sql stable security invoker set search_path='' as $$select cms_private.site_configuration()$$;
-- Minimal paginated DTOs. RLS/permission equivalent enforced inside this private definer.
create function cms_private.console_query(p_kind text,p_filters jsonb default '{}') returns jsonb language plpgsql stable security definer set search_path='' as $$
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
   select d.id,d.module_id,d.entity_key,d.state,d.published_version,d.updated_at,d.draft, v.snapshot published,
     coalesce(p.display_name,'Importación') editor_name
   from public.cms_documents d left join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
    left join public.admin_profiles p on p.id=d.updated_by
   where d.draft->>'_kind' in ('home','city','institution','offering','event','events-page','service','services-page','training-offering','about')
    and (coalesce(p_filters->>'type','')='' or d.module_id=p_filters->>'type')
    and (coalesce(p_filters->>'state','')='' or d.state=p_filters->>'state')
    and (coalesce(p_filters->>'city','')='' or coalesce(d.draft->'data'->>'cityId',d.draft->'data'->>'city')=p_filters->>'city')
    and (q='' or coalesce(d.draft->'data'->>'name',d.draft->'data'->>'degree',d.entity_key) ilike '%'||q||'%')
   order by d.updated_at desc limit 25 offset offset_n)t;
 elsif p_kind='summary' then
  select jsonb_build_object('kinds',(select coalesce(jsonb_object_agg(k,n),'{}') from(select draft->>'_kind' k,count(*) n from public.cms_documents where state<>'archived' and draft ? '_kind' group by draft->>'_kind')a),
   'states',(select jsonb_object_agg(state,n) from(select state,count(*) n from public.cms_documents where cms_private.can_content(module_id,'read') group by state)a),
   'media',(select count(*) from public.cms_media_assets where state='ready')) into result;
 else raise exception 'Unknown query' using errcode='22023';end if;
 return result;
end; $$;
create function public.cms_console_query(p_kind text,p_filters jsonb default '{}') returns jsonb language sql stable security invoker set search_path='' as $$select cms_private.console_query(p_kind,p_filters)$$;
create function cms_private.invited_profile(p_id uuid,p_name text,p_role text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not cms_private.can_perform('users') then raise exception 'CMS access denied' using errcode='42501';end if;
 if p_role not in ('ADMIN','EDITOR') or length(btrim(p_name)) not between 1 and 120 or not exists(select 1 from auth.users where id=p_id and invited_at is not null and not coalesce(is_anonymous,false)) or exists(select 1 from public.admin_profiles where id=p_id) then raise exception 'Invalid invitation' using errcode='22023';end if;
 insert into public.admin_profiles(id,display_name,role) values(p_id,p_name,p_role);
 insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id,metadata) values(auth.uid(),'INVITE_USER','users',p_id,jsonb_build_object('role',p_role,'verificationRequired',true));
end; $$;
create function public.cms_invited_profile(p_id uuid,p_name text,p_role text) returns void language sql security invoker set search_path='' as $$select cms_private.invited_profile(p_id,p_name,p_role)$$;
create function cms_private.redirect_guard() returns trigger language plpgsql set search_path='' as $$
begin
 perform pg_advisory_xact_lock(713040031);
 if exists(select 1 from public.cms_redirects r where r.source=new.destination or r.destination=new.source and r.source<>new.source) then raise exception 'Redirect loop or chain' using errcode='22023';end if;
 return new;
end; $$;
create trigger cms_redirect_safe before insert or update on public.cms_redirects for each row execute function cms_private.redirect_guard();
create function cms_private.manual_redirect(p_source text,p_destination text,p_status integer) returns void language plpgsql security definer set search_path='' as $$
begin
 if not cms_private.can_perform('publish') then raise exception 'CMS access denied' using errcode='42501';end if;
 perform pg_advisory_xact_lock(713040031);
 insert into public.cms_redirects(source,destination,status_code,origin,created_by) values(p_source,p_destination,p_status,'manual',auth.uid());
 insert into public.cms_audit_logs(actor_id,action,entity_type,metadata) values(auth.uid(),'MANAGE_REDIRECT','seo',jsonb_build_object('source',p_source,'destination',p_destination,'status',p_status));
end; $$;
create function public.cms_manual_redirect(p_source text,p_destination text,p_status integer) returns void language sql security invoker set search_path='' as $$select cms_private.manual_redirect(p_source,p_destination,p_status)$$;
create function cms_private.redirect_record(p_source text) returns jsonb language sql stable security definer set search_path='' as $$select jsonb_build_object('destination',destination,'status',status_code) from public.cms_redirects where source=p_source$$;
create function public.cms_redirect_record(p_source text) returns jsonb language sql stable security invoker set search_path='' as $$select cms_private.redirect_record(p_source)$$;
revoke all on function cms_private.final_guard(),cms_private.site_configuration(),cms_private.console_query(text,jsonb),cms_private.invited_profile(uuid,text,text),cms_private.redirect_guard(),cms_private.manual_redirect(text,text,integer),cms_private.redirect_record(text) from public,anon,authenticated;
grant execute on function cms_private.site_configuration(),cms_private.redirect_record(text) to anon,authenticated;
grant execute on function cms_private.console_query(text,jsonb),cms_private.invited_profile(uuid,text,text),cms_private.manual_redirect(text,text,integer) to authenticated;
revoke all on function public.cms_site_configuration(),public.cms_console_query(text,jsonb),public.cms_invited_profile(uuid,text,text),public.cms_manual_redirect(text,text,integer),public.cms_redirect_record(text) from public,anon,authenticated;
grant execute on function public.cms_site_configuration(),public.cms_redirect_record(text) to anon,authenticated;
grant execute on function public.cms_console_query(text,jsonb),public.cms_invited_profile(uuid,text,text),public.cms_manual_redirect(text,text,integer) to authenticated;
-- Initial approved state: no design overrides; defaults identical to existing metadata.
do $$declare m text;p jsonb;d public.cms_documents;begin
 foreach m in array array['design','settings'] loop
  p:=case when m='design' then '{"data":{}}'::jsonb else '{"data":{"siteName":"Guía Educativa Tucumán","description":"Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.","ogImage":"","favicon":""}}'::jsonb end;
  insert into public.cms_documents(module_id,entity_key,draft,state) values(m,'main',p,'draft') on conflict(module_id,entity_key) do nothing returning * into d;
  if d.id is not null then
   insert into public.cms_versions(document_id,version_number,schema_version,snapshot,origin) values(d.id,1,1,p,'import');
   update public.cms_documents set published_version=1,state='published' where id=d.id;
   insert into public.cms_audit_logs(actor_kind,action,entity_type,entity_id,metadata) values('migration','IMPORT',m,d.id,'{"source":"approved-defaults-no-visual-change"}');
  end if;
 end loop;
end; $$;
