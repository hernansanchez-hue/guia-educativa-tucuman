-- Auth's unique email index excludes SSO users and is case-sensitive.
-- Never choose the first row when a bootstrap email matches multiple identities.
create or replace function cms_private.bootstrap(p_email text,p_name text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid; matches bigint; existing public.admin_profiles; result public.admin_profiles;
begin
  if coalesce(auth.jwt()->>'role','')<>'service_role' then raise exception 'Bootstrap requires service role' using errcode='42501'; end if;
  if p_email is null or length(p_email)>254 or p_email<>btrim(p_email) then raise exception 'Explicit email required' using errcode='22023'; end if;
  lock table public.admin_profiles in share row exclusive mode;
  select count(*),min(id::text)::uuid into matches,uid from auth.users where lower(email)=lower(p_email);
  if matches<>1 or not exists(select 1 from auth.users where id=uid and email_confirmed_at is not null
      and not coalesce(is_anonymous,false) and (banned_until is null or banned_until<now())) then
    raise exception 'Exactly one confirmed identity required' using errcode='22023';
  end if;
  if exists(select 1 from public.admin_profiles where role='SUPERADMIN' and id<>uid) then raise exception 'Bootstrap already completed' using errcode='42501'; end if;
  select * into existing from public.admin_profiles where id=uid;
  if existing.role='SUPERADMIN' and existing.status='active' then return to_jsonb(existing); end if;
  if existing.id is not null then raise exception 'Existing profile requires superadmin management' using errcode='42501'; end if;
  insert into public.admin_profiles(id,display_name,role) values(uid,p_name,'SUPERADMIN') returning * into result;
  insert into public.cms_audit_logs(actor_id,action,entity_type,entity_id) values(uid,'BOOTSTRAP','users',uid);
  return to_jsonb(result);
end; $$;
