const canonical=id=>id==='licenciatura-en-administracion'?'lic-en-administracion':id;
// Page-only projection: preserve the shared city/CMS summaries and bind each
// consultation to the actual territorial offering, including modality variants.
export function institutionDesignPage(catalog,page){
 if(!page)return null;
 const institution=page.institution;
 const offers=catalog.offerings.filter(o=>o.institutionId===institution.id);
 const summaries=institution.careers||[];
 const academic=offers.map(o=>{
  const master=catalog.careers.find(c=>c.id===o.careerId);
  const previous=summaries.find(c=>canonical(c.id)===o.careerId)||{};
  return {...previous,id:master.id,slug:master.slug,name:previous.name||master.name,description:previous.description||master.description,
   offeringId:o.id,duration:o.duration,modality:o.modality,image:o.image,badge:o.badge,
   ...(o.featured!==undefined?{featured:o.featured}:{}),routePath:`/${institution.citySlug}/${institution.slug}/carreras/${master.slug}`};
 });
 const nonAcademic=summaries.filter(c=>!offers.some(o=>o.careerId===canonical(c.id)));
 return {...page,institution:{...institution,careers:[...academic,...nonAcademic]}};
}
