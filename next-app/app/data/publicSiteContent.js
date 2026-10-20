export const publicNavigationItems=Object.freeze([
 {id:'inicio',label:'Inicio',href:'/',contextual:true,visible:true},
 {id:'instituciones',label:'Instituciones',href:'/instituciones',contextual:false,visible:true},
 {id:'carreras',label:'Carreras',href:'/carreras',contextual:false,visible:true},
]);

const publicSections=new Set(['ciudades','instituciones','carreras','eventos','nosotros','servicios','orientacion-vocacional','contacto','cursos-docentes','admin','media']);

export function resolvePublicNavigation(content={}){
 return {...content,items:publicNavigationItems.map(item=>({...item}))};
}

export function isPublicNavigationItemActive(item,pathname='/',homeHref='/'){
 const path=pathname.replace(/\/+$/,'')||'/';
 if(item.id==='inicio'){
  if(path===homeHref)return true;
  const parts=path.split('/').filter(Boolean);
  return homeHref==='/'&&parts.length===1&&!publicSections.has(parts[0]);
 }
 if(item.id==='instituciones'){
  if(path==='/instituciones'||path.startsWith('/instituciones/'))return true;
  const parts=path.split('/').filter(Boolean);
  return parts.length>=2&&!publicSections.has(parts[0])&&parts[2]!=='carreras'&&parts[2]!=='capacitaciones';
 }
 if(item.id==='carreras'){
  if(path==='/carreras'||path.startsWith('/carreras/'))return true;
  const parts=path.split('/').filter(Boolean);
  return parts.length>=3&&!publicSections.has(parts[0])&&parts[2]==='carreras';
 }
 return path===item.href||path.startsWith(`${item.href}/`);
}

export const navigationContent=resolvePublicNavigation({id:'navigation',name:'Menús',logo:'/assets/get-city-footer-logo.png',searchPlaceholder:'Buscar carreras, instituciones...',courseLabel:'Cursos Docentes',courseHref:'/cursos-docentes'});
export const orientationContent={id:'orientation',name:'Orientación Vocacional',eyebrow:'ORIENTACIÓN VOCACIONAL GRATUITA',titleBefore:'¿Todavía no sabés qué estudiar?',titleAfter:'Encontrá tu camino con GET.',description:'Explorá tus intereses y conocé opciones para tu futuro.',image:'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1100&q=84',imageAlt:'Estudiantes conversando sobre su futuro académico',caption:'Un espacio para pensar tu próximo paso.',ctaLabel:'Quiero sumarme',status:'Próximamente',cityIds:['concepcion','monteros','aguilares'],visible:true};
export const footerContent={id:'footer',name:'Footer',logo:'/assets/get-city-footer-logo.png',brandCopy:'Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.',exploreTitle:'Explorar',explore:[{id:'instituciones',label:'Instituciones',href:'/instituciones',alert:'',visible:true},{id:'carreras',label:'Carreras',href:'/carreras',alert:'',visible:true},{id:'servicios',label:'Servicios',href:'/servicios',alert:'',visible:true},{id:'faq',label:'Preguntas frecuentes',href:'',alert:'Preguntas frecuentes',visible:true},{id:'docentes',label:'Cursos docentes',href:'/cursos-docentes',alert:'',visible:true},{id:'proximo',label:'Lo Próximo',href:'/nosotros',alert:'',visible:true},{id:'nosotros',label:'Quiénes somos',href:'/nosotros',alert:'',visible:true}],contactTitle:'Contacto',address:'Cristóbal Colón 601, Concepción, Tucumán',mapsHref:'https://www.google.com/maps/search/?api=1&query=Crist%C3%B3bal%20Col%C3%B3n%20601%2C%20Concepci%C3%B3n%2C%20Tucum%C3%A1n',phone:'3865 751273',whatsappHref:'https://wa.me/5493865751273',appTitle:'Descargá la app',androidLabel:'Google Play',androidNote:'DISPONIBLE PRÓXIMAMENTE EN',androidHref:'',iosLabel:'App Store',iosNote:'DESCARGAR PRÓXIMAMENTE EN',iosHref:'',socialTitle:'Seguinos en redes',social:[{id:'facebook',label:'Facebook',href:'',visible:true},{id:'instagram',label:'Instagram',href:'',visible:true},{id:'youtube',label:'YouTube',href:'',visible:true},{id:'tiktok',label:'TikTok',href:'',visible:true}],whatsappLabel:'WhatsApp',copyright:'Copyright © 2026 Guía Educativa Tucumán. Todos los derechos reservados.',homeLabel:'Volver al inicio'};
