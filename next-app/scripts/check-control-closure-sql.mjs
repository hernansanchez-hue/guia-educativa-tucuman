// PostgreSQL 17 restored-backup acceptance. Docker network=none; no remote URL.
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const container=process.argv[2];
if(!/^get-backup-restore-[a-z0-9-]+$/.test(container||''))throw Error('OWN_ISOLATED_CONTAINER_REQUIRED');
const run=(args,input)=>spawnSync('docker',args,{input,encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:4*1024*1024});
const inspected=run(['inspect',container]);
if(inspected.status)throw Error('CONTAINER_UNAVAILABLE');
const state=JSON.parse(inspected.stdout)[0];
if(state.HostConfig.NetworkMode!=='none'||Object.keys(state.HostConfig.PortBindings||{}).length)throw Error('ISOLATION_REQUIRED');
function sql(query){
 const result=run(['exec','--user','root','-i',container,'psql','-X','-qAt','-h','/tmp','-U','supabase_admin','-d','get_restore_test','-v','ON_ERROR_STOP=1'],query);
 if(result.status){
   // Diagnostic contains only our SQL labels/definitions, never rows or parameters.
   const labels=(result.stderr||'').match(/ERROR:[^\n]*/g)||['SQL_FAILED'];
   throw Error(labels.join(' ').slice(0,500));
 }
 return result.stdout.trim();
}
const migrations=['20261116011719_commercial_consent_evidence.sql','20261116011721_control_mfa_opt_in.sql'];
// All application/Auth rows are fingerprinted before and after, excluding only
// the newly-added nullable field. No row data leaves the isolated database.
const fingerprintSql=`do $$ declare r record; h text; begin
 create temporary table if not exists closure_hashes(name text, hash text);
 truncate closure_hashes;
 for r in select n.nspname schema,c.relname name from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind='r' and n.nspname in ('public','get_control_private','cms_private','auth','storage') order by 1,2 loop
 execute format('select md5(coalesce(string_agg(md5((to_jsonb(t)-%L)::text),%L order by md5((to_jsonb(t)-%L)::text)),%L)) from only %I.%I t','consent_evidence','','consent_evidence','',r.schema,r.name) into h;
 insert into closure_hashes values(r.schema||'.'||r.name,h);
 end loop; end $$; select jsonb_object_agg(name,hash) from closure_hashes;`;
