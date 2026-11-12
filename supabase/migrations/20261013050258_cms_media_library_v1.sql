-- Private media registry: metadata only; legacy files remain in their original location.
create table public.cms_media_assets(
 id uuid primary key default gen_random_uuid(), url text not null unique, name text not null,
 kind text not null check(kind in ('image','video','logo','pdf','document')),
 origin text not null check(origin in ('local','external','cloudinary','supabase')),
 alt text not null default '', mime text, size_bytes bigint check(size_bytes between 1 and 52428800),
 width integer check(width between 1 and 30000),height integer check(height between 1 and 30000),
 storage_path text unique, state text not null default 'ready' check(state in ('ready','deleting')),
 created_by uuid references auth.users(id), created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(url ~ '^(/assets/|/media/cms/|https://)' and url !~ '[[:space:]<>]' and name<>''),
 check((origin='supabase' and storage_path is not null and url='/media/cms/'||storage_path) or (origin<>'supabase' and storage_path is null)));
alter table public.cms_media_assets enable row level security;
revoke all on public.cms_media_assets from public,anon,authenticated;
grant select on public.cms_media_assets to authenticated;
create policy cms_media_registry_team_read on public.cms_media_assets for select to authenticated using((select cms_private.can_perform('media')));
create index cms_media_assets_created_by_idx on public.cms_media_assets(created_by);
create function cms_private.media_usage(p_url text) returns bigint language sql stable security definer set search_path='' as $$
 select (select count(*) from public.cms_documents d where jsonb_path_exists(d.draft,'$.** ? (@ == $url)',jsonb_build_object('url',p_url)))
 +(select count(*) from public.cms_versions v where jsonb_path_exists(v.snapshot,'$.** ? (@ == $url)',jsonb_build_object('url',p_url)))
$$;
create function cms_private.media_list() returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not cms_private.can_perform('media') then raise exception 'Media access denied' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(to_jsonb(a)||jsonb_build_object('usage',cms_private.media_usage(a.url)) order by a.created_at desc) from public.cms_media_assets a),'[]');
end; $$;
create function cms_private.media_mutate(p_operation text,p_id uuid,p_asset jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.cms_media_assets; result jsonb; permission text;
begin
 permission:=case when p_operation in ('begin_delete','finish_delete','cancel_delete') then 'delete' else 'media' end;
 if not cms_private.can_perform(permission) then raise exception 'Media access denied' using errcode='42501'; end if;
 -- Same barrier as snapshot publication. A deleting resource cannot be introduced into a draft.
 perform pg_advisory_xact_lock(713040031);
 if p_operation='register' then
  if jsonb_typeof(p_asset)<>'object' or exists(select 1 from jsonb_object_keys(p_asset) k where k not in ('url','name','kind','origin','alt','mime','size_bytes','storage_path','width','height')) then raise exception 'Invalid media metadata' using errcode='22023'; end if;
  if p_asset->>'origin'='supabase' and not exists(select 1 from storage.objects where bucket_id='cms-media' and name=p_asset->>'storage_path') then raise exception 'Upload missing' using errcode='22023'; end if;
  insert into public.cms_media_assets(url,name,kind,origin,alt,mime,size_bytes,storage_path,width,height,created_by)
  values(p_asset->>'url',p_asset->>'name',p_asset->>'kind',p_asset->>'origin',coalesce(p_asset->>'alt',''),p_asset->>'mime',(p_asset->>'size_bytes')::bigint,p_asset->>'storage_path',(p_asset->>'width')::integer,(p_asset->>'height')::integer,auth.uid())
  on conflict(url) do nothing returning * into a;
  if a.id is null then select * into a from public.cms_media_assets where url=p_asset->>'url'; end if;
 elsif p_operation='alt' then
  if jsonb_typeof(p_asset->'alt')<>'string' or length(p_asset->>'alt')>500 then raise exception 'Invalid alt' using errcode='22023'; end if;
  update public.cms_media_assets set alt=p_asset->>'alt',updated_at=now() where id=p_id and state='ready' returning * into a;
 elsif p_operation in ('begin_delete','finish_delete','cancel_delete') then
  select * into a from public.cms_media_assets where id=p_id for update;
  if a.id is null then raise exception 'Resource missing' using errcode='22023'; end if;
  if p_operation<>'cancel_delete' and cms_private.media_usage(a.url)>0 then raise exception 'Resource is used in drafts, publications or history' using errcode='55000'; end if;
  if p_operation='begin_delete' then update public.cms_media_assets set state='deleting',updated_at=now() where id=a.id returning * into a;
  elsif p_operation='cancel_delete' then update public.cms_media_assets set state='ready',updated_at=now() where id=a.id returning * into a;
  else
   if a.state<>'deleting' or (a.storage_path is not null and exists(select 1 from storage.objects where bucket_id='cms-media' and name=a.storage_path)) then raise exception 'Storage deletion incomplete' using errcode='55000'; end if;
   delete from public.cms_media_assets where id=a.id;
  end if;
 else raise exception 'Invalid media operation' using errcode='22023';
 end if;
 if a.id is null then raise exception 'Resource missing' using errcode='22023'; end if;
 insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id,metadata)
 values(auth.uid(),'MANAGE_MEDIA','media',a.id,jsonb_build_object('operation',p_operation,'name',a.name));
 return to_jsonb(a)||jsonb_build_object('usage',cms_private.media_usage(a.url));
