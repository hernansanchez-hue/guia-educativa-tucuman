import {publicCareerHref} from '../catalog/public-career-href.mjs';
export const normalizeSearch=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();

export function cityDiscoveryEntries(city) {
  return (city.institutions||[]).flatMap(institution=>{
    const href=`/${city.slug}/${institution.slug}`;
    return [{id:`institution-${institution.id}`,type:'Institución',name:institution.name,href},...(institution.careers||[]).filter(c=>c && c.slug && c.name).map(career=>({
      id:`career-${institution.id}-${career.id||career.slug}`,type:'Carrera',name:career.name,institution:institution.name,
      href:publicCareerHref(city,institution,career),
    }))];
  });
}

export function searchCityEntries(entries,query,{careersOnly=false}={}) {
  const term=normalizeSearch(query);
  return entries.filter(entry=>(!careersOnly||entry.type==='Carrera')&&(!term||normalizeSearch(`${entry.name} ${entry.institution||''}`).includes(term)));
}

export function institutionMatchesResults(city,institution,results) {
  const base=`/${city.slug}/${institution.slug}`;
  return results.some(result=>{
    const path=String(result.href||'').split(/[?#]/,1)[0];
    return path===base||path.startsWith(base+'/');
  });
}
