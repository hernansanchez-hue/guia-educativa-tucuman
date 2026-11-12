-- Validate every entry, including unchanged parts; protect direct RPC publication too.
create or replace function cms_private.editorial_bundle(p_operation text,p_parts jsonb,p_redirects jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare part jsonb; d public.cms_documents; result jsonb; results jsonb:='[]'; rev integer; red jsonb;
begin
 if p_operation not in ('save','publish') or not cms_private.can_perform(case when p_operation='publish' then 'publish' else 'edit' end) then raise exception 'CMS access denied' using errcode='42501'; end if;
 if jsonb_typeof(p_parts)<>'array' or jsonb_array_length(p_parts) not between 1 and 3 then raise exception 'Invalid editorial bundle' using errcode='22023'; end if;
 if (select count(distinct x->>'id') from jsonb_array_elements(p_parts) x)<>jsonb_array_length(p_parts) then raise exception 'Duplicate bundle document' using errcode='22023'; end if;
 for part in select value from jsonb_array_elements(p_parts) order by value->>'id' loop
   select * into d from public.cms_documents where id=(part->>'id')::uuid for update;
   rev:=(part->>'revision')::integer;
   if d.id is null or rev is null or rev<>d.revision then raise exception 'CMS revision conflict' using errcode='40001'; end if;
   if not cms_private.can_content(d.module_id,case when p_operation='publish' then 'publish' else 'edit' end) or d.module_id not in ('cities','institutions','careers') or d.draft->>'_kind' is null then raise exception 'CMS access denied' using errcode='42501'; end if;
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

create function cms_private.editorial_publish_lock() returns trigger language plpgsql set search_path='' as $$
begin
 if new.published_version is distinct from old.published_version and new.published_version is not null then
   perform pg_catalog.pg_advisory_xact_lock(713040031);
 end if;
 return new;
end; $$;
create trigger cms_editorial_publish_lock before update of published_version on public.cms_documents for each row execute function cms_private.editorial_publish_lock();

create function cms_private.editorial_integrity() returns trigger language plpgsql security definer set search_path='' as $$
declare p jsonb; d jsonb; k text; parent text; required_kind text;
begin
 -- Read the final transaction state; bundles may publish dependent parts in any UUID order.
 select v.snapshot into p from public.cms_documents c join public.cms_versions v on v.document_id=c.id and v.version_number=c.published_version where c.id=new.id and c.state<>'archived';
 if p is null or p->>'_kind' is null then return null; end if;
 d:=p->'data'; k:=p->>'_kind';
 if exists(select 1 from public.cms_documents c join public.cms_versions v on v.document_id=c.id and v.version_number=c.published_version
  where c.id<>new.id and c.state<>'archived' and v.snapshot->>'_kind'=k and
  (v.snapshot->'data'->>'id'=d->>'id' or (k in ('city','brand','career','institution') and v.snapshot->'data'->>'slug'=d->>'slug' and (k<>'institution' or v.snapshot->'data'->>'cityId'=d->>'cityId'))
   or (k='offering' and v.snapshot->'data'->>'institutionId'=d->>'institutionId' and v.snapshot->'data'->>'careerId'=d->>'careerId'))) then
   raise exception 'Duplicate editorial identity or public route' using errcode='23505';
 end if;
 if k in ('institution','offering') then
  for parent,required_kind in select * from (values
   (case when k='institution' then d->>'cityId' else d->>'institutionId' end,case when k='institution' then 'city' else 'institution' end),
   (case when k='institution' then d->>'brandId' else d->>'careerId' end,case when k='institution' then 'brand' else 'career' end)) refs(id,kind)
  loop
   if parent is null or not exists(select 1 from public.cms_documents c join public.cms_versions v on v.document_id=c.id and v.version_number=c.published_version
    where c.state<>'archived' and v.snapshot->>'_kind'=required_kind and v.snapshot->'data'->>'id'=parent) then
    raise exception 'Publish the related entity first' using errcode='23514';
   end if;
  end loop;
 end if;
 return null;
end; $$;
create constraint trigger cms_editorial_integrity after update of published_version on public.cms_documents deferrable initially deferred for each row execute function cms_private.editorial_integrity();
revoke all on function cms_private.editorial_publish_lock(),cms_private.editorial_integrity() from public,anon,authenticated;
notify pgrst,'reload schema';
