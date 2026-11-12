-- CMS phase 2: additive infrastructure. Existing public catalog is untouched.
-- All privileged implementations live in a non-exposed schema. Public RPCs are invokers.
create schema if not exists cms_private;
revoke all on schema cms_private from public, anon, authenticated;
grant usage on schema cms_private to authenticated, service_role;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(btrim(display_name)) between 1 and 120),
  role text not null check (role in ('SUPERADMIN','ADMIN','EDITOR')),
  status text not null default 'active' check (status in ('active','disabled')),
  can_publish boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);
create table public.cms_documents (
  id uuid primary key default gen_random_uuid(),
  module_id text not null check (module_id in ('home','cities','institutions','careers','trainings','teacher-courses','events','services','orientation','about','contact','banners','navigation','footer','design','seo','settings')),
  entity_key text not null check (length(btrim(entity_key)) between 1 and 250),
  schema_version integer not null default 1 check (schema_version > 0),
  state text not null default 'draft' check (state in ('draft','published','pending_changes','archived')),
  revision integer not null default 1 check (revision > 0),
  draft jsonb not null check (jsonb_typeof(draft) = 'object' and octet_length(draft::text) <= 500000),
  published_version integer check (published_version > 0),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id,entity_key),
  check (state not in ('published','pending_changes') or published_version is not null)
);
create table public.cms_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.cms_documents(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  schema_version integer not null check (schema_version > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot)='object' and octet_length(snapshot::text)<=500000),
  -- Historical actor UUID retained even when its Auth identity is removed.
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique(document_id,version_number)
);
alter table public.cms_documents add constraint cms_documents_published_fk
  foreign key(id,published_version) references public.cms_versions(document_id,version_number) deferrable initially deferred;
create table public.cms_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  action text not null check (action in ('LOGIN','LOGOUT','CREATE','UPDATE_DRAFT','PUBLISH','UNPUBLISH','ARCHIVE','RESTORE','MANAGE_PROFILE','BOOTSTRAP')),
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}' check (jsonb_typeof(metadata)='object' and octet_length(metadata::text)<=2000),
  created_at timestamptz not null default now()
);
create index cms_documents_module_updated_idx on public.cms_documents(module_id,updated_at desc);
create index cms_documents_created_by_idx on public.cms_documents(created_by);
create index cms_documents_updated_by_idx on public.cms_documents(updated_by);
create index cms_audit_actor_created_idx on public.cms_audit_logs(actor_id,created_at desc);
create index cms_audit_entity_created_idx on public.cms_audit_logs(entity_type,entity_id,created_at desc);
create index admin_profiles_role_status_idx on public.admin_profiles(role,status);
create trigger admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();
create trigger cms_documents_updated_at before update on public.cms_documents for each row execute function public.set_updated_at();

create function cms_private.immutable_history() returns trigger language plpgsql set search_path='' as $$
begin raise exception 'CMS history is immutable' using errcode='42501'; end; $$;
create trigger cms_versions_immutable before update or delete on public.cms_versions for each row execute function cms_private.immutable_history();
create trigger cms_audit_immutable before update or delete on public.cms_audit_logs for each row execute function cms_private.immutable_history();

-- Fresh DB profile + confirmed email + live Auth session, not user-editable metadata.
create function cms_private.current_profile() returns public.admin_profiles
language sql stable security definer set search_path='' as $$
  select p from public.admin_profiles p join auth.users u on u.id=p.id
  where p.id=auth.uid() and p.status='active' and u.email_confirmed_at is not null
    and not coalesce(u.is_anonymous,false) and (u.banned_until is null or u.banned_until<now())
    and exists(select 1 from auth.sessions s where s.user_id=u.id
      and s.id::text=auth.jwt()->>'session_id' and (s.not_after is null or s.not_after>now()))
$$;
create function cms_private.can_perform(p_action text) returns boolean
language plpgsql stable security definer set search_path='' as $$
declare p public.admin_profiles;
begin
  p:=cms_private.current_profile();
  if p.id is null or p_action not in ('read','edit','preview','media','seo','publish','archive','restore','delete','users','design','settings') then return false; end if;
  if p.role='SUPERADMIN' then return true; end if;
  if p_action in ('read','edit','preview','media','seo') then return true; end if;
  if p.role='ADMIN' and p_action in ('publish','archive','restore') then return true; end if;
  return p.role='EDITOR' and p_action='publish' and p.can_publish;
