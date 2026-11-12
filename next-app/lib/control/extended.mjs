import {extendedFields} from '../admin/extended-fields.mjs';
import {validateExtendedPayload, extendedCatalog} from '../admin/extended-editorial.mjs';
import {validateExtendedPublication} from '../admin/editor-links.mjs';
import {isSafeContentLink, validateDraftPayload} from '../admin/content-document.mjs';
import {eventStartDate, isConfirmedEvent} from '../events/public-events.mjs';

export const controlExtendedKinds = ['event', 'events-page', 'service', 'services-page'];
export const isControlExtended = entry => controlExtendedKinds.includes(entry?.payload?._kind);
export const extendedKey = (moduleId, key) => 'extended/' + moduleId + '/' + key;
export const namespaceExtended = entries => entries.map(e => isControlExtended(e) && !e.key.startsWith('extended/'+e.moduleId+'/') ? {...e, key: extendedKey(e.moduleId,e.key)} : e);
// Public readers retain the legacy module/key identity, so local seed fallbacks
// cannot duplicate a document or resurrect a hidden service/event.
export const publicExtendedEntries = entries => entries.map(e => isControlExtended(e) && e.key.startsWith('extended/'+e.moduleId+'/') ? {...e,key:e.key.slice(('extended/'+e.moduleId+'/').length)} : e);
export const isExtendedRecord = record => record.key.startsWith('extended/events/') || record.key.startsWith('extended/services/');
export function extendedGroups(kind) {
  const groups = Object.fromEntries(Object.entries(extendedFields(kind)).filter(([group])=>!['Diseño','Avanzado','Historial'].includes(group)));
  if(kind==='service')groups.Contenido=[{path:'root.data.content',label:'Información adicional',type:'textarea'},...groups.Contenido];
  return groups;
}
export const extendedFieldNames = Object.fromEntries(controlExtendedKinds.map(kind=>[kind,Object.fromEntries(Object.values(extendedGroups(kind)).flat().map(field=>{
  const key=field.path.startsWith('root.seo.')?'seo':field.path.split('.')[2];
  return [key,key==='seo'?'SEO':field.label];
}))]));
const plain = value => value && typeof value==='object' && !Array.isArray(value);
export function validateExtendedPatch(entry,input,entries) {
  const patch=validateDraftPayload(input), kind=entry.payload._kind;
  if(!isControlExtended(entry)||Object.keys(patch).some(key=>!Object.hasOwn(extendedFieldNames[kind],key)))throw Error('El campo no pertenece a este editor.');
  const candidate=structuredClone(entry.payload);
  for(const [key,value]of Object.entries(patch)){
    if(key==='seo')candidate.seo={...candidate.seo,...value};
    else candidate.data[key]=value;
  }
  validateExtendedPayload(candidate);
  const d=candidate.data;
  if(['event','service'].includes(kind)&&!d.name.trim())throw Error('Completá el nombre.');
  // Apply the same safe local URL boundary as the catalog editor to nested resources.
  function resources(value,key=''){
    if(typeof value==='string' && value && /(?:href|image|photo|logo|video|pdf|material|heroImage|closingImage|gallery|coverageImages)$/i.test(key)){
      if(!isSafeContentLink(value)&&!/^#[a-zA-Z0-9-]+$/.test(value))throw Error('Usá enlaces públicos seguros.');
      try {const path=decodeURIComponent(new URL(value,'https://get.invalid').pathname);if(/^\/(?:admin|administrador|api|_next)(?:\/|$)/i.test(path)||/[\\\s]/.test(path))throw Error();}catch{throw Error('Usá enlaces públicos seguros.');}
    }
    if(Array.isArray(value))value.forEach(item=>resources(item,key));
    else if(plain(value))Object.entries(value).forEach(([name,item])=>resources(item,name));
  }
  resources(patch);
  if(kind==='event'){
    if(d.status&&!['Próximamente','Confirmado','Finalizado','Cancelado'].includes(d.status))throw Error('Elegí un estado editorial válido.');
    for(const key of ['startDate','endDate'])if(d[key]&&!eventStartDate({startDate:d[key]}))throw Error('Revisá las fechas del evento.');
    if(d.startDate&&d.endDate&&d.endDate<d.startDate)throw Error('La fecha de fin debe ser posterior al inicio.');
    if(Object.hasOwn(patch,'city')&&!entries.some(e=>e.payload._kind==='city'&&e.payload.data.name===d.city))throw Error('Elegí una ciudad registrada.');
    if(Object.hasOwn(patch,'institutions')&&(!Array.isArray(d.institutions)||new Set(d.institutions).size!==d.institutions.length||d.institutions.some(id=>!entries.some(e=>e.payload._kind==='institution'&&e.payload.data.id===id&&e.payload.data.visible!==false))))throw Error('Elegí instituciones registradas.');
  }
  return patch;
}
export function validateControlExtendedPublication(entry){
  if(!isControlExtended(entry))return;
  validateExtendedPublication(entry.payload);
  const d=entry.payload.data;
  if(entry.payload._kind==='event'&&d.visible!==false&&['Confirmado','Finalizado'].includes(d.status)&&!isConfirmedEvent(d))throw Error('Para confirmar un evento completá fecha real y lugar confirmado.');
  if(entry.payload._kind==='event'&&d.visible!==false&&d.ctaHref&&!isConfirmedEvent(d))throw Error('Un evento pendiente no puede habilitar inscripciones.');
}
export function extendedPreview(entries,entry){
  const visible=entries.map(e=>e.key===entry.key?{...entry,visibility:'published',payload:{...entry.payload,data:{...entry.payload.data,visible:true}}}:e);
  const ext=extendedCatalog(visible,{includeLegacy:false}),d=entry.payload.data,k=entry.payload._kind;
  if(k==='event')return {kind:k,props:{event:ext.events.find(e=>e.id===d.id),institutionNames:(d.institutions||[]).map(id=>entries.find(e=>e.payload._kind==='institution'&&e.payload.data.id===id)?.payload.data.campusName).filter(Boolean)}};
  if(k==='events-page')return {kind:k,props:{content:ext.eventsPage,events:ext.events}};
  if(k==='service')return {kind:k,props:{service:ext.services.find(e=>e.id===d.id)}};
  if(k==='services-page')return {kind:k,props:{content:ext.servicesPage,services:ext.services}};
  return null;
}
