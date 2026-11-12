-- Address new-schema advisors without changing catalog policies or data.
create index if not exists cms_documents_published_fk_idx on public.cms_documents(id,published_version);
alter policy cms_profiles_read on public.admin_profiles using (
  (id=(select auth.uid()) and (select cms_private.can_perform('read'))) or (select cms_private.can_perform('users'))
);
alter policy cms_audit_read on public.cms_audit_logs using (
  (select cms_private.can_perform('read')) and
  (((select cms_private.current_profile()).role in ('SUPERADMIN','ADMIN')) or actor_id=(select auth.uid()))
);
create or replace function cms_private.can_perform(p_action text) returns boolean
language plpgsql stable security definer set search_path='' as $$
declare p public.admin_profiles;
begin
  p:=cms_private.current_profile();
  if p.id is null or p_action is null or p_action not in ('read','edit','preview','media','seo','publish','archive','restore','delete','users','design','settings') then return false; end if;
  if p.role='SUPERADMIN' then return true; end if;
  if p_action in ('read','edit','preview','media','seo') then return true; end if;
  if p.role='ADMIN' and p_action in ('publish','archive','restore') then return true; end if;
  return p.role='EDITOR' and p_action='publish' and p.can_publish;
end; $$;
