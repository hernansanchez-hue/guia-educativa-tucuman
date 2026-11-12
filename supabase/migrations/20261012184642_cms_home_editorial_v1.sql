-- Macrofase 4, primera etapa únicamente: Home. Timestamp sincronizado con get-definitivo.
create or replace function cms_private.editorial_guard() returns trigger language plpgsql set search_path='' as $$
declare p jsonb:=new.draft; d jsonb:=p->'data'; k text:=p->>'_kind'; expected text; field text; item jsonb; link text;
begin
 if k is null then return new; end if; -- Phase-2 generic documents never render as catalog entries.
 expected:=case k when 'home' then 'home' when 'city' then 'cities' when 'brand' then 'institutions' when 'institution' then 'institutions' when 'career' then 'careers' when 'offering' then 'careers' end;
 if expected is null or expected<>new.module_id or jsonb_typeof(d)<>'object' or coalesce(length(d->>'id'),0) not between 1 and 120 then raise exception 'Invalid editorial identity' using errcode='22023'; end if;
 if tg_op='UPDATE' and (old.draft->>'_kind' is distinct from k or old.draft->'data'->>'id' is distinct from d->>'id') then raise exception 'Stable identity cannot change' using errcode='22023'; end if;
 if k in ('city','brand','career','institution') and coalesce(d->>'slug','') !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Invalid slug' using errcode='22023'; end if;
 if k in ('city','brand','career') and coalesce(length(btrim(d->>'name')),0)=0 then raise exception 'Name required' using errcode='22023'; end if;
 if p->'design'->>'color' is not null and p->'design'->>'color' !~ '^#[0-9a-fA-F]{6}$' then raise exception 'Invalid color' using errcode='22023'; end if;
 if p->'design'->>'titleSize' is not null and (p->'design'->>'titleSize')::numeric not between 32 and 80 then raise exception 'Invalid title size' using errcode='22023'; end if;
 if p->'design'->>'align' is not null and p->'design'->>'align' not in ('left','center') then raise exception 'Invalid alignment' using errcode='22023'; end if;
 for field in select unnest(array['name','slug','title','heroTitle','heroDescription','orientationTitle','orientationDescription','expoTitle','expoDescription','commercialTitle','description','slogan','logo','phone','address','email','whatsapp','openingHours','degree','duration','modality','graduateProfile','workField','shifts','image','heroImage','logoUrl','website','video','mapsUrl','studyPlanPdf','cityId','brandId','institutionId','careerId']) loop
  if d ? field and d->field<>'null'::jsonb and jsonb_typeof(d->field)<>'string' then raise exception 'Text field required' using errcode='22023'; end if;
 end loop;
 for field in select unnest(array['visible','featured','isNew','formEnabled']) loop
  if d ? field and jsonb_typeof(d->field)<>'boolean' then raise exception 'Boolean field required' using errcode='22023'; end if;
 end loop;
 for field in select unnest(array['gallery','institutionIds','featuredInstitutionIds','featuredCareerIds','requirements','faq','studyPlan']) loop
  if d ? field and (jsonb_typeof(d->field)<>'array' or jsonb_array_length(d->field)>200) then raise exception 'List field required' using errcode='22023'; end if;
 end loop;
 for field in select unnest(array['gallery','institutionIds','featuredInstitutionIds','featuredCareerIds','requirements']) loop
  if d ? field and exists(select 1 from jsonb_array_elements(d->field) j where jsonb_typeof(j)<>'string') then raise exception 'Text list required' using errcode='22023'; end if;
 end loop;
 if d ? 'faq' and exists(select 1 from jsonb_array_elements(d->'faq') j where jsonb_typeof(j)<>'object' or jsonb_typeof(j->'question') is distinct from 'string' or jsonb_typeof(j->'answer') is distinct from 'string') then raise exception 'Invalid FAQ' using errcode='22023'; end if;
 for item in select value from jsonb_array_elements(coalesce(d->'studyPlan','[]')) loop
  if jsonb_typeof(item)<>'string' and (jsonb_typeof(item)<>'object' or jsonb_typeof(item->'label') is distinct from 'string' or jsonb_typeof(item->'subjects') is distinct from 'array') then raise exception 'Invalid study plan' using errcode='22023'; end if;
  if jsonb_typeof(item)='object' and exists(select 1 from jsonb_array_elements(item->'subjects') j where jsonb_typeof(j)<>'string') then raise exception 'Invalid subjects' using errcode='22023'; end if;
 end loop;
 for link in select value from (
  select d->>x as value from unnest(array['image','heroImage','logoUrl','website','video','mapsUrl','studyPlanPdf']) x
  union all select value from jsonb_array_elements_text(coalesce(d->'gallery','[]'))
  union all select p->'seo'->>'image') links where value is not null and value<>'' loop
  if link !~ '^(https://|/[^/])' or link ~ '[[:space:]"''<>]' or position(chr(92) in link)>0 or link ~ '^https://[^/]*@' then raise exception 'Unsafe content link' using errcode='22023'; end if;
 end loop;
 if k='city' and d->>'slug' in ('admin','api','media','carreras','instituciones','ciudades','servicios','eventos','nosotros','contacto','cursos-docentes') then raise exception 'Reserved city route' using errcode='22023'; end if;
 return new;