const before=sql(fingerprintSql);
if(process.argv.includes('--apply-local'))for(const name of migrations)sql(readFileSync(fileURLToPath(new URL('../../supabase/migrations/'+name,import.meta.url)),'utf8'));
const [admin,reader,session,readSession,factor,key,oldKey]=Array.from({length:7},()=>randomUUID());
const payload=JSON.stringify({institutionName:'Ensayo SQL aislado',name:'Prueba',email:'qa@example.invalid',phone:'000',plan:'Básico',message:'Prueba descartable'});
const evidence=JSON.stringify({accepted:true,noticeVersion:'contacto-2026-11-15-v1',privacyVersion:'2026-11-15',sourcePath:'/contacto'});
const receive=(id=key,consent=`'${evidence}'::jsonb`)=>`public.get_commercial_contact_receive('${id}','${'a'.repeat(64)}','${payload}','${'c'.repeat(64)}',${consent})`;
const identify=(id=admin,aal='aal1',sid=session)=>`select set_config('request.jwt.claims','${JSON.stringify({sub:id,aal,session_id:sid})}',true);`;
const deny=(statement,label)=>`do $$ begin begin ${statement}; raise exception '${label}' using errcode='22000'; exception when insufficient_privilege then null; end; end $$;`;
sql(`begin;
insert into auth.users(id,email,email_confirmed_at) values('${admin}','qa-${admin}@example.invalid',now()),('${reader}','qa-${reader}@example.invalid',now());
insert into auth.sessions(id,user_id) values('${session}','${admin}'),('${readSession}','${reader}');
insert into public.get_control_members(id,name,role,active) values('${admin}','SQL ensayo','ADMINISTRADOR',true),('${reader}','SQL lectura','LECTOR',true);
set local role service_role;
do $$ declare a jsonb; b jsonb; original jsonb; begin
 begin perform ${receive(key,"null")}; raise exception 'MISSING_CONSENT_ACCEPTED' using errcode='22000'; exception when invalid_parameter_value then null; end;
 begin perform ${receive(key,`'${JSON.stringify({...JSON.parse(evidence),accepted:false})}'::jsonb`)}; raise exception 'FALSE_CONSENT_ACCEPTED' using errcode='22000'; exception when invalid_parameter_value then null; end;
 a=${receive()}; select consent_evidence into original from public.get_commercial_contacts where id=(a->>'receiptId')::uuid;
 if a->>'status'<>'201' or original-'receivedAt'<>'${evidence}'::jsonb or (original->>'receivedAt')::timestamptz<transaction_timestamp() then raise exception 'PERSISTENCE_FAILED'; end if;
 b=${receive()};
 if a<>b or (select consent_evidence from public.get_commercial_contacts where id=(a->>'receiptId')::uuid)<>original then raise exception 'RETRY_CHANGED_EVIDENCE'; end if;
 perform public.get_commercial_contact_receive('${oldKey}','${'a'.repeat(64)}','${payload}','${'c'.repeat(64)}');
 perform ${receive(oldKey)};
 if (select consent_evidence is not null from public.get_commercial_contacts where idempotency_key='${oldKey}') then raise exception 'INVENTED_LEGACY_CONSENT'; end if;
end $$;
reset role;
select set_config('test.receipt',(select id::text from public.get_commercial_contacts where idempotency_key='${key}'),true);
set local role anon;
${deny('perform '+receive(),'ANON_RECEIVE_ALLOWED')}
${deny('perform consent_evidence from public.get_commercial_contacts','ANON_READ_ALLOWED')}
set local role authenticated;
${identify(reader,'aal1',readSession)}
${deny("perform public.get_commercial_contact_list('','',1)",'READER_INBOX_ALLOWED')}
do $$ begin if exists(select id from public.get_commercial_contacts) then raise exception 'READER_RLS_LEAK'; end if; end $$;
${identify()}
${deny('perform '+receive(),'HUMAN_RECEIVE_ALLOWED')}
do $$ begin if get_control_private.me()->>'id'<>'${admin}' then raise exception 'OPT_IN_ACCESS_BROKEN'; end if;
 if not exists(select 1 from public.get_commercial_contacts where id=current_setting('test.receipt')::uuid and consent_evidence->'accepted'='true'::jsonb) then raise exception 'EVIDENCE_NOT_VISIBLE'; end if; end $$;
${deny("update public.get_commercial_contacts set consent_evidence=null where id=current_setting('test.receipt')::uuid",'EVIDENCE_MUTABLE')}
reset role;
insert into auth.mfa_factors(id,user_id,factor_type,status,created_at,updated_at) values('${factor}','${admin}','totp','unverified',now(),now());
set local role authenticated;
do $$ begin if get_control_private.me() is null then raise exception 'UNVERIFIED_FACTOR_LOCKOUT'; end if; end $$;
reset role; update auth.mfa_factors set status='verified' where id='${factor}';
set local role authenticated;
do $$ begin if get_control_private.me() is not null or exists(select id from public.get_commercial_contacts) then raise exception 'AAL1_BYPASS'; end if;
 if public.get_control_mfa_context()->>'id'<>'${admin}' then raise exception 'CHALLENGE_CONTEXT_MISSING'; end if; end $$;
${deny("perform public.get_commercial_contact_list('','',1)",'MFA_LIST_BYPASS')}
${deny("perform public.get_commercial_contact_status(current_setting('test.receipt')::uuid,'cerrada',0)",'MFA_WRITE_BYPASS')}
${identify(admin,'aal2')}
do $$ begin if get_control_private.me()->>'id'<>'${admin}' then raise exception 'AAL2_DENIED'; end if;
 perform public.get_commercial_contact_status(current_setting('test.receipt')::uuid,'cerrada',0);
 if (select consent_evidence is null from public.get_commercial_contacts where id=current_setting('test.receipt')::uuid) then raise exception 'STATUS_LOST_EVIDENCE'; end if; end $$;
reset role; delete from auth.sessions where id='${session}';
set local role authenticated;
do $$ begin if get_control_private.me() is not null or public.get_control_mfa_context() is not null then raise exception 'REVOKED_SESSION_ALLOWED'; end if; end $$;
rollback;`);
if(sql(fingerprintSql)!==before)throw Error('EXISTING_DATA_CHANGED');
console.log(JSON.stringify({pass:true,postgres:17,isolated:true,fixturesRolledBack:true,existingDataUnchanged:true,consent:true,historicalNull:true,idempotent:true,rls:true,mfaOptIn:true,aal1DeniedAfterActivation:true,aal2Allowed:true,revokedSessionDenied:true}));
