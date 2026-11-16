import {isSafeContentLink} from './content-document.mjs';
import {isPremiumCareer} from '../catalog/commercial-policy.mjs';
import {publicCareerHref} from '../catalog/public-career-href.mjs';

function safePublicLink(value){
 if(!isSafeContentLink(value))return false;
 try{return !/^\/(?:administrador|admin|api)(?:\/|$)/i.test(new URL(decodeURIComponent(value),'https://get.local').pathname);}catch{return false;}
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
    route:publicCareerHref(city,institution,career),
  })));
}

export function seedCitySlides(city) {
  return automaticCitySlides(city).map(career=>({
    id:career.id,institutionId:career.institutionId,careerId:career.careerId,
    title:city.heroTitle||career.name,description:city.heroDescription||career.description||'',
    image:city.heroImage||career.image||'',href:career.route,ctaLabel:'Ver carrera',
    institutionCtaLabel:'Conocer más',active:true,
  }));
}

// A manual slide is an editorial selection, not a commercial plan or a profile benefit.
// Offer choices come from this city's visible institutional catalog, not from its slider.
export function citySlideOptions(city) {
  return (city.institutions || []).flatMap(institution => (institution.careers || [])
    .filter(career => career.visible !== false && career.id && career.slug)
    .map(career => ({
      id: institution.id + '-' + career.id, institutionId: institution.id, careerId: career.id,
      institutionName: institution.name, careerName: career.name, title: career.name,
      description: career.description || '', image: career.image || '',
      href: publicCareerHref(city,institution,career),
      ctaLabel: 'Conocer la carrera', institutionCtaLabel: 'Conocer más', active: true,
    })));
}

export function resolveCitySlides(city) {
  if(!Array.isArray(city.slides)) return automaticCitySlides(city);
  try{validateCitySlides(city.slides);}catch{return [];}
  return city.slides.filter(slide=>slide.active!==false).flatMap(slide=>{
    const institution=city.institutions.find(i=>i.id===slide.institutionId);
    if(!institution||institution.visible===false)return [];
    const career=slide.careerId?institution.careers.find(c=>c.id===slide.careerId):null;
    if(slide.careerId&&(!career||career.visible===false))return [];
    const route=career&&slide.href?.startsWith(`/${city.slug}/${institution.slug}/carreras/`)?publicCareerHref(city,institution,career):slide.href;
    return [{...slide,name:slide.title,route,
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