end; $$;
create function cms_private.can_content(p_module text,p_action text) returns boolean
language sql stable security definer set search_path='' as $$
  select cms_private.can_perform(p_action)
    and (p_module not in ('design','settings') or cms_private.can_perform(p_module))
$$;
create function cms_private.valid_json(p_value jsonb,p_depth integer default 0) returns boolean
language plpgsql immutable set search_path='' as $$
declare item record; t text:=jsonb_typeof(p_value);
begin
  if p_value is null or p_depth>15 then return false; end if;
  if t='string' then return length(p_value#>>'{}')<=20000 and not (p_value#>>'{}') ~* '</?[a-z][^>]*>'; end if;
  if t='object' then
    if (select count(*) from jsonb_object_keys(p_value))>250 then return false; end if;
    for item in select key,value from jsonb_each(p_value) loop
      if item.key in ('__proto__','constructor','prototype') or not cms_private.valid_json(item.value,p_depth+1) then return false; end if;
    end loop;
  elsif t='array' then
    if jsonb_array_length(p_value)>1000 then return false; end if;
    for item in select value from jsonb_array_elements(p_value) loop
      if not cms_private.valid_json(item.value,p_depth+1) then return false; end if;
    end loop;
  end if;
  return true;
end; $$;

alter table public.admin_profiles enable row level security;
alter table public.cms_documents enable row level security;
alter table public.cms_versions enable row level security;
alter table public.cms_audit_logs enable row level security;
revoke all on public.admin_profiles,public.cms_documents,public.cms_versions,public.cms_audit_logs from public,anon,authenticated;
grant select on public.admin_profiles,public.cms_documents,public.cms_versions,public.cms_audit_logs to authenticated;
grant all on public.admin_profiles,public.cms_documents,public.cms_versions,public.cms_audit_logs to service_role;
create policy cms_profiles_read on public.admin_profiles for select to authenticated
 using ((id=auth.uid() and cms_private.can_perform('read')) or cms_private.can_perform('users'));
create policy cms_documents_read on public.cms_documents for select to authenticated
 using (cms_private.can_content(module_id,'read'));
create policy cms_versions_read on public.cms_versions for select to authenticated
 using (exists(select 1 from public.cms_documents d where d.id=document_id and cms_private.can_content(d.module_id,'read')));
create policy cms_audit_read on public.cms_audit_logs for select to authenticated
 using (cms_private.can_perform('read') and ((cms_private.current_profile()).role in ('SUPERADMIN','ADMIN') or actor_id=auth.uid()));

-- One transaction for validation, revision lock, immutable snapshot and audit.
create function cms_private.mutate_content(p_operation text,p_id uuid,p_module text,p_entity text,p_payload jsonb,p_revision integer,p_version integer)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor public.admin_profiles; d public.cms_documents; v integer; snapshot jsonb; required_action text; event_action text;
begin
  actor:=cms_private.current_profile();
  required_action:=case p_operation when 'create' then 'edit' when 'save' then 'edit' when 'publish' then 'publish' when 'restore' then 'restore' when 'archive' then 'archive' when 'unpublish' then 'publish' end;
  if actor.id is null or required_action is null then raise exception 'CMS access denied' using errcode='42501'; end if;
  if p_operation='create' then
    if p_module is null or not cms_private.can_content(p_module,required_action) then raise exception 'CMS access denied' using errcode='42501'; end if;
    if p_payload is null or jsonb_typeof(p_payload)<>'object' or not cms_private.valid_json(p_payload) or octet_length(p_payload::text)>500000 then raise exception 'Invalid CMS payload' using errcode='22023'; end if;
    insert into public.cms_documents(module_id,entity_key,draft,created_by,updated_by)
      values(p_module,p_entity,p_payload,actor.id,actor.id) returning * into d;
    event_action:='CREATE';
  else
    select * into d from public.cms_documents where id=p_id for update;
    if d.id is null or not cms_private.can_content(d.module_id,required_action) then raise exception 'CMS access denied' using errcode='42501'; end if;
    if p_revision is null or d.revision<>p_revision then raise exception 'CMS revision conflict' using errcode='40001'; end if;
    if d.state='archived' then raise exception 'CMS document archived' using errcode='22023'; end if;
    if p_operation in ('save','restore') then
      if p_operation='restore' then
        select cv.snapshot into snapshot from public.cms_versions cv where cv.document_id=d.id and cv.version_number=p_version;
        if snapshot is null then raise exception 'Version not found' using errcode='22023'; end if;
        event_action:='RESTORE';
      else snapshot:=p_payload; event_action:='UPDATE_DRAFT'; end if;
      if snapshot is null or jsonb_typeof(snapshot)<>'object' or not cms_private.valid_json(snapshot) or octet_length(snapshot::text)>500000 then raise exception 'Invalid CMS payload' using errcode='22023'; end if;
      update public.cms_documents set draft=snapshot,state=case when published_version is null then 'draft' else 'pending_changes' end,
        revision=revision+1,updated_by=actor.id where id=d.id returning * into d;
    elsif p_operation='publish' then
      if not cms_private.valid_json(d.draft) then raise exception 'Invalid CMS payload' using errcode='22023'; end if;
      select coalesce(max(version_number),0)+1 into v from public.cms_versions where document_id=d.id;
      insert into public.cms_versions(document_id,version_number,schema_version,snapshot,created_by) values(d.id,v,d.schema_version,d.draft,actor.id);
      update public.cms_documents set published_version=v,state='published',revision=revision+1,updated_by=actor.id where id=d.id returning * into d;
      event_action:='PUBLISH';
    elsif p_operation='unpublish' then
      update public.cms_documents set published_version=null,state='draft',revision=revision+1,updated_by=actor.id where id=d.id returning * into d;
      event_action:='UNPUBLISH';
    elsif p_operation='archive' then
      update public.cms_documents set state='archived',revision=revision+1,updated_by=actor.id where id=d.id returning * into d;
      event_action:='ARCHIVE';
    end if;
  end if;
  insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id,metadata)
    values(actor.id,event_action,d.module_id,d.id,jsonb_build_object('revision',d.revision,'version',d.published_version));
  return jsonb_build_object('document',to_jsonb(d),'revalidation',jsonb_build_object('tags',jsonb_build_array('cms:'||d.module_id,'cms:document:'||d.id::text),'routes','[]'::jsonb,'projectionPending',true));
