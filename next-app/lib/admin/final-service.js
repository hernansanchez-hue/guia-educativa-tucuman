import 'server-only';
import {requireAdmin} from './auth';
import {SupabaseContentRepository} from './supabase-content-repository.mjs';
import {validateFinalPayload,localRoute,validateSeo,editorHref,diffValues} from './final-model.mjs';
import {validateEditorialPayload} from './editorial-model.mjs';
import {getPublicRoutePaths} from './published-editorial';
import {revalidatePath,updateTag} from 'next/cache';
import {manageAdminProfile} from './users';
import {createSupabaseServiceClient} from '../supabase/service';
import {validateEmail,isUuid} from './auth-contract.mjs';
export async function consoleOptions(){
 const {client}=await requireAdmin('seo');
 const {data,error}=await client.from('cms_documents').select('module_id,entity_key,draft').in('draft->>_kind',['city','institution','brand','career']).neq('state','archived');
 if(error)throw Error('No se pudieron cargar las opciones de búsqueda.');
 const {editorialCatalog}=await import('./editorial-model.mjs');
 const catalog=editorialCatalog(data.map(row=>({moduleId:row.module_id,key:row.entity_key,payload:row.draft})),{includeLegacy:false});
 return {cities:catalog.cities.map(({id,name})=>({id,name})),institutions:catalog.institutions.map(({id,name,cityId})=>({id,name,cityId})),careers:catalog.careers.map(({id,name})=>({id,name}))};
}
export async function consoleQuery(kind,filters={}){
 const {client}=await requireAdmin(kind==='users'?'users':kind==='seo'?'seo':'read');
 const safe={};for(const key of ['q','type','state','city','institution','career','user','entity','from','to'])if(typeof filters[key]==='string')safe[key]=filters[key].slice(0,120);
 safe.page=Math.max(1,Math.min(400,Number(filters.page)||1));
 if(kind==='seo'&&['missingTitles','missingDescriptions','missingImages'].includes(filters.issue)){
  const matched=[];
  for(let page=1;page<=400;page++){
   const {data,error}=await client.rpc('cms_console_query',{p_kind:kind,p_filters:{...safe,page}});
   if(error)throw Error('No se pudieron revisar las páginas.');
   for(const row of data){const d=row.draft?.data||{},meta=row.draft?.seo||{};if(filters.issue==='missingTitles'?!meta.title&&!d.name&&!d.degree:filters.issue==='missingDescriptions'?!meta.description&&!d.description:!meta.image&&!d.image&&!d.heroImage)matched.push(row);}
   if(data.length<25)break;
  }
  return matched.slice((safe.page-1)*25,safe.page*25);
 }
 const {data,error}=await client.rpc('cms_console_query',{p_kind:kind,p_filters:safe});
 if(error)throw Error('No se pudo cargar esta sección. Revisá los filtros e intentá nuevamente.');
 return data;
}
export async function loadGlobal(module){
 const {client,actor}=await requireAdmin(module);
 const found=await client.from('cms_documents').select('id').eq('module_id',module).eq('entity_key','main').single();
 if(found.error)throw Error('Configuración no disponible.');
 return {document:await new SupabaseContentRepository(client,actor).get(found.data.id),module};
}
export async function saveGlobal(module,payload,revision,publish=false){
 const {client}=await requireAdmin(module);
 const valid=validateFinalPayload(module,payload);
 const {error}=await client.rpc('cms_configuration_bundle',{p_module:module,p_payload:valid,p_revision:revision,p_publish:publish});
 if(error)throw Error(error.code==='40001'?'Otra persona modificó la configuración. Actualizá antes de guardar.':'No se pudo guardar la configuración.');
 if(publish){updateTag('cms:site-configuration');revalidatePath('/', 'layout');}
 return loadGlobal(module);
}
export async function loadVersionDiff(id,version){
 const {client,actor}=await requireAdmin('read');if(!isUuid(id)||!Number.isInteger(version)||version<1)throw Error('Versión no válida.');
 const doc=await new SupabaseContentRepository(client,actor).get(id);
 const row=doc.versions.find(v=>v.version===version),before=doc.versions.find(v=>v.version===version-1);
 if(!row)throw Error('Versión no disponible.');
 let compatible=true;try{if(['design','settings'].includes(doc.moduleId))validateFinalPayload(doc.moduleId,row.payload);else validateEditorialPayload(row.payload);}catch{compatible=false;}
 return {id,name:doc.draft.data?.name||doc.draft.data?.degree||doc.entityKey,revision:doc.revision,version,compatible,changes:diffValues(before?.payload||{},row.payload),publishedAt:row.publishedAt,payload:row.payload};
}
export async function restoreHistory(id,version,expectedRevision){
 const {client,actor}=await requireAdmin('restore'),repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id),row=doc.versions.find(v=>v.version===version);
 if(!row)throw Error('Versión no disponible.');
 if(['design','settings'].includes(doc.moduleId))validateFinalPayload(doc.moduleId,row.payload);else validateEditorialPayload(row.payload);
 const result=await repo.restore(id,{version,expectedRevision});revalidatePath('/admin/historial');return {href:editorHref(result.document),message:'Restaurado como borrador.'};
}
export async function listRedirects(page=1){
 const {client}=await requireAdmin('seo'),{data,error}=await client.from('cms_redirects').select('source,destination,status_code,origin,created_at').order('created_at',{ascending:false}).range((page-1)*25,page*25-1);
 if(error)throw Error('No se pudieron cargar las redirecciones.');return data;
}
export async function createRedirect({source,destination,status}){
 const {client}=await requireAdmin('publish');
 if(!localRoute(source)||!(localRoute(destination)||destination==='/')||source===destination||![301,302,307,308].includes(Number(status)))throw Error('Revisá las rutas y el tipo de redirección.');
 const routes=await getPublicRoutePaths();if(routes.includes(source))throw Error('La ruta de origen todavía pertenece a una página publicada.');
 if(!routes.includes(destination))throw Error('El destino debe ser una página pública existente.');
 const {error}=await client.rpc('cms_manual_redirect',{p_source:source,p_destination:destination,p_status:Number(status)});
 if(error)throw Error('No se pudo crear: el origen ya existe o generaría una cadena o un bucle.');
 for(const t of ['catalog','events','services','trainings'])updateTag('cms:'+t);revalidatePath(source);revalidatePath('/admin/seo/redirects');
 return {message:'Redirección creada.'};
}
export async function inviteUser({email,name,role}){
 const {client}=await requireAdmin('users');
 if(!validateEmail(email)||typeof name!=='string'||name.trim().length<1||name.length>120||!['ADMIN','EDITOR'].includes(role))throw Error('Revisá nombre, email y rol.');
 const service=createSupabaseServiceClient(),origin=new URL(process.env.GET_ADMIN_ORIGIN);
 if(origin.origin!==process.env.GET_ADMIN_ORIGIN)throw Error('Origen del administrador no válido.');
 const {data,error}=await service.auth.admin.inviteUserByEmail(email,{redirectTo:origin.origin+'/admin/callback',data:{display_name:name.trim()}});
 if(error||!data?.user?.id)throw Error('No se pudo enviar la invitación. Comprobá si ese email ya existe.');
 const assigned=await client.rpc('cms_invited_profile',{p_id:data.user.id,p_name:name.trim(),p_role:role});
 if(assigned.error)throw Error('El email fue enviado, pero el rol no se asignó. No tendrá acceso hasta que SUPERADMIN complete la asignación.');
 revalidatePath('/admin/usuarios');return {message:'Usuario invitado. Debe confirmar su email antes de ingresar.'};
}
export async function updateUser(input){await requireAdmin('users');await manageAdminProfile(input);revalidatePath('/admin/usuarios');return {message:'Usuario actualizado.'};}
export async function saveSeo(id,seo,revision,publish=false){
 const {client,actor}=await requireAdmin(publish?'publish':'seo'),repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id);
 validateSeo(seo);if(seo.canonical&&!(await getPublicRoutePaths()).includes(seo.canonical))throw Error('El canonical debe apuntar a una página pública existente.');
 const payload=validateEditorialPayload({...doc.draft,seo});
 if(doc.revision!==revision)throw Error('El contenido cambió. Actualizá antes de guardar.');
 // Reuse the editorial pipeline, including relationships, redirects, tags and snapshots.
 const {loadEditor,saveEditorBundle}=await import('./editor-service');
 const loaded=await loadEditor(id),parts=[{id,revision,payload},...(loaded.shared?[{id:loaded.shared.id,revision:loaded.shared.revision,payload:loaded.shared.draft}]:[])];
 await saveEditorBundle(id,parts,publish);return {message:publish?'Publicado.':'Borrador guardado.'};
}
