-- Transaction-only integration acceptance. No test identity/content/file survives.
begin;
set constraints all immediate;
do $$
declare sa uuid:=gen_random_uuid(); adm uuid:=gen_random_uuid(); ed uuid:=gen_random_uuid(); ss uuid:=gen_random_uuid(); ads uuid:=gen_random_uuid(); es uuid:=gen_random_uuid();
 d public.cms_documents; original jsonb; payload jsonb; pub jsonb; n int; checks int:=0; a jsonb; result jsonb; asset_id uuid; source_url text:='https://example.test/'||gen_random_uuid()||'.png'; used_url text; red_old text; red_new text;
begin
 insert into auth.users(id,email,email_confirmed_at) values(sa,sa||'@macro4-test.invalid',now()),(adm,adm||'@macro4-test.invalid',now()),(ed,ed||'@macro4-test.invalid',now());
 insert into auth.sessions(id,user_id) values(ss,sa),(ads,adm),(es,ed);
 insert into public.admin_profiles(id,display_name,role) values(sa,'CMS M4 TEST SA','SUPERADMIN'),(adm,'CMS M4 TEST ADMIN','ADMIN'),(ed,'CMS M4 TEST EDITOR','EDITOR');
 if (select count(*) from public.cms_documents where module_id not in ('design','settings'))<>104 then raise exception 'Unexpected imported document count';end if;checks:=checks+1;
 for d in select * from public.cms_documents where draft->>'_kind' in ('event','service','training-offering','about','orientation','navigation','footer') order by id loop
  original:=d.draft;
  payload:=case d.draft->>'_kind' when 'training-offering' then jsonb_set(original,'{data,duration}','"M4 TEST DURATION"')
   when 'about' then jsonb_set(original,'{data,copy,text01}','"M4 TEST TEXT"')
   when 'footer' then jsonb_set(original,'{data,address}','"M4 TEST ADDRESS"')
   when 'navigation' then jsonb_set(original,'{data,searchPlaceholder}','"M4 TEST SEARCH"')
   when 'orientation' then jsonb_set(original,'{data,description}','"M4 TEST DESCRIPTION"')
   else jsonb_set(original,'{data,name}','"M4 TEST NAME"') end;
  perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true);set local role authenticated;
  perform public.cms_editorial_bundle('save',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision,'payload',payload)));
  if public.cms_read_published(d.module_id,d.entity_key) is distinct from original then raise exception 'Draft leaked: %',d.module_id;end if;checks:=checks+1;
  begin perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+1,'payload',payload)));raise exception 'Editor published without override';exception when insufficient_privilege then checks:=checks+1;end;
  reset role;
  n:=(select count(*) from public.cms_versions where document_id=d.id);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
  perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+1,'payload',payload)));
  if public.cms_read_published(d.module_id,d.entity_key) is distinct from payload then raise exception 'Published content unavailable';end if;checks:=checks+1;
  if (select count(*) from public.cms_versions where document_id=d.id)<>n+1 then raise exception 'History missing';end if;checks:=checks+1;
  reset role;
 end loop;
 perform set_config('request.jwt.claims','{}',true);set local role anon;
 if jsonb_array_length(public.cms_module_entries('events'))<>8 or jsonb_array_length(public.cms_module_entries('services'))<>16 or jsonb_array_length(public.cms_module_entries('trainings'))<>6 then raise exception 'Public modules unavailable';end if;checks:=checks+1;
 if public.cms_module_entries('design')<>'[]'::jsonb then raise exception 'Restricted module exposed';end if;checks:=checks+1;
 begin perform public.cms_media_list();raise exception 'Anon media library allowed';exception when insufficient_privilege then checks:=checks+1;end;
 begin perform count(*) from public.cms_media_assets;raise exception 'Anon registry allowed';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 select * into d from public.cms_documents where module_id='events' and draft->>'_kind'='event' limit 1;
 red_old:='/eventos/'||(d.draft->'data'->>'slug');red_new:=red_old||'-m4-test';
 perform set_config('request.jwt.claims',jsonb_build_object('sub',adm,'role','authenticated','session_id',ads)::text,true);set local role authenticated;
 perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision,'payload',jsonb_set(d.draft,'{data,slug}',to_jsonb((d.draft->'data'->>'slug')||'-m4-test')))),jsonb_build_array(jsonb_build_object('from',red_old,'to',red_new)));
 if public.cms_read_redirect(red_old)<>red_new then raise exception 'Event redirect missing';end if;checks:=checks+1;
 begin perform public.cms_editorial_bundle('publish',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision+2,'payload',d.draft)),jsonb_build_array(jsonb_build_object('from',red_new,'to',red_old)));raise exception 'Redirect chain accepted';exception when invalid_parameter_value then checks:=checks+1;end;
 reset role;
 select * into d from public.cms_documents where module_id='footer';
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true);set local role authenticated;
 begin perform public.cms_mutate_content('unpublish',p_id=>d.id,p_revision=>d.revision);raise exception 'Singleton removed';exception when invalid_parameter_value then checks:=checks+1;end;
 reset role;
 select url into used_url from public.cms_media_assets where cms_private.media_usage(url)>0 limit 1;
 set local role authenticated;
 begin perform public.cms_media_mutate('begin_delete',p_id=>(select id from public.cms_media_assets where url=used_url));raise exception 'Used asset deleted';exception when object_not_in_prerequisite_state then checks:=checks+1;end;
 a:=public.cms_media_mutate('register',p_asset=>jsonb_build_object('url',source_url,'name','M4 TEST ASSET','kind','image','origin','external'));asset_id:=(a->>'id')::uuid;
 if (a->>'usage')::int<>0 then raise exception 'New asset unexpectedly used';end if;checks:=checks+1;
 result:=public.cms_media_mutate('register',p_asset=>jsonb_build_object('url',source_url,'name','M4 TEST ASSET','kind','image','origin','external'));
 if result->>'id'<>a->>'id' then raise exception 'Registry import not idempotent';end if;checks:=checks+1;
 perform public.cms_media_mutate('alt',p_id=>asset_id,p_asset=>'{"alt":"Descripción de prueba"}');
 if not exists(select 1 from jsonb_array_elements(public.cms_media_list()) e where e->>'id'=asset_id::text and e->>'alt'='Descripción de prueba') then raise exception 'Alt update missing';end if;checks:=checks+1;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',ed,'role','authenticated','session_id',es)::text,true);set local role authenticated;
 begin perform public.cms_media_mutate('begin_delete',p_id=>asset_id);raise exception 'Editor deleted resource';exception when insufficient_privilege then checks:=checks+1;end;
 reset role;
 perform set_config('request.jwt.claims',jsonb_build_object('sub',sa,'role','authenticated','session_id',ss)::text,true);set local role authenticated;
 perform public.cms_media_mutate('begin_delete',p_id=>asset_id);
 reset role;
 select * into d from public.cms_documents where module_id='footer';
 set local role authenticated;
 begin perform public.cms_editorial_bundle('save',jsonb_build_array(jsonb_build_object('id',d.id,'revision',d.revision,'payload',jsonb_set(d.draft,'{data,logo}',to_jsonb(source_url)))));raise exception 'Deleting asset referenced by draft';exception when object_not_in_prerequisite_state then checks:=checks+1;end;
 perform public.cms_media_mutate('cancel_delete',p_id=>asset_id);
 perform public.cms_media_mutate('begin_delete',p_id=>asset_id);
 perform public.cms_media_mutate('finish_delete',p_id=>asset_id);
 if exists(select 1 from public.cms_media_assets where id=asset_id) then raise exception 'Safe unregister failed';end if;checks:=checks+1;
 reset role;
 perform set_config('get.cms_m4_checks',checks::text,true);
end; $$;
select current_setting('get.cms_m4_checks')::int as checks_passed,'ROLLBACK — no real session or permanent test modifications' as mode;
rollback;
