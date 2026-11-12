-- PROPOSAL ONLY. NOT APPLIED. Back up get-definitivo before operator execution.
-- Target: zomoblpgurchkxvkkutj. Never run in GET Instituciones.
-- Prerequisite: existing get_control_private.me()/get_control_members.
-- Additive private inbox. No catalog, Auth user, role, or existing policy changes.
begin;
create table public.get_commercial_contacts (
 id uuid primary key default gen_random_uuid(),idempotency_key uuid not null unique,
 fingerprint text not null check(fingerprint ~ '^[a-f0-9]{64}$'),
 institution_name text not null check(length(institution_name) between 2 and 200),
 contact_name text not null check(length(contact_name) between 2 and 200),
 phone text not null check(length(phone) between 3 and 50),
 email text not null check(length(email) between 3 and 320),
 plan text not null check(plan in ('Básico','Profesional','Premium')),
 message text not null default '' check(length(message)<=4000),
 status text not null default 'nueva' check(status in ('nueva','en_seguimiento','contactada','cerrada')),
 revision integer not null default 0 check(revision>=0),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 source_path text not null default '/contacto' check(source_path='/contacto')
);
create index get_commercial_contacts_date on public.get_commercial_contacts(created_at desc,id desc);
create index get_commercial_contacts_status_date on public.get_commercial_contacts(status,created_at desc,id desc);
create table public.get_commercial_contact_audit (
 id bigint generated always as identity primary key,contact_id uuid not null references public.get_commercial_contacts(id),
 actor_id uuid not null,previous_status text not null,next_status text not null,at timestamptz not null default now()
);
create index get_commercial_contact_audit_contact on public.get_commercial_contact_audit(contact_id,id desc);
create table public.get_commercial_contact_rates (rate_key text primary key check(rate_key ~ '^[a-f0-9]{64}$'),window_start timestamptz not null,count integer not null check(count>0));
alter table public.get_commercial_contacts enable row level security;
alter table public.get_commercial_contact_audit enable row level security;
alter table public.get_commercial_contact_rates enable row level security;
revoke all on public.get_commercial_contacts,public.get_commercial_contact_audit,public.get_commercial_contact_rates from public,anon,authenticated,service_role;
revoke all on sequence public.get_commercial_contact_audit_id_seq from public,anon,authenticated,service_role;
grant select,insert on public.get_commercial_contacts to service_role;
grant select,insert,update,delete on public.get_commercial_contact_rates to service_role;
grant select(id,institution_name,contact_name,phone,email,plan,message,status,revision,created_at,updated_at,source_path) on public.get_commercial_contacts to authenticated;
grant update(status) on public.get_commercial_contacts to authenticated;
grant select on public.get_commercial_contact_audit to authenticated;
create policy commercial_contact_read on public.get_commercial_contacts for select to authenticated
 using (((select get_control_private.me())->>'role') in ('ADMINISTRADOR','EDITOR'));
create policy commercial_contact_followup on public.get_commercial_contacts for update to authenticated
 using (((select get_control_private.me())->>'role') in ('ADMINISTRADOR','EDITOR'))
 with check (((select get_control_private.me())->>'role') in ('ADMINISTRADOR','EDITOR'));
create policy commercial_contact_history on public.get_commercial_contact_audit for select to authenticated
 using (((select get_control_private.me())->>'role') in ('ADMINISTRADOR','EDITOR'));

-- Only server credential can create contact records; explicit EXECUTE revoke below.
-- Invoker uses its grants; it does not bypass RLS for public/authenticated roles.
create function public.get_commercial_contact_receive(p_key uuid,p_fingerprint text,p_payload jsonb,p_rate_key text)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare item public.get_commercial_contacts; attempts integer; receipt uuid;
begin
 if p_key is null or coalesce(p_fingerprint ~ '^[a-f0-9]{64}$',false)=false or coalesce(p_rate_key ~ '^[a-f0-9]{64}$',false)=false
 or coalesce(jsonb_typeof(p_payload)='object',false)=false then raise invalid_parameter_value; end if;
 if not coalesce(length(p_payload->>'institutionName') between 2 and 200 and length(p_payload->>'name') between 2 and 200
 and length(p_payload->>'phone') between 3 and 50 and length(p_payload->>'email') between 3 and 320
 and (p_payload->>'email') ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
 and (p_payload->>'plan') in ('Básico','Profesional','Premium') and length(coalesce(p_payload->>'message',''))<=4000,false) then raise invalid_parameter_value; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_key::text,459871));
 select * into item from public.get_commercial_contacts where idempotency_key=p_key;
 if found then
   if item.fingerprint<>p_fingerprint then return jsonb_build_object('status',409); end if;
   return jsonb_build_object('status',201,'receiptId',item.id);
 end if;
 delete from public.get_commercial_contact_rates where window_start<now()-interval '1 day';
 insert into public.get_commercial_contact_rates(rate_key,window_start,count) values(p_rate_key,now(),1)
 on conflict(rate_key) do update set
   count=case when get_commercial_contact_rates.window_start<now()-interval '10 minutes' then 1 else get_commercial_contact_rates.count+1 end,
   window_start=case when get_commercial_contact_rates.window_start<now()-interval '10 minutes' then now() else get_commercial_contact_rates.window_start end
 returning count into attempts;
 if attempts>5 then return jsonb_build_object('status',429); end if;
 insert into public.get_commercial_contacts(idempotency_key,fingerprint,institution_name,contact_name,phone,email,plan,message)
 values(p_key,p_fingerprint,p_payload->>'institutionName',p_payload->>'name',p_payload->>'phone',p_payload->>'email',p_payload->>'plan',coalesce(p_payload->>'message','')) returning id into receipt;
 return jsonb_build_object('status',201,'receiptId',receipt);
