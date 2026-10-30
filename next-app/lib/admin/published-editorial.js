import "server-only";
import {institutionDesignPage} from "../catalog/institution-design.mjs";
import { resolveSupabaseConfiguration } from "./environment.mjs";
import { editorialCatalog, cityPageFromCatalog, institutionPageFromCatalog, careerPageFromCatalog,trainingPageFromCatalog } from "./editorial-model.mjs";
import { createPublicMetadata } from "../seo/public-metadata";
import {indexablePublicPaths} from './seo-projection.mjs';
import {getPublishedHomeEntry} from './published-home';
import {notFound,permanentRedirect,redirect} from 'next/navigation';
import {createPublicRoutePaths} from '../public-catalog/public-routes-catalog';
import {getExtendedPublishedEntries,getExtendedCatalog} from './published-extended';
import {extendedTrainingPage} from './extended-editorial.mjs';
import {getVersionedPublicCatalogEntries} from '../catalog/versioned-public-catalog.mjs';
import {directoryCareers,directoryInstitutions} from '../catalog/directory-projections.mjs';

export async function getPublishedEditorialEntries() {
  return getVersionedPublicCatalogEntries();
}
function publishedCatalog(entries){return editorialCatalog(entries,{includeLegacy:false});}
export async function getPublishedCatalog(options) { return publishedCatalog(await getPublishedEditorialEntries(options)); }
export async function getCitiesCatalog(){const catalog=await getPublishedCatalog();return catalog.cities.map(c=>({id:c.id,slug:c.slug,name:c.name,title:c.title,image:c.image,institutionCount:catalog.institutions.filter(i=>i.citySlug===c.slug).length,careerCount:catalog.offerings.filter(o=>o.citySlug===c.slug).length}));}
export async function getIndexablePublicRoutePaths(){const [paths,catalog,extended,home]=await Promise.all([getPublicRoutePaths(),getPublishedCatalog(),getExtendedCatalog(['events','services','trainings','about']),getPublishedHomeEntry()]);return indexablePublicPaths(paths,catalog,extended,home.payload.seo);}
export async function getPublicRoutePaths(){const [c,ext]=await Promise.all([getPublishedCatalog(),getExtendedCatalog(['events','services','trainings'])]);return [...new Set([...createPublicRoutePaths({cities:c.cities,institutions:c.institutions.map(i=>({...i,city_id:i.cityId})),careers:c.careers,academicOfferings:c.offerings.map(o=>({...o,institution_id:o.institutionId,career_master_id:o.careerId})),trainingPrograms:ext.trainings,trainingOfferings:ext.trainingOfferings.map(o=>({...o,institution_id:o.institutionId,training_program_id:o.trainingProgramId}))}),'/eventos','/servicios',...ext.events.map(e=>`/eventos/${e.slug}`),...ext.services.map(s=>`/servicios/${s.slug}`),...directoryCareers(c).map(master=>`/carreras/${master.slug}`)])];}
export async function getCityPageCatalog(slug) {const [entries,ext]=await Promise.all([getPublishedEditorialEntries(),getExtendedPublishedEntries(['trainings'])]);return cityPageFromCatalog(publishedCatalog([...entries,...ext]),slug);}
export async function getInstitutionPageCatalog(city,inst) {const [entries,ext]=await Promise.all([getPublishedEditorialEntries(),getExtendedPublishedEntries(['trainings'])]);const catalog=publishedCatalog([...entries,...ext]);return institutionDesignPage(catalog,institutionPageFromCatalog(catalog,city,inst));}
export async function getCareerPageCatalog(city,inst,career) { const catalog=await getPublishedCatalog();return institutionDesignPage(catalog,careerPageFromCatalog(catalog,city,inst,career)); }
export async function getTrainingPageCatalog(city,inst,program){const [catalog,ext]=await Promise.all([getPublishedCatalog(),getExtendedCatalog(['trainings'])]);return extendedTrainingPage(catalog,ext,city,inst,program);}
export async function getCareersCatalog() { return directoryCareers(await getPublishedCatalog()); }
export async function getCareerCatalog(slug) { return (await getCareersCatalog()).find(c=>c.slug===slug)||null; }
export async function getInstitutionsCatalog() { return directoryInstitutions(await getPublishedCatalog()); }
export async function getInstitutionCatalog(slug) {return (await getInstitutionsCatalog()).find(i=>i.slug===slug)||null;}
export function editorialMetadata(input, entity) {
  const s=entity?.cmsSeo||{};
  const result=createPublicMetadata({...input,title:s.title||input.title,description:s.description||input.description,image:s.image||input.image});
  if(s.canonical)result.alternates.canonical=s.canonical;
  if(s.ogTitle)result.openGraph.title=s.ogTitle;
  if(s.ogDescription)result.openGraph.description=s.ogDescription;
  if(s.noindex===true)result.robots={index:false,follow:true};
  return result;
}
export async function getEditorialRedirect(path) {
 const {url,key}=resolveSupabaseConfiguration(process.env);if(!url||!key)return null;
 const response=await fetch(`${url}/rest/v1/rpc/cms_read_redirect`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify({p_source:path}),next:{revalidate:60,tags:["cms:catalog","cms:events","cms:services","cms:trainings"]}});
 return response.ok ? response.json():null;
}
export async function resolveEditorialMissing(path){const {url,key}=resolveSupabaseConfiguration(process.env);if(url&&key){const r=await fetch(url+'/rest/v1/rpc/cms_redirect_record',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_source:path}),next:{revalidate:60,tags:['cms:catalog','cms:events','cms:services','cms:trainings']}});if(r.ok){const record=await r.json();if(record&&typeof record.destination==='string'&&!record.destination.startsWith('/admin')){if([301,308].includes(record.status))permanentRedirect(record.destination);else redirect(record.destination);}}}notFound();}
