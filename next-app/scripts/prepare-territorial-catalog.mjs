/** Deterministic LOCAL seed. No database client, credentials or write-to-Supabase operation. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {editorialCatalog,validateEditorialPayload} from '../lib/admin/editorial-model.mjs';
const source=JSON.parse(await readFile('../docs/catalog/GET-PDF-EXTRACTION.json','utf8'));
const images=await readFile('../docs/catalog/GET-CATALOG-IMAGES.json','utf8').then(JSON.parse).catch(()=>[]);
const baseline=JSON.parse(await readFile('../docs/catalog/GET-CATALOG-BASELINE.json','utf8'));
const before=editorialCatalog(baseline.entries,{includeLegacy:false});
const normalized=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,16);
const slug=s=>{const clean=normalized(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');return clean.length<=110?clean:clean.slice(0,90).replace(/-$/,'')+'-'+hash(s);};
const tidy=s=>String(s||'').replace(/\s+/g,' ').trim();
const localities={
 'AGUILARES':['Aguilares','Río Chico','90077'], 'ALDERETES - INCLUYE EL CORTE Y LOS GUTIERREZ':['Alderetes','Cruz Alta','90014'],
 'AMAICHA DEL VALLE':['Amaicha del Valle','Tafí del Valle','90098'], 'BANDA DEL RIO SALI - INCLUYE LASTENIA':['Banda del Río Salí','Cruz Alta','90014'],
 'BELLA VISTA':['Bella Vista','Leales','90056'],BURRUYACU:['Burruyacú','Burruyacú','90007'],CONCEPCION:['Concepción','Chicligasta','90021'],
 'ESPERANZA - INCLUYE DELFIN GALLO Y EX INGENIOS ESP':['Esperanza','Cruz Alta','90014'],FAMAILLA:['Famaillá','Famaillá','90028'],GRANEROS:['Graneros','Graneros','90035'],
 'JUAN BAUTISTA ALBERDI':['Juan Bautista Alberdi','Juan Bautista Alberdi','90042'],'LA COCHA':['La Cocha','La Cocha','90049'],'LA RAMADA':['La Ramada','Burruyacú','90007'],LAMADRID:['Lamadrid','Graneros','90035'],
 'LOS RALOS-INCLUYE VILLAS RESCATE Y TERCERA Y EX IN':['Los Ralos','Cruz Alta','90014'],LULES:['Lules','Lules','90063'],MONTEROS:['Monteros','Monteros','90070'],
 'SAN MIGUEL DE TUCUMAN':['San Miguel de Tucumán','Capital','90084'],'SAN PEDRO DE COLALAO':['San Pedro de Colalao','Trancas','90112'],
 'SANTA ROSA DE LEALES':['Santa Rosa de Leales','Leales','90056'],SIMOCA:['Simoca','Simoca','90091'],'TAFI DEL VALLE':['Tafí del Valle','Tafí del Valle','90098'],
 'TAFI VIEJO':['Tafí Viejo','Tafí Viejo','90105'],'VILLA QUINTEROS':['Villa Quinteros','Monteros','90070'],'VILLA TRANCAS':['Villa Trancas','Trancas','90112'],
 'YERBA BUENA':['Yerba Buena','Yerba Buena','90119'],'SAN PABLO':['San Pablo','Lules','90063'],
};
const entries=new Map(),enrichments=[],duplicates=[],pending=[],campuses=[],offerAudit=[];
const identity=e=>`${e.moduleId}:${e.key}`;
const provenance=(page,record)=>({file:source.source,sha256:source.sha256,page,record});
function add(kind,module,key,data,page,record){const e={moduleId:module,key,payload:{_kind:kind,data,source:provenance(page,record)},visibility:'published'};entries.set(identity(e),e);return e;}
function enrich(old,data){const key=identity(old),current=entries.get(key)||structuredClone(old);for(const [k,v]of Object.entries(data))if((current.payload.data[k]===undefined||current.payload.data[k]===''||Array.isArray(current.payload.data[k])&&!current.payload.data[k].length)&&v!==undefined&&v!=='')current.payload.data[k]=v;entries.set(key,current);return current;}
function cityFor(raw,page){const geo=localities[raw];if(!geo)throw Error('Localidad sin revisar: '+raw);const [name,department,departmentId]=geo,id=slug(name),old=baseline.entries.find(e=>e.payload._kind==='city'&&e.payload.data.slug===id);
 if(old){enrich(old,{department,departmentId});return old.payload.data;}
 const key=`cities:${id}`;if(entries.has(key))return entries.get(key).payload.data;
 return add('city','cities',id,{id,slug:id,name,title:`Instituciones y carreras en ${name}`,heroTitle:`Estudiá en ${name}`,heroDescription:`Instituciones y propuestas educativas en ${name}, Tucumán.`,heroImage:'/assets/catalog/institution-neutral.webp',department,departmentId,institutionIds:[],featuredInstitutionIds:[],slides:[],visible:true},page,raw).payload.data;
}
const imageRules=[
 ['radiology',/radiolog|imagenolog|diagn[oó]stico por im/],['dentistry',/odont|dental/],['surgery',/instrumentaci[oó]n quir/],['counseling',/psicolog|acompa[nñ]amiento terap/],['mathematics',/matem[aá]tic|estad[ií]stic|f[ií]sica(?!.*educaci)/],
 ['languages',/ingl[eé]s|franc[eé]s|portugu[eé]s|lenguas|letras|literatura/],['physical',/educaci[oó]n f[ií]sica|deport/],
 ['music',/m[uú]sica|luther|instrumentos|sonori|sonido|canto|coral/],['arts',/arte|pl[aá]stic|danza|teatr|dram[aá]tic|dise[nñ]o|fotograf|cine|audiovis|iluminaci/],
 ['clinical',/medicin|enfermer|kinesio|fonoaudi|odont|dental|terapia|nutric|radiolog|imagenolog|diagn[oó]stico|instrumentaci[oó]n quir/],
 ['science',/biolog|qu[ií]mic|laborator|biotecn|f[ií]sica|matem[aá]tic|estad[ií]stic|geolog/],['law',/abogac|derecho|escriban|notari|procurac|seguridad p[uú]blica|protecci[oó]n ciudad/],
 ['technology',/inform[aá]tic|comput|program|software|redes|inteligencia artificial/],['agriculture',/agron|zootec|veterinar|azucar|bioenerg/],
 ['industry',/ingenier|electric|mec[aá]nic|autom[aá]tic|higiene|seguridad laboral|industrial|log[ií]stic/],['hospitality',/tur[ií]s|gastronom/],
 ['education',/educa|docente/],['economics',/econom|contad|administr|marketing|gesti[oó]n|comercial/],['community',/psicolog|social|historia|geograf|filosof|pol[ií]tic|comunicaci[oó]n|arqueol|sagrad/],
 ['education',/profesor|educaci|docente|pedag/],['architecture',/arquitect|agrimens/]
];
const imageFor=name=>`/assets/catalog/${/educaci[oó]n f[ií]sica/i.test(name)?'physical':imageRules.find(([,re])=>re.test(name.toLowerCase()))?.[0]||'education'}.webp`;
const careerByName=new Map(before.careers.map(c=>[normalized(c.name),c]));
function masterFor(name,page,record){name=tidy(name).replace(/^Licenciatura Licenciatura /,'Licenciatura ').replace(/\s*\/\s*/g,'/');const norm=normalized(name);if(careerByName.has(norm))return careerByName.get(norm);
 const id='pdf-carrera-'+hash(norm),c={id,slug:slug(name),name,description:'',graduateProfile:'',workField:'',studyPlan:[],requirements:[],faq:[],image:imageFor(name),imageAlt:`Imagen editorial del área de ${name}`,premium:false};add('career','careers',`carrera/${id}`,c,page,record);careerByName.set(norm,c);return c;
}
function offerFor(inst,career,name,page,record,modality){const existing=before.offerings.find(o=>o.institutionId===inst.id&&o.careerId===career.id);if(existing){duplicates.push({type:'offering',source:record,existing:existing.id,decision:'Conservar oferta y todos sus datos previos'});return existing;}
 const id='pdf-oferta-'+hash(inst.id+':'+career.id+':'+(modality||'')),key=`oferta/${id}`;if(entries.has('careers:'+key)){duplicates.push({type:'offering',source:record,existing:id,decision:'Misma denominación, sede y modalidad explícita; una oferta'});return entries.get('careers:'+key).payload.data;}
 const offer={id,institutionId:inst.id,careerId:career.id,degree:name,...(modality?{modality}:{}),image:imageFor(name),imageAlt:`Imagen editorial del área de ${name}`,featured:false,premium:false,visible:true,formEnabled:true,badge:'',order:100};add('offering','careers',key,offer,page,record);offerAudit.push({id,institutionId:inst.id,careerId:career.id,source:record,page,scope:'campus'});return offer;
}
const knownCampuses={'900095700':'ies-concepcion-concepcion','900190000':'instituto-santa-barbara-concepcion'};
const names=new Map(source.tertiaryCampuses.map(r=>[r.sourceId,r.name]));
const usedRoutes=new Set(before.institutions.map(i=>i.citySlug+'/'+i.slug));
function publicContact(record){const output={};if(record.address)output.address=record.address;
 if(record.phone&&!/no publicado|requiere|consultar/i.test(record.phone))output.phone=record.phone;
 const email=record.email.replace(/\s+/g,'');if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)&&!email.includes('No'))output.email=email;
 const web=record.website.replace(/\s+/g,'');if(/^https:\/\//i.test(web))output.website=web;
 return output;
}
for(const r of source.tertiaryCampuses){const city=cityFor(r.locality,r.page),known=before.institutions.find(i=>i.id===knownCampuses[r.sourceId]);let inst;
 if(known){const old=baseline.entries.find(e=>e.payload._kind==='institution'&&e.payload.data.id===known.id);inst=enrich(old,{...publicContact(r),cueAnexo:r.sourceId,sourceLocality:r.locality,ownership:r.ownership,category:'Terciario'}).payload.data;enrichments.push({sourceId:r.sourceId,institutionId:known.id,decision:'Sólo completar campos vacíos; conservar presentación, Premium y datos existentes'});}
 else{const prefix=r.sourceId.slice(0,7),brandId='pdf-marca-'+prefix,central=names.get(prefix+'00')||r.name.replace(/\s*-\s*ANEXO.*$/i,'');
 if(!entries.has(`institutions:marca/${brandId}`))add('brand','institutions',`marca/${brandId}`,{id:brandId,slug:slug(central),name:central,logo:'',description:'',slogan:''},r.page,r.sourceId);
 let instSlug=slug(central);if(usedRoutes.has(`${city.slug}/${instSlug}`))instSlug=slug(r.name)+'-'+r.sourceId.slice(-2);usedRoutes.add(`${city.slug}/${instSlug}`);
 const id='pdf-sede-'+r.sourceId;inst=add('institution','institutions',`sede/${id}`,{id,slug:instSlug,brandId,cityId:city.id,citySlug:city.slug,campusName:r.name,category:'Terciario',type:r.ownership==='Estatal'?'Terciario estatal':'Terciario privado',ownership:r.ownership,plan:'Normal',premium:false,featured:false,visible:true,image:'/assets/catalog/institution-neutral.webp',imageAlt:'Biblioteca educativa genérica; imagen editorial, no fotografía de esta sede',gallery:[],cities:[city.name],...publicContact(r),...(r.address?{address:`${r.address}, ${city.name}, Tucumán`}:{}),cueAnexo:r.sourceId,sourceLocality:r.locality,offerType:r.offerType,infodType:r.infodType},r.page,r.sourceId).payload.data;}
 campuses.push({sourceId:r.sourceId,page:r.page,institutionId:inst.id,cityId:city.id,name:r.name,originalLocality:r.locality,ownership:r.ownership,offerCount:r.careers.length,isExisting:!!known});
 for(const name of r.careers)offerFor(inst,masterFor(name,r.page,r.sourceId),tidy(name),r.page,r.sourceId);
 if(!r.careers.length)pending.push({institutionId:inst.id,city:city.name,name:r.name,page:r.page,status:'SIN CARRERAS INFORMADAS'});
}
// The eight network profiles on pages 2–3. Addresses and territorial presence are transcribed, not inferred from career lists.
const universities=[
 {id:'unt',name:'Universidad Nacional de Tucumán (UNT)',ownership:'Estatal',page:2,website:'https://academica.unt.edu.ar/oferta-academica/',phone:'+54 381 4530200 / (0381) 453-0215',email:'prensa@rectorado.unt.edu.ar',sites:[['SAN MIGUEL DE TUCUMAN','Ayacucho 491','Rectorado']]},
 {id:'utn-frt',name:'Universidad Tecnológica Nacional — Facultad Regional Tucumán (UTN-FRT)',ownership:'Estatal',page:2,website:'https://frt.utn.edu.ar/',phone:'+54 381 4307387 / +54 381 4307385',email:'ayuda@frt.utn.edu.ar',sites:[['SAN MIGUEL DE TUCUMAN','Rivadavia 1050','Facultad Regional Tucumán'],['CONCEPCION','América y Ricardo Alfonsín','Concepción']]},
 {id:'unsta',name:'Universidad del Norte Santo Tomás de Aquino (UNSTA)',ownership:'Privado',page:2,website:'https://www.unsta.edu.ar/oferta_academica/',phone:'(0381) 410-1141 / 381 408-0310 / 381 620-1120',email:'informes@unsta.edu.ar',sites:[['SAN MIGUEL DE TUCUMAN','9 de Julio 165','Sede Central','SC'],['YERBA BUENA','Av. Presidente Perón 2085','Campus Yerba Buena','YB'],['CONCEPCION','','Campus Concepción','CUC']]},
 {id:'usp-t',name:'Universidad de San Pablo-Tucumán (USP-T)',ownership:'Privado',page:2,website:'https://www.uspt.edu.ar/carreras',phone:'+54 381 4530630',email:'informes@uspt.edu.ar',sites:[['SAN MIGUEL DE TUCUMAN','Gral. José de San Martín 435','Sede Plaza'],['SAN PABLO','','Campus San Pablo']]},
 {id:'universidad-siglo-21',slug:'universidad-siglo-21',name:'Universidad Siglo 21',ownership:'Privado',page:2,website:'https://21.edu.ar/la-universidad/sedes-centros/presencia-territorial',sites:[['JUAN BAUTISTA ALBERDI','Laprida 622','CAU J. B. Alberdi'],['CONCEPCION','Buenos Aires 128','CAU Concepción'],['MONTEROS','Tucumán 327','CAU Monteros'],['SAN MIGUEL DE TUCUMAN','Buenos Aires 564','CAU San Miguel de Tucumán'],['YERBA BUENA','Lobo de Vega 304','CAU Yerba Buena']]},
 {id:'universidad-blas-pascal',name:'Universidad Blas Pascal — Red Pascal Tucumán',ownership:'Privado',page:2,website:'https://redpascal.com.ar/tucuman/',phone:'351 681-0505',email:'tucuman@redpascal.com.ar',sites:[['SAN MIGUEL DE TUCUMAN','Congreso de Tucumán 430, 1.º piso','Tucumán']]},
 {id:'ucasal',name:'Universidad Católica de Salta (UCASAL)',ownership:'Privado',page:3,website:'https://www.ucasal.edu.ar/ucasalx/en-que-consiste-estudiar-online/sedes',phone:'381 647-0259 / 0810 555 822725',email:'admision@ucasal.edu.ar',sites:[['SAN MIGUEL DE TUCUMAN','Monteagudo 341','Sede San Miguel de Tucumán']]},
 {id:'ufasta',name:'Universidad FASTA — Educación a Distancia Tucumán',ownership:'Privado',page:3,website:'https://www.ufasta.edu.ar/distancia/',sites:[['SAN MIGUEL DE TUCUMAN','Buenos Aires 548','Oficina Tucumán']]},
];
const universitySites=new Map();
for(const u of universities){const existingBrand=before.brands.find(b=>b.slug===(u.slug||slug(u.name))),brandId=existingBrand?.id||'pdf-universidad-'+u.id,brandSlug=existingBrand?.slug||u.slug||slug(u.name);
 const brand=existingBrand?enrich(baseline.entries.find(e=>e.payload._kind==='brand'&&e.payload.data.id===brandId),{website:u.website}).payload.data:add('brand','institutions',`marca/${brandId}`,{id:brandId,slug:brandSlug,name:u.name,logo:'',description:'',slogan:'',website:u.website,generalOffers:[]},u.page,u.id).payload.data;
 const sites=[];
 for(const [raw,address,campus,code] of u.sites){const city=cityFor(raw,u.page),known=before.institutions.find(i=>i.brandId===brandId&&i.citySlug===city.slug);let inst;
 if(known){inst=enrich(baseline.entries.find(e=>e.payload._kind==='institution'&&e.payload.data.id===known.id),{address,website:u.website,phone:u.phone,email:u.email,ownership:u.ownership,category:'Universidad'}).payload.data;enrichments.push({sourceId:u.id+'-'+city.slug,institutionId:inst.id,decision:'Completar vacíos, conservar Premium y campos aprobados'});}
 else{const id='pdf-universidad-sede-'+hash(u.id+':'+city.id);inst=add('institution','institutions',`sede/${id}`,{id,slug:brandSlug,brandId,cityId:city.id,citySlug:city.slug,category:'Universidad',type:u.ownership==='Estatal'?'Universidad estatal':'Universidad privada',ownership:u.ownership,campusLabel:campus,plan:'Normal',premium:false,featured:false,visible:true,image:'/assets/catalog/institution-neutral.webp',gallery:[],cities:[city.name],...(address?{address:`${address}, ${city.name}, Tucumán`}:{}),website:u.website,...(u.phone?{phone:u.phone}:{}),...(u.email?{email:u.email}:{})},u.page,u.id+'-'+city.slug).payload.data;}
 sites.push({inst,code});campuses.push({sourceId:u.id+'-'+city.slug,page:u.page,institutionId:inst.id,cityId:city.id,name:u.name,campus,offerCount:0,isExisting:!!known});
 }universitySites.set(u.id,{brand,sites,u});
}
for(const [index,row]of source.universityOffers.entries()){
 const {brand,sites}=universitySites.get(row.university==='UNT'?'unt':'unsta');
 // Keep academic qualifiers such as CCC and compound qualifications. Only remove explicit location/mode/launch annotations.
 let name=tidy(row.name).replace(/\(NUEVA\)/gi,'').replace(/\((?:SC|YB|CUC|UC)[^)]*\)/gi,match=>/CCC/i.test(match)?' (CCC)':'').replace(/\((?:PRESENCIAL|DISTANCIA)\)/gi,'').replace(/\(-?\*?CCC\*?-?\)/gi,' (CCC)').replace(/\s*-\s*CCC\s*-\s*/gi,' (CCC) ').replace(/\(\s*\(/g,'(').replace(/\(\s*$/,'').trim();name=tidy(name);
 const master=masterFor(name,row.page,`${row.university}:${index}`),codeText=row.name.toUpperCase(),codes=row.university==='UNSTA'?['SC','YB','CUC'].filter(code=>new RegExp(`(?:\\(|[ -])${code}(?=[) -])`).test(codeText)):[];
 const modes=[...codeText.matchAll(/\((PRESENCIAL|DISTANCIA)\)/g)].map(m=>m[1]);const modality=modes.length===1?(modes[0]==='DISTANCIA'?'A distancia':'Presencial'):undefined;
 if(codes.length){for(const {inst,code}of sites.filter(s=>codes.includes(s.code)))offerFor(inst,master,name,row.page,`${row.university}:${index}`,modality);}
 else{const list=brand.generalOffers||=[];const key=master.id+':'+(modality||'');if(!list.some(o=>o.careerId+':'+(o.modality||'')===key)){list.push({careerId:master.id,sourceName:row.name,...(modality?{modality}:{}),page:row.page});offerAudit.push({careerId:master.id,brandId:brand.id,page:row.page,source:row.name,scope:'institution-general'});}else duplicates.push({type:'university-offer',source:row.name,page:row.page,decision:'Misma denominación y modalidad; referencia general única'});}
 if(row.name.includes('SC- UC')||modes.length>1)pending.push({name:row.name,page:row.page,status:'PARCIAL',reason:'Código UC o modalidades contradictorias en la fuente; no inferir campus/modalidad faltante'});
}
for(const {brand,sites,u}of universitySites.values())for(const {inst}of sites)if(!before.offerings.some(o=>o.institutionId===inst.id)&&![...entries.values()].some(e=>e.payload._kind==='offering'&&e.payload.data.institutionId===inst.id))pending.push({institutionId:inst.id,city:localities[u.sites.find(s=>slug(localities[s[0]][0])===inst.cityId)[0]][0],name:u.name,page:u.page,status:brand.generalOffers?.length?'PARCIAL':'SIN CARRERAS INFORMADAS',reason:brand.generalOffers?.length?'Oferta general de la universidad conocida; no se atribuye a esta sede sin respaldo.':'La fuente describe áreas o volumen de oferta, no carreras concretas para esta sede.'});
for(const [raw,[name]]of Object.entries(localities)){const id=slug(name),cityEntry=[...entries.values()].find(e=>e.payload._kind==='city'&&e.payload.data.id===id);if(cityEntry){cityEntry.payload.data.institutionIds=[...new Set([...(cityEntry.payload.data.institutionIds||[]),...campuses.filter(c=>c.cityId===id).map(c=>c.institutionId)])];}}
for(const e of entries.values())validateEditorialPayload(e.payload);
const after=editorialCatalog([...baseline.entries,...entries.values()],{includeLegacy:false});
for(const inst of before.institutions){const next=after.institutions.find(i=>i.id===inst.id);if(next.plan!==inst.plan||next.premium!==inst.premium||next.featured!==inst.featured)throw Error('Condición comercial alterada: '+inst.id);}
for(const o of before.offerings){const n=after.offerings.find(v=>v.id===o.id);if(JSON.stringify(n)!==JSON.stringify(o))throw Error('Oferta anterior alterada: '+o.id);}
const newEntries=[...entries.values()].filter(e=>!baseline.entries.some(b=>identity(b)===identity(e)));
const report={source:{file:source.source,sha256:source.sha256,pageCount:source.pageCount,processedPages:Array.from({length:30},(_,i)=>i+1)},mode:'LOCAL REVIEW ONLY — no remote writes',cities:after.cities.map(c=>({id:c.id,name:c.name,route:'/'+c.slug,isNew:!before.cities.some(b=>b.id===c.id),institutions:after.institutions.filter(i=>i.citySlug===c.slug).length,offers:after.offerings.filter(o=>o.citySlug===c.slug).length,missingOffers:campuses.filter(v=>v.cityId===c.id&&!after.offerings.some(o=>o.institutionId===v.institutionId)).length,premium:after.institutions.filter(i=>i.citySlug===c.slug&&i.plan==='Premium').length,status:'PENDIENTE VALIDACIÓN VISUAL'})),institutions:after.brands.map(b=>({id:b.id,slug:b.slug,name:b.name,campuses:after.institutions.filter(i=>i.brandId===b.id).map(i=>i.id)})),updates:enrichments,campuses,careers:offerAudit,missingOffers:pending,images,duplicates,premiumPreserved:{before:baseline.premium,plansUnchanged:true,offersUnchanged:true},notImported:[],totals:{pdfTertiaryCampuses:103,pdfUniversityNetworks:8,pdfUniversityOfferRows:source.universityOffers.length,pdfLocalities:Object.keys(localities).length,newCities:after.cities.length-before.cities.length,existingCities:before.cities.length,newCampuses:after.institutions.length-before.institutions.length,totalCampuses:after.institutions.length,totalBrands:after.brands.length,newCareerMasters:after.careers.length-before.careers.length,totalCareerMasters:after.careers.length,totalTerritorialOffers:after.offerings.length,newTerritorialOffers:after.offerings.length-before.offerings.length,institutionGeneralOffers:offerAudit.filter(o=>o.scope==='institution-general').length,updatedCampuses:enrichments.length,newDocuments:newEntries.length,institutionsWithoutTerritorialOffers:after.institutions.filter(i=>!after.offerings.some(o=>o.institutionId===i.id)).length,pdfCampusesWithoutPublishedCareers:source.tertiaryCampuses.filter(r=>!r.careers.length).length,generatedImages:images.length}};
await mkdir('lib/catalog',{recursive:true});
await writeFile('lib/catalog/territorial-entries.json',JSON.stringify({source:report.source,entries:[...entries.values()]},null,2)+'\n');
await writeFile('../docs/catalog/GET-CATALOG-IMPORT-REPORT.json',JSON.stringify(report,null,2)+'\n');
await writeFile('../docs/catalog/GET-CATALOG-PENDING.md','# Pendientes del catálogo territorial\n\nImportación local, sin cambios remotos. Las ofertas universitarias generales no se atribuyen a sedes. Todos los registros nuevos son normales.\n\n## Datos faltantes o ambiguos\n\n'+pending.map(p=>`- ${p.city||''} — ${p.name} (p. ${p.page}): ${p.status}. ${p.reason||'La fuente no informa carreras concretas.'}`).join('\n')+'\n\n## Deduplicación\n\n'+duplicates.map(d=>`- p. ${d.page||''} ${d.source}: ${d.decision}.`).join('\n')+'\n\n## Criterio territorial\n\nSe conservan las 25 localidades del padrón, incluyendo sus etiquetas agrupadas en sourceLocality. Esperanza incluye Delfín Gallo; Banda del Río Salí incluye Lastenia. No se inventan coordenadas ni se desagregan sin evidencia. Universidades agregan Yerba Buena y San Pablo. Los departamentos se relacionan con los IDs del GeoJSON existente.\n\n## Arquitectura pública\n\nCiudad → Instituciones → Carreras de cada institución. No hay grilla general de carreras en las homes de ciudad. /carreras y sus páginas SEO permanecen disponibles como directorio transversal.\n\n## Importación futura al CMS\n\nLos documentos usan el modelo editorial existente (_kind, moduleId, key, payload), validados por validateEditorialPayload. No se ejecutó importación en Supabase. Requieren revisión/aprobación y carga transaccional mediante las operaciones autorizadas del CMS antes de publicar.\n');
console.log(JSON.stringify(report.totals,null,2));
