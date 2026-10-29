import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publicIntegrationCatalog } from '../lib/integration/catalog-map.mjs';

const root = resolve(import.meta.dirname, '../../docs/integration');
const read = name => JSON.parse(readFileSync(resolve(root, name), 'utf8'));
const save = (name, value) => writeFileSync(resolve(root, name), `${JSON.stringify(value, null, 2)}\n`);
const venues = read('venues.json');
const offerings = read('offerings.json');
const snapshot = read('crm-readonly-snapshot.json');
const schema = read('crm-schema-readonly-snapshot.json');
const catalog = publicIntegrationCatalog();
const issues = [];
const add = (type, id, detail) => issues.push({ type, id, detail });
const unique = (rows, key, type) => {
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row[key])) add(type, row[key], 'Identificador repetido');
    seen.add(row[key]);
  }
};
const validCode = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const venueById = new Map(venues.map(row => [row.publicVenueId, row]));
const catalogVenueById = new Map(catalog.institutions.map(row => [row.id, row]));
const catalogOfferingById = new Map(catalog.offerings.map(row => [row.id, row]));
const catalogCareerById = new Map(catalog.careers.map(row => [row.id, row]));
const catalogVenueIds = new Set(catalog.institutions.map(row => row.id));
const catalogOfferingIds = new Set(catalog.offerings.map(row => row.id));

unique(venues, 'publicVenueId', 'duplicate_public_venue_id');
unique(offerings, 'publicOfferingId', 'duplicate_public_offering_id');
if (schema.projectRef !== snapshot.projectRef) add('crm_snapshot_project_mismatch', 'crm', 'Datos y esquema apuntan a proyectos distintos');
if (!schema.tables['public.institutions']?.remotePresent || !schema.tables['public.programs']?.remotePresent) add('crm_core_schema_missing', 'crm', 'No se puede preparar importación sin instituciones y programas');
for (const row of venues) {
  if (!catalogVenueIds.has(row.publicVenueId)) add('stale_venue', row.publicVenueId, 'Ya no figura en el catálogo público');
  if (!row.institutionName || row.institutionName.trim().length < 2 || row.institutionName.trim().length > 160) add('invalid_institution_name', row.publicVenueId, 'Fuera del límite del CRM (2–160)');
  if (!row.city || !row.slug) add('insufficient_venue_data', row.publicVenueId, 'Falta ciudad o slug original');
  const current = catalogVenueById.get(row.publicVenueId);
  if (current && (current.name !== row.institutionName || current.slug !== row.slug || (current.address ?? null) !== row.address || current.citySlug !== row.cityId)) add('venue_content_changed', row.publicVenueId, 'Nombre, slug, dirección o ciudad ya no coincide con el catálogo');
}
for (const id of catalogVenueIds) if (!venueById.has(id)) add('missing_venue', id, 'Figura en catálogo pero no en inventario');
for (const row of offerings) {
  if (!catalogOfferingIds.has(row.publicOfferingId)) add('stale_offering', row.publicOfferingId, 'Ya no figura en el catálogo público');
  if (!venueById.has(row.publicVenueId)) add('offering_without_venue', row.publicOfferingId, row.publicVenueId);
  if (!catalog.careers.some(career => career.id === row.publicMasterCareerId)) add('offering_without_master', row.publicOfferingId, row.publicMasterCareerId);
  if (!row.masterName || row.masterName.trim().length < 2 || row.masterName.trim().length > 160) add('invalid_program_name', row.publicOfferingId, 'Fuera del límite del CRM (2–160)');
  if (row.citySlug !== venueById.get(row.publicVenueId)?.cityId) add('city_mismatch', row.publicOfferingId, 'Ciudad de oferta y sede no coincide');
  const current = catalogOfferingById.get(row.publicOfferingId);
  const master = catalogCareerById.get(row.publicMasterCareerId);
  if (current && (current.institutionId !== row.publicVenueId || current.careerId !== row.publicMasterCareerId || (current.modality ?? null) !== row.modality || (current.duration ?? null) !== row.duration || master?.name !== row.masterName)) add('offering_content_changed', row.publicOfferingId, 'Sede, carrera, modalidad, duración o nombre maestro ya no coincide');
}
for (const id of catalogOfferingIds) if (!offerings.some(row => row.publicOfferingId === id)) add('missing_offering', id, 'Figura en catálogo pero no en inventario');

