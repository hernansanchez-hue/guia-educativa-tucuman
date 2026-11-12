-- Progressive editorial catalog; no legacy public table is overwritten.
alter table public.cms_versions alter column created_by drop not null;
alter table public.cms_versions add column origin text not null default 'editorial' check(origin in ('editorial','import'));
alter table public.cms_versions add constraint cms_version_actor_required check(created_by is not null or origin='import');
alter table public.cms_audit_logs alter column actor_id drop not null;
alter table public.cms_audit_logs add column actor_kind text not null default 'user' check(actor_kind in ('user','migration'));
alter table public.cms_audit_logs add constraint cms_audit_actor_required check(actor_id is not null or actor_kind='migration');
alter table public.cms_audit_logs drop constraint cms_audit_logs_action_check;
alter table public.cms_audit_logs add constraint cms_audit_logs_action_check check(action in ('LOGIN','LOGOUT','CREATE','UPDATE_DRAFT','PUBLISH','UNPUBLISH','ARCHIVE','RESTORE','MANAGE_PROFILE','BOOTSTRAP','IMPORT'));

create function cms_private.public_entries() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('moduleId',d.module_id,'key',d.entity_key,'visibility',case when d.state='archived' or d.published_version is null then 'hidden' else 'published' end,
   'payload',case when d.state='archived' or d.published_version is null then null else v.snapshot end)), '[]'::jsonb)
 from public.cms_documents d left join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
 where d.module_id in ('cities','institutions','careers') and (d.published_version is not null or d.state='archived' or exists(select 1 from public.cms_versions h where h.document_id=d.id))
$$;
create function public.cms_public_entries() returns jsonb language sql stable security invoker set search_path='' as $$ select cms_private.public_entries() $$;

create table public.cms_redirects(source text primary key, destination text not null,
 created_by uuid not null,created_at timestamptz not null default now(),
 check(source ~ '^(/[a-z0-9-]+)+$' and destination ~ '^(/[a-z0-9-]+)+$' and source<>destination and source !~ '^/admin' and destination !~ '^/admin'));
alter table public.cms_redirects enable row level security;
revoke all on public.cms_redirects from public,anon,authenticated;
grant select on public.cms_redirects to authenticated;
create policy cms_redirects_team_read on public.cms_redirects for select to authenticated using((select cms_private.can_perform('read')));
create function cms_private.read_redirect(p_source text) returns text language sql stable security definer set search_path='' as $$ select destination from public.cms_redirects where source=p_source $$;
create function public.cms_read_redirect(p_source text) returns text language sql stable security invoker set search_path='' as $$ select cms_private.read_redirect(p_source) $$;

create function cms_private.editorial_guard() returns trigger language plpgsql set search_path='' as $$
declare p jsonb:=new.draft; d jsonb:=p->'data'; k text:=p->>'_kind'; expected text;
begin
 if k is null then return new; end if; -- Phase-2 generic documents never render as catalog entries.
 expected:=case k when 'city' then 'cities' when 'brand' then 'institutions' when 'institution' then 'institutions' when 'career' then 'careers' when 'offering' then 'careers' end;
 if expected is null or expected<>new.module_id or jsonb_typeof(d)<>'object' or coalesce(length(d->>'id'),0) not between 1 and 120 then raise exception 'Invalid editorial identity' using errcode='22023'; end if;
 if tg_op='UPDATE' and (old.draft->>'_kind' is distinct from k or old.draft->'data'->>'id' is distinct from d->>'id') then raise exception 'Stable identity cannot change' using errcode='22023'; end if;
 if k in ('city','brand','career','institution') and coalesce(d->>'slug','') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Invalid slug' using errcode='22023'; end if;
 if k in ('city','brand','career') and coalesce(length(btrim(d->>'name')),0)=0 then raise exception 'Name required' using errcode='22023'; end if;
 if p->'design'->>'color' is not null and p->'design'->>'color' !~ '^#[0-9a-fA-F]{6}$' then raise exception 'Invalid color' using errcode='22023'; end if;
 if p->'design'->>'titleSize' is not null and (p->'design'->>'titleSize')::numeric not between 32 and 80 then raise exception 'Invalid title size' using errcode='22023'; end if;
 if p->'design'->>'align' is not null and p->'design'->>'align' not in ('left','center') then raise exception 'Invalid alignment' using errcode='22023'; end if;
 return new;
end; $$;
create trigger cms_editorial_payload_guard before insert or update of draft on public.cms_documents for each row execute function cms_private.editorial_guard();

