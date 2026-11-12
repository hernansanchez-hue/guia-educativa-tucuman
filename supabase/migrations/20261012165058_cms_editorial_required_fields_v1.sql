-- Require the fields consumed structurally by the existing public components.
create function cms_private.editorial_required_fields() returns trigger language plpgsql set search_path='' as $$
declare k text:=new.draft->>'_kind'; d jsonb:=new.draft->'data'; field text;
begin
 if k='institution' and (jsonb_typeof(d->'gallery') is distinct from 'array' or jsonb_typeof(d->'type') is distinct from 'string') then raise exception 'Institution gallery and type required' using errcode='22023'; end if;
 if k='career' then
  foreach field in array array['studyPlan','requirements','faq'] loop
   if jsonb_typeof(d->field) is distinct from 'array' then raise exception 'Career section list required' using errcode='22023'; end if;
  end loop;
 end if;
 return new;
end; $$;
create trigger cms_editorial_required_fields before insert or update of draft on public.cms_documents for each row execute function cms_private.editorial_required_fields();
revoke all on function cms_private.editorial_required_fields() from public,anon,authenticated;
notify pgrst,'reload schema';
