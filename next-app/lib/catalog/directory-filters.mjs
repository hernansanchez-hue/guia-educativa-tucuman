import {matchesSearch} from './search.mjs';

/** Filter only the published directory projection. No commercial access is granted. */
export function filterDirectory(items,kind,{query='',city='',type='',ownership='',institution='',modality=''}={}){
 return items.filter(item=>kind==='institutions'
  ? matchesSearch(query,item.name,item.type,item.venues.map(v=>v.city.name),item.careers.map(c=>c.name))&&(!city||item.venues.some(v=>v.city.slug===city))&&(!type||item.category===type)&&(!ownership||item.ownership===ownership)
  : matchesSearch(query,item.name,item.description,item.offerings.map(o=>[o.institution.name,o.city.name]))&&(!(city||institution||modality)||item.offerings.some(o=>(!city||o.city.slug===city)&&(!institution||o.institution.slug===institution)&&(!modality||o.offering.modality===modality))));
}

export function directoryPage(items,page=1,pageSize=24){
 const pages=Math.max(1,Math.ceil(items.length/pageSize));
 const current=Math.min(pages,Math.max(1,Number.isFinite(Number(page))?Math.floor(Number(page)):1));
 return {pages,current,visible:items.slice((current-1)*pageSize,current*pageSize)};
}
