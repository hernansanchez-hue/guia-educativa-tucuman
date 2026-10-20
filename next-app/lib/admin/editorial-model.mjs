import { cityPages, institutions, getCityPage } from "../../app/data/institutions.js";
import { careers } from "../../app/data/careers.js";
import { offerings } from "../../app/data/offerings.js";
import {trainingOfferings} from '../../app/data/trainingOfferings.js';
import {trainingPrograms} from '../../app/data/trainingPrograms.js';
import { getLocalInstitutionOfferingsCatalog } from "../public-catalog/institution-offerings-catalog.js";
import {getLocalTrainingPageCatalog} from '../public-catalog/training-page-catalog.js';
import {validateSeo} from './final-model.mjs';
import { validateDraftPayload, isValidSlug, isSafeContentLink } from "./content-document.mjs";
import {validateCitySlides} from './city-slider.mjs';
import {isPremiumInstitution} from '../catalog/commercial-policy.mjs';
import {homeContentFromEntries,validateHomePayload} from './home-editorial.mjs';
import {trainingSummary,EXTENDED_TYPES,EXTENDED_KINDS,extendedPageForEntry,extendedRelatedRoutes,extendedRouteMap,validateExtendedPayload} from './extended-editorial.mjs';

export const EDITOR_TYPES = { ciudades: { module: "cities", kind: "city", label: "Ciudades" }, instituciones: { module: "institutions", kind: "institution", label: "Instituciones" }, carreras: { module: "careers", kind: "offering", label: "Carreras" },...EXTENDED_TYPES };
const sharedFields = ["name", "logo", "slogan", "description", "logoUrl"];
export function seedEditorialEntries() {
  const brands = new Map();
  const rows = Object.values(cityPages).map(c => ({ moduleId: "cities", key: c.slug, payload: { _kind: "city", data: { ...c, id: c.slug } } }));
  for (const inst of institutions) {
    if (!brands.has(inst.slug)) brands.set(inst.slug, Object.fromEntries([...["id", "slug"].map(k => [k, inst.slug]), ...sharedFields.filter(k => inst[k] !== undefined).map(k => [k, inst[k]])]));
    const brand = brands.get(inst.slug); const data = structuredClone(inst);
    const overrides = Object.fromEntries(sharedFields.filter(k => data[k] !== brand[k]).map(k => [k, data[k]]));
    sharedFields.forEach(k => delete data[k]); delete data.careers;
    data.brandId = inst.slug; data.cityId = inst.citySlug;
    if (Object.keys(overrides).length) data.brandOverrides = overrides;
    rows.push({ moduleId: "institutions", key: `sede/${inst.id}`, payload: { _kind: "institution", data } });
  }
  for (const brand of brands.values()) rows.push({ moduleId: "institutions", key: `marca/${brand.id}`, payload: { _kind: "brand", data: brand } });
  for (const career of careers) rows.push({ moduleId: "careers", key: `carrera/${career.id}`, payload: { _kind: "career", data: structuredClone(career) } });
  for (const offering of offerings) rows.push({ moduleId: "careers", key: `oferta/${offering.id}`, payload: { _kind: "offering", data: structuredClone(offering) } });
  return rows;
}
export function editorialCatalog(entries = [],{includeLegacy=true}={}) {
  const initial=seedEditorialEntries();
  const originalBrands=new Map(initial.filter(e=>e.payload._kind==='brand').map(e=>[e.payload.data.id,e.payload.data]));
  const merged = new Map((includeLegacy?initial:[]).map(r => [`${r.moduleId}:${r.key}`, r]));
  for (const row of entries) merged.set(`${row.moduleId}:${row.key}`, row);
  const visible = [...merged.values()].filter(r => r.visibility !== "hidden" && r.payload);
  const byKind = kind => visible.filter(r => r.payload._kind === kind).map(r => ({ ...structuredClone(r.payload.data), ...(r.payload.seo ? {cmsSeo:r.payload.seo}:{}), ...(r.payload.design ? {cmsDesign:r.payload.design}:{}) }));
  const cityRows = byKind("city"); const brandRows = byKind("brand"); const masterRows = byKind("career");
  const instRows = byKind("institution").flatMap(i => {
    const city = cityRows.find(c => c.id === (i.cityId || i.citySlug)); const brand = brandRows.find(b => b.id === i.brandId);
    const originalBrand=i.presentation?.brand||(includeLegacy?originalBrands.get(i.brandId):null);
    const preservedOverrides=Object.fromEntries(Object.entries(i.brandOverrides||{}).filter(([key])=>brand&&brand[key]===originalBrand?.[key]));
    return city && city.visible !== false && brand ? [{ ...i, ...Object.fromEntries(sharedFields.filter(k => brand[k] !== undefined).map(k => [k, brand[k]])), ...preservedOverrides, ...(i.campusName?{name:i.campusName}:{}), citySlug: city.slug }] : [];
  });
  const offerRows = byKind("offering").flatMap(o => {
    const inst = instRows.find(i => i.id === o.institutionId); const master = masterRows.find(c => c.id === o.careerId);
    return inst && inst.visible !== false && master && o.visible !== false ? [{ ...o, citySlug: inst.citySlug }] : [];
  });
  return { cities: cityRows.filter(c => c.visible !== false), brands: brandRows, institutions: instRows.filter(i => i.visible !== false), careers: masterRows, offerings: offerRows, entries: [...merged.values()],includeLegacy };
}
function summaryFor(catalog, inst, o, original) {
  const master = catalog.careers.find(c => c.id === o.careerId);
  const originalMaster=inst.presentation?.careers?.[o.careerId]||(catalog.includeLegacy?careers.find(c=>c.id===o.careerId):null);const originalOffering=inst.presentation?.offerings?.[o.id]||(catalog.includeLegacy?offerings.find(v=>v.id===o.id):null);
  const summary = original ? structuredClone(original) : { id: master.id, slug: master.slug, name: master.name, description: master.description, image: o.image, badge: o.badge, duration: o.duration, modality: o.modality };
  for (const k of ["name", "description"]) if (!original || master[k] !== originalMaster?.[k]) summary[k] = master[k];
  for (const k of ["image", "badge", "duration", "modality", "nationalValidity", "video", "startLabel", "isNew", "featured", "premium"]) if ((!original && o[k]!==undefined) || JSON.stringify(o[k]) !== JSON.stringify(originalOffering?.[k])) summary[k] = o[k];
  return { ...summary, routePath: `/${inst.citySlug}/${inst.slug}/carreras/${master.slug}` };
}
export function composeInstitution(catalog, id, context = "institution") {
  const inst = catalog.institutions.find(i => i.id === id); if (!inst) return null;
  const original = catalog.includeLegacy?institutions.find(i => i.id === id):null;
  const originals=inst.presentation?(context==="city"?inst.presentation.cityCareers:inst.presentation.institutionCareers):(catalog.includeLegacy?(context==="city"?original?.careers:getLocalInstitutionOfferingsCatalog(inst.citySlug, original?.slug||inst.slug)):[]);
  const institutionCareers = (originals || []).flatMap(s => {
    const careerId = s.id === "licenciatura-en-administracion" ? "lic-en-administracion" : s.id;
    const offering = catalog.offerings.find(o => o.institutionId === id && o.careerId === careerId);
    if (!offering) {if(careers.some(c=>c.id===careerId))return [];const training=trainingSummary(catalog,inst,structuredClone(s),context);return training?[training]:[];}
    const result = summaryFor(catalog, inst, offering, s);
    if (context === "city" && !Object.hasOwn(s, "routePath")) delete result.routePath;
    return [result];
  });
  for (const o of catalog.offerings.filter(o => o.institutionId === id)) if (!institutionCareers.some(s => (s.id === "licenciatura-en-administracion" ? "lic-en-administracion" : s.id) === o.careerId)) institutionCareers.push(summaryFor(catalog, inst, o));
  const {presentation:_presentation,...publicInstitution}=inst;
  return { ...publicInstitution, careers: institutionCareers.map(c => ({...c, ...(inst.featuredCareerIds ? {featured:inst.featuredCareerIds.includes(c.id === 'licenciatura-en-administracion' ? 'lic-en-administracion' : c.id)}:{})})) };
}
export function cityPageFromCatalog(catalog, slug) {
  const c = catalog.cities.find(c => c.slug === slug); if (!c) return null;
  const current = catalog.institutions.filter(i => i.citySlug === slug);
  const order = c.institutionIds || []; current.sort((a,b) => (order.indexOf(a.id)<0 ? 999 : order.indexOf(a.id)) - (order.indexOf(b.id)<0 ? 999 : order.indexOf(b.id)));
  const rows = current.map(i => composeInstitution(catalog, i.id, "city"));
  return { ...c, institutions: rows, featuredInstitutions: rows.filter(i => isPremiumInstitution(i,c)&&((c.featuredInstitutionIds || []).includes(i.id)||i.featured===true)) };
}
export function institutionPageFromCatalog(catalog, citySlug, slug) {
  const city = catalog.cities.find(c => c.slug === citySlug); const inst = catalog.institutions.find(i => i.citySlug === citySlug && i.slug === slug);
  return city && inst ? { city: { slug: city.slug, name: city.name }, institution: composeInstitution(catalog, inst.id) } : null;
}
export function careerPageFromCatalog(catalog, citySlug, slug, careerSlug) {
  const page = institutionPageFromCatalog(catalog, citySlug, slug); if (!page) return null;
  const career = catalog.careers.find(c => c.slug === (careerSlug === "licenciatura-en-administracion" ? "lic-en-administracion" : careerSlug));
  const offering = catalog.offerings.find(o => o.institutionId === page.institution.id && o.careerId === career?.id);
  return career && offering ? { ...page, career, offering } : null;
}
export function trainingPageFromCatalog(catalog,citySlug,slug,programSlug){
 const city=catalog.cities.find(c=>c.slug===citySlug),inst=catalog.institutions.find(i=>i.citySlug===citySlug&&i.slug===slug),legacy=institutions.find(i=>i.id===inst?.id);if(!city||!inst||!legacy)return null;
 const original=getLocalTrainingPageCatalog(legacy.citySlug,legacy.slug,programSlug);return original?{...original,city:{slug:city.slug,name:city.name},institution:{...original.institution,...inst},offering:{...original.offering,citySlug:city.slug}}:null;
}
export function pageForEntry(catalog, entry) {
  const { _kind, data } = entry.payload;
  if (_kind === 'home') return {kind:'home',props:{content:homeContentFromEntries(catalog.entries)}};
  if(EXTENDED_KINDS[_kind])return extendedPageForEntry(catalog,entry);
  if (_kind === "city") { const city=cityPageFromCatalog(catalog,data.slug); return { kind:"city",props:city?{city}:null }; }
  if (_kind === "institution") { const i=catalog.institutions.find(i=>i.id===data.id); return { kind: "institution", props: i ? institutionPageFromCatalog(catalog,i.citySlug,i.slug):null }; }
  const o=catalog.offerings.find(o=>o.id===data.id), i=catalog.institutions.find(i=>i.id===o?.institutionId), c=catalog.careers.find(c=>c.id===o?.careerId);
  return { kind: "career", props: i && c ? careerPageFromCatalog(catalog,i.citySlug,i.slug,c.slug):null };
}
export function relatedRoutes(catalog, entries) {
  if(entries.length && entries.every(e=>e.payload._kind==='home'))return ['/'];
  if(entries.length && entries.every(e=>EXTENDED_KINDS[e.payload._kind]))return extendedRelatedRoutes(catalog,entries);
  const paths = new Set(["/sitemap.xml"]);
  for (const e of entries) {
    const d=e.payload.data, k=e.payload._kind;
    const matches = catalog.institutions.filter(i => k === "city" ? i.cityId===d.id : k === "brand" ? i.brandId===d.id : k === "institution" ? i.id===d.id : k === "offering" ? i.id===d.institutionId : catalog.offerings.some(o=>o.institutionId===i.id&&o.careerId===d.id));
    if(k==="city") paths.add(`/${d.slug}`);
    for(const i of matches) { paths.add(`/${i.citySlug}`); paths.add(`/${i.citySlug}/${i.slug}`); paths.add(`/instituciones/${i.slug}`);
      for(const o of catalog.offerings.filter(o=>o.institutionId===i.id)){const c=catalog.careers.find(c=>c.id===o.careerId); if(c){paths.add(`/${i.citySlug}/${i.slug}/carreras/${c.slug}`); paths.add(`/carreras/${c.slug}`);}}
      for(const o of trainingOfferings.filter(o=>o.institutionId===i.id)){const p=trainingPrograms.find(p=>p.id===o.trainingProgramId);if(p)paths.add(`/${i.citySlug}/${i.slug}/capacitaciones/${p.slug}`);}
    }
    if(k!=="city"){paths.add("/instituciones");paths.add("/carreras");}
  }
  return [...paths];
}
export function catalogRouteMap(catalog){
 const map=new Map();
 for(const c of catalog.cities)map.set(`city:${c.id}`,`/${c.slug}`);
 for(const i of catalog.institutions){map.set(`institution:${i.id}`,`/${i.citySlug}/${i.slug}`);map.set(`institution-seo:${i.id}`,`/instituciones/${i.slug}`);}
 for(const o of catalog.offerings){const i=catalog.institutions.find(i=>i.id===o.institutionId),c=catalog.careers.find(c=>c.id===o.careerId);if(i&&c){map.set(`offering:${o.id}`,`/${i.citySlug}/${i.slug}/carreras/${c.slug}`);map.set(`career-seo:${o.id}`,`/carreras/${c.slug}`);}}
 for(const o of trainingOfferings){const i=catalog.institutions.find(i=>i.id===o.institutionId),p=trainingPrograms.find(p=>p.id===o.trainingProgramId);if(i&&p)map.set(`training:${o.id}`,`/${i.citySlug}/${i.slug}/capacitaciones/${p.slug}`);}
 for(const [key,path]of extendedRouteMap(catalog))map.set(key,path);
 return map;
}
export function publicationRedirects(before,after){const previous=catalogRouteMap(before),next=catalogRouteMap(after),paths=new Set(next.values()),redirects=new Map();for(const [key,from]of previous){const to=next.get(key);if(to&&to!==from&&!paths.has(from))redirects.set(from,to);}return [...redirects].map(([from,to])=>({from,to}));}
export function validateEditorialPayload(payload) {
  if(EXTENDED_KINDS[payload?._kind])return validateExtendedPayload(payload);
  if(payload?._kind==='home')return validateHomePayload(payload);
  const p=validateDraftPayload(payload);validateSeo(p.seo); const d=p.data;
  if(!["city","brand","institution","career","offering"].includes(p._kind)||!d||typeof d.id!=="string"||!d.id||d.id.length>120) throw new Error("Identidad editorial no válida.");
  if(p._kind!=="offering"&&(!isValidSlug(d.slug)||(p._kind!=="institution"&&(typeof d.name!=="string"||!d.name.trim())))) throw new Error("Ingresá un nombre y una dirección válida.");
  if(p._kind==="institution"&&(!d.cityId||!d.brandId)) throw new Error("Seleccioná la ciudad y la institución.");
  if(p._kind==="offering"&&(!d.institutionId||!d.careerId||!d.degree?.trim())) throw new Error("Seleccioná una institución, una carrera y su título.");
  for(const key of ["image","heroImage","logoUrl","video","website","studyPlanPdf","mapsUrl"]) if(d[key]&&!isSafeContentLink(d[key])) throw new Error("Usá una dirección web segura para el recurso.");
  for(const key of ['gallery','institutionIds','featuredInstitutionIds','featuredCareerIds','requirements','studyPlan','faq']) if(d[key]!==undefined&&(!Array.isArray(d[key])||d[key].length>200))throw new Error('Revisá el formato del listado.');
  for(const key of ['name','title','slug','phone','address','description','slogan','heroTitle','heroDescription','degree','duration','modality','workField','graduateProfile','shifts'])if(d[key]!=null&&typeof d[key]!=='string')throw new Error('Revisá los campos de texto.');
  if(p._kind==='city'&&['admin','api','media','carreras','instituciones','ciudades','servicios','eventos','nosotros','contacto','cursos-docentes'].includes(d.slug))throw new Error('Esta dirección está reservada por el sitio.');
  if(p._kind==='city'){
   validateCitySlides(d.slides);
   for(const key of ['orientationVisible','expoVisible','commercialVisible'])if(d[key]!=null&&typeof d[key]!=='boolean')throw Error('Revisá la visibilidad de las secciones.');
   for(const key of ['orientationImage','expoImage','commercialHref'])if(d[key]&&!isSafeContentLink(d[key]))throw Error('Revisá los enlaces de la ciudad.');
   for(const key of ['orientationCtaLabel','expoCtaLabel','commercialCtaLabel','commercialDescription','featuredInstitutionsTitle','allInstitutionsTitle'])if(d[key]!=null&&typeof d[key]!=='string')throw Error('Revisá los textos de las secciones.');
  }
  if(p._kind==='institution'&&(!Array.isArray(d.gallery)||typeof d.type!=='string'))throw new Error('Revisá la galería y el tipo de institución.');
  if(p._kind==='career'&&['studyPlan','requirements','faq'].some(key=>!Array.isArray(d[key])))throw new Error('Completá el plan, los requisitos y las preguntas frecuentes.');
  for(const key of ['visible','featured','isNew','formEnabled']) if(d[key]!=null&&typeof d[key]!=='boolean')throw new Error('Revisá las opciones de visibilidad.');
  if(d.studyPlan?.some(y=>typeof y!=='string'&&(!y||typeof y.label!=='string'||!Array.isArray(y.subjects)||y.subjects.some(s=>typeof s!=='string'))))throw new Error('Revisá los años y materias del plan.');
  if(d.faq?.some(q=>!q||typeof q.question!=='string'||typeof q.answer!=='string'))throw new Error('Revisá las preguntas frecuentes.');
  if(d.requirements?.some(r=>typeof r!=='string'))throw new Error('Revisá los requisitos.');
  for(const key of ['cityId','brandId','institutionId','careerId']) if(d[key]!=null&&(typeof d[key]!=='string'||!d[key]||d[key].length>120))throw new Error('Revisá la relación seleccionada.');
  if(d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) throw new Error("Revisá el email de contacto.");
  for(const url of d.gallery||[]) if(!isSafeContentLink(url)) throw new Error("Revisá las imágenes de la galería.");
  if(p.design){const x=p.design;if(Object.keys(x).some(k=>!['titleSize','color','align'].includes(k)))throw new Error('Diseño no soportado.');if(x.titleSize!=null&&(!Number.isFinite(x.titleSize)||x.titleSize<32||x.titleSize>80))throw new Error("El título admite de 32 a 80 px.");if(x.color&&!/^#[0-9a-f]{6}$/i.test(x.color))throw new Error("Color no válido.");if(x.align&&!['left','center'].includes(x.align))throw new Error("Alineación no válida.");}
  if(p.seo?.image&&!isSafeContentLink(p.seo.image)) throw new Error("Imagen SEO no válida.");
  return p;
}
export const legacyCity = getCityPage;
