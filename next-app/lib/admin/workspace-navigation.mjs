import {canAdmin} from './permissions.mjs';

export const CONTENT_LINKS = Object.freeze([
  ['Home','home','grid'], ['Ciudades','ciudades','city'],
  ['Instituciones','instituciones','building'], ['Carreras','carreras','book'],
  ['Capacitaciones','capacitaciones','book'], ['Eventos','eventos','clock'],
  ['Servicios','servicios','grid'], ['Orientación Vocacional','orientacion-vocacional','book'],
  ['Nosotros','nosotros','building'],
]);

export const ADVANCED_LINKS = Object.freeze([
  {label:'Navegación',route:'menus',action:'edit',description:'Enlaces del menú y buscador compartido.'},
  {label:'Footer',route:'footer',action:'edit',description:'Logo, contactos, redes y enlaces del pie de página.'},
  {label:'Diseño global',route:'diseno',action:'design',description:'Colores y opciones visuales seguras del sitio.'},
  {label:'SEO',route:'seo',action:'seo',description:'Cómo aparecen las páginas en buscadores y al compartirlas.'},
  {label:'Configuración general',route:'configuracion',action:'settings',description:'Nombre del sitio, descripción e imagen predeterminada.'},
  {label:'Biblioteca de banners',route:'banners',action:'settings',description:'Acceso avanzado a portadas. Los sliders se editan dentro de cada ciudad.'},
]);

export function workspaceNavigation(actor) {
  return [
    {label:'Inicio',links:[['Panel','','grid']]},
    {label:'Contenido',links:CONTENT_LINKS},
    {label:'Recursos',links:[['Multimedia','multimedia','grid']]},
    {label:'Administración',links:[
      ...(canAdmin(actor,'users')?[['Usuarios','usuarios','building']]:[]),
      ['Historial','historial','clock'], ['Ajustes avanzados','ajustes','settings'],
    ]},
  ];
}

export function advancedLinks(actor) { return ADVANCED_LINKS.filter(link=>canAdmin(actor,link.action)); }
export const hiddenModules = Object.freeze(['teacher-courses','contact','forms','legal']);
