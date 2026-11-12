import {validateEditorialPayload} from '../admin/editorial-model.mjs';
import {validateDraftPayload} from '../admin/content-document.mjs';
import {extendedKey} from './extended.mjs';

// Identity envelopes are generated only by the server. Changes to an existing record
// remain sparse patches; a newly created institution owns its first venue and brand
// in one draft, hence their first publication cannot be partially visible.
export const CREATED='_created';
export const epoch=rows=>rows.reduce((n,r)=>n+r.revision,0);
export const patchOnly=(value={})=>Object.fromEntries(Object.entries(value||{}).filter(([k])=>k!==CREATED));
export const seeds=value=>Array.isArray(value?.[CREATED])?value[CREATED]:[];
export const editorialSlug=s=>s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function expandedBase(base,rows,privateDrafts=false){
 const keys=new Set(base.map(e=>e.key)),out=[...base];
 for(const r of rows){
  const bundle=seeds(r.published).length?seeds(r.published):privateDrafts?seeds(r.draft):[];
  for(const e of bundle){
   if(keys.has(e.key))throw Error('Hay dos registros con la misma identidad. Revisá el catálogo.');
   keys.add(e.key);out.push(e);
  }
 }
 return out;
}
export function unpublishedKeys(rows){
 return new Set(rows.filter(r=>!seeds(r.published).length).flatMap(r=>seeds(r.draft).map(e=>e.key)));
}
export function publicSnapshot(key,value){
 if(value?.visible!==false)return value;
 const shared=seeds(value).filter(e=>e.key!==key);
 return shared.length?{visible:false,[CREATED]:shared}:{visible:false};
}
const slugOf=e=>e.payload.data.slug;
const kindOf=e=>e.payload._kind;
const dataOf=e=>e.payload.data;
function clean(v,label,{required=false,max=140}={}){
 if(v==null&&!required)return '';
 if(typeof v!=='string'||v.trim().length>max||(required&&!v.trim())||/[\u0000-\u001f<>]/.test(v))throw Error('Revisá '+label+'.');
 return v.trim();
}
function makeEntry(kind,data){
 const prefix={institution:'sede',brand:'marca',career:'carrera',offering:'oferta',event:'event'}[kind];
 const entry={key:kind==='event'?extendedKey('events',prefix+'/'+data.id):prefix+'/'+data.id,moduleId:kind==='event'?'events':['brand','institution'].includes(kind)?'institutions':'careers',visibility:'published',payload:{_kind:kind,data}};
 validateEditorialPayload(entry.payload);return entry;
}
function requiredRef(entries,kind,id){
 const e=entries.find(e=>kindOf(e)===kind&&dataOf(e).id===id&&dataOf(e).visible!==false&&e.visibility!=='hidden');
 if(!e)throw Error('Primero publicá o activá el registro que querés vincular.');return dataOf(e);
}
// A venue identity may move only while the initial creation is still a draft.
// Derive citySlug on the server from a real city; never accept it from a form.
export function changeCreationCity(bundle,key,cityId,published){
 const city=requiredRef(published,'city',cityId);
 const venue=bundle.find(e=>e.key===key&&kindOf(e)==='institution');
 if(!venue)throw Error('Solo una sede nueva puede cambiar de ciudad antes de publicarse.');
 const moved=structuredClone(venue);
 Object.assign(moved.payload.data,{cityId:city.id,citySlug:city.slug});
 return bundle.map(e=>e.key===key?moved:e);
}
function assertCanonical(slug){
 if(!slug||slug.length>100)throw Error('Elegí un nombre que permita generar una dirección web válida.');
 return slug;
}
export function validateCreation(bundle,reserved,published){
 const added=[];
 for(const entry of bundle){
  validateEditorialPayload(entry.payload);
  const data=dataOf(entry),kind=kindOf(entry),same=reserved.concat(added).filter(e=>kindOf(e)===kind);
  if(reserved.concat(added).some(e=>e.key===entry.key))throw Error('Ese registro ya existe.');
  if(kind==='event'&&same.some(e=>slugOf(e)===data.slug))throw Error('Ya existe un evento con esa dirección. Editá el existente.');
  if((kind==='brand'||kind==='career')&&same.some(e=>slugOf(e)===data.slug||editorialSlug(dataOf(e).name)===editorialSlug(data.name)))
   throw Error(kind==='brand'?'Esta institución ya existe. Agregá una sede a su marca.':'Ya existe una carrera con ese nombre. Seleccionala para crear su oferta.');
  if(kind==='brand'&&reserved.some(e=>kindOf(e)==='institution'&&slugOf(e)===data.slug&&dataOf(e).brandId!==data.id))throw Error('La dirección institucional ya está en uso.');
  if(kind==='institution'){
   requiredRef(published.concat(added),'brand',data.brandId);requiredRef(published,'city',data.cityId);
   if(['carreras','instituciones','capacitaciones'].includes(data.slug)||same.some(e=>slugOf(e)===data.slug&&(dataOf(e).cityId===data.cityId||dataOf(e).brandId!==data.brandId)))throw Error('Ya existe una sede con esa dirección pública.');
  }
  if(kind==='offering'){
   requiredRef(published,'institution',data.institutionId);requiredRef(published,'career',data.careerId);
   if(same.some(e=>dataOf(e).institutionId===data.institutionId&&dataOf(e).careerId===data.careerId))throw Error('Esta carrera ya tiene una oferta en esa sede. Editá la existente.');
  }
  added.push(entry);
 }
}
export function prepareCreation(raw,reserved,published){
 const input=validateDraftPayload(raw),kind=input.kind;
 const allowed={institution:['name','cityId','type','address'],venue:['brandId','campusName','cityId','type','address'],career:['name','description'],offering:['institutionId','careerId','degree','duration','modality'],event:['name','cityId','category']};
 if(!Object.hasOwn(allowed,kind)||Object.keys(input).some(k=>k!=='kind'&&!allowed[kind].includes(k)))throw Error('Datos de alta no válidos.');
 const entries=[],id=()=> 'cc-'+crypto.randomUUID(),required=(k,label)=>clean(input[k],label,{required:true});
 if(kind==='institution'||kind==='venue'){
  const city=requiredRef(published,'city',input.cityId),name=kind==='institution'?required('name','el nombre de la institución'):'';
  const brand=kind==='institution'?{id:id(),name,slug:assertCanonical(editorialSlug(name))}:requiredRef(published,'brand',input.brandId);
  if(kind==='institution')entries.push(makeEntry('brand',brand));
  const campusName=clean(input.campusName,'el nombre de sede'),address=clean(input.address,'la dirección',{max:300});
  const venue={id:id(),slug:brand.slug,brandId:brand.id,cityId:city.id,citySlug:city.slug,type:required('type','el tipo de institución'),gallery:[],visible:true};
  if(campusName)venue.campusName=campusName;if(address)venue.address=address;
  entries.push(makeEntry('institution',venue));
 }else if(kind==='career'){
  const name=required('name','el nombre de la carrera');
  entries.push(makeEntry('career',{id:id(),name,slug:assertCanonical(editorialSlug(name)),description:clean(input.description,'la descripción',{max:5000}),studyPlan:[],requirements:[],faq:[]}));
 }else if(kind==='event'){
  const city=requiredRef(published,'city',input.cityId),name=required('name','el nombre del evento');
  entries.push(makeEntry('event',{id:id(),name,slug:assertCanonical(editorialSlug(name)),city:city.name,category:required('category','el tipo de evento'),date:'',description:'',gallery:[],image:'',institutions:[],location:'',status:'Próximamente',visible:false}));
 }else{
  const inst=requiredRef(published,'institution',input.institutionId),master=requiredRef(published,'career',input.careerId);
  const d={id:id(),institutionId:inst.id,careerId:master.id,degree:required('degree','el título otorgado'),visible:true};
  for(const k of ['duration','modality'])if(input[k])d[k]=clean(input[k],k);entries.push(makeEntry('offering',d));
 }
 validateCreation(entries,reserved,published);
 return {key:entries.at(-1).key,draft:{[CREATED]:entries}};
}
// Before restoring a new item to its original nonexistence, refuse to orphan
// another venue/offer, including a pending draft that has not been published.
export function assertRemovable(bundle,entries,rows){
 const keys=new Set(bundle.map(e=>e.key)),ids=new Set(bundle.map(e=>dataOf(e).id));
 const offering=bundle.find(e=>kindOf(e)==='offering')?.payload.data;
 const refs=d=>d&&(
   ['brandId','institutionId','careerId','offeringId'].some(k=>ids.has(d[k]))||
   ['featuredInstitutionIds','institutionIds','featuredCareerIds'].some(k=>Array.isArray(d[k])&&d[k].some(id=>ids.has(id)))||
   [d.placements,d.controlPlacements].some(list=>list?.some(p=>ids.has(p.id)))||
   d.generalOffers?.some(p=>ids.has(p.careerId))||
   d.slides?.some(p=>ids.has(p.institutionId)||ids.has(p.careerId)||ids.has(p.offeringId)||
    (offering&&p.institutionId===offering.institutionId&&p.careerId===offering.careerId))
 );
 if(entries.some(e=>!keys.has(e.key)&&refs(dataOf(e)))||
   rows.some(r=>!keys.has(r.key)&&(refs(r.published)||refs(r.draft)))||
   rows.some(r=>keys.has(r.key)&&r.key!==bundle.at(-1).key&&(r.draft!==null||Object.keys(r.published||{}).length)))
   throw Error('Hay contenido vinculado a este registro. Podés ocultarlo sin quitar su identidad.');
}
