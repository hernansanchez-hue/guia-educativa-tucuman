-- Paso aditivo posterior a instalar-en-staging.sql; no importar ni modificar datos.
-- No aplicar automáticamente. Requiere revisión del operador en el proyecto público GET.
begin;
create or replace function public.get_control_write_checked(actor uuid,entity text,operation text,expected_revision int,changes jsonb,history_id bigint,expected_catalog_revision bigint)
returns void language plpgsql security invoker set search_path='' as $$
declare item jsonb; shared_rows jsonb;
begin
  -- Compite también con los INSERT/UPDATE del escritor original. Sin borrado
  -- de documentos, la suma de revisiones es un contador monotónico del catálogo.
  lock table public.get_control_docs in share row exclusive mode;
  if expected_catalog_revision is distinct from (select coalesce(sum(revision),0) from public.get_control_docs) then
    raise serialization_failure;
  end if;
  perform public.get_control_write(actor,entity,operation,expected_revision,changes,history_id);
  if operation='publish' then
    select d.published into strict item from public.get_control_docs d where d.key=entity;
    if item->'visible'='false'::jsonb and jsonb_typeof(item->'_created')='array' then
      -- La sede oculta se mantiene privada; una marca compartida sigue estando
      -- disponible para sus otras sedes sin exponer campos del registro oculto.
      select jsonb_agg(e.value) into shared_rows from jsonb_array_elements(item->'_created') e
        where e.value->>'key'<>entity;
      if shared_rows is not null then
        update public.get_control_publications set published=jsonb_build_object('visible',false,'_created',shared_rows) where key=entity;
      end if;
    end if;
  end if;
end $$;
revoke all on function public.get_control_write_checked(uuid,text,text,int,jsonb,bigint,bigint) from public,anon,authenticated;
grant execute on function public.get_control_write_checked(uuid,text,text,int,jsonb,bigint,bigint) to service_role;
commit;
