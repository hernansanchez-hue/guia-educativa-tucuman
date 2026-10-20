import {validateSeo} from './final-model.mjs';
import {events} from '../../app/data/events.js';
import {services} from '../../app/data/services.js';
import {serviceVisuals,defaultVisual} from '../../app/data/serviceVisuals.js';
import {eventsPageContent} from '../../app/data/eventsPageContent.js';
import {servicesPageContent} from '../../app/data/servicesPageContent.js';
import {aboutContent} from '../../app/data/aboutContent.js';
import {navigationContent,footerContent,orientationContent} from '../../app/data/publicSiteContent.js';
import {trainingPrograms} from '../../app/data/trainingPrograms.js';
import {trainingOfferings} from '../../app/data/trainingOfferings.js';
import {getLocalTrainingPageCatalog} from '../public-catalog/training-page-catalog.js';
import {isSafeContentLink,isValidSlug,validateDraftPayload} from './content-document.mjs';

export const EXTENDED_TYPES={eventos:{module:'events',kind:'event',label:'Eventos'},servicios:{module:'services',kind:'service',label:'Servicios'},capacitaciones:{module:'trainings',kind:'training-offering',label:'Capacitaciones'}};
export const EXTENDED_KINDS={'event':'events','events-page':'events','service':'services','services-page':'services','training':'trainings','training-offering':'trainings','about':'about','orientation':'orientation','navigation':'navigation','footer':'footer'};
export const EXTENDED_MODULES=[...new Set(Object.values(EXTENDED_KINDS))];
export const SINGLETON_KINDS=['events-page','services-page','about','orientation','navigation','footer'];
const entry=(moduleId,key,kind,data,seo)=>({moduleId,key,payload:{_kind:kind,data:structuredClone(data),...(seo?{seo}:{})}});
export function seedExtendedEntries(){return [
 ...events.map(e=>entry('events',`event/${e.id}`,'event',e)),entry('events','main','events-page',eventsPageContent),
 ...services.map((s,n)=>entry('services',`service/${s.slug}`,'service',{id:s.slug,...s,visual:serviceVisuals[s.slug]||defaultVisual,ordinal:n,order:n,visible:true})),entry('services','main','services-page',servicesPageContent),
 ...trainingPrograms.map(p=>entry('trainings',`training/${p.id}`,'training',p)),...trainingOfferings.map(o=>entry('trainings',`offer/${o.id}`,'training-offering',o)),
 entry('about','main','about',aboutContent,{title:'Nosotros',description:'Guía Educativa Tucumán nació para reunir en un solo lugar toda la oferta educativa de la provincia y acercar a cada persona a su próximo paso.'}),
 entry('orientation','main','orientation',orientationContent),entry('navigation','main','navigation',navigationContent),entry('footer','main','footer',footerContent),
 ];}
