import nextEnv from '@next/env';
import {writeFile} from 'node:fs/promises';
import {editorialCatalog,cityPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {automaticCitySlides} from '../lib/admin/city-slider.mjs';
import {resolveSupabaseConfiguration} from '../lib/admin/environment.mjs';
nextEnv.loadEnvConfig(process.cwd());
const {url,key}=resolveSupabaseConfiguration(process.env);
if(!url||!key)throw Error('Falta configuración pública para auditar el catálogo activo.');
const response=await fetch(`${url}/rest/v1/rpc/cms_public_entries`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}'});
if(!response.ok)throw Error(`Lectura pública HTTP ${response.status}`);
const entries=await response.json(),catalog=editorialCatalog(entries,{includeLegacy:false});
const snapshot={createdAt:new Date().toISOString(),entries,counts:Object.fromEntries(['cities','institutions','careers','offerings'].map(k=>[k,catalog[k].length])),premium:{
 institutions:catalog.institutions.filter(i=>i.plan==='Premium'||i.premium===true).map(i=>({id:i.id,slug:i.slug,citySlug:i.citySlug,plan:i.plan,featured:i.featured})),
 offers:catalog.offerings.filter(o=>o.premium===true||o.featured===true||catalog.institutions.some(i=>i.id===o.institutionId&&i.plan==='Premium')&&o.featured!==false).map(o=>({id:o.id,institutionId:o.institutionId,careerId:o.careerId,featured:o.featured})),
 cityFeatured:catalog.cities.map(c=>{const page=cityPageFromCatalog(catalog,c.slug);return {city:c.slug,institutions:page.featuredInstitutions.map(i=>i.id),slides:automaticCitySlides(page).map(o=>({institutionId:o.institutionId,careerId:o.careerId}))};})
}};
await writeFile('../docs/catalog/GET-CATALOG-BASELINE.json',JSON.stringify(snapshot,null,2)+'\n');
console.log(JSON.stringify({counts:snapshot.counts,premium:snapshot.premium},null,2));
