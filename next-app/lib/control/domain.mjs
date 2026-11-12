import {
  editorialCatalog,
  cityPageFromCatalog,
  validateEditorialPayload,
} from '../admin/editorial-model.mjs';
import { validateCitySlides, seedCitySlides, citySlideOptions } from '../admin/city-slider.mjs';
import { institutionProfileTier } from '../catalog/commercial-policy.mjs';
import { selectedProfileCareers } from '../catalog/profile-presentation.mjs';
import { validateDraftPayload, isSafeContentLink } from '../admin/content-document.mjs';
import { CREATED, expandedBase, seeds, patchOnly, validateCreation, assertRemovable, epoch, editorialSlug, changeCreationCity } from './creation.mjs';
import {isControlExtended, extendedFieldNames, validateExtendedPatch, validateControlExtendedPublication} from './extended.mjs';

export const roles = ['ADMINISTRADOR', 'EDITOR', 'LECTOR'];
export function permit(actor, op) {
  if (!actor?.id || !actor.active || !roles.includes(actor.role))
    throw Error('Acceso no habilitado.');
  if (
    op === 'read' ||
    (op === 'save' && actor.role !== 'LECTOR') ||
    (op === 'discard' && actor.role !== 'LECTOR') ||
    (op === 'media' && actor.role !== 'LECTOR') ||
    (['publish', 'restore', 'users'].includes(op) && actor.role === 'ADMINISTRADOR')
  )
    return;
  throw Error('No tenés permiso para esta acción.');
}
// Only these properties can be proposed from the browser. Commercial plan, IDs, slugs,
// identity relationships and legacy presentation snapshots are deliberately not writable.
export const fields = {
  ...extendedFieldNames,
  career: {name:'Nombre de la carrera',description:'Descripción general',studyPlan:'Plan de estudios',requirements:'Requisitos',workField:'Salida laboral',graduateProfile:'Perfil del egresado',faq:'Preguntas frecuentes',seo:'SEO'},
  brand: {
    name: 'Nombre institucional',
    description: 'Descripción institucional',
    logoUrl: 'Logo institucional',
  },
  institution: {
    campusName: 'Nombre público de la sede',
    additionalInfo: 'Información adicional de la sede',
    description: 'Presentación de esta sede',
    type: 'Tipo de institución',
    image: 'Portada',
    logoUrl: 'Logo de la sede',
    address: 'Dirección',
    phone: 'Teléfono',
    whatsapp: 'WhatsApp',
    email: 'Correo',
    website: 'Sitio web',
    openingHours: 'Horarios',
    modalities: 'Modalidades',
    socialLinks: 'Redes sociales',
    gallery: 'Galería',
    visible: 'Publicación',
    featuredCareerIds: 'Carreras destacadas',
    seo: 'SEO',
  },
  offering: {
    name: 'Nombre en esta sede',
    degree: 'Título otorgado',
    description: 'Descripción breve',
    fullDescription: '¿De qué se trata?',
    duration: 'Duración',
    modality: 'Modalidad',
    titleType: 'Tipo de título',
    image: 'Imagen principal',
    gallery: 'Galería',
    video: 'Video institucional',
    studyPlan: 'Plan de estudios',
    studyPlanPdf: 'PDF del plan',
    requirements: 'Requisitos de ingreso',
    learning: 'Qué vas a aprender',
    workField: 'Salida laboral',
    graduateProfile: 'Perfil del egresado',
    additionalInfo: 'Información adicional',
    faq: 'Preguntas frecuentes',
    whatsapp: 'WhatsApp',
    enrollmentUrl: 'Enlace de inscripción',
    infoLabel: 'Botón de información',
    consultLabel: 'Botón de consulta',
    pdfLabel: 'Botón del plan',
    visible: 'Publicación',
    seo: 'SEO',
  },
  city: { slides: 'Slider de la ciudad', placements: 'Instituciones destacadas' },
};
export const localFields = [
  'name',
  'description',
  'studyPlan',
  'studyPlanPdf',
  'requirements',
  'workField',
  'graduateProfile',
  'faq',
  'fullDescription',
  'learning',
  'additionalInfo',
];
export const clone = (v) => structuredClone(v);
export function applyPatch(entry, patch) {
  if (!patch || !Object.keys(patch).length) return entry;
  const item = clone(entry),
    d = item.payload.data,
    kind = item.payload._kind;
  for (const [key, value] of Object.entries(patch)) {
    if (key === CREATED) continue;
    if (key === 'seo') {
      item.payload.seo = { ...item.payload.seo, ...value };
      continue;
    }
    if (kind === 'institution' && ['description', 'logoUrl'].includes(key)) {
      d.controlVenue = { ...d.controlVenue, [key]: value };
      continue;
    }
    if (kind === 'offering' && localFields.includes(key)) {
      d.controlCareer = { ...d.controlCareer, [key]: value };
      if (key === 'studyPlanPdf') d.studyPlanPdf = value;
      continue;
    }
    if (kind === 'institution' && key === 'gallery') d.verifiedGallery = value;
    if (kind === 'institution' && key === 'image') d.imageVerified = !!value;
    if (
      kind === 'institution' &&
      ['phone', 'email', 'website', 'socialLinks', 'modalities','additionalInfo'].includes(key)
    )
      d.controlContact = { ...d.controlContact, [key]: value };
    if (kind === 'offering' && ['video', 'gallery'].includes(key))
      d.controlMedia = { ...d.controlMedia, [key]: value };
    if (key === 'placements') {
      d.controlPlacements = value;
      continue;
    }
    d[key] = value;
  }
  return item;
}
export function project(base, rows, includeNewDrafts=false) {
  const by = new Map(rows.map((r) => [r.key, r.published]));
  return expandedBase(base, rows, includeNewDrafts).map((e) => applyPatch(e, by.get(e.key)));
}
export function currentCity(entries, id) {
  return cityPageFromCatalog(editorialCatalog(entries, { includeLegacy: false }), id);
}
export function placements(city) {
  return (
    city.controlPlacements ?? city.featuredInstitutions.map((i) => ({ id: i.id, active: true }))
  );
}
export function effectiveFields(entry, entries) {
  const d = entry.payload.data,
    kind = entry.payload._kind,
    all = editorialCatalog(entries, { includeLegacy: false });
  if(isControlExtended(entry))return {...d,seo:entry.payload.seo||{}};
  if (kind === 'city') {
    const city = currentCity(entries, d.slug);
    return { slides: d.slides ?? seedCitySlides(city), placements: placements(city) };
  }
  if (kind === 'institution') {
    const brand =
      entries.find((e) => e.payload._kind === 'brand' && e.payload.data.id === d.brandId)?.payload
        .data || {};
    const venue = all.institutions.find((i) => i.id === d.id);
    return {
      ...brand,
      ...d,
      ...d.controlVenue,
      gallery: (d.verifiedGallery || []).map((x) => (typeof x === 'string' ? x : x.url)),
      campusName: d.campusName || venue?.name || brand.name,
      description: d.controlVenue?.description ?? venue?.description ?? brand.description,
      logoUrl: d.controlVenue?.logoUrl ?? venue?.logoUrl ?? brand.logoUrl,
      visible: d.visible !== false,
      seo: entry.payload.seo || {},
      featuredCareerIds:
        d.featuredCareerIds ??
        selectedProfileCareers({
          ...d,
          careers: all.offerings
            .filter((o) => o.institutionId === d.id)
            .map((o) => ({ ...o, id: o.careerId, offeringId: o.id })),
        }).map((c) => c.offeringId),
    };
  }
  if (kind === 'offering') {
    const master = all.careers.find((c) => c.id === d.careerId) || {};
    return {
      ...master,
      ...d,
      ...d.controlCareer,
      visible: d.visible !== false,
      seo: entry.payload.seo || {},
    };
  }
  return kind==='career'?{...d,seo:entry.payload.seo||{}}:d;
}
const assert = (ok, msg) => {
  if (!ok) throw Error(msg);
};
const str = (v, max = 5000) => typeof v === 'string' && v.length <= max;
const list = (v, max) => Array.isArray(v) && v.length <= max;
const unique = (a) => new Set(a).size === a.length;
function link(value) {
  if (!value) return true;
  if (!isSafeContentLink(value)) return false;
  try {
    const p = decodeURIComponent(new URL(value, 'https://get.invalid').pathname);
    return (
      !/[\\\s]/.test(p) &&
      !/^\/(?:administrador|admin|api|_next)(?:\/|$)/i.test(p) &&
      !p.startsWith('//')
    );
  } catch {
    return false;
  }
}
const mediaLink = (v) => str(v, 2000) && link(v);
const mediaKey = (v) => /^\/media\/control\/[a-f\d-]{36}\.(?:png|jpg|webp|pdf)$/.test(v);
export function referencedMedia(value, out = new Set()) {
  if (typeof value === 'string' && mediaKey(value)) out.add(value.split('/').pop());
  else if (Array.isArray(value)) value.forEach((x) => referencedMedia(x, out));
  else if (value && typeof value === 'object')
    Object.values(value).forEach((x) => referencedMedia(x, out));
  return out;
}
export function validatePatch(entry, input, published) {
  if(isControlExtended(entry))return validateExtendedPatch(entry,input,published);
  const patch = validateDraftPayload(input),
    kind = entry.payload._kind,
    d = entry.payload.data;
  for (const k of ['gallery', 'requirements', 'socialLinks', 'modalities'])
    if (Array.isArray(patch[k])) patch[k] = patch[k].filter((v) => v !== '');
  const keys = Object.keys(fields[kind] || {});
  assert(
    keys.length && Object.keys(patch).every((k) => keys.includes(k)),
    'El campo no pertenece a este editor.',
  );
  const get = (k, id) =>
    published.find((e) => e.payload._kind === k && e.payload.data.id === id)?.payload.data;
  const institution = kind === 'offering' ? get('institution', d.institutionId) : d;
  const isPaid = institutionProfileTier(institution) === 'paid';
  for (const [k, v] of Object.entries(patch)) {
    if (k === 'visible') {
      assert(typeof v === 'boolean', 'Estado no válido.');
      continue;
    }
    if (k === 'placements') {
      assert(
        list(v, 200) &&
          unique(v.map((x) => x.id)) &&
          v.every(
            (x) =>
              x &&
              Object.keys(x).every((a) => ['id', 'active', 'image', 'description', 'displayName'].includes(a)) &&
              get('institution', x.id)?.cityId === d.id &&
              typeof x.active === 'boolean' &&
              (x.displayName === undefined || str(x.displayName,150)) &&
              (!x.image || mediaLink(x.image)) &&
              (!x.description || str(x.description)),
          ),
        'Seleccioná sedes únicas de esta ciudad.',
      );
      continue;
    }
    if (k === 'slides') {
      validateCitySlides(v, { complete: true });
      const city = currentCity(published, d.slug),
        allowed = citySlideOptions(city);
      assert(
        v.every(
          (x) =>
            allowed.some(
              (y) =>
                y.institutionId === x.institutionId &&
                y.careerId === x.careerId &&
                y.href === x.href,
            ) && link(x.image),
        ),
        'Cada slide debe apuntar a una oferta habilitada de esta ciudad.',
      );
      continue;
    }
    if (k === 'featuredCareerIds') {
      const offers = published
        .filter(
          (e) =>
            e.payload._kind === 'offering' &&
            e.payload.data.institutionId === d.id &&
            e.payload.data.visible !== false,
        )
        .map((e) => e.payload.data);
      assert(
        list(v, isPaid ? 5 : 0) &&
          unique(v) &&
          v.every((id) => offers.some((o) => id === o.id || id === o.careerId)),
        'Solo se pueden destacar hasta cinco ofertas propias de una institución paga.',
      );
      assert(
        unique(v.map((id) => offers.find((o) => o.id === id || o.careerId === id)?.careerId)),
        'Hay dos variantes de la misma carrera seleccionadas.',
      );
      continue;
    }
    if (k === 'seo') {
      assert(
        v &&
          typeof v === 'object' &&
          !Array.isArray(v) &&
          Object.keys(v).every(
            (n) => ['title', 'description', 'image', 'canonical'].includes(n) && str(v[n], 1800),
          ) &&
          mediaLink(v.image || '') &&
          (!v.canonical || (/^\/(?!\/)/.test(v.canonical) && link(v.canonical))),
        'Revisá el SEO y la ruta canonical.',
      );
      continue;
    }
    if (['image', 'logoUrl', 'video', 'website', 'studyPlanPdf', 'enrollmentUrl'].includes(k)) {
      assert(
        mediaLink(v) && (!v || k !== 'studyPlanPdf' || /\.pdf(?:[?#]|$)/i.test(v)),
        'Usá una URL HTTPS o un recurso público válido.',
      );
    } else if (['requirements', 'modalities', 'socialLinks', 'gallery'].includes(k)) {
      assert(
        list(v, 80) &&
          v.every((x) => str(x, 1500) && (!['gallery', 'socialLinks'].includes(k) || mediaLink(x))),
        'Revisá el listado.',
      );
    } else if (k === 'studyPlan') {
      assert(
        list(v, 30) &&
          v.every(
            (x) =>
              str(x, 5000) ||
              (x &&
                str(x.label, 200) &&
                list(x.subjects, 100) &&
                x.subjects.every((s) => str(s, 500))),
          ),
        'Revisá años y materias.',
      );
    } else if (k === 'faq') {
      assert(
        list(v, 50) && v.every((x) => x && str(x.question, 300) && str(x.answer, 2000)),
        'Revisá las preguntas y respuestas.',
      );
    } else assert(str(v, k.includes('escription') ? 12000 : 3000), 'Texto demasiado largo.');
    if (k === 'email' && v) assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Revisá el correo.');
    if (['whatsapp', 'enrollmentUrl'].includes(k) && v && !isPaid)
      throw Error('La ficha no tiene habilitado contacto directo.');
    if (['name', 'campusName', 'degree', 'type'].includes(k))
      assert(v.trim(), 'El nombre o título no puede quedar vacío.');
  }
  validateEditorialPayload(applyPatch(entry, patch).payload);
  return patch;
}
export function transition(actor, op, revision, record, value) {
  permit(actor, op);
  if (!Number.isSafeInteger(revision) || revision < 0 || revision !== (record?.revision || 0))
    throw Error('Otra persona modificó este registro. Recargá antes de continuar.');
  const before = { published: record?.published || {}, draft: record?.draft ?? null },
    next = { ...before, revision: revision + 1 };
  if (op === 'save' || op === 'restore') next.draft = value;
  else if (op === 'discard') {
    assert(before.draft !== null, 'No hay un borrador.');
    next.draft = null;
  } else if (op === 'publish') {
    assert(before.draft !== null, 'Guardá un borrador antes de publicar.');
    next.published = before.draft;
    next.draft = null;
  } else throw Error('Operación desconocida.');
  return next;
}

/** Validate using an immutable snapshot; the store compares the supplied catalog
 * revision again inside the write transaction for cross-document operations. */
export function prepareContentWrite(base, rows, actor, {key,op,revision,patch}) {
  permit(actor,op);
  const raw=expandedBase(base,rows,true);
  const entry=raw.find(e=>e.key===key),row=rows.find(r=>r.key===key);
  if((row?.revision||0)!==revision)throw Error('El contenido cambió. Volvé a abrir el editor.');
  // A second restore may bring back an identity whose creation was undone.
  // The store only accepts an existing publish event of this same key.
  if(!entry&&row&&op==='restore')return {value:null,removed:false,generation:epoch(rows)};
  if(!entry)throw Error('No existe el registro.');
  const published=project(base,rows),reserved=project(base,rows,true);
  const isAuxDraft=!published.some(e=>e.key===key)&&!row;
  if(isAuxDraft)throw Error('Publicá primero la institución con su sede inicial.');
  const oldBundle=seeds(row?.published),draftBundle=seeds(row?.draft),bundle=draftBundle.length?draftBundle:oldBundle;
  const removing=op==='publish'&&oldBundle.length&&!draftBundle.length;
  let value=null;
  if(op==='save'||op==='publish'){
    if(op==='publish'&&!row?.draft)throw Error('Guardá un borrador antes de publicar.');
    if(removing){
      assertRemovable(oldBundle,reserved,rows);
    }else{
      if(op==='publish'&&draftBundle.length){
        const own=new Set(draftBundle.map(e=>e.key));
        validateCreation(draftBundle,reserved.filter(e=>!own.has(e.key)),published.filter(e=>!own.has(e.key)));
      }
      let nextBundle=bundle,input=op==='save'?patch:patchOnly(row.draft);
      if(op==='save'&&input&&Object.hasOwn(input,'cityId')){
        if(entry.payload._kind!=='institution'||!draftBundle.length||oldBundle.length||row.hadPublication)
          throw Error('La ciudad solo se puede corregir antes de la primera publicación de la sede.');
        const {cityId,...other}=validateDraftPayload(input);
        input=other;nextBundle=changeCreationCity(draftBundle,key,cityId,published);
        const own=new Set(nextBundle.map(e=>e.key));
        validateCreation(nextBundle,reserved.filter(e=>!own.has(e.key)),published);
      }
      const changes=validatePatch(entry,input,published);
      if(op==='publish')validateControlExtendedPublication(applyPatch(entry,changes));
      if(['brand','career'].includes(entry.payload._kind)&&changes.name&&reserved.some(other=>
        other.key!==key&&other.payload._kind===entry.payload._kind&&editorialSlug(other.payload.data.name)===editorialSlug(changes.name)
      ))throw Error('Ya existe un registro con ese nombre.');
      value=nextBundle.length?{[CREATED]:nextBundle,...changes}:changes;
    }
  }
  return {value,removed:!!removing||op==='discard'&&!oldBundle.length&&!!draftBundle.length,
    generation:bundle.length||op==='publish'||(op==='save'&&patch?.name)?epoch(rows):undefined};
}
