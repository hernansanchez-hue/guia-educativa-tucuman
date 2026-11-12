-- Provision once, as an operator, in the PUBLIC GET project, never GET Instituciones.
-- This is intentionally not an automatically applied migration. No catalog import or user grants.
begin;
create table public.get_control_members (
 id uuid primary key references auth.users(id), name text not null check(length(name) between 1 and 160),
 role text not null check(role in ('ADMINISTRADOR','EDITOR','LECTOR')),active boolean not null default false);
create table public.get_control_docs (
 key text primary key, revision integer not null default 0, draft jsonb, published jsonb not null default '{}');
create table public.get_control_publications (key text primary key references public.get_control_docs(key), published jsonb not null);
create table public.get_control_changes (
 id bigint generated always as identity primary key, key text not null, actor uuid not null, name text not null,
 operation text not null, at timestamptz not null default now(), before jsonb not null);
create index get_control_entity_history on public.get_control_changes(key,id desc);
create table public.get_control_assets(id text primary key,name text not null,mime text not null,size integer not null);
alter table public.get_control_members enable row level security;
alter table public.get_control_docs enable row level security;
alter table public.get_control_publications enable row level security;
alter table public.get_control_changes enable row level security;
alter table public.get_control_assets enable row level security;
revoke all on public.get_control_members,public.get_control_docs,public.get_control_publications,public.get_control_changes,public.get_control_assets from public, anon, authenticated, service_role;
grant select on public.get_control_publications to anon, authenticated;
create policy published_patches_only on public.get_control_publications for select to anon,authenticated using(true);
grant select,insert,update on public.get_control_docs,public.get_control_members,public.get_control_publications to service_role;
grant select,insert on public.get_control_assets,public.get_control_changes to service_role;
revoke all on sequence public.get_control_changes_id_seq from public,anon,authenticated,service_role;
grant usage on sequence public.get_control_changes_id_seq to service_role;

-- Only the verified browser session can query its own active membership.
create schema get_control_private;
revoke all on schema get_control_private from public,anon;
grant usage on schema get_control_private to authenticated;
create function get_control_private.me() returns jsonb language sql stable security definer set search_path='' as $$
 select to_jsonb(m) from public.get_control_members m join auth.users u on u.id=m.id
 where m.id=auth.uid() and m.active and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
 and (u.banned_until is null or u.banned_until<now())
 and exists(select 1 from auth.sessions s where s.user_id=m.id and s.id::text=auth.jwt()->>'session_id' and (s.not_after is null or s.not_after>now()))
$$;
create function public.get_control_me() returns jsonb language sql stable security invoker set search_path='' as $$ select get_control_private.me() $$;
revoke all on function get_control_private.me(),public.get_control_me() from public,anon,authenticated;
grant execute on function get_control_private.me(),public.get_control_me() to authenticated;

create function public.get_control_write(actor uuid,entity text,operation text,expected_revision int,changes jsonb,history_id bigint default null)
returns void language plpgsql security invoker set search_path='' as $$
declare member public.get_control_members; item public.get_control_docs; next_draft jsonb; next_pub jsonb;
begin
 select m.* into member from public.get_control_members m where m.id=actor and m.active for share;
 if member.id is null or member.role='LECTOR' or operation not in ('save','publish','discard','restore') or (operation in ('publish','restore') and member.role<>'ADMINISTRADOR') then raise insufficient_privilege; end if;
 if length(entity) not between 1 and 200 or expected_revision is null then raise exception 'invalid entity'; end if;
 insert into public.get_control_docs(key) values(entity) on conflict do nothing;
 select * into strict item from public.get_control_docs where key=entity for update;
 if item.revision<>expected_revision then raise serialization_failure; end if;
 next_pub=item.published;
 case operation
 when 'save' then next_draft=changes;
 when 'restore' then select h.before->'published' into strict next_draft from public.get_control_changes h where h.id=history_id and h.key=entity and h.operation='publish';
 when 'publish' then
  if item.draft is null then raise exception 'no draft'; end if;
  next_pub=item.draft;
  insert into public.get_control_publications(key,published) values(entity,case when next_pub->'visible'='false'::jsonb then '{"visible":false}'::jsonb else next_pub end) on conflict(key) do update set published=excluded.published;
 when 'discard' then if item.draft is null then raise exception 'no draft'; end if;
 end case;
 if operation in ('save','restore') and (next_draft is null or jsonb_typeof(next_draft)<>'object' or octet_length(next_draft::text)>500000) then raise exception 'invalid patch'; end if;
 update public.get_control_docs set revision=item.revision+1,draft=next_draft,published=next_pub where key=entity;
 insert into public.get_control_changes(key,actor,name,operation,before) values(entity,actor,member.name,operation,to_jsonb(item));
end $$;
create function public.get_control_access(actor uuid,target uuid,display_name text,new_role text,enabled boolean)
returns void language plpgsql security invoker set search_path='' as $$
declare admin_name text; old_value jsonb;
begin
 perform pg_catalog.pg_advisory_xact_lock(75824191);
 select m.name into strict admin_name from public.get_control_members m where m.id=actor and m.active and m.role='ADMINISTRADOR' for share;
 if target=actor then raise insufficient_privilege; end if;
 select to_jsonb(m) into old_value from public.get_control_members m where m.id=target for update;
 insert into public.get_control_members(id,name,role,active) values(target,display_name,new_role,enabled) on conflict(id) do update set name=excluded.name,role=excluded.role,active=excluded.active;
 insert into public.get_control_changes(key,actor,name,operation,before) values('usuario/'||target,actor,admin_name,'member',coalesce(old_value,'null'::jsonb));
end $$;
create function public.get_control_register_asset(actor uuid,file_id text,file_name text,file_mime text,file_size int)
returns void language plpgsql security invoker set search_path='' as $$
declare editor text;
begin
 select m.name into strict editor from public.get_control_members m where m.id=actor and m.active and m.role in ('ADMINISTRADOR','EDITOR') for share;
 insert into public.get_control_assets(id,name,mime,size) values(file_id,file_name,file_mime,file_size);
 insert into public.get_control_changes(key,actor,name,operation,before) values('archivo/'||file_id,actor,editor,'upload','{}');
end $$;
revoke all on function public.get_control_write(uuid,text,text,int,jsonb,bigint),public.get_control_access(uuid,uuid,text,text,boolean),public.get_control_register_asset(uuid,text,text,text,int) from public,anon,authenticated;
grant execute on function public.get_control_write(uuid,text,text,int,jsonb,bigint),public.get_control_access(uuid,uuid,text,text,boolean),public.get_control_register_asset(uuid,text,text,text,int) to service_role;
-- Private bucket; the server checks membership for uploads and publication before serving.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('get-control-media','get-control-media',false,5242880,array['image/jpeg','image/png','image/webp','application/pdf']);
commit;