const existingRealInstitutions = snapshot.institutions.filter(row => !row.qa);
const existingRealPrograms = snapshot.programs.filter(row => !snapshot.institutions.some(inst => inst.id === row.institutionId && inst.qa));
if (existingRealInstitutions.length || existingRealPrograms.length) add('snapshot_requires_reconciliation', 'crm', 'Hay registros reales: verificar equivalencias por identificador externo, nunca por nombre');
const proposedInstitutions = venues.map(row => ({
  publicVenueId: row.publicVenueId,
  crmLookupSlug: `get-public-${row.publicVenueId}`,
  name: row.institutionName,
  city: row.city,
  province: 'Tucumán',
  address: row.address,
  department: row.department,
  originalPublicSlug: row.slug,
  sourceKey: row.sourceKey,
  get_enabled: false,
  status: 'active',
  crmInstitutionId: null,
  action: 'create_after_approval',
}));
const crmSlugByVenue = new Map(proposedInstitutions.map(row => [row.publicVenueId, row.crmLookupSlug]));
const proposedPrograms = offerings.map(row => ({
  publicOfferingId: row.publicOfferingId,
  publicVenueId: row.publicVenueId,
  publicMasterCareerId: row.publicMasterCareerId,
  institutionLookupSlug: crmSlugByVenue.get(row.publicVenueId) ?? null,
  crmLookupCode: `get-public-${row.publicOfferingId}`,
  name: row.masterName,
  modalityFromPublic: row.modality,
  durationFromPublic: row.duration,
  status: 'active',
  crmInstitutionId: null,
  crmProgramId: null,
  action: 'create_after_approval',
}));
unique(proposedInstitutions, 'crmLookupSlug', 'duplicate_crm_slug');
unique(proposedPrograms, 'crmLookupCode', 'duplicate_crm_code');
for (const row of proposedInstitutions) if (!validCode(row.crmLookupSlug)) add('invalid_crm_slug', row.publicVenueId, row.crmLookupSlug);
for (const row of proposedPrograms) if (!validCode(row.crmLookupCode)) add('invalid_crm_code', row.publicOfferingId, row.crmLookupCode);
for (const row of proposedInstitutions) if (snapshot.institutions.some(existing => existing.slug === row.crmLookupSlug)) add('crm_slug_collision', row.publicVenueId, row.crmLookupSlug);
for (const row of proposedPrograms) if (snapshot.programs.some(existing => existing.code === row.crmLookupCode)) add('crm_code_collision', row.publicOfferingId, row.crmLookupCode);

const proposedInstitutionLinks = proposedInstitutions.map(row => ({
  source_code: 'get_public', public_institution_id: row.publicVenueId,
  institution_lookup_slug: row.crmLookupSlug, institution_id: null, active: true,
}));
const proposedOfferingLinks = proposedPrograms.map(row => ({
  source_code: 'get_public', public_offering_id: row.publicOfferingId,
  public_institution_id: row.publicVenueId,
  institution_lookup_slug: row.institutionLookupSlug,
  program_lookup_code: row.crmLookupCode,
  institution_id: null, program_id: null, active: true,
}));
for (const row of proposedOfferingLinks) {
  const expected = crmSlugByVenue.get(row.public_institution_id);
  if (expected !== row.institution_lookup_slug) add('cross_tenant_offering_link', row.public_offering_id, 'Clave institucional de oferta no corresponde a su sede');
}

const byPair = new Map();
for (const row of offerings) {
  const key = `${row.publicVenueId}:${row.publicMasterCareerId}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push({ publicOfferingId: row.publicOfferingId, modality: row.modality });
}
const sameVenueMasterPairs = [...byPair.values()].filter(rows => rows.length > 1);
const duplicateModalityPairs = sameVenueMasterPairs.filter(rows => new Set(rows.map(row => row.modality ?? 'not_specified')).size < rows.length);
for (const rows of duplicateModalityPairs) add('same_venue_master_modality_collision', rows.map(row => row.publicOfferingId).join(','), 'Requiere revisión antes de importar');
const qaNameTokens = ['institución qa', 'institucion qa'];
for (const row of proposedInstitutions) if (qaNameTokens.some(token => row.name.toLowerCase().includes(token))) add('qa_in_public_catalog', row.publicVenueId, row.name);

const report = {
  projectRef: snapshot.projectRef,
  sourceSnapshotDate: snapshot.snapshotDate,
  mode: 'offline_dry_run_no_remote_writes',
  schemaSnapshotDate: schema.observedDate,
  schema: {
    institutions: schema.tables['public.institutions'].remotePresent ? 'remote_present' : 'remote_absent',
    programs: schema.tables['public.programs'].remotePresent ? 'remote_present' : 'remote_absent',
    privateInstitutionLinks: schema.tables['private.public_catalog_institution_links'].remotePresent ? 'remote_present' : 'remote_absent_local_migration_only',
    privateOfferingLinks: schema.tables['private.public_catalog_offering_links'].remotePresent ? 'remote_present' : 'remote_absent_local_migration_only',
  },
  counts: { catalogCities: catalog.cities.length, catalogMasters: catalog.careers.length, inventoryVenues: venues.length, inventoryOfferings: offerings.length, existingRealInstitutions: existingRealInstitutions.length, existingRealPrograms: existingRealPrograms.length, qaInstitutionsExcluded: snapshot.institutions.filter(row => row.qa).length, qaProgramsExcluded: snapshot.programs.length - existingRealPrograms.length, institutionsToCreate: proposedInstitutions.length, programsToCreate: proposedPrograms.length, institutionLinksToCreateAfterMigration: proposedInstitutionLinks.length, offeringLinksToCreateAfterMigration: proposedOfferingLinks.length, sameVenueMasterPairs: sameVenueMasterPairs.length, exactModalityDuplicates: duplicateModalityPairs.length, blockingIssues: issues.length },
  sameVenueMasterPairs,
  readyForReview: issues.length === 0 && venues.length === 125 && offerings.length === 198,
  importSafeNow: false,
  importBlockedBy: ['Explicit user approval required', 'Private link tables not deployed remotely', 'Remote state must be refreshed immediately before execution'],
};
save('proposed-institutions.json', proposedInstitutions);
save('proposed-programs.json', proposedPrograms);
save('proposed-institution-links.json', proposedInstitutionLinks);
save('proposed-offering-links.json', proposedOfferingLinks);
save('import-inconsistencies.json', issues);
save('dry-run-report.json', report);
console.log(JSON.stringify(report));
if (issues.length || venues.length !== 125 || offerings.length !== 198) process.exitCode = 1;
