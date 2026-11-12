
-- Baseline presentation is not an editable second source. Restore older snapshots without losing it. Remote timestamp aligned.
create function cms_private.presentation_restore_guard() returns trigger language plpgsql set search_path='' as $$
begin
 if old.draft->>'_kind'='institution' and old.draft->'data' ? 'presentation' then
  if not(new.draft->'data' ? 'presentation') then new.draft:=jsonb_set(new.draft,'{data,presentation}',old.draft->'data'->'presentation');
  elsif new.draft->'data'->'presentation' is distinct from old.draft->'data'->'presentation' then raise exception 'Approved presentation baseline is immutable' using errcode='22023';end if;
 end if;
 return new;
end; $$;
revoke all on function cms_private.presentation_restore_guard() from public,anon,authenticated;
create trigger cms_presentation_restore before update of draft on public.cms_documents for each row execute function cms_private.presentation_restore_guard();
