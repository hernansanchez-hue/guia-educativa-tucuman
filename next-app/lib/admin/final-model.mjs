import {validateDraftPayload,isSafeContentLink} from './content-document.mjs';
export const FINAL_ROUTES={design:'diseno',seo:'seo',users:'usuarios',history:'historial',settings:'configuracion'};
export const DESIGN_FIELDS=[
 ['primary','Azul institucional','color',null,null,'#0d1b3d'],['accent','Dorado institucional','color',null,null,'#c9971a'],
 ['text','Texto principal','color',null,null,'#172033'],['muted','Texto secundario','color',null,null,'#667085'],
 ['font','Tipografía existente','select',['Poppins','Geist','Arial'],null,'Poppins'],
 ['bodySize','Texto de contenido (px)','number',14,20,16],['headingSize','Título principal máximo (px)','number',32,80,48],
 ['radius','Bordes de controles (px)','number',4,24,8],
 ['shadow','Sombra del sistema','select',['suave','actual','sin'],null,'actual'],
 ['button','Padding de botones de contenido','select',['compacto','actual','amplio'],null,'actual'],
 ['spacing','Separación de bloques de contenido','select',['compacto','actual','amplio'],null,'actual']
];
export const SETTINGS_DEFAULTS={siteName:'Guía Educativa Tucumán',description:'Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.',ogImage:'',favicon:''};
export function validateFinalPayload(ownerModule,payload){
 const p=validateDraftPayload(payload);
 if(!['design','settings'].includes(ownerModule)||Object.keys(p).some(k=>k!=='data')||!p.data||typeof p.data!=='object'||Array.isArray(p.data))throw Error('Configuración no válida.');
 if(ownerModule==='design'){
  for(const [key,value] of Object.entries(p.data)){const f=DESIGN_FIELDS.find(f=>f[0]===key);if(!f)throw Error('Control de diseño no soportado.');
   if(f[2]==='color'&&!/^#[0-9a-f]{6}$/i.test(value))throw Error('Color no válido.');
   if(f[2]==='number'&&(!Number.isFinite(value)||value<f[3]||value>f[4]))throw Error('Tamaño fuera del rango seguro.');
   if(f[2]==='select'&&!f[3].includes(value))throw Error('Opción de diseño no soportada.');
  }
 }else{
  if(Object.keys(p.data).some(k=>!Object.hasOwn(SETTINGS_DEFAULTS,k))||typeof p.data.siteName!=='string'||!p.data.siteName.trim()||p.data.siteName.length>120||typeof p.data.description!=='string'||p.data.description.length>500)throw Error('Revisá el nombre y la descripción del sitio.');
  for(const key of ['ogImage','favicon'])if(typeof p.data[key]!=='string'||p.data[key]&&!isSafeContentLink(p.data[key]))throw Error('Recurso de configuración no válido.');
  if(p.data.favicon&&!/\.(?:png|ico|webp)(?:\?.*)?$/i.test(p.data.favicon))throw Error('Usá un favicon PNG, ICO o WebP existente.');
 }return p;
}
export function designVariables(input={}){
 const d=validateFinalPayload('design',{data:input}).data,v={};
 const map={primary:'--azul',accent:'--verde',text:'--texto',muted:'--muted',radius:'--radio'};
 for(const [k,token]of Object.entries(map))if(d[k]!=null)v[token]=k==='radius'?d[k]+'px':d[k];
 if(d.accent)v['--amarillo']=d.accent;
 if(d.font)v['--cms-font']=d.font+', Arial, sans-serif';
 if(d.bodySize)v['--cms-body-size']=d.bodySize+'px';
 if(d.headingSize)v['--cms-heading-size']='clamp(28px, 4vw, '+d.headingSize+'px)';
 if(d.shadow)v['--sombra']=({suave:'0 8px 24px rgba(15,23,42,.08)',actual:'0 16px 36px rgba(15,23,42,.13)',sin:'none'})[d.shadow];
 if(d.button&&d.button!=='actual')v['--cms-button-padding']=d.button==='compacto'?'8px 16px':'14px 24px';
 if(d.spacing&&d.spacing!=='actual')v['--cms-block-gap']=d.spacing==='compacto'?'clamp(20px,3vw,36px)':'clamp(36px,6vw,72px)';
 return v;
}
export function localRoute(value){return typeof value==='string'&&value.length<=512&&/^\/(?:[a-z0-9-]+\/)*[a-z0-9-]+$/.test(value)&&!/^\/(?:admin|api|media|docs)(?:\/|$)/.test(value);}
export function validateSeo(seo={}){
 validateDraftPayload({seo});
 if(!seo||Array.isArray(seo)||typeof seo!=='object'||Object.keys(seo).some(k=>!['title','description','ogTitle','ogDescription','image','noindex','canonical'].includes(k)))throw Error('SEO no válido.');
 for(const key of ['title','description','ogTitle','ogDescription','image','canonical'])if(seo[key]!=null&&(typeof seo[key]!=='string'||seo[key].length>1000))throw Error('Revisá los textos SEO.');
 if(seo.image&&!isSafeContentLink(seo.image))throw Error('Imagen SEO no válida.');
 if(seo.canonical&&!localRoute(seo.canonical)&&seo.canonical!=='/')throw Error('Canonical debe ser una ruta pública local.');
 if(seo.noindex!=null&&typeof seo.noindex!=='boolean')throw Error('Indexación no válida.');return seo;
}
export function diffValues(before,after,path=''){
 const rows=[];const keys=new Set([...Object.keys(before||{}),...Object.keys(after||{})]);
 for(const k of keys){const p=path?path+'.'+k:k,a=before?.[k],b=after?.[k];if(JSON.stringify(a)===JSON.stringify(b))continue;
  if(a&&b&&!Array.isArray(a)&&!Array.isArray(b)&&typeof a==='object'&&typeof b==='object')rows.push(...diffValues(a,b,p));else rows.push({path:p,before:a,after:b});
 }return rows;
}
export function editorHref(doc){const kind=doc.draft?._kind,ownerModule=doc.module_id||doc.moduleId;
 if(FINAL_ROUTES[ownerModule])return '/admin/'+FINAL_ROUTES[ownerModule];
 if(ownerModule==='home')return '/admin/home';
 if(['about','orientation','navigation','footer'].includes(ownerModule))return '/admin/'+({about:'nosotros',orientation:'orientacion-vocacional',navigation:'menus',footer:'footer'})[ownerModule];
 const route=({cities:'ciudades',institutions:'instituciones',careers:'carreras',events:'eventos',services:'servicios',trainings:'capacitaciones'})[ownerModule];
 if(!route)return null;return '/admin/'+route+'/'+(['events-page','services-page'].includes(kind)?'pagina':doc.id);
}
export const ACTION_LABELS={IMPORT:'Importación inicial',CREATE:'Creación',UPDATE_DRAFT:'Borrador guardado',PUBLISH:'Publicado',RESTORE:'Restaurado como borrador',ARCHIVE:'Archivado',UNPUBLISH:'Publicación retirada',MANAGE_PROFILE:'Usuario actualizado',INVITE_USER:'Usuario invitado',MANAGE_MEDIA:'Multimedia',MANAGE_REDIRECT:'Redirección',LOGIN:'Inicio de sesión',LOGOUT:'Cierre de sesión',BOOTSTRAP:'Activación inicial'};
