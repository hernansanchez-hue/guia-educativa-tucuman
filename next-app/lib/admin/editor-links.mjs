import {catalogRouteMap} from './editorial-model.mjs';
const staticPaths=['/','/ciudades','/carreras','/instituciones','/cursos-docentes','/contacto','/nosotros','/servicios','/eventos'];
export function editorialLinkWarnings(catalog,payload){
 const d=payload.data,paths=new Set([...staticPaths,...catalogRouteMap(catalog).values()]),links=payload._kind==='navigation'?[{label:d.courseLabel,href:d.courseHref},...d.items.filter(i=>i.visible!==false&&!i.contextual)]:payload._kind==='footer'?[...d.explore,...d.social].filter(i=>i.visible!==false):[];
 if(['event','service'].includes(payload._kind)&&d.ctaHref)links.push({label:d.ctaLabel||'CTA',href:d.ctaHref});
 return links.filter(i=>i.href?.startsWith('/')&&!paths.has(i.href.split(/[?#]/)[0])&&!i.href.startsWith('/assets/')&&!i.href.startsWith('/media/cms/')).map(i=>`${i.label}: ${i.href} no figura entre las rutas públicas actuales.`);
}
export function validateExtendedPublication(payload){
 const d=payload.data;
 if(['event','training-offering'].includes(payload._kind)&&d.visible!==false&&!d.image?.trim())throw new Error('Elegí una imagen principal antes de publicar.');
 if(payload._kind==='about'&&d.team.some(p=>p.visible!==false&&(!p.name.trim()||!p.photo.trim())))throw new Error('Completá nombre y foto de los integrantes visibles, o escondé la fila incompleta.');
 if(['navigation','footer'].includes(payload._kind)){for(const rows of [d.items,d.explore,d.social].filter(Boolean))if(rows.some(r=>r.visible!==false&&!r.label.trim()))throw new Error('Completá el texto de los enlaces visibles.');}
 for(const key of ['startDate','endDate'])if(d[key]&&!/^\d{4}-\d{2}-\d{2}$/.test(d[key]))throw new Error('Revisá las fechas.');
 if(d.startDate&&d.endDate&&d.endDate<d.startDate)throw new Error('La fecha de fin debe ser posterior al inicio.');
 return payload;
}