export function extendedCatalog(entries=[],{includeLegacy=true}={}){
 const map=new Map((includeLegacy?seedExtendedEntries():[]).map(e=>[`${e.moduleId}:${e.key}`,e]));
 for(const e of entries)if(EXTENDED_MODULES.includes(e.moduleId))map.set(`${e.moduleId}:${e.key}`,e);
 const rows=[...map.values()].filter(e=>e.visibility!=='hidden'&&e.payload&&(SINGLETON_KINDS.includes(e.payload._kind)||e.payload.data.visible!==false));
 const byKind=kind=>rows.filter(e=>e.payload._kind===kind).map(e=>({...structuredClone(e.payload.data),cmsSeo:e.payload.seo||{},cmsDesign:e.payload.design}));
 const single=kind=>byKind(kind)[0]||null;
 return {events:byKind('event'),eventsPage:single('events-page'),services:byKind('service').sort((a,b)=>a.order-b.order),servicesPage:single('services-page'),trainings:byKind('training'),trainingOfferings:byKind('training-offering'),about:single('about'),orientation:single('orientation'),navigation:single('navigation'),footer:single('footer'),entries:[...map.values()]};
}
export function extendedTrainingPage(catalog,ext,citySlug,institutionSlug,slug){
 const city=catalog.cities.find(c=>c.slug===citySlug),inst=catalog.institutions.find(i=>i.citySlug===citySlug&&i.slug===institutionSlug),program=ext.trainings.find(p=>p.slug===slug);
 const offering=ext.trainingOfferings.find(o=>o.institutionId===inst?.id&&o.trainingProgramId===program?.id&&o.publicationStatus!=='draft');if(!city||!inst||!program||!offering)return null;
 const originalOffering=trainingOfferings.find(o=>o.id===offering.id),original=getLocalTrainingPageCatalog(originalOffering?.citySlug,inst.slug,program.slug);
 const {cmsSeo:_s,cmsDesign:_d,...plainProgram}=program,{cmsSeo:_os,cmsDesign:_od,...plainOffering}=offering;
 return {city:{slug:city.slug,name:city.name},institution:original?{...original.institution,...inst}:inst,program:plainProgram,offering:{...plainOffering,citySlug:city.slug},cmsSeo:offering.cmsSeo};
}
export function extendedPageForEntry(catalog,e){
 const ext=extendedCatalog(catalog.entries,{includeLegacy:catalog.includeLegacy!==false}),k=e.payload._kind,d=e.payload.data;let props;
 if(k==='event')props={event:ext.events.find(x=>x.id===d.id),institutionNames:(d.institutions||[]).map(id=>catalog.institutions.find(i=>i.id===id)?.name).filter(Boolean)};
 if(k==='events-page')props={content:ext.eventsPage,events:ext.events};
 if(k==='service')props={service:ext.services.find(x=>x.id===d.id)};
 if(k==='services-page')props={content:ext.servicesPage,services:ext.services};
 if(k==='about')props={content:ext.about};
 if(['navigation','footer','orientation'].includes(k)){const city=catalog.cities[0];props=city?{citySlug:city.slug}:null;}
 if(k==='training-offering'){const inst=catalog.institutions.find(i=>i.id===d.institutionId),p=ext.trainings.find(p=>p.id===d.trainingProgramId);props=inst&&p?extendedTrainingPage(catalog,ext,inst.citySlug,inst.slug,p.slug):null;}
 return {kind:k,props:props&&Object.values(props).every(Boolean)?props:null,siteContent:{navigation:ext.navigation,footer:ext.footer,orientation:ext.orientation}};
}
export function extendedRouteMap(catalog){const ext=extendedCatalog(catalog.entries,{includeLegacy:catalog.includeLegacy!==false}),map=new Map();for(const e of ext.events)map.set(`event:${e.id}`,`/eventos/${e.slug}`);for(const s of ext.services)map.set(`service:${s.id}`,`/servicios/${s.slug}`);for(const o of ext.trainingOfferings){const i=catalog.institutions.find(i=>i.id===o.institutionId),p=ext.trainings.find(p=>p.id===o.trainingProgramId);if(i&&p)map.set(`training:${o.id}`,`/${i.citySlug}/${i.slug}/capacitaciones/${p.slug}`);}return map;}
export function extendedRelatedRoutes(catalog,entries){const ext=extendedCatalog(catalog.entries,{includeLegacy:catalog.includeLegacy!==false}),paths=new Set();for(const e of entries){const k=e.payload._kind,d=e.payload.data;
 if(k.startsWith('event')){paths.add('/eventos');if(d.slug)paths.add(`/eventos/${d.slug}`);}
 if(k.startsWith('service')){paths.add('/servicios');if(d.slug)paths.add(`/servicios/${d.slug}`);}
 if(k==='about')paths.add('/nosotros');
 if(k==='orientation')for(const c of catalog.cities)paths.add(`/${c.slug}`);
 if(k.startsWith('training'))for(const [id,path]of extendedRouteMap(catalog))if(id.startsWith('training:')&&(k==='training'||id===`training:${d.id}`)){paths.add(path);const o=ext.trainingOfferings.find(o=>`training:${o.id}`===id),i=catalog.institutions.find(i=>i.id===o?.institutionId);if(i)paths.add(`/${i.citySlug}/${i.slug}`);}
 if(['navigation','footer'].includes(k)){for(const c of catalog.cities)paths.add(`/${c.slug}`);for(const i of catalog.institutions)paths.add(`/${i.citySlug}/${i.slug}`);for(const p of ['/carreras','/instituciones','/ciudades','/nosotros','/servicios','/eventos','/contacto','/cursos-docentes'])paths.add(p);}
 }if(entries.some(e=>['event','service','training','training-offering'].includes(e.payload._kind)))paths.add('/sitemap.xml');return [...paths];}

const optional={event:{status:'string',visible:'boolean',time:'string',startDate:'string',endDate:'string',ctaLabel:'string',ctaHref:'string',content:'string',video:'string'},service:{image:'string',imageAlt:'string',ctaLabel:'string',ctaHref:'string',ctaTitle:'string',gallery:['string'],content:'string'},'training':{pdf:'string'},'training-offering':{whatsapp:'string',startDate:'string',endDate:'string',material:'string'}};
function mergeShape(a,b){if(a.type==='object'&&b.type==='object'){const properties={};for(const key of new Set([...Object.keys(a.properties),...Object.keys(b.properties)])){const x=a.properties[key],y=b.properties[key];properties[key]=x&&y?{...mergeShape(x,y),required:x.required&&y.required}:{...(x||y),required:false};}return {type:'object',properties};}if(a.type==='array'&&b.type==='array')return {type:'array',item:mergeShape(a.item,b.item)};return a;}
const shapeOf=v=>Array.isArray(v)?{type:'array',item:v.length?v.map(shapeOf).reduce(mergeShape):{type:'string'}}:v&&typeof v==='object'?{type:'object',properties:Object.fromEntries(Object.entries(v).map(([k,v])=>[k,{...shapeOf(v),required:true}]))}:{type:typeof v};
export function extendedSchemas(){const schemas={};for(const e of seedExtendedEntries()){const k=e.payload._kind,next=shapeOf(e.payload.data);if(!schemas[k])schemas[k]=next;else{for(const [field,s]of Object.entries(schemas[k].properties))if(!Object.hasOwn(next.properties,field))s.required=false;for(const [field,s]of Object.entries(next.properties))if(!schemas[k].properties[field])schemas[k].properties[field]={...s,required:false};}}
 for(const [k,fields]of Object.entries(optional))for(const [field,type]of Object.entries(fields))schemas[k].properties[field]={type:Array.isArray(type)?'array':type,...(Array.isArray(type)?{item:{type:type[0]}}:{}),required:false};
 for(const k of ['about'])for(const field of ['team','organizations'])schemas[k].properties[field].item.properties.visible={type:'boolean',required:false};
 return schemas;}
