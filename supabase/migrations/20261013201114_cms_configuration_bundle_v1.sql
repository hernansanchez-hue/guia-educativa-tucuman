
-- Atomic singleton draft/publication; exclusive SUPERADMIN permission.
create function cms_private.configuration_bundle(p_module text,p_payload jsonb,p_revision integer,p_publish boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.cms_documents;r jsonb;
begin
 if p_module not in ('design','settings') or not cms_private.can_content(p_module,'edit') or p_publish is null or p_publish and not cms_private.can_content(p_module,'publish') then raise exception 'CMS access denied' using errcode='42501';end if;
 select * into d from public.cms_documents where module_id=p_module and entity_key='main' for update;
 if d.id is null then raise exception 'Configuration missing' using errcode='22023';end if;
 r:=cms_private.mutate_content('save',d.id,null,null,p_payload,p_revision,null);
 if p_publish then r:=cms_private.mutate_content('publish',d.id,null,null,null,p_revision+1,null);end if;
 return r;
end;$$;
create function public.cms_configuration_bundle(p_module text,p_payload jsonb,p_revision integer,p_publish boolean default false) returns jsonb language sql security invoker set search_path='' as $$select cms_private.configuration_bundle(p_module,p_payload,p_revision,p_publish)$$;
revoke all on function cms_private.configuration_bundle(text,jsonb,integer,boolean),public.cms_configuration_bundle(text,jsonb,integer,boolean) from public,anon,authenticated;
grant execute on function cms_private.configuration_bundle(text,jsonb,integer,boolean),public.cms_configuration_bundle(text,jsonb,integer,boolean) to authenticated;
