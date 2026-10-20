import {isSafeContentLink} from './content-document.mjs';
import {isPremiumCareer,isPremiumInstitution} from '../catalog/commercial-policy.mjs';

const canonical = {'licenciatura-en-administracion':'lic-en-administracion'};
function safePublicLink(value){
 if(!isSafeContentLink(value))return false;
 try{return !/^\/(?:admin|api)(?:\/|$)/i.test(new URL(decodeURIComponent(value),'https://get.local').pathname);}catch{return false;}
}

/** Same five offers and order used by the approved city renderer. No persistence here. */
export function automaticCitySlides(city) {
  return (city.institutions||[]).flatMap(institution=>(institution.careers||[]).filter(career=>isPremiumCareer(career,institution,city)).map(career=>({
    ...career,
    id:`${institution.id}-${career.id}`,
    institutionId:institution.id,
    careerId:career.id,
    institutionName:institution.name,
    institution:{name:institution.name,description:institution.description,image:institution.image,type:institution.type,route:`/${city.slug}/${institution.slug}`},
    route:`/${city.slug}/${institution.slug}/${/capacitaci/i.test(institution.type??'')?'capacitaciones':'carreras'}/${canonical[career.slug]??career.slug}`,
  }))).slice(0,5);
}

export function seedCitySlides(city) {
  return automaticCitySlides(city).map(career=>({
    id:career.id,institutionId:career.institutionId,careerId:career.careerId,
    title:city.heroTitle||career.name,description:city.heroDescription||career.description||'',
    image:city.heroImage||career.image||'',href:career.route,ctaLabel:'Ver carrera',
    institutionCtaLabel:'Conocer más',active:true,
  }));
}

export function resolveCitySlides(city) {
  if(!Array.isArray(city.slides)) return automaticCitySlides(city);
  try{validateCitySlides(city.slides);}catch{return [];}
  return city.slides.filter(slide=>slide.active!==false).flatMap(slide=>{
    const institution=city.institutions.find(i=>i.id===slide.institutionId);
    if(!institution||!isPremiumInstitution(institution,city))return [];
    if(slide.careerId){const career=institution.careers.find(c=>c.id===slide.careerId);if(!career||!isPremiumCareer(career,institution,city))return [];}
    return [{...slide,name:slide.title,route:slide.href,
      institution:{name:institution.name,description:institution.description,image:institution.image,type:institution.type,route:`/${city.slug}/${institution.slug}`}}];
  });
}

export function validateCitySlides(slides,{complete=false}={}) {
  if(slides===undefined)return;
  if(!Array.isArray(slides)||slides.length>30)throw Error('El slider admite hasta 30 diapositivas.');
  const ids=new Set(),keys=['id','institutionId','careerId','title','description','image','href','ctaLabel','institutionCtaLabel','active'];
  for(const slide of slides){
    if(!slide||Array.isArray(slide)||typeof slide!=='object'||Object.keys(slide).some(key=>!keys.includes(key)))throw Error('Revisá los datos de la diapositiva.');
    for(const key of keys.filter(k=>k!=='active'))if(slide[key]!=null&&(typeof slide[key]!=='string'||slide[key].length>(key==='description'?4000:1000)))throw Error('Revisá los textos de la diapositiva.');
    if(!slide.id||ids.has(slide.id))throw Error('Cada diapositiva debe ser única.');
    ids.add(slide.id);
    if(typeof slide.active!=='boolean')throw Error('Indicá si la diapositiva está visible.');
    for(const key of ['image','href'])if(slide[key]&&!safePublicLink(slide[key]))throw Error('Usá un recurso o destino público seguro para la diapositiva.');
    if(complete&&slide.active&&(!slide.title?.trim()||!slide.image||!slide.href||!slide.institutionId||!slide.ctaLabel?.trim()))throw Error('Completá título, imagen, institución y botón de las diapositivas visibles.');
  }
}