create function cms_private.editorial_bundle(p_operation text,p_parts jsonb,p_redirects jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare part jsonb; d public.cms_documents; result jsonb; results jsonb:='[]'; rev integer; red jsonb;
begin
 if p_operation not in ('save','publish') or not cms_private.can_perform(case when p_operation='publish' then 'publish' else 'edit' end) then raise exception 'CMS access denied' using errcode='42501'; end if;
 if jsonb_typeof(p_parts)<>'array' or jsonb_array_length(p_parts) not between 1 and 3 then raise exception 'Invalid editorial bundle' using errcode='22023'; end if;
 for part in select value from jsonb_array_elements(p_parts) order by value->>'id' loop
   select * into d from public.cms_documents where id=(part->>'id')::uuid for update;
   rev:=(part->>'revision')::integer;
   if d.id is null or rev is null or rev<>d.revision then raise exception 'CMS revision conflict' using errcode='40001'; end if;
   if part ? 'payload' and part->'payload' is distinct from d.draft then
     result:=cms_private.mutate_content('save',d.id,null,null,part->'payload',rev,null); rev:=rev+1;
   end if;
   if p_operation='publish' then result:=cms_private.mutate_content('publish',d.id,null,null,null,rev,null);
   else result:=jsonb_build_object('document',(select to_jsonb(row) from public.cms_documents row where row.id=d.id)); end if;
   results:=results||jsonb_build_array(result);
 end loop;
 -- One atomic published catalog: reject duplicate identities/routes and broken relations.
 if p_operation='publish' then
   if exists(select 1 from public.cms_documents a join public.cms_versions av on av.document_id=a.id and av.version_number=a.published_version
     join public.cms_documents b on b.id<>a.id and b.state<>'archived' join public.cms_versions bv on bv.document_id=b.id and bv.version_number=b.published_version
     where a.state<>'archived' and av.snapshot->>'_kind'=bv.snapshot->>'_kind' and av.snapshot->>'_kind' in ('city','career','brand','institution')
      and av.snapshot->'data'->>'slug'=bv.snapshot->'data'->>'slug'
      and (av.snapshot->>'_kind'<>'institution' or av.snapshot->'data'->>'cityId'=bv.snapshot->'data'->>'cityId')) then raise exception 'Duplicate public slug' using errcode='23505'; end if;
   for red in select value from jsonb_array_elements(coalesce(p_redirects,'[]')) loop
     if exists(select 1 from public.cms_redirects where source=red->>'to') then raise exception 'Redirect chains not allowed' using errcode='22023'; end if;
     insert into public.cms_redirects(source,destination,created_by) values(red->>'from',red->>'to',auth.uid()) on conflict(source) do update set destination=excluded.destination,created_by=excluded.created_by;
   end loop;
 end if;
 return results;
end; $$;
create function public.cms_editorial_bundle(p_operation text,p_parts jsonb,p_redirects jsonb default '[]') returns jsonb language sql security invoker set search_path='' as $$ select cms_private.editorial_bundle(p_operation,p_parts,p_redirects) $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('cms-media','cms-media',false,5242880,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create function cms_private.media_published(p_name text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.cms_documents d join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version where d.state<>'archived'
 and jsonb_path_exists(v.snapshot,'$.** ? (@ == $url)',jsonb_build_object('url','/media/cms/'||p_name)))
$$;
create policy cms_media_read on storage.objects for select to anon,authenticated using(bucket_id='cms-media' and (cms_private.media_published(name) or ((select auth.uid()) is not null and cms_private.can_perform('media'))));
create policy cms_media_insert on storage.objects for insert to authenticated with check(bucket_id='cms-media' and cms_private.can_perform('media'));
revoke all on function cms_private.public_entries(),cms_private.read_redirect(text),cms_private.editorial_guard(),cms_private.editorial_bundle(text,jsonb,jsonb),cms_private.media_published(text) from public,anon,authenticated;
grant execute on function cms_private.public_entries(),cms_private.read_redirect(text),cms_private.media_published(text) to anon,authenticated;
grant execute on function cms_private.editorial_bundle(text,jsonb,jsonb) to authenticated;
revoke all on function public.cms_public_entries(),public.cms_read_redirect(text),public.cms_editorial_bundle(text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.cms_public_entries(),public.cms_read_redirect(text) to anon,authenticated;
grant execute on function public.cms_editorial_bundle(text,jsonb,jsonb) to authenticated;
notify pgrst,'reload schema';
