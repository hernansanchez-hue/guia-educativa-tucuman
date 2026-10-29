import {publicIntegrationCatalog, validateIntegrationMap} from './catalog-map.mjs';

const validText = (value, min, max) => typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function resolvePublicInquiry(input, mapping, catalog = publicIntegrationCatalog()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {error:'Solicitud inválida', status:400};
  if (!validText(input.institutionId, 2, 160) || !validText(input.name, 2, 200) || !validText(input.phone, 3, 50) || !validText(input.email, 3, 320) || !emailPattern.test(input.email.trim()) || !validText(input.query ?? '', 0, 2000)) return {error:'Revisá los datos de contacto', status:400};
  if (input.offeringId != null && !validText(input.offeringId, 2, 180)) return {error:'Oferta inválida', status:400};
  const institution = catalog.institutions.find(row => row.id === input.institutionId);
  if (!institution) return {error:'Institución inexistente', status:404};
  if (institution.visible === false || institution.formEnabled === false) return {error:'Institución no habilitada', status:403};
  const offering = input.offeringId ? catalog.offerings.find(row => row.id === input.offeringId) : null;
  if (input.offeringId && (!offering || offering.institutionId !== institution.id || offering.visible === false || offering.formEnabled === false)) return {error:'Oferta no habilitada para esta institución', status:422};
  const report = validateIntegrationMap(mapping, catalog);
  if (!report.valid) return {error:'Mapeo CRM inválido', status:503};
  const venue = mapping.venues?.[institution.id];
  const program = offering ? mapping.offerings?.[offering.id] : null;
  if (!venue || (offering && !program)) return {error:'Institución u oferta pendiente de vinculación', status:503};
  return {value:{institutionId:venue.institutionId, programId:program?.programId ?? null, publicInstitutionId:institution.id, publicOfferingId:offering?.id ?? null, name:input.name.trim(), phone:input.phone.trim(), email:input.email.trim(), query:(input.query ?? '').trim(), origin:'website', receivedAt:new Date().toISOString()}};
}