end; $$;


-- Singleton Home: existing editorial/RLS/version/audit system, no separate publisher.
create unique index cms_home_singleton_idx on public.cms_documents(module_id) where module_id='home';
create function cms_private.home_guard() returns trigger language plpgsql set search_path='' as $$
declare p jsonb:=new.draft; d jsonb:=p->'data'; x jsonb:=p->'design'; s jsonb:=p->'seo'; field text; link text;
begin
 if new.module_id<>'home' then return new; end if;
 if new.entity_key<>'main' or p->>'_kind' is distinct from 'home' or jsonb_typeof(d) is distinct from 'object' or d->>'id' is distinct from 'home' or d->>'name' is distinct from 'Home' then raise exception 'Home singleton identity required' using errcode='22023'; end if;
 if tg_op='UPDATE' and old.published_version is not null and (new.published_version is null or new.state='archived') then raise exception 'The Home cannot be removed' using errcode='22023'; end if;
 if exists(select 1 from jsonb_object_keys(p) a where a<>all(array['_kind','data','seo','design'])) or exists(select 1 from jsonb_object_keys(d) a where a<>all(array['id','name','logo','logoAlt','video','videoVisible','titleBefore','titleHighlight','titleAfter','searchPlaceholder','provinceName','departmentLabel','provinceLabel','institutionsLabel','careersLabel','comingText','selectCityLabel','cityAvailableLabel','cityLinkLabel','hint'])) then raise exception 'Unsupported Home content' using errcode='22023'; end if;
 foreach field in array array['id','name','logo','logoAlt','video','titleBefore','titleHighlight','titleAfter','searchPlaceholder','provinceName','departmentLabel','provinceLabel','institutionsLabel','careersLabel','comingText','selectCityLabel','cityAvailableLabel','cityLinkLabel','hint'] loop
  if jsonb_typeof(d->field) is distinct from 'string' or length(btrim(d->>field))=0 or length(d->>field)>(case when field in ('logo','video') then 2048 when field='hint' then 250 else 120 end) then raise exception 'Home text required' using errcode='22023'; end if;
 end loop;
 if jsonb_typeof(d->'videoVisible') is distinct from 'boolean' then raise exception 'Home visibility must be boolean' using errcode='22023'; end if;
 if p ? 'design' then
  if jsonb_typeof(x) is distinct from 'object' then raise exception 'Home design must be an object' using errcode='22023'; end if;
  if exists(select 1 from jsonb_object_keys(x) a where a<>all(array['titleSize','logoSize','overlay','color','align'])) then raise exception 'Unsupported Home design' using errcode='22023'; end if;
  foreach field in array array['titleSize','logoSize','overlay'] loop
   if x ? field then
    if jsonb_typeof(x->field) is distinct from 'number' then raise exception 'Home dimension must be numeric' using errcode='22023'; end if;
    if (field='titleSize' and (x->>field)::numeric not between 32 and 60) or (field='logoSize' and (x->>field)::numeric not between 120 and 200) or (field='overlay' and (x->>field)::numeric not between .6 and .94) then raise exception 'Unsafe Home dimension' using errcode='22023'; end if;
   end if;
  end loop;
 end if;
 if p ? 'seo' then
  if jsonb_typeof(s) is distinct from 'object' then raise exception 'Home SEO must be an object' using errcode='22023'; end if;
  if exists(select 1 from jsonb_object_keys(s) a where a<>all(array['title','description','ogTitle','ogDescription','image','noindex'])) then raise exception 'Unsupported Home SEO' using errcode='22023'; end if;
  foreach field in array array['title','description','ogTitle','ogDescription','image'] loop
   if s ? field and jsonb_typeof(s->field) is distinct from 'string' then raise exception 'Home SEO text required' using errcode='22023'; end if;
  end loop;
  if s ? 'noindex' and jsonb_typeof(s->'noindex') is distinct from 'boolean' then raise exception 'Home SEO visibility must be boolean' using errcode='22023'; end if;
 end if;
 for link in select d->>'logo' union all select d->>'video' union all select s->>'image' loop
  if link is not null and link<>'' and (link !~ '^(https://|/[^/])' or link ~ '[[:space:]"''<>]' or position(chr(92) in link)>0 or link ~ '^https://[^/]*@' or link ~ '^/admin(/|$)') then raise exception 'Unsafe Home resource' using errcode='22023'; end if;
 end loop;
 return new;
