-- GET Definitivo only: zomoblpgurchkxvkkutj. Backward-compatible additive change.
-- Existing four-argument receiver is retained for safe application rollback.
-- Historical evidence remains NULL; no backfill, inferred consent or added PII.
begin;
alter table public.get_commercial_contacts add column consent_evidence jsonb;
alter table public.get_commercial_contacts add constraint commercial_consent_shape check (
 consent_evidence is null or coalesce(
   jsonb_typeof(consent_evidence)='object'
   and consent_evidence->'accepted'='true'::jsonb
   and jsonb_typeof(consent_evidence->'noticeVersion')='string'
   and length(consent_evidence->>'noticeVersion') between 1 and 100
   and jsonb_typeof(consent_evidence->'privacyVersion')='string'
   and length(consent_evidence->>'privacyVersion') between 1 and 100
   and consent_evidence->>'sourcePath'='/contacto'
   and jsonb_typeof(consent_evidence->'receivedAt')='string'
   and (consent_evidence-'accepted'-'noticeVersion'-'privacyVersion'-'sourcePath'-'receivedAt')='{}'::jsonb,false)
);
grant select(consent_evidence) on public.get_commercial_contacts to authenticated;

create function get_control_private.immutable_commercial_consent() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if new.consent_evidence is distinct from old.consent_evidence then raise insufficient_privilege; end if;
 return new;
end $$;
revoke all on function get_control_private.immutable_commercial_consent() from public,anon,authenticated,service_role;
create trigger commercial_consent_immutable before update on public.get_commercial_contacts
for each row execute function get_control_private.immutable_commercial_consent();

create function public.get_commercial_contact_receive(p_key uuid,p_fingerprint text,p_payload jsonb,p_rate_key text,p_consent jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare item public.get_commercial_contacts; attempts integer; receipt uuid;
begin
 if not coalesce(jsonb_typeof(p_consent)='object' and p_consent->'accepted'='true'::jsonb
   and p_consent->>'noticeVersion'='contacto-2026-11-15-v1'
   and p_consent->>'privacyVersion'='2026-11-15' and p_consent->>'sourcePath'='/contacto'
   and (p_consent-'accepted'-'noticeVersion'-'privacyVersion'-'sourcePath')='{}'::jsonb,false)
 then raise invalid_parameter_value; end if;
 if p_key is null or not coalesce(p_fingerprint ~ '^[a-f0-9]{64}$',false)
   or not coalesce(p_rate_key ~ '^[a-f0-9]{64}$',false)
   or not coalesce(jsonb_typeof(p_payload)='object',false) then raise invalid_parameter_value; end if;
 if not coalesce(length(p_payload->>'institutionName') between 2 and 200 and length(p_payload->>'name') between 2 and 200
   and length(p_payload->>'phone') between 3 and 50 and length(p_payload->>'email') between 3 and 320
   and (p_payload->>'email') ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
   and (p_payload->>'plan') in ('Básico','Profesional','Premium')
   and length(coalesce(p_payload->>'message',''))<=4000,false) then raise invalid_parameter_value; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_key::text,459871));
 select * into item from public.get_commercial_contacts where idempotency_key=p_key;
 if found then
   if item.fingerprint<>p_fingerprint or (item.consent_evidence is not null and item.consent_evidence-'receivedAt'<>p_consent)
   then return jsonb_build_object('status',409); end if;
   return jsonb_build_object('status',201,'receiptId',item.id);
 end if;
 delete from public.get_commercial_contact_rates where window_start<now()-interval '1 day';
 insert into public.get_commercial_contact_rates(rate_key,window_start,count) values(p_rate_key,now(),1)
 on conflict(rate_key) do update set
   count=case when get_commercial_contact_rates.window_start<now()-interval '10 minutes' then 1 else get_commercial_contact_rates.count+1 end,
   window_start=case when get_commercial_contact_rates.window_start<now()-interval '10 minutes' then now() else get_commercial_contact_rates.window_start end
 returning count into attempts;
 if attempts>5 then return jsonb_build_object('status',429); end if;
 insert into public.get_commercial_contacts(idempotency_key,fingerprint,institution_name,contact_name,phone,email,plan,message,consent_evidence)
 values(p_key,p_fingerprint,p_payload->>'institutionName',p_payload->>'name',p_payload->>'phone',p_payload->>'email',p_payload->>'plan',coalesce(p_payload->>'message',''),
   p_consent||jsonb_build_object('receivedAt',clock_timestamp())) returning id into receipt;
 return jsonb_build_object('status',201,'receiptId',receipt);
end $$;
revoke all on function public.get_commercial_contact_receive(uuid,text,jsonb,text,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.get_commercial_contact_receive(uuid,text,jsonb,text,jsonb) to service_role;

create or replace function public.get_commercial_contact_list(p_query text default '',p_status text default '',p_page int default 1)
returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare rows jsonb; total bigint; needle text=lower(trim(coalesce(p_query,'')));
begin
 if coalesce((get_control_private.me())->>'role','') not in ('ADMINISTRADOR','EDITOR') then raise insufficient_privilege; end if;
 if length(needle)>120 or p_page is null or p_page<1 or p_page>50000 or p_status is null or p_status not in ('','nueva','en_seguimiento','contactada','cerrada') then raise invalid_parameter_value; end if;
 select count(*) into total from public.get_commercial_contacts c where (p_status='' or c.status=p_status)
 and (needle='' or strpos(lower(c.institution_name||' '||c.contact_name||' '||c.email||' '||c.phone||' '||c.message),needle)>0);
 select coalesce(jsonb_agg(to_jsonb(items)),'[]') into rows from (
   select c.id,c.institution_name,c.contact_name,c.phone,c.email,c.plan,c.message,c.status,c.revision,c.created_at,c.updated_at,c.source_path,c.consent_evidence
   from public.get_commercial_contacts c where (p_status='' or c.status=p_status)
   and (needle='' or strpos(lower(c.institution_name||' '||c.contact_name||' '||c.email||' '||c.phone||' '||c.message),needle)>0)
   order by c.created_at desc,c.id desc limit 20 offset (p_page-1)*20
 ) items;
 return jsonb_build_object('rows',rows,'total',total);
end $$;
notify pgrst, 'reload schema';
commit;
