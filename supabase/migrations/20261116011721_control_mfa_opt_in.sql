-- GET Definitivo only: zomoblpgurchkxvkkutj. Opt-in; no Auth users/factors changed.
-- Scope is exclusively get_control and its commercial inbox, not other applications.
begin;
create function get_control_private.session_member() returns jsonb language sql stable security definer set search_path='' as $$
 select to_jsonb(m) from public.get_control_members m join auth.users u on u.id=m.id
 where m.id=auth.uid() and m.active and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
 and (u.banned_until is null or u.banned_until<now())
 and exists(select 1 from auth.sessions s where s.user_id=m.id and s.id::text=auth.jwt()->>'session_id' and (s.not_after is null or s.not_after>now()))
$$;
create function get_control_private.mfa_allowed() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (
   auth.jwt()->>'aal'='aal2' or not exists(
     select 1 from auth.mfa_factors f where f.user_id=auth.uid() and f.status='verified'
   )
 )
$$;
-- Minimal own-membership context only, for the challenge screen. No content or inbox data.
create function public.get_control_mfa_context() returns jsonb language sql stable security invoker set search_path='' as $$
 select get_control_private.session_member()
$$;
create or replace function get_control_private.me() returns jsonb language sql stable security definer set search_path='' as $$
 select get_control_private.session_member() where get_control_private.mfa_allowed()
$$;
revoke all on function get_control_private.session_member(),get_control_private.mfa_allowed(),public.get_control_mfa_context() from public,anon,authenticated,service_role;
grant execute on function get_control_private.session_member(),get_control_private.mfa_allowed(),public.get_control_mfa_context() to authenticated;
-- Restrictive policies compose with, rather than replace, existing role/session checks.
create policy commercial_contact_mfa on public.get_commercial_contacts as restrictive for all to authenticated
 using((select get_control_private.mfa_allowed())) with check((select get_control_private.mfa_allowed()));
create policy commercial_contact_history_mfa on public.get_commercial_contact_audit as restrictive for select to authenticated
 using((select get_control_private.mfa_allowed()));
notify pgrst, 'reload schema';
commit;