end; $$;
create trigger cms_home_guard before insert or update on public.cms_documents for each row execute function cms_private.home_guard();
revoke all on function cms_private.home_guard() from public,anon,authenticated;

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
   if not cms_private.can_content(d.module_id,case when p_operation='publish' then 'publish' else 'edit' end) or d.module_id not in ('home','cities','institutions','careers') or d.draft->>'_kind' is null then raise exception 'CMS access denied' using errcode='42501'; end if;
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



-- Exact approved Home. Idempotent: no overwrite of a draft or existing snapshot.
do $import$
declare item jsonb:=$approved${"moduleId":"home","key":"main","payload":{"_kind":"home","data":{"id":"home","name":"Home","logo":"/assets/get-logo-hero-white.png","logoAlt":"GET — Guía Educativa Tucumán","video":"https://res.cloudinary.com/disj9fs8m/video/upload/q_auto/v1782350401/get/hero/v2l8k0maxocxnxf0yerh.mp4","videoVisible":true,"titleBefore":"Toda la oferta educativa de","titleHighlight":"Tucumán","titleAfter":"en un solo lugar","searchPlaceholder":"Buscar ciudad, institución o carrera...","provinceName":"Tucumán","departmentLabel":"DEPARTAMENTO","provinceLabel":"PROVINCIA","institutionsLabel":"Instituciones","careersLabel":"Carreras","comingText":"Próximamente en GET","selectCityLabel":"Elegí una ciudad","cityAvailableLabel":"Ciudad disponible","cityLinkLabel":"Ver","hint":"Seleccioná un departamento para conocer las ciudades, instituciones y carreras disponibles."},"seo":{"title":"Guía Educativa Tucumán","description":"Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar."}}}$approved$::jsonb; document_id uuid;
begin
 insert into public.cms_documents(module_id,entity_key,draft) values(item->>'moduleId',item->>'key',item->'payload') on conflict(module_id,entity_key) do nothing returning id into document_id;
 if document_id is not null then
  insert into public.cms_versions(document_id,version_number,schema_version,snapshot,created_by,origin) values(document_id,1,1,item->'payload',null,'import');
  update public.cms_documents set state='published',published_version=1 where id=document_id;
  insert into public.cms_audit_logs(actor_id,actor_kind,action,entity_type,entity_id,metadata) values(null,'migration','IMPORT','home',document_id,jsonb_build_object('source','approved-home-map','migration','cms_home_editorial_v1','databaseActor',current_user));
 end if;
end $import$;
notify pgrst,'reload schema';
