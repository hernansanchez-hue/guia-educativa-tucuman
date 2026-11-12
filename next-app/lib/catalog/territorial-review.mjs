/** Same CMS documents, overlaid only for local review. Never publishes or mutates input. */
export function territorialReviewEnabled(env={}) {
 return env.NODE_ENV==='development'&&env.GET_TERRITORIAL_CATALOG_REVIEW!=='0'&&env.NETLIFY!=='true';
}
export function mergeTerritorialEntries(published,seed) {
 const byKey=new Map(published.map(e=>[`${e.moduleId}:${e.key}`,structuredClone(e)]));
 for(const imported of seed){
  const key=`${imported.moduleId}:${imported.key}`,current=byKey.get(key);
  if(!current){byKey.set(key,structuredClone(imported));continue;}
  // Respect tombstones, later edits, existing commercial choices and approved copy.
  if(current.visibility==='hidden'||!current.payload?.data)continue;
  const data=current.payload.data,extra=imported.payload.data;
  for(const [field,value]of Object.entries(extra)){
   if(['institutionIds','generalOffers'].includes(field)&&Array.isArray(value)){
    const merged=[...(data[field]||[])];for(const item of value)if(!merged.some(v=>JSON.stringify(v)===JSON.stringify(item)))merged.push(structuredClone(item));data[field]=merged;
   }else if((data[field]===undefined||data[field]==='')&&value!==undefined&&value!=='')data[field]=structuredClone(value);
  }
 }
 return [...byKey.values()];
}