end; $$;
create function public.cms_mutate_content(p_operation text,p_id uuid default null,p_module text default null,p_entity text default null,p_payload jsonb default null,p_revision integer default null,p_version integer default null)
returns jsonb language sql security invoker set search_path='' as $$ select cms_private.mutate_content(p_operation,p_id,p_module,p_entity,p_payload,p_revision,p_version) $$;

-- Deliberately returns only an explicitly published snapshot, never a document/draft.
create function cms_private.read_published(p_module text,p_entity text) returns jsonb
language sql stable security definer set search_path='' as $$
  select v.snapshot from public.cms_documents d join public.cms_versions v on v.document_id=d.id and v.version_number=d.published_version
  where d.module_id=p_module and d.entity_key=p_entity and d.state<>'archived' and d.module_id not in ('settings','design')
$$;
create function public.cms_read_published(p_module text,p_entity text) returns jsonb
language sql stable security invoker set search_path='' as $$ select cms_private.read_published(p_module,p_entity) $$;

create function cms_private.manage_profile(p_id uuid,p_name text,p_role text,p_status text,p_can_publish boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare actor public.admin_profiles; result public.admin_profiles;
begin
  if not cms_private.can_perform('users') then raise exception 'CMS access denied' using errcode='42501'; end if;
  actor:=cms_private.current_profile();
  lock table public.admin_profiles in share row exclusive mode;
  if p_role is null or p_role not in ('SUPERADMIN','ADMIN','EDITOR') or p_status is null or p_status not in ('active','disabled') or p_can_publish is null then raise exception 'Invalid profile' using errcode='22023'; end if;
  if not exists(select 1 from auth.users where id=p_id and email_confirmed_at is not null and not coalesce(is_anonymous,false)) then raise exception 'Verified user required' using errcode='22023'; end if;
  if exists(select 1 from public.admin_profiles where id=p_id and role='SUPERADMIN' and status='active')
    and (p_role<>'SUPERADMIN' or p_status<>'active') and (select count(*) from public.admin_profiles where role='SUPERADMIN' and status='active')<=1 then raise exception 'Cannot disable last superadmin' using errcode='22023'; end if;
  insert into public.admin_profiles(id,display_name,role,status,can_publish) values(p_id,p_name,p_role,p_status,p_can_publish)
    on conflict(id) do update set display_name=excluded.display_name,role=excluded.role,status=excluded.status,can_publish=excluded.can_publish returning * into result;
  insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id,metadata) values(actor.id,'MANAGE_PROFILE','users',p_id,jsonb_build_object('role',p_role,'status',p_status,'canPublish',p_can_publish));
  return to_jsonb(result);