export function matchesShape(value,s){if(s.type==='array')return Array.isArray(value)&&value.length<=100&&value.every(v=>matchesShape(v,s.item));if(s.type==='object'){if(!value||Array.isArray(value)||typeof value!=='object')return false;return Object.keys(value).every(k=>s.properties[k]&&matchesShape(value[k],s.properties[k]))&&Object.entries(s.properties).every(([k,v])=>!v.required||Object.hasOwn(value,k));}return typeof value===s.type;}
export function validateExtendedPayload(input){const p=validateDraftPayload(input),d=p.data,k=p._kind,s=extendedSchemas()[k];if(!s||!matchesShape(d,s)||!d.id||!d.name?.trim()&&['event','service','training'].includes(k))throw new Error('Revisá los campos y los listados del contenido.');if(d.id.length>120)throw new Error('Identidad no válida.');if(['event','service','training'].includes(k)&&!isValidSlug(d.slug))throw new Error('Revisá la dirección de la página.');
 function resources(v,key=''){if(Array.isArray(v)){if(['gallery','coverageImages'].includes(key)&&v.some(url=>!isSafeContentLink(url)||/^\/admin(?:\/|$)|^\/docs\/legal/.test(url)))throw new Error('Revisá los recursos del listado.');return v.forEach(x=>resources(x,key));}if(v&&typeof v==='object')for(const [key,value]of Object.entries(v)){if(typeof value==='string'&&value&&/(?:href|image|photo|logo|video|pdf|material|heroImage|closingImage)$/i.test(key)&&(!isSafeContentLink(value)&&!/^#[a-zA-Z0-9-]+$/.test(value)||/^\/admin(?:\/|$)|^\/docs\/legal/.test(value)))throw new Error('Usá enlaces y recursos públicos seguros.');resources(value,key);}}
 resources(d);validateSeo(p.seo);if(p.seo){for(const key of ['title','description','ogTitle','ogDescription','image'])if(p.seo[key]!=null&&typeof p.seo[key]!=='string')throw new Error('Revisá los textos SEO.');if(p.seo.image&&!isSafeContentLink(p.seo.image))throw new Error('Imagen SEO no válida.');if(p.seo.noindex!=null&&typeof p.seo.noindex!=='boolean')throw new Error('Revisá indexación.');}
 if(p.design){if(Object.keys(p.design).some(k=>!['titleSize','color','align','overlay','height'].includes(k)))throw new Error('Diseño no soportado.');const x=p.design;if(x.titleSize!=null&&(!Number.isFinite(x.titleSize)||x.titleSize<32||x.titleSize>80))throw new Error('Título fuera de rango.');if(x.color&&!/^#[0-9a-f]{6}$/i.test(x.color))throw new Error('Color no válido.');if(x.align&&!['left','center'].includes(x.align))throw new Error('Alineación no válida.');if(x.overlay!=null&&(!Number.isFinite(x.overlay)||x.overlay<.4||x.overlay>.94))throw new Error('Overlay fuera de rango.');if(x.height!=null&&(!Number.isFinite(x.height)||x.height<300||x.height>820))throw new Error('Altura fuera de rango.');}
 if(d.visual&&!['social','gold','violet','sky'].includes(d.visual.tone))throw new Error('Variante gráfica no soportada.');if(k==='footer'&&!d.logo.trim())throw new Error('El footer y Admin deben conservar un logo.');if(k==='orientation'&&d.status!=='Próximamente')throw new Error('Inscripciones pendientes de revisión legal.');return p;}
export function trainingSummary(catalog,inst,summary,context='institution'){
 const ext=extendedCatalog(catalog.entries,{includeLegacy:catalog.includeLegacy!==false}),original=trainingPrograms.find(p=>p.id===summary.id);
 if(!original)return summary;
 const p=ext.trainings.find(p=>p.id===summary.id),o=ext.trainingOfferings.find(o=>o.institutionId===inst.id&&o.trainingProgramId===summary.id);
 if(!p||!o||o.publicationStatus!=='published')return null;
 const initial=trainingOfferings.find(v=>v.id===o.id),result={...summary};
 for(const key of ['name','description','slug'])if(p[key]!==original[key])result[key]=p[key];
 for(const key of ['image','duration','modality','nationalValidity','badge'])if(o[key]!==initial?.[key])result[key]=o[key];
 if(context!=='city'||Object.hasOwn(summary,'routePath'))result.routePath=`/${inst.citySlug}/${inst.slug}/capacitaciones/${p.slug}`;
 return result;
}