end; $$;
create function cms_private.media_document_guard() returns trigger language plpgsql security definer set search_path='' as $$
begin
 perform pg_advisory_xact_lock(713040031);
 if exists(select 1 from public.cms_media_assets a where a.state='deleting' and jsonb_path_exists(new.draft,'$.** ? (@ == $url)',jsonb_build_object('url',a.url))) then raise exception 'Resource deletion in progress' using errcode='55000'; end if;
 return new;
end; $$;
create trigger cms_media_document_guard before insert or update of draft on public.cms_documents for each row execute function cms_private.media_document_guard();
create function cms_private.media_delete_allowed(p_path text) returns boolean language sql stable security definer set search_path='' as $$
 select cms_private.can_perform('delete') and exists(select 1 from public.cms_media_assets a where a.storage_path=p_path and a.state='deleting' and cms_private.media_usage(a.url)=0)
$$;
create policy cms_media_safe_delete on storage.objects for delete to authenticated using(bucket_id='cms-media' and cms_private.media_delete_allowed(name));
create function public.cms_media_list() returns jsonb language sql stable security invoker set search_path='' as $$select cms_private.media_list()$$;
create function public.cms_media_mutate(p_operation text,p_id uuid default null,p_asset jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select cms_private.media_mutate(p_operation,p_id,p_asset)$$;
alter table public.cms_audit_logs drop constraint cms_audit_logs_action_check;
alter table public.cms_audit_logs add constraint cms_audit_logs_action_check check(action in ('LOGIN','LOGOUT','CREATE','UPDATE_DRAFT','PUBLISH','UNPUBLISH','ARCHIVE','RESTORE','MANAGE_PROFILE','BOOTSTRAP','IMPORT','MANAGE_MEDIA'));
update storage.buckets set file_size_limit=52428800,allowed_mime_types=array['image/png','image/jpeg','image/webp','video/mp4','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'] where id='cms-media';
-- No download, copying or deletion: register references already present in editorial content.
insert into public.cms_media_assets(url,name,kind,origin)
 select u,split_part(split_part(u,'?',1),'/',array_length(string_to_array(split_part(u,'?',1),'/'),1)),
 case when u ~* '\.mp4([?]|$)' then 'video' when u ~* '\.pdf([?]|$)' then 'pdf' when u ~* '\.(docx|txt)([?]|$)' then 'document' when u ~* 'logo' then 'logo' else 'image' end,
 case when u like '/assets/%' then 'local' when u like '%res.cloudinary.com/%' then 'cloudinary' else 'external' end
 from (select distinct trim(both '"' from v::text) u from public.cms_documents d cross join lateral jsonb_path_query(d.draft,'$.** ? (@.type() == "string")') v) src
 where u ~ '^(/assets/|https://)' and (u ~* '\.(png|jpe?g|webp|mp4|pdf|docx|txt)([?]|$)' or u like 'https://images.unsplash.com/%') on conflict(url) do nothing;
revoke all on function cms_private.media_usage(text),cms_private.media_list(),cms_private.media_mutate(text,uuid,jsonb),cms_private.media_document_guard(),cms_private.media_delete_allowed(text),public.cms_media_list(),public.cms_media_mutate(text,uuid,jsonb) from public,anon,authenticated;
grant execute on function cms_private.media_list(),cms_private.media_mutate(text,uuid,jsonb),cms_private.media_delete_allowed(text),public.cms_media_list(),public.cms_media_mutate(text,uuid,jsonb) to authenticated;
notify pgrst,'reload schema';
