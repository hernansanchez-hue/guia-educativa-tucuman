-- All profiles/sessions below are disposable fixtures, rolled back in this transaction.
-- Existing human accounts, policies, published content and version history are preserved.
begin;
do $$
declare
 ed uuid:=gen_random_uuid();adm uuid:=gen_random_uuid();es uuid:=gen_random_uuid();ads uuid:=gen_random_uuid();
 d public.cms_documents; original jsonb; payload jsonb; count_before int; checks int:=0;
begin
 insert into auth.users(id,email,email_confirmed_at) values(ed,ed||'@workspace-test.invalid',now()),(adm,adm||'@workspace-test.invalid',now());
 insert into auth.sessions(id,user_id) values(es,ed),(ads,adm);
 insert into public.admin_profiles(id,display_name,role) values(ed,'WORKSPACE TEST EDITOR','EDITOR'),(adm,'WORKSPACE TEST ADMIN','ADMIN');
 select * into d from public.cms_documents where module_id='cities' and entity_key='concepcion';
 original:=public.cms_read_published('cities','concepcion');
 select count(*) into count_before from public.cms_versions where document_id=d.id;
 payload:=jsonb_set(d.draft,'{data,slides}',jsonb_build_array(jsonb_build_object('id','workspace-slide','title','Slider de prueba','description','Texto temporal','image','/assets/get-city-footer-logo.png','href','/concepcion','ctaLabel','Ver carrera','institutionCtaLabel','Conocer más','institutionId','universidad-siglo-21-concepcion','careerId','abogacia','active',true)));
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true);set local role authenticated;
 perform public.cms_editorial_bundle('save',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision,'payload',payload)));checks:=checks+1;
 if public.cms_read_published('cities','concepcion') is distinct from original then raise exception 'Slider draft leaked';end if;checks:=checks+1;
 begin perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+1,'payload',payload)));raise exception 'Editor published slider';exception when insufficient_privilege then checks:=checks+1;end;
 begin perform public.cms_manage_profile(ed,'TEST','SUPERADMIN','active');raise exception 'Editor escalated';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
 perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+1,'payload',payload)));checks:=checks+1;
 if public.cms_read_published('cities','concepcion')->'data'->'slides' is distinct from payload->'data'->'slides' then raise exception 'Slider not published';end if;checks:=checks+1;
 if (select count(*) from public.cms_versions where document_id=d.id)<>count_before+1 then raise exception 'Slider version missing';end if;checks:=checks+1;
 if (select snapshot from public.cms_versions where document_id=d.id and version_number=d.published_version) is distinct from original then raise exception 'Original slider version changed';end if;checks:=checks+1;
 perform public.cms_mutate_content('restore',p_id=>d.id,p_revision=>d.revision+2,p_version=>d.published_version);checks:=checks+1;
 if public.cms_read_published('cities','concepcion')->'data'->'slides' is distinct from payload->'data'->'slides' then raise exception 'Restore changed public slider';end if;checks:=checks+1;
 if (select draft from public.cms_documents where id=d.id) is distinct from original then raise exception 'Restored draft mismatch';end if;checks:=checks+1;
 reset role;
 perform set_config('request.jwt.claims','{}',true);set local role anon;
 begin perform count(*) from public.cms_documents;raise exception 'Anon can see slider draft';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 perform set_config('cms.tests.workspace',jsonb_build_object('checks',checks,'passed',true,'fixtures','rolled back')::text,true);
end;$$;
select current_setting('cms.tests.workspace')::jsonb as result;
rollback;