end $$;
revoke all on function public.get_commercial_contact_receive(uuid,text,jsonb,text) from public,anon,authenticated,service_role;
grant execute on function public.get_commercial_contact_receive(uuid,text,jsonb,text) to service_role;

-- This trigger is private and narrowly privileged solely to append immutable audit
-- records. It verifies the existing real Auth session/membership on every update.
create function get_control_private.audit_commercial_contact_status() returns trigger
language plpgsql security definer set search_path='' as $$
declare member jsonb;
begin
 member=get_control_private.me();
 if auth.uid() is null or coalesce(member->>'role','') not in ('ADMINISTRADOR','EDITOR') then raise insufficient_privilege; end if;
 if new.id<>old.id or new.idempotency_key<>old.idempotency_key or new.fingerprint<>old.fingerprint
 or new.institution_name<>old.institution_name or new.contact_name<>old.contact_name or new.phone<>old.phone
 or new.email<>old.email or new.plan<>old.plan or new.message<>old.message or new.created_at<>old.created_at or new.source_path<>old.source_path then raise insufficient_privilege; end if;
 if new.status is distinct from old.status then
   new.revision=old.revision+1;new.updated_at=now();
   insert into public.get_commercial_contact_audit(contact_id,actor_id,previous_status,next_status)
   values(old.id,auth.uid(),old.status,new.status);
 else new.revision=old.revision;new.updated_at=old.updated_at;
 end if;
 return new;
end $$;
revoke all on function get_control_private.audit_commercial_contact_status() from public,anon,authenticated,service_role;
create trigger commercial_contact_status_audit before update on public.get_commercial_contacts
for each row execute function get_control_private.audit_commercial_contact_status();

create function public.get_commercial_contact_list(p_query text default '',p_status text default '',p_page int default 1)
returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare rows jsonb; total bigint; needle text=lower(trim(coalesce(p_query,'')));
begin
 if coalesce((get_control_private.me())->>'role','') not in ('ADMINISTRADOR','EDITOR') then raise insufficient_privilege; end if;
 if length(needle)>120 or p_page is null or p_page<1 or p_page>50000 or p_status is null or p_status not in ('','nueva','en_seguimiento','contactada','cerrada') then raise invalid_parameter_value; end if;
 select count(*) into total from public.get_commercial_contacts c where (p_status='' or c.status=p_status)
 and (needle='' or strpos(lower(c.institution_name||' '||c.contact_name||' '||c.email||' '||c.phone||' '||c.message),needle)>0);
 select coalesce(jsonb_agg(to_jsonb(items)),'[]') into rows from (
   select c.id,c.institution_name,c.contact_name,c.phone,c.email,c.plan,c.message,c.status,c.revision,c.created_at,c.updated_at,c.source_path
   from public.get_commercial_contacts c where (p_status='' or c.status=p_status)
   and (needle='' or strpos(lower(c.institution_name||' '||c.contact_name||' '||c.email||' '||c.phone||' '||c.message),needle)>0)
   order by c.created_at desc,c.id desc limit 20 offset (p_page-1)*20
 ) items;
 return jsonb_build_object('rows',rows,'total',total);
end $$;
create function public.get_commercial_contact_status(p_id uuid,p_status text,p_expected_revision int)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare item record; next_revision int;
begin
 if coalesce((get_control_private.me())->>'role','') not in ('ADMINISTRADOR','EDITOR') then raise insufficient_privilege; end if;
 if p_id is null or p_status is null or p_status not in ('nueva','en_seguimiento','contactada','cerrada') or p_expected_revision is null or p_expected_revision<0 then raise invalid_parameter_value; end if;
 select c.id,c.status,c.revision into item from public.get_commercial_contacts c where c.id=p_id for update;
 if not found then raise insufficient_privilege; end if;
 if item.revision<>p_expected_revision then raise serialization_failure; end if;
 if item.status=p_status then return jsonb_build_object('ok',true,'id',p_id,'status',p_status,'revision',item.revision); end if;
 update public.get_commercial_contacts set status=p_status where id=p_id returning revision into next_revision;
 return jsonb_build_object('ok',true,'id',p_id,'status',p_status,'revision',next_revision);
end $$;
revoke all on function public.get_commercial_contact_list(text,text,int),public.get_commercial_contact_status(uuid,text,int) from public,anon,authenticated,service_role;
grant execute on function public.get_commercial_contact_list(text,text,int),public.get_commercial_contact_status(uuid,text,int) to authenticated;
commit;
-- After applying in an authorized environment: test anon, LECTOR, inactive and
-- active ADMINISTRADOR/EDITOR sessions; run database advisors and export backup.
-- No public grants, no new users, no changed role memberships, no CRM writes.
