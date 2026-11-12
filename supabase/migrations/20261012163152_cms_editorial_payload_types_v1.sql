create or replace function cms_private.editorial_guard() returns trigger language plpgsql set search_path='' as $$
declare p jsonb:=new.draft; d jsonb:=p->'data'; k text:=p->>'_kind'; expected text; field text; item jsonb; link text;
begin
 if k is null then return new; end if; -- Phase-2 generic documents never render as catalog entries.
 expected:=case k when 'city' then 'cities' when 'brand' then 'institutions' when 'institution' then 'institutions' when 'career' then 'careers' when 'offering' then 'careers' end;
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
notify pgrst,'reload schema';
