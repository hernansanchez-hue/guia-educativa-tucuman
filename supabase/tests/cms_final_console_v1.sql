
begin;
set constraints all immediate;
do $$
declare sa uuid:=gen_random_uuid();adm uuid:=gen_random_uuid();ed uuid:=gen_random_uuid();ss uuid:=gen_random_uuid();ads uuid:=gen_random_uuid();es uuid:=gen_random_uuid();d public.cms_documents;original jsonb;p jsonb;v integer;n integer;checks integer:=0;
begin
 insert into auth.users(id,email,email_confirmed_at) values(sa,sa||'@final-test.invalid',now()),(adm,adm||'@final-test.invalid',now()),(ed,ed||'@final-test.invalid',now());
 insert into auth.sessions(id,user_id) values(ss,sa),(ads,adm),(es,ed);
 insert into public.admin_profiles(id,display_name,role) values(sa,'TEST FINAL SA','SUPERADMIN'),(adm,'TEST FINAL ADMIN','ADMIN'),(ed,'TEST FINAL EDITOR','EDITOR');
 perform set_config('request.jwt.claims','{}',true);set local role anon;
 begin perform public.cms_console_query('history');raise exception 'Anonymous history exposed';exception when insufficient_privilege then checks:=checks+1;end;
 if public.cms_site_configuration()->'design'<>'{}'::jsonb then raise exception 'Approved defaults changed';end if;checks:=checks+1;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true);set local role authenticated;
 begin perform public.cms_console_query('users');raise exception 'Editor users access';exception when insufficient_privilege then checks:=checks+1;end;
 begin perform public.cms_manage_profile(ed,'TEST EDITOR','ADMIN','active',false);raise exception 'Editor escalation';exception when insufficient_privilege then checks:=checks+1;end;
 if jsonb_array_length(public.cms_console_query('search','{"q":"Siglo"}'))=0 then raise exception 'Search unavailable';end if;checks:=checks+1;
 reset role;
 select * into d from public.cms_documents where module_id='design';original:=d.draft;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
 begin perform public.cms_mutate_content('save',p_id=>d.id,p_revision=>d.revision,p_payload=>'{"data":{"accent":"#102030"}}');raise exception 'Admin global design access';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true);set local role authenticated;
 if (select count(*) from public.admin_profiles where role='SUPERADMIN' and status='active')=1 then
  begin perform public.cms_manage_profile(sa,'TEST SA','EDITOR','active',false);raise exception 'Last SA downgraded';exception when invalid_parameter_value then checks:=checks+1;end;
 else
  -- Only the disposable test profile changes; human SUPERADMIN accounts remain active.
  perform public.cms_manage_profile(sa,'TEST SA','EDITOR','active',false);
  if (select role from public.admin_profiles where id=sa)<>'EDITOR' then raise exception 'Fixture demotion with another SA failed';end if;checks:=checks+1;
  reset role;update public.admin_profiles set role='SUPERADMIN' where id=sa;set local role authenticated;
 end if;
 perform public.cms_configuration_bundle('design','{"data":{"accent":"#102030"}}',d.revision,false);
 if public.cms_site_configuration()->'design'<>'{}'::jsonb then raise exception 'Global draft exposed';end if;checks:=checks+1;
 perform public.cms_configuration_bundle('design','{"data":{"accent":"#102030"}}',d.revision+1,true);
 if public.cms_site_configuration()->'design'->>'accent'<>'#102030' then raise exception 'Global publication unavailable';end if;checks:=checks+1;
 begin perform public.cms_mutate_content('save',p_id=>d.id,p_revision=>d.revision+3,p_payload=>'{"data":{"css":"body{}"}}');raise exception 'Free CSS accepted';exception when invalid_parameter_value then checks:=checks+1;end;
 perform public.cms_mutate_content('restore',p_id=>d.id,p_revision=>d.revision+3,p_version=>1);
 if public.cms_site_configuration()->'design'->>'accent'<>'#102030' then raise exception 'Restore changed public before publication';end if;checks:=checks+1;
 reset role;
 for d in select * from public.cms_documents where draft->>'_kind' in ('institution','offering','home','event','service') order by module_id,id loop
  original:=d.draft;v:=d.published_version;n:=(select count(*) from public.cms_versions where document_id=d.id);
  p:=case d.draft->>'_kind' when 'institution' then jsonb_set(original,'{data,phone}','"TEST FINAL PHONE"') when 'home' then jsonb_set(original,'{data,titleBefore}','"TEST FINAL HOME"') else jsonb_set(original,'{seo}', '{"title":"TEST FINAL TITLE","description":"Descripción de prueba sin HTML.","noindex":true}'::jsonb) end;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
  perform public.cms_editorial_bundle('save',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision,'payload',p)));
  if public.cms_read_published(d.module_id,d.entity_key) is distinct from original then raise exception 'Draft leak';end if;checks:=checks+1;
  perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+1,'payload',p)));
  if public.cms_read_published(d.module_id,d.entity_key) is distinct from p then raise exception 'Publication missing';end if;checks:=checks+1;
  perform public.cms_mutate_content('restore',p_id=>d.id,p_revision=>(select revision from public.cms_documents where id=d.id),p_version=>v);
  if public.cms_read_published(d.module_id,d.entity_key) is distinct from p then raise exception 'Restoration leaked';end if;checks:=checks+1;
  if (select count(*) from public.cms_versions where document_id=d.id)<>n+1 then raise exception 'History rewritten';end if;checks:=checks+1;
  reset role;
 end loop;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
 perform public.cms_manual_redirect('/final-old','/concepcion',301);
 if public.cms_redirect_record('/final-old')->>'status'<>'301' then raise exception 'Redirect type lost';end if;checks:=checks+1;
 begin perform public.cms_manual_redirect('/concepcion','/final-old',308);raise exception 'Redirect loop accepted';exception when invalid_parameter_value then checks:=checks+1;end;
 begin perform public.cms_manual_redirect('/final-before','/final-old',308);raise exception 'Redirect chain accepted';exception when invalid_parameter_value then checks:=checks+1;end;
 if public.cms_console_query('seo-metrics')->>'total' is null then raise exception 'SEO metrics missing';end if;checks:=checks+1;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true);set local role authenticated;
 perform public.cms_manage_profile(ed,'TEST EDITOR','EDITOR','disabled',false);reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true);set local role authenticated;
 begin perform public.cms_console_query('search');raise exception 'Disabled identity accessed';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 delete from auth.sessions where id=ss;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true);set local role authenticated;
 if (select count(*) from public.admin_profiles where id=sa)<>0 then raise exception 'Revoked session exposed profile';end if;checks:=checks+1;
 begin perform public.cms_console_query('users');raise exception 'Revoked SA users access';exception when insufficient_privilege then checks:=checks+1;end;
 begin perform public.cms_manage_profile(adm,'TEST ADMIN','SUPERADMIN','active',false);raise exception 'Revoked SA role mutation';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 if checks<>271 then raise exception 'Unexpected check count: %',checks;end if;
 raise notice 'FINAL CMS checks PASS: %',checks;
end;$$;
rollback;
select jsonb_build_object('checks_passed',271,'mode','ROLLBACK — no real session or permanent test modifications') result;
