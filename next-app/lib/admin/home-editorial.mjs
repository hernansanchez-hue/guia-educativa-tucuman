import { isSafeContentLink, validateDraftPayload } from './content-document.mjs';
import { SITE_DESCRIPTION, SITE_NAME } from '../seo/public-metadata.js';

// Exact content of the approved HomeMapClient, not a new page template.
export const HOME_CONTENT = Object.freeze({
  id: 'home', name: 'Home',
  logo: '/assets/get-logo-hero-white.png', logoAlt: 'GET — Guía Educativa Tucumán',
  video: 'https://res.cloudinary.com/disj9fs8m/video/upload/q_auto/v1782350401/get/hero/v2l8k0maxocxnxf0yerh.mp4',
  videoVisible: true,
  titleBefore: 'Toda la oferta educativa de', titleHighlight: 'Tucumán', titleAfter: 'en un solo lugar',
  searchPlaceholder: 'Buscar ciudad, institución o carrera...',
  provinceName: 'Tucumán', departmentLabel: 'DEPARTAMENTO', provinceLabel: 'PROVINCIA',
  institutionsLabel: 'Instituciones', careersLabel: 'Carreras',
  comingText: 'Próximamente en GET', selectCityLabel: 'Elegí una ciudad', cityAvailableLabel: 'Ciudad disponible',
  cityLinkLabel: 'Ver',
  hint: 'Seleccioná un departamento para conocer las ciudades, instituciones y carreras disponibles.',
});

export function seedHomeEntry() {
  return { moduleId: 'home', key: 'main', payload: {
    _kind: 'home', data: structuredClone(HOME_CONTENT),
    seo: { title: SITE_NAME, description: SITE_DESCRIPTION },
  } };
}

export function homeContentFromEntries(entries = []) {
  const entry = entries.findLast(e => e.moduleId === 'home' && e.key === 'main');
  if (entry && (entry.visibility === 'hidden' || !entry.payload)) throw new Error('La Home necesita una publicación activa.');
  const payload = entry?.payload || seedHomeEntry().payload;
  validateHomePayload(payload);
  return { ...structuredClone(payload.data), ...(payload.design ? { cmsDesign: payload.design } : {}), cmsSeo: payload.seo || {} };
}

export function validateHomePayload(input) {
  const payload = validateDraftPayload(input), d = payload.data;
  if (payload._kind !== 'home' || !d || d.id !== 'home' || d.name !== 'Home') throw new Error('La identidad de Home no puede cambiar.');
  const keys = new Set(Object.keys(HOME_CONTENT));
  if (Object.keys(d).some(key => !keys.has(key))) throw new Error('Campo no soportado por la Home actual.');
  for (const [key, original] of Object.entries(HOME_CONTENT)) {
    if (typeof d[key] !== typeof original) throw new Error('Completá los contenidos de Home.');
    if (typeof original === 'string' && (!d[key].trim() || d[key].length > (['logo','video'].includes(key) ? 2048 : key === 'hint' ? 250 : 120))) throw new Error('Revisá la longitud de los textos de Home.');
  }
  for (const key of ['logo', 'video']) if (!isSafeContentLink(d[key]) || /^\/admin(?:\/|$)/.test(d[key])) throw new Error('Usá un recurso público seguro.');
  if (payload.design) {
    const x = payload.design;
    if (Object.keys(x).some(key => !['titleSize','color','align','logoSize','overlay'].includes(key))) throw new Error('Ajuste de diseño no soportado.');
    if (x.titleSize != null && (!Number.isFinite(x.titleSize) || x.titleSize < 32 || x.titleSize > 60)) throw new Error('El título admite entre 32 y 60 px.');
    if (x.logoSize != null && (!Number.isFinite(x.logoSize) || x.logoSize < 120 || x.logoSize > 200)) throw new Error('El logo admite entre 120 y 200 px.');
    if (x.overlay != null && (!Number.isFinite(x.overlay) || x.overlay < 0.6 || x.overlay > 0.94)) throw new Error('El overlay debe conservar buena legibilidad.');
    if (x.color != null && !/^#[0-9a-f]{6}$/i.test(x.color)) throw new Error('Color no válido.');
    if (x.align != null && !['left','center'].includes(x.align)) throw new Error('Alineación no válida.');
  }
  if (payload.seo) {
    if (Object.keys(payload.seo).some(key => !['title','description','ogTitle','ogDescription','image','noindex'].includes(key))) throw new Error('Campo SEO no soportado.');
    for (const key of ['title','description','ogTitle','ogDescription','image']) if (payload.seo[key] != null && typeof payload.seo[key] !== 'string') throw new Error('Revisá los textos SEO.');
    if (payload.seo.noindex != null && typeof payload.seo.noindex !== 'boolean') throw new Error('Revisá la indexación.');
    if (payload.seo.image && (!isSafeContentLink(payload.seo.image) || /^\/admin(?:\/|$)/.test(payload.seo.image))) throw new Error('Imagen SEO no válida.');
  }
  return payload;
}

export function homeTitleStyle(design) {
  if (!design) return undefined;
  return {
    ...(design.titleSize ? { fontSize: `clamp(28px, 3.5vw, ${design.titleSize}px)` } : {}),
    ...(design.color ? { color: design.color } : {}),
    ...(design.align ? { textAlign: design.align } : {}),
  };
}
