import "server-only";
import { requireAdmin } from "./auth";
import { SupabaseContentRepository } from "./supabase-content-repository.mjs";
import { EDITOR_TYPES, editorialCatalog, validateEditorialPayload, relatedRoutes, pageForEntry, publicationRedirects } from "./editorial-model.mjs";
import { getPublishedEditorialEntries } from "./published-editorial";
import { revalidatePath, updateTag } from "next/cache";
import {getPublishedHomeEntry} from './published-home';
import {getHomeMapCatalog} from '../public-catalog/home-map-catalog';
import {EXTENDED_KINDS,EXTENDED_TYPES,extendedCatalog,seedExtendedEntries} from './extended-editorial.mjs';
import {validateExtendedPublication} from './editor-links.mjs';
import {getExtendedPublishedEntries} from './published-extended';
import {validateCitySlides} from './city-slider.mjs';

export async function loadEditor(id) {
 const {client,actor}=await requireAdmin("preview");const repo=new SupabaseContentRepository(client,actor);const root=await repo.get(id);
 const p=root.draft;let shared=null;
 const key=p._kind==='institution'?`marca/${p.data.brandId}`:p._kind==='offering'?`carrera/${p.data.careerId}`:p._kind==='training-offering'?`training/${p.data.trainingProgramId}`:null;
 if(key){const row=await client.from('cms_documents').select('id').eq('module_id',root.moduleId).eq('entity_key',key).maybeSingle();if(row.data)shared=await repo.get(row.data.id);}
 const entries=await getPublishedEditorialEntries({fresh:true});
 if(p._kind==='home')entries.push(await getPublishedHomeEntry({fresh:true}));
 const relatedModules=EXTENDED_KINDS[p._kind]?[root.moduleId,'navigation','footer','orientation']:['city','institution'].includes(p._kind)?['trainings','navigation','footer','orientation']:[];
 if(relatedModules.length)entries.push(...await getExtendedPublishedEntries([...new Set(relatedModules)],{fresh:true}));
 const relatedDocuments=root.draft._kind==='institution'?await client.from('cms_documents').select('id,draft').eq('module_id','careers').eq('draft->>_kind','offering').eq('draft->data->>institutionId',root.draft.data.id).neq('state','archived'):null;
 if(relatedDocuments?.error)throw Error('No se pudieron cargar las carreras de esta institución.');
 return {root,shared,entries,actor,relatedDocuments:relatedDocuments?.data||[],...(p._kind==='home'?{homeMapCatalog:await getHomeMapCatalog()}:{})};
}
export async function loadHomeEditor(){const {client}=await requireAdmin('preview');const result=await client.from('cms_documents').select('id').eq('module_id','home').eq('entity_key','main').single();if(result.error)throw new Error('No se pudo abrir el editor de Home. Revisá la importación CMS.');return loadEditor(result.data.id);}
export async function loadSingletonEditor(module){if(!['events','services','about','orientation','navigation','footer'].includes(module))throw new Error('Página no disponible.');const {client}=await requireAdmin('preview');const row=await client.from('cms_documents').select('id').eq('module_id',module).eq('entity_key','main').single();if(row.error)throw new Error('No se pudo abrir el editor. Revisá la importación CMS.');return loadEditor(row.data.id);}
export async function listEditorDocuments(type,{q='',state='',city='',institution='',featured='',modality='',page=1}={}) {
 const def=EDITOR_TYPES[type];if(!def)throw new Error('Sección no disponible.');const {client}=await requireAdmin();
 if(EXTENDED_TYPES[type]){let query=client.from('cms_documents').select('id,entity_key,draft,state,updated_at,published_version',{count:'exact'}).eq('module_id',def.module).eq('draft->>_kind',def.kind).order('updated_at',{ascending:false}).range((Math.max(1,Number(page)||1)-1)*25,(Math.max(1,Number(page)||1))*25-1);if(q&&type!=='capacitaciones')query=query.ilike('draft->data->>name',`%${q.replace(/[%_,]/g,'').slice(0,100)}%`);if(q&&type==='capacitaciones'){const found=await client.from('cms_documents').select('draft').eq('draft->>_kind','training').ilike('draft->data->>name',`%${q.replace(/[%_,]/g,'').slice(0,100)}%`);if(found.error)throw new Error('No se pudo buscar capacitaciones.');const ids=found.data.map(r=>r.draft.data.id);if(ids.length)query=query.in('draft->data->>trainingProgramId',ids);else return {data:[],count:0,catalog:editorialCatalog(await getPublishedEditorialEntries({fresh:true})),extended:extendedCatalog(await getExtendedPublishedEntries(undefined,{fresh:true}))};}if(state)query=query.eq('state',state);if(city&&type==='eventos')query=query.eq('draft->data->>city',city);const result=await query;if(result.error)throw new Error('No se pudo cargar el listado.');const entries=[...await getPublishedEditorialEntries({fresh:true}),...await getExtendedPublishedEntries(undefined,{fresh:true})];return {...result,catalog:editorialCatalog(entries),extended:extendedCatalog(entries)};}
 const offset=(Math.max(1,Number(page)||1)-1)*25;
 let query=client.from('cms_documents').select('id,entity_key,draft,state,updated_at,published_version',{count:'exact'}).eq('module_id',def.module).eq('draft->>_kind',def.kind).order('updated_at',{ascending:false}).range(offset,offset+24);
 if(q.trim()){
  const search=q.replace(/[^\p{L}\p{N} -]/gu,'').slice(0,100);
  if(type==='ciudades')query=query.ilike('draft->data->>name',`%${search}%`);
  else {const sharedKind=type==='instituciones'?'brand':'career',relation=type==='instituciones'?'brandId':'careerId';const found=await client.from('cms_documents').select('draft').eq('draft->>_kind',sharedKind).ilike('draft->data->>name',`%${search}%`);if(found.error)throw new Error('No se pudo buscar el contenido.');const ids=(found.data||[]).map(r=>r.draft.data.id);if(type==='instituciones'){if(!ids.length)return {data:[],count:0,catalog:editorialCatalog(await getPublishedEditorialEntries({fresh:true}))};query=query.in(`draft->data->>${relation}`,ids);}else query=query.or(`draft->data->>degree.ilike.%${search}%${ids.length?`,draft->data->>${relation}.in.(${ids.join(',')})`:''}`);}
 }
 if(state)query=query.eq('state',state);
 if(city&&type==='instituciones')query=query.eq('draft->data->>cityId',city);
 if(city&&type==='carreras'){const c=editorialCatalog(await getPublishedEditorialEntries({fresh:true}));const ids=c.institutions.filter(i=>i.cityId===city).map(i=>i.id);if(!ids.length)return {data:[],count:0,catalog:c};query=query.in('draft->data->>institutionId',ids);}
 if(featured==='yes'){
  const c=editorialCatalog(await getPublishedEditorialEntries({fresh:true})),candidates=await client.from('cms_documents').select('id,draft').eq('module_id',def.module).eq('draft->>_kind',def.kind);if(candidates.error)throw new Error('No se pudo aplicar el filtro.');
  const ids=candidates.data.filter(r=>{const d=r.draft.data;return d.featured!==false&&(d.featured===true||type==='carreras'||c.cities.some(city=>city.featuredInstitutionIds?.includes(d.id)));}).map(r=>r.id);
  if(!ids.length)return {data:[],count:0,catalog:c};query=query.in('id',ids);
 }
 if(institution&&type==='carreras')query=query.eq('draft->data->>institutionId',institution);
 if(modality&&type==='carreras')query=query.eq('draft->data->>modality',modality);
 const result=await query;if(result.error)throw new Error('No se pudo cargar el listado.');
 const shared=await client.from('cms_documents').select('module_id,entity_key,draft').in('draft->>_kind',['brand','career']).neq('state','archived');if(shared.error)throw new Error('No se pudo cargar el contenido relacionado.');
 return {...result,catalog:editorialCatalog([...(await getPublishedEditorialEntries({fresh:true})),...shared.data.map(r=>({moduleId:r.module_id,key:r.entity_key,payload:r.draft,visibility:'published'}))])};
}
function entry(doc,payload=doc.draft){return {moduleId:doc.moduleId,key:doc.entityKey,payload,visibility:'published'};}
export async function saveEditorBundle(id,payloads,publish=false) {
 const {client}=await requireAdmin(publish?'publish':'edit'); const loaded=await loadEditor(id);
 const docs=[loaded.root,...loaded.shared?[loaded.shared]:[]];
 if(!Array.isArray(payloads)||payloads.length!==docs.length)throw new Error('Revisá los cambios antes de guardar.');
 const parts=docs.map(doc=>{const p=payloads.find(p=>p.id===doc.id);if(!p||p.revision!==doc.revision)throw new Error('Otra persona modificó el contenido. Actualizá antes de guardar.');return {id:doc.id,revision:doc.revision,payload:validateEditorialPayload(p.payload)};});
 const before=editorialCatalog(loaded.entries),nextEntries=docs.map(doc=>entry(doc,parts.find(p=>p.id===doc.id).payload));
 const after=editorialCatalog([...loaded.entries,...nextEntries]);
 if(publish)for(const e of nextEntries){if(EXTENDED_KINDS[e.payload._kind])validateExtendedPublication(e.payload);const page=pageForEntry(after,e);if(['city','institution','offering','training-offering'].includes(e.payload._kind)&&e.payload.data.visible!==false&&!page.props)throw new Error('Publicá primero la ciudad o la institución relacionada.');if(e.payload._kind==='city'){validateCitySlides(e.payload.data.slides,{complete:true});if(e.payload.data.slides?.some(slide=>slide.active&&!page.props?.city.institutions.some(i=>i.id===slide.institutionId)))throw Error('Elegí instituciones publicadas de esta ciudad para las diapositivas visibles.');}}
 const redirects=publish?publicationRedirects(before,after):[];
 const response=await client.rpc('cms_editorial_bundle',{p_operation:publish?'publish':'save',p_parts:parts,p_redirects:redirects});
 if(response.error)throw new Error(response.error.code==='23505'?'Ya existe una página con esta dirección.':response.error.code==='40001'?'Otra persona modificó el contenido. Actualizá antes de guardar.':'No se pudo guardar el contenido. Revisá los campos y tus permisos.');
 if(publish){updateTag(loaded.root.draft._kind==='home'?'cms:home':EXTENDED_KINDS[loaded.root.draft._kind]?`cms:${loaded.root.moduleId}`:'cms:catalog');const routes=new Set([...relatedRoutes(before,docs.map(d=>entry(d))),...relatedRoutes(after,nextEntries)]);for(const path of routes)revalidatePath(path);}
 return { ...(await loadEditor(id)), message:publish?'Publicado correctamente.':'Cambios guardados como borrador.' };
}
export async function createEditorEntity(type,input) {
 const def=EDITOR_TYPES[type];if(!def)throw new Error('Sección no disponible.');const {client,actor}=await requireAdmin('edit');const repo=new SupabaseContentRepository(client,actor);
 const id=crypto.randomUUID();let data;
 if(type==='eventos'||type==='servicios'){const template=structuredClone(seedExtendedEntries().find(e=>e.payload._kind===def.kind).payload);Object.assign(template.data,{id,name:input.name,slug:input.slug,description:input.description||'',image:input.image||'',visible:true});if(type==='eventos'){template.data.city=input.city||'Concepción';template.data.gallery=[];}else{template.data.ordinal=15;template.data.order=15;}return repo.create({moduleId:def.module,entityKey:`${def.kind}/${id}`,payload:validateEditorialPayload({...template,seo:{title:input.seoTitle||'',description:input.seoDescription||''}})});}
 if(type==='ciudades')data={id,name:input.name,slug:input.slug,title:input.name,heroTitle:input.name,heroImage:input.image||'',heroDescription:input.description||'',institutionIds:[],featuredInstitutionIds:[],visible:true};
 if(type==='instituciones'){
  let brandId=input.brandId;
  if(!brandId){brandId=crypto.randomUUID();await repo.create({moduleId:'institutions',entityKey:`marca/${brandId}`,payload:validateEditorialPayload({_kind:'brand',data:{id:brandId,slug:input.slug,name:input.name,logo:'',description:input.description||'',slogan:input.description||''}})});}
  data={id,slug:input.slug,brandId,cityId:input.cityId,type:input.type||'Institución',plan:'Básico',image:input.image||'',address:'',whatsapp:'',gallery:[],cities:[],visible:true};
 } else if(type==='carreras'){
  let careerId=input.careerId;
  if(!careerId){careerId=crypto.randomUUID();await repo.create({moduleId:'careers',entityKey:`carrera/${careerId}`,payload:validateEditorialPayload({_kind:'career',data:{id:careerId,slug:input.slug,name:input.name,description:input.description||'',graduateProfile:'',workField:'',studyPlan:[],requirements:[],faq:[]}})});}
  data={id,institutionId:input.institutionId,careerId,degree:input.name||input.degree,modality:input.modality||'Presencial',duration:input.duration||'',image:input.image||'',badge:'',order:1,visible:true,formEnabled:true};
 }
 const key=type==='ciudades'?id:type==='instituciones'?`sede/${id}`:`oferta/${id}`;
 return repo.create({moduleId:def.module,entityKey:key,payload:validateEditorialPayload({_kind:def.kind,data,seo:{title:input.seoTitle||'',description:input.seoDescription||''}})});
}
export async function editorArchive(id) {
 const {client,actor}=await requireAdmin('archive');const repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id);
 const before=editorialCatalog([...await getPublishedEditorialEntries({fresh:true}),...(EXTENDED_KINDS[doc.draft._kind]?await getExtendedPublishedEntries(undefined,{fresh:true}):[])]);await repo.archive(id,{expectedRevision:doc.revision});updateTag(EXTENDED_KINDS[doc.draft._kind]?`cms:${doc.moduleId}`:'cms:catalog');for(const path of relatedRoutes(before,[entry(doc)]))revalidatePath(path);
}
export async function editorUnpublish(id){const {client,actor}=await requireAdmin('publish'),repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id),before=editorialCatalog([...await getPublishedEditorialEntries({fresh:true}),...(EXTENDED_KINDS[doc.draft._kind]?await getExtendedPublishedEntries(undefined,{fresh:true}):[])]);await repo.unpublish(id,{expectedRevision:doc.revision});updateTag(EXTENDED_KINDS[doc.draft._kind]?`cms:${doc.moduleId}`:'cms:catalog');for(const path of relatedRoutes(before,[entry(doc)]))revalidatePath(path);return loadEditor(id);}
export async function editorDuplicate(id){const {client,actor}=await requireAdmin('edit'),repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id),payload=structuredClone(doc.draft),newId=crypto.randomUUID();if(!['city','institution','offering','event','service','training-offering'].includes(payload._kind))throw new Error('Este contenido no se puede duplicar desde este editor.');payload.data.id=newId;payload.data.visible=false;if(payload.data.slug)payload.data.slug=`${payload.data.slug}-copia-${newId.slice(0,8)}`;if(payload._kind==='city')payload.data.name+= ' (copia)';if(['event','service'].includes(payload._kind))payload.data.name+=' (copia)';if(payload._kind==='service')payload.data.ordinal=15;const prefix=payload._kind==='city'?'':payload._kind==='institution'?'sede/':payload._kind==='event'?'event/':payload._kind==='service'?'service/':payload._kind==='training-offering'?'offer/':'oferta/';return repo.create({moduleId:doc.moduleId,entityKey:prefix+newId,payload:validateEditorialPayload(payload)});}
