import {editorialCatalog} from '../admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../catalog/versioned-public-catalog.mjs';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function publicIntegrationCatalog() {
  return editorialCatalog(getVersionedPublicCatalogEntries(), {includeLegacy:false});
}

export function validateIntegrationMap(mapping, catalog = publicIntegrationCatalog()) {
  const issues = [];
  const institutions = new Map(catalog.institutions.map(row => [row.id, row]));
  const offerings = new Map(catalog.offerings.map(row => [row.id, row]));
  const venueIds = new Map();
  const programIds = new Map();
  const venues = mapping?.venues ?? {};
  const programs = mapping?.offerings ?? {};
  for (const [publicId, row] of Object.entries(venues)) {
    if (!institutions.has(publicId)) issues.push(`Sede pública inexistente: ${publicId}`);
    if (!uuid.test(row?.institutionId ?? '')) issues.push(`UUID institucional inválido: ${publicId}`);
    if (venueIds.has(row?.institutionId)) issues.push(`UUID institucional compartido por sedes: ${venueIds.get(row.institutionId)}, ${publicId}`);
    venueIds.set(row?.institutionId, publicId);
  }
  for (const [publicId, row] of Object.entries(programs)) {
    const offering = offerings.get(publicId);
    if (!offering) issues.push(`Oferta pública inexistente: ${publicId}`);
    if (!uuid.test(row?.programId ?? '')) issues.push(`UUID de programa inválido: ${publicId}`);
    if (!offering || !venues[offering.institutionId] || row.institutionId !== venues[offering.institutionId].institutionId) issues.push(`Tenant no coincide o sede sin vincular: ${publicId}`);
    const key = `${row?.institutionId}:${row?.programId}`;
    if (programIds.has(key) && programIds.get(key) !== offering?.careerId) issues.push(`Programa asignado a carreras distintas: ${publicId}`);
    programIds.set(key, offering?.careerId);
  }
  return {
    valid: issues.length === 0,
    issues,
    counts: {cities:catalog.cities.length, venues:catalog.institutions.length, careers:catalog.careers.length, offerings:catalog.offerings.length},
    unmappedVenues:catalog.institutions.filter(row => !venues[row.id]).map(row => ({id:row.id, city:row.citySlug, slug:row.slug})),
    unmappedOfferings:catalog.offerings.filter(row => !programs[row.id]).map(row => ({id:row.id, institutionId:row.institutionId, careerId:row.careerId})),
  };
}
