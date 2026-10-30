export const normalizeSearch=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').trim();

export function cityDiscoveryEntries(city) {
  return (city.institutions||[]).flatMap(institution=>{
    const href=`/${city.slug}/${institution.slug}`;
    return [{id:`institution-${institution.id}`,type:'Institución',name:institution.name,href},...(institution.careers||[]).filter(c=>c && c.slug && c.name).map(career=>({
      id:`career-${institution.id}-${career.id||career.slug}`,type:'Carrera',name:career.name,institution:institution.name,
      href:`${href}/${/capacitaci/i.test(institution.type??'')?'capacitaciones':'carreras'}/${career.slug==='licenciatura-en-administracion'?'lic-en-administracion':career.slug}`,
    }))];
  });
}

export function searchCityEntries(entries,query,{careersOnly=false}={}) {
  const term=normalizeSearch(query);
  return entries.filter(entry=>(!careersOnly||entry.type==='Carrera')&&(!term||normalizeSearch(`${entry.name} ${entry.institution||''}`).includes(term)));
}
