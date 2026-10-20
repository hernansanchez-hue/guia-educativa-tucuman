import {createCatalog} from '../public-catalog/careers-catalog.js';
import {groupInstitutions} from '../public-catalog/institutions-catalog.js';
export function directoryCareers(catalog){
 const rows=createCatalog({careerRows:catalog.careers,institutionRows:catalog.institutions,cityRows:catalog.cities,offeringRows:catalog.offerings});
 for(const brand of catalog.brands)for(const offer of brand.generalOffers||[]){
  const master=catalog.careers.find(c=>c.id===offer.careerId),venue=catalog.institutions.find(i=>i.brandId===brand.id);
  if(!master||!venue)continue;
  let row=rows.find(c=>c.id===master.id);if(!row){row={...master,offerings:[]};rows.push(row);}
  if(row.offerings.some(o=>o.general&&o.institution.slug===venue.slug&&o.offering.modality===offer.modality))continue;
  row.offerings.push({general:true,career:{id:master.id,slug:master.slug,name:master.name},institution:{slug:venue.slug,name:brand.name,type:venue.type,image:venue.image},city:{slug:'',name:'Sede a consultar'},offering:{degree:master.name,image:master.image,modality:offer.modality},sourceName:offer.sourceName});
 }
 return rows.map(row=>{const master=catalog.careers.find(c=>c.id===row.id);return {...row,...(master?.image?{image:master.image,imageAlt:master.imageAlt}:{}),cmsSeo:master?.cmsSeo};}).sort((a,b)=>a.name.localeCompare(b.name,'es'));
}
export function directoryInstitutions(catalog){
 return groupInstitutions(catalog.institutions,catalog.cities,catalog.offerings,false,catalog.careers).map(row=>{
  const inst=catalog.institutions.find(i=>i.slug===row.slug),brand=catalog.brands.find(b=>b.id===inst?.brandId);
  const general=(brand?.generalOffers||[]).flatMap(o=>{const c=catalog.careers.find(c=>c.id===o.careerId);return c?[{name:c.name,slug:c.slug,image:c.image,modality:o.modality,cities:[],general:true}]:[];});
  return {...row,...(row.isMultiVenue&&brand?{name:brand.name}:{}),category:inst?.category||(/universidad/i.test(row.type)?'Universidad':/curso|capacitaci|academia/i.test(row.type)?'Capacitaciones':/terciari|institut|IES/i.test(row.type+' '+row.name)?'Terciario':undefined),ownership:inst?.ownership||(/privad/i.test(row.type)?'Privado':/p[uú]blic|estatal/i.test(row.type)?'Estatal':undefined),cmsSeo:brand?.cmsSeo,careers:[...row.careers,...general.filter(g=>!row.careers.some(c=>c.slug===g.slug))]};
 });
}
export {searchText,matchesSearch} from './search.mjs';

export function compactDirectoryCareers(rows){return rows.map(({id,slug,name,description,image,imageAlt,offerings})=>({id,slug,name,description,image,imageAlt,offerings:offerings.map(({institution,city,offering})=>({institution:{slug:institution.slug,name:institution.name},city,offering:{modality:offering.modality}}))}));}
export function compactDirectoryInstitutions(rows){return rows.map(({slug,name,type,category,ownership,image,imageAlt,venues,careers})=>({slug,name,type,category,ownership,image,imageAlt,venues:venues.map(({id,city})=>({id,city})),careers:careers.map(c=>({name:c.name}))}));}
