import {
  editorialCatalog,
  cityPageFromCatalog,
  careerPageFromCatalog,
  institutionPageFromCatalog,
} from '../admin/editorial-model.mjs';
import { institutionDesignPage } from '../catalog/institution-design.mjs';
import { citySlideOptions } from '../admin/city-slider.mjs';
import { institutionProfileTier } from '../catalog/commercial-policy.mjs';
import { selectedProfileCareers } from '../catalog/profile-presentation.mjs';
import {patchOnly,unpublishedKeys,seeds,changeCreationCity} from './creation.mjs';
import {isControlExtended,extendedPreview} from './extended.mjs';
import {
  fields,
  effectiveFields,
  applyPatch,
  project,
  placements,
  validatePatch,
} from './domain.mjs';

export function assemble(base, records) {
  const entries = project(base, records,true),
    catalog = editorialCatalog(entries, { includeLegacy: false }),
    by = new Map(records.map((r) => [r.key, r]));
  const unpublished=unpublishedKeys(records);
  const cities = catalog.cities.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
  const citiesBy = new Map(cities.map((c) => [c.id, c]));
  const brands = new Map(catalog.brands.map((b) => [b.id, b]));
  const masters = new Map(catalog.careers.map((c) => [c.id, c]));
  const selected = new Map(
    cities.map((c) => [
      c.id,
      placements(cityPageFromCatalog(catalog, c.slug))
        .filter((p) => p.active)
        .map((p) => p.id),
    ]),
  );
  const venues = entries
    .filter((e) => e.payload._kind === 'institution')
    .map((e) => {
      const d = e.payload.data,
        c = citiesBy.get(d.cityId),
        brand = brands.get(d.brandId),
        key = e.key;
      return {
        key,
        id: d.id,
        unpublished: unpublished.has(key),
        brandId: d.brandId,
        cityId: d.cityId,
        city: c?.name || '',
        name: d.campusName || brand?.name || d.id,
        type: d.type,
        plan: d.plan || 'Sin clasificar',
        paid: institutionProfileTier(d) === 'paid',
        featured: selected.get(d.cityId)?.includes(d.id) || false,
        visible: !unpublished.has(key) && d.visible !== false,
        dirty: by.get(key)?.draft != null,
        url: '/' + c?.slug + '/' + d.slug,
      };
    });
  const instBy = new Map(venues.map((i) => [i.id, i]));
  const picked = new Map(
    catalog.institutions.map((i) => [
      i.id,
      new Set(
        selectedProfileCareers({
          ...i,
          careers: catalog.offerings
            .filter((o) => o.institutionId === i.id)
            .map((o) => ({ ...o, id: o.careerId, offeringId: o.id })),
        }).map((o) => o.offeringId),
      ),
    ]),
  );
  const offers = entries
    .filter((e) => e.payload._kind === 'offering')
    .map((e) => {
      const d = e.payload.data,
        i = instBy.get(d.institutionId),
        c = masters.get(d.careerId);
      return {
        key: e.key,
        id: d.id,
        unpublished: unpublished.has(e.key),
        careerId: d.careerId,
        institutionId: d.institutionId,
        cityId: i.cityId,
        name: d.controlCareer?.name || c?.name || d.degree,
        venue: i.name,
        city: i.city,
        visible: !unpublished.has(e.key) && i.visible && d.visible !== false,
        featured: picked.get(i.id)?.has(d.id) || false,
        modality: d.modality || '',
        dirty: by.get(e.key)?.draft != null,
        url: i.url + '/carreras/' + c.slug,
      };
    });
  const choices=kind=>entries.filter(e=>e.payload._kind===kind).map(e=>({key:e.key,id:e.payload.data.id,name:e.payload.data.name,slug:e.payload.data.slug,unpublished:unpublished.has(e.key)}));
  const editorial=entries.filter(isControlExtended).map(e=>({key:e.key,id:e.payload.data.id,kind:e.payload._kind,name:e.payload.data.name,city:e.payload.data.city||'',status:e.payload.data.status||'',unpublished:unpublished.has(e.key),visible:!unpublished.has(e.key)&&e.payload.data.visible!==false,dirty:by.get(e.key)?.draft!=null,url:e.payload._kind==='event'?'/eventos/'+e.payload.data.slug:e.payload._kind==='service'?'/servicios/'+e.payload.data.slug:e.moduleId==='events'?'/eventos':'/servicios'}));
  return { entries, catalog, by, cities, venues, offers,brands:choices('brand'),masters:choices('career'),editorial,unpublished };
}
export function makeEditor(work, key) {
  const entry = work.entries.find((e) => e.key === key),
    rec = work.by.get(key),
    kind = entry?.payload._kind;
  if(isControlExtended(entry)){
    const data=entry.payload.data,patch=patchOnly(rec?.draft??rec?.published??{}),summary=work.editorial.find(e=>e.key===key);
    return {key,kind,id:data.id,title:data.name,patch,revision:rec?.revision||0,dirty:rec?.draft!=null,
      unpublished:work.unpublished.has(key),restoringAbsence:!!(rec?.draft&&!seeds(rec.draft).length&&seeds(rec.published).length),
      values:{...data,visible:data.visible!==false,seo:entry.payload.seo||{},...patch},url:work.unpublished.has(key)?null:summary.url,
      cities:work.cities,institutionOptions:work.venues.filter(v=>v.visible).map(v=>({id:v.id,name:v.name+' · '+v.city})),
      previewSource:work.entries.filter(e=>isControlExtended(e)||['city','brand','institution'].includes(e.payload._kind))};
  }
  if (!['city', 'institution', 'brand', 'offering','career'].includes(kind))
    throw Error('Contenido no disponible.');
  const d = entry.payload.data,
    patch = patchOnly(rec?.draft ?? rec?.published ?? {}),
    baseData = effectiveFields(entry, work.entries);
  const v = work.venues.find((v) => v.id === (kind === 'offering' ? d.institutionId : d.id)),
    city = kind === 'city' ? cityPageFromCatalog(work.catalog, d.slug) : null;
  // Only published rows necessary to render this locality enter the private frame.
  const previewCity = city?.id ?? v?.cityId ?? work.venues.find((i) => i.brandId === d.id)?.cityId;
  const cityOptions=kind==='institution'&&work.unpublished.has(key)&&!rec?.hadPublication?work.cities:[];
  const venues = new Set(work.venues.filter((i) => i.cityId === previewCity).map((i) => i.id));
  const brandIds = new Set(work.venues.filter((i) => venues.has(i.id)).map((i) => i.brandId));
  const careerIds = new Set(
    work.offers.filter((o) => venues.has(o.institutionId)).map((o) => o.careerId),
  );
  const trainingIds = new Set(
    work.entries
      .filter(
        (e) => e.payload._kind === 'training-offering' && venues.has(e.payload.data.institutionId),
      )
      .map((e) => e.payload.data.trainingProgramId),
  );
  const previewSource = work.entries.filter((e) => {
    if(e.key===key)return true;
    const x = e.payload.data;
    switch (e.payload._kind) {
      case 'city':
        return x.id === previewCity;
      case 'brand':
        return brandIds.has(x.id);
      case 'institution':
        return venues.has(x.id);
      case 'career':
        return careerIds.has(x.id);
      case 'offering':
      case 'training-offering':
        return venues.has(x.institutionId);
      case 'training':
        return trainingIds.has(x.id);
      default:
        return false;
    }
  });
  if(cityOptions.length)for(const c of cityOptions){
    if(c.id!==previewCity)previewSource.push({key:c.slug,moduleId:'cities',visibility:'published',payload:{_kind:'city',data:{...c,institutionIds:[],featuredInstitutionIds:[]}}});
  }
  return {
    key,
    previewSource,
    cityOptions,
    kind,
    id: d.id,
    unpublished:work.unpublished.has(key),
    restoringAbsence:!!(rec?.draft && !seeds(rec.draft).length && seeds(rec.published).length),
    revision: rec?.revision || 0,
    dirty: rec?.draft != null,
    patch,
    values: { ...(cityOptions.length?{cityId:d.cityId}:{}),...Object.fromEntries(
      Object.keys(fields[kind]).map((k) => [
        k,
        k === 'seo' ? { ...baseData.seo, ...patch.seo } : (patch[k] ?? baseData[k] ?? null),
      ]),
    )},
    title: city?.name || (v && kind === 'institution' && v.name) || baseData.name || d.degree,
    url: work.unpublished.has(key)?null:kind==='career'
      ? (work.offers.some(o=>o.careerId===d.id&&o.visible)||work.catalog.brands.some(b=>b.generalOffers?.some(o=>o.careerId===d.id)&&work.venues.some(v=>v.brandId===b.id&&v.visible))?'/carreras/'+d.slug:null)
      :city
      ? '/' + city.slug
      : kind === 'offering'
        ? work.offers.find((o) => o.id === d.id)?.url
        : v?.url,
    paid: v?.paid || false,
    venue: v || null,
    brandKey: v && !work.unpublished.has('marca/'+v.brandId) ? 'marca/' + v.brandId : null,
    siblings: v ? work.venues.filter((i) => i.brandId === v.brandId) : [],
    offers: v ? work.offers.filter((o) => o.institutionId === v.id) : [],
    venues: city ? work.venues.filter((i) => i.cityId === d.id) : [],
    slideOptions: city ? citySlideOptions(city) : [],
  };
}
export function previewData(base, records, key, patch, view, focus, canMoveCity=false) {
  let original = base.find((e) => e.key === key);
  if (!original) throw Error('Contenido desconocido.');
  const entries = project(base, records);
  if(canMoveCity&&Object.hasOwn(patch,'cityId')){
    const {cityId,...changes}=patch;
    [original]=changeCreationCity([original],key,cityId,entries);patch=changes;
  }
  const changed = applyPatch(original, validatePatch(original, patch, entries));
  // Hidden drafts may be inspected here; the public reader never receives them.
  const preview = structuredClone(changed);
  preview.payload.data.visible = true;
  if(isControlExtended(preview))return extendedPreview(entries,preview);
  if(preview.payload._kind==='career')return {kind:'master',career:preview.payload.data};
  const catalog = editorialCatalog(
      entries.map((e) => (e.key === key ? preview : e)),
      { includeLegacy: false },
    ),
    d = preview.payload.data;
  if (preview.payload._kind === 'city') {
    const city = cityPageFromCatalog(catalog, d.slug);
    return {
      kind: view === 'placements' ? 'placements' : 'slider',
      city: { ...city, previewSlideId: focus },
      focus,
    };
  }
  const v = catalog.institutions.find(
    (i) => i.id === (preview.payload._kind === 'offering' ? d.institutionId : d.id),
  );
  if (preview.payload._kind === 'brand') {
    const i = catalog.institutions.find((x) => x.brandId === d.id);
    return i
      ? {
          kind: 'institution',
          props: institutionDesignPage(
            catalog,
            institutionPageFromCatalog(catalog, i.citySlug, i.slug),
          ),
        }
      : null;
  }
  if (!v) return null;
  if (preview.payload._kind === 'institution')
    return {
      kind: 'institution',
      props: institutionDesignPage(
        catalog,
        institutionPageFromCatalog(catalog, v.citySlug, v.slug),
      ),
    };
  const master = catalog.careers.find((m) => m.id === d.careerId);
  const page = careerPageFromCatalog(catalog, v.citySlug, v.slug, master.slug);
  // A modality variant shares the public slug; preview the selected offering, not the first by name.
  return {
    kind: 'career',
    paid: institutionProfileTier(v) === 'paid',
    props: { ...page, offering: d, career: { ...master, ...d.controlCareer } },
  };
}