end; $$;
create function public.cms_manage_profile(p_id uuid,p_name text,p_role text,p_status text,p_can_publish boolean default false) returns jsonb
language sql security invoker set search_path='' as $$ select cms_private.manage_profile(p_id,p_name,p_role,p_status,p_can_publish) $$;

create function cms_private.auth_event(p_action text) returns void language plpgsql security definer set search_path='' as $$
begin
  if not cms_private.can_perform('read') or p_action not in ('LOGIN','LOGOUT') then raise exception 'CMS access denied' using errcode='42501'; end if;
  if p_action='LOGIN' then update public.admin_profiles set last_login_at=now() where id=auth.uid(); end if;
  insert into public.cms_audit_logs(actor_id,action,entity_type) values(auth.uid(),p_action,'auth');
end; $$;
create function public.cms_auth_event(p_action text) returns void language sql security invoker set search_path='' as $$ select cms_private.auth_event(p_action) $$;

-- Callable ONLY with a privileged local credential, exact confirmed email, and no existing other superadmin.
create function cms_private.bootstrap(p_email text,p_name text) returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid; existing public.admin_profiles; result public.admin_profiles;
begin
  if coalesce(auth.jwt()->>'role','')<>'service_role' then raise exception 'Bootstrap requires service role' using errcode='42501'; end if;
  if p_email is null or length(p_email)>254 or p_email<>btrim(p_email) then raise exception 'Explicit email required' using errcode='22023'; end if;
  lock table public.admin_profiles in share row exclusive mode;
  select id into uid from auth.users where lower(email)=lower(p_email) and email_confirmed_at is not null and not coalesce(is_anonymous,false);
  if uid is null then raise exception 'Confirmed email required' using errcode='22023'; end if;
  if exists(select 1 from public.admin_profiles where role='SUPERADMIN' and id<>uid) then raise exception 'Bootstrap already completed' using errcode='42501'; end if;
  select * into existing from public.admin_profiles where id=uid;
  if existing.role='SUPERADMIN' and existing.status='active' then return to_jsonb(existing); end if;
  if existing.id is not null then raise exception 'Existing profile requires superadmin management' using errcode='42501'; end if;
  insert into public.admin_profiles(id,display_name,role) values(uid,p_name,'SUPERADMIN') returning * into result;
  insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id) values(uid,'BOOTSTRAP','users',uid);
  return to_jsonb(result);
end; $$;
create function public.cms_bootstrap_superadmin(p_email text,p_name text) returns jsonb language sql security invoker set search_path='' as $$ select cms_private.bootstrap(p_email,p_name) $$;

-- Remove default function EXECUTE grants, then expose only specific capabilities.
revoke all on all functions in schema cms_private from public,anon,authenticated;
grant execute on function cms_private.current_profile(),cms_private.can_perform(text),cms_private.can_content(text,text),cms_private.mutate_content(text,uuid,text,text,jsonb,integer,integer),cms_private.manage_profile(uuid,text,text,text,boolean),cms_private.auth_event(text) to authenticated;
grant usage on schema cms_private to anon;
grant execute on function cms_private.read_published(text,text) to anon,authenticated;
grant execute on function cms_private.bootstrap(text,text) to service_role;
revoke all on function public.cms_mutate_content(text,uuid,text,text,jsonb,integer,integer),public.cms_read_published(text,text),public.cms_manage_profile(uuid,text,text,text,boolean),public.cms_auth_event(text),public.cms_bootstrap_superadmin(text,text) from public,anon,authenticated;
grant execute on function public.cms_mutate_content(text,uuid,text,text,jsonb,integer,integer),public.cms_manage_profile(uuid,text,text,text,boolean),public.cms_auth_event(text) to authenticated;
grant execute on function public.cms_read_published(text,text) to anon,authenticated;
grant execute on function public.cms_bootstrap_superadmin(text,text) to service_role;
notify pgrst,'reload schema';
