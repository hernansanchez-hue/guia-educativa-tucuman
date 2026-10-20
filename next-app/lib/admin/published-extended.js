import 'server-only';
import {getSiteConfiguration} from './published-configuration';
import {resolveSupabaseConfiguration} from './environment.mjs';
import {EXTENDED_MODULES,extendedCatalog,validateExtendedPayload,seedExtendedEntries} from './extended-editorial.mjs';
import {editorialMetadata} from './published-editorial';
import {SITE_NAME,SITE_DESCRIPTION} from '../seo/public-metadata';

export async function getExtendedPublishedEntries(modules=EXTENDED_MODULES,{fresh=false}={}){
 const {url,key}=resolveSupabaseConfiguration(process.env);
 if(!url||!key)return seedExtendedEntries().filter(e=>modules.includes(e.moduleId));
 return (await Promise.all(modules.map(async module=>{
  if(!EXTENDED_MODULES.includes(module))throw new Error('Módulo editorial no permitido.');
  const response=await fetch(`${url}/rest/v1/rpc/cms_module_entries`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_module:module}),...(fresh?{cache:'no-store'}:{next:{revalidate:60,tags:[`cms:${module}`]}})});
  if(!response.ok)throw new Error(`No se pudo consultar el módulo publicado: ${module}.`);
  const entries=await response.json();for(const e of entries)if(e.payload)validateExtendedPayload(e.payload);return entries;
 }))).flat();
}
export async function getExtendedCatalog(modules=EXTENDED_MODULES,options){const {url,key}=resolveSupabaseConfiguration(process.env);return extendedCatalog(await getExtendedPublishedEntries(modules,options),{includeLegacy:!(url&&key)});}
export async function getPublishedSiteContent(){const [c,config]=await Promise.all([getExtendedCatalog(['navigation','footer','orientation']),getSiteConfiguration()]);return {navigation:c.navigation,footer:c.footer,orientation:c.orientation,design:config.design};}
export function extendedMetadata(path,entity,defaults={title:SITE_NAME,description:SITE_DESCRIPTION,absoluteTitle:true}){return editorialMetadata({...defaults,path},entity);}
