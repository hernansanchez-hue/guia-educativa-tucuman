-- Real database roles/RLS/RPC tests. All fixture identities and mutations are rolled back.
begin;
do $$
declare
 sa uuid:=gen_random_uuid(); adm uuid:=gen_random_uuid(); ed uuid:=gen_random_uuid(); outsider uuid:=gen_random_uuid(); uv uuid:=gen_random_uuid();
 ss uuid:=gen_random_uuid(); ads uuid:=gen_random_uuid(); es uuid:=gen_random_uuid(); os uuid:=gen_random_uuid(); uvs uuid:=gen_random_uuid();
 existing_admins integer; r jsonb; doc uuid; duplicate_identity uuid:=gen_random_uuid(); rev integer:=1; checks integer:=0;
begin
 select count(*) into existing_admins from public.admin_profiles;
 insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
 (sa,sa||'@cms-test.invalid',now(),'{}'),(adm,adm||'@cms-test.invalid',now(),'{}'),(ed,ed||'@cms-test.invalid',now(),'{}'),
 (outsider,outsider||'@cms-test.invalid',now(),'{"role":"SUPERADMIN"}'),(uv,uv||'@cms-test.invalid',null,'{}');
 insert into auth.sessions(id,user_id) values(ss,sa),(ads,adm),(es,ed),(os,outsider),(uvs,uv);
 if existing_admins=0 then
 perform set_config('request.jwt.claims','{"role":"service_role"}',true); set local role service_role;
 r:=public.cms_bootstrap_superadmin(sa||'@cms-test.invalid','Test SA');
 if r->>'role'<>'SUPERADMIN' then raise exception 'Verified bootstrap failed'; end if; checks:=checks+1;
 if public.cms_bootstrap_superadmin(sa||'@cms-test.invalid','Test SA')->>'id'<>sa::text then raise exception 'Bootstrap not idempotent'; end if; checks:=checks+1;
 begin perform public.cms_bootstrap_superadmin(uv||'@cms-test.invalid','Test UV'); raise exception 'Unverified bootstrap accepted'; exception when invalid_parameter_value then checks:=checks+1; end;
 begin perform public.cms_bootstrap_superadmin(adm||'@cms-test.invalid','Test Admin'); raise exception 'Second bootstrap accepted'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 insert into auth.users(id,email,email_confirmed_at,is_sso_user) values(duplicate_identity,upper(sa||'@cms-test.invalid'),now(),true);
 set local role service_role;
 begin perform public.cms_bootstrap_superadmin(sa||'@cms-test.invalid','Test SA'); raise exception 'Ambiguous identity bootstrap accepted'; exception when invalid_parameter_value then checks:=checks+1; end;
 reset role; delete from auth.users where id=duplicate_identity;
 else
  -- An installed CMS must refuse another bootstrap. Existing human profiles are never touched.
  set local role service_role;
  begin perform public.cms_bootstrap_superadmin(sa||'@cms-test.invalid','Test SA'); raise exception 'Installed CMS accepted another bootstrap'; exception when insufficient_privilege then checks:=checks+1; end;
  reset role;
  insert into public.admin_profiles(id,display_name,role) values(sa,'Test SA','SUPERADMIN');
 end if;
 insert into public.admin_profiles(id,display_name,role) values(adm,'Test Admin','ADMIN'),(ed,'Test Editor','EDITOR'),(uv,'Test unverified','ADMIN');
 begin insert into public.admin_profiles(id,display_name,role) values(outsider,'Invalid','OWNER'); raise exception 'Invalid role accepted'; exception when check_violation then checks:=checks+1; end;
 begin update public.admin_profiles set status='unknown' where id=ed; raise exception 'Invalid status accepted'; exception when check_violation then checks:=checks+1; end;
 perform set_config('request.jwt.claims','{}',true); set local role anon;
 begin perform count(*) from public.cms_documents; raise exception 'Anonymous drafts accessible'; exception when insufficient_privilege then checks:=checks+1; end;
 begin perform public.cms_mutate_content('create',p_module=>'institutions',p_entity=>'test',p_payload=>'{}'); raise exception 'Anonymous write accepted'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',outsider,'role','authenticated','session_id',os,'user_metadata',jsonb_build_object('role','SUPERADMIN'))::text,true); set local role authenticated;
 if exists(select 1 from public.admin_profiles) then raise exception 'Outsider read profiles'; end if; checks:=checks+1;
 begin perform public.cms_mutate_content('create',p_module=>'institutions',p_entity=>'test',p_payload=>'{}'); raise exception 'Metadata escalated'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true); set local role authenticated;
 r:=public.cms_mutate_content('create',p_module=>'institutions',p_entity=>'phase2-rollback-fixture',p_payload=>'{"title":"A"}'); doc:=(r->'document'->>'id')::uuid;
 if public.cms_read_published('institutions','phase2-rollback-fixture') is not null then raise exception 'Draft leaked'; end if; checks:=checks+1;
 r:=public.cms_mutate_content('save',p_id=>doc,p_payload=>'{"title":"A"}',p_revision=>rev); rev:=2; checks:=checks+1;
 begin perform public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); raise exception 'Editor published'; exception when insufficient_privilege then checks:=checks+1; end;
 begin perform public.cms_manage_profile(ed,'Elevate','SUPERADMIN','active'); raise exception 'Editor escalated'; exception when insufficient_privilege then checks:=checks+1; end;
 begin update public.admin_profiles set role='SUPERADMIN' where id=ed; raise exception 'Direct escalation'; exception when insufficient_privilege then checks:=checks+1; end;
 begin perform public.cms_mutate_content('create',p_module=>'design',p_entity=>'global',p_payload=>'{}'); raise exception 'Editor design edit'; exception when insufficient_privilege then checks:=checks+1; end;
 begin perform public.cms_mutate_content('save',p_id=>doc,p_revision=>rev,p_payload=>'{"title":"<script>x</script>"}'); raise exception 'HTML accepted'; exception when invalid_parameter_value then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true); set local role authenticated;
 begin perform public.cms_manage_profile(adm,'Elevate','SUPERADMIN','active'); raise exception 'Admin escalated'; exception when insufficient_privilege then checks:=checks+1; end;
 r:=public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); rev:=3; checks:=checks+1;
 r:=public.cms_mutate_content('save',p_id=>doc,p_revision=>rev,p_payload=>'{"title":"B"}'); rev:=4;
 if public.cms_read_published('institutions','phase2-rollback-fixture')->>'title'<>'A' then raise exception 'Draft changed published'; end if; checks:=checks+1;
 begin perform public.cms_mutate_content('save',p_id=>doc,p_revision=>3,p_payload=>'{}'); raise exception 'Stale revision accepted'; exception when serialization_failure then checks:=checks+1; end;
 r:=public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); rev:=5;
 if (select count(*) from public.cms_versions where document_id=doc)<>2 then raise exception 'Missing version 2'; end if; checks:=checks+1;
 r:=public.cms_mutate_content('restore',p_id=>doc,p_revision=>rev,p_version=>1); rev:=6;
 if r->'document'->'draft'->>'title'<>'A' or public.cms_read_published('institutions','phase2-rollback-fixture')->>'title'<>'B' then raise exception 'Restore changed published'; end if; checks:=checks+1;
 r:=public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); rev:=7;
 if (select count(*) from public.cms_versions where document_id=doc)<>3 then raise exception 'Restore rewrote versions'; end if; checks:=checks+1;
 reset role;
 begin update public.cms_versions set snapshot='{}' where document_id=doc; raise exception 'History changed'; exception when insufficient_privilege then checks:=checks+1; end;
 begin delete from public.cms_audit_logs where entity_id=doc; raise exception 'Audit deleted'; exception when insufficient_privilege then checks:=checks+1; end;
 perform set_config('request.jwt.claims','{}',true); set local role anon;
 if public.cms_read_published('institutions','phase2-rollback-fixture')->>'title'<>'A' then raise exception 'Published unavailable'; end if; checks:=checks+1;
 begin perform count(*) from public.cms_versions; raise exception 'Anon history accessible'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',uv,'role','authenticated','session_id',uvs)::text,true); set local role authenticated;
 if exists(select 1 from public.cms_documents) then raise exception 'Unverified user read'; end if; checks:=checks+1;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true); set local role authenticated;
 perform public.cms_manage_profile(ed,'Editor','EDITOR','active',true); checks:=checks+1;
  if cms_private.can_perform(null) or cms_private.can_perform('invalid') then raise exception 'Unknown action allowed'; end if; checks:=checks+1;
 if (select count(*) from public.admin_profiles where role='SUPERADMIN' and status='active')=1 then
  begin perform public.cms_manage_profile(sa,'SA','ADMIN','active'); raise exception 'Last superadmin removed'; exception when invalid_parameter_value then checks:=checks+1; end;
 else
  perform public.cms_manage_profile(sa,'SA','ADMIN','active');
  if (select role from public.admin_profiles where id=sa)<>'ADMIN' then raise exception 'Another active SA should allow fixture demotion';end if;checks:=checks+1;
  reset role;update public.admin_profiles set role='SUPERADMIN' where id=sa;set local role authenticated;
 end if;
 begin perform public.cms_bootstrap_superadmin(sa||'@cms-test.invalid','SA'); raise exception 'User bootstrap'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true); set local role authenticated;
 r:=public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); rev:=8; checks:=checks+1;
 reset role; update public.admin_profiles set status='disabled' where id=ed; set local role authenticated;
 begin perform public.cms_mutate_content('publish',p_id=>doc,p_revision=>rev); raise exception 'Disabled retained access'; exception when insufficient_privilege then checks:=checks+1; end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true); set local role authenticated;
 r:=public.cms_mutate_content('unpublish',p_id=>doc,p_revision=>rev); rev:=9;
 if public.cms_read_published('institutions','phase2-rollback-fixture') is not null then raise exception 'Unpublish failed'; end if; checks:=checks+1;
 r:=public.cms_mutate_content('archive',p_id=>doc,p_revision=>rev); rev:=10;
 begin perform public.cms_mutate_content('save',p_id=>doc,p_revision=>rev,p_payload=>'{}'); raise exception 'Archived write'; exception when invalid_parameter_value then checks:=checks+1; end;
 perform public.cms_auth_event('LOGIN'); perform public.cms_auth_event('LOGOUT'); checks:=checks+1;
 reset role; delete from auth.sessions where id=ads; set local role authenticated;
 if exists(select 1 from public.cms_documents) then raise exception 'Revoked session read'; end if; checks:=checks+1;
 reset role;
 perform set_config('cms.tests.result',jsonb_build_object('checks',checks,'passed',true,'fixtures','rolled back')::text,true);
end; $$;
select current_setting('cms.tests.result')::jsonb as result;
rollback;
