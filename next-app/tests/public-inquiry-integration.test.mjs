import test from 'node:test';
import assert from 'node:assert/strict';
import {publicIntegrationCatalog, validateIntegrationMap} from '../lib/integration/catalog-map.mjs';
import {resolvePublicInquiry} from '../lib/integration/public-inquiry.mjs';

const catalog = publicIntegrationCatalog();
const institution = catalog.institutions.find(row => catalog.offerings.some(offering => offering.institutionId === row.id));
const offering = catalog.offerings.find(row => row.institutionId === institution.id);
const input = {institutionId:institution.id, offeringId:offering.id, name:'Persona de Prueba', phone:'3811234567', email:'persona@example.test', query:''};
const venueId = '11111111-1111-4111-8111-111111111111';
const programId = '22222222-2222-4222-8222-222222222222';
const mapping = {venues:{[institution.id]:{institutionId:venueId}}, offerings:{[offering.id]:{institutionId:venueId,programId}}};

test('catálogo versionado conserva las cantidades aprobadas', () => {
  assert.deepEqual(validateIntegrationMap({},catalog).counts,{cities:27,venues:125,careers:195,offerings:198});
});
test('resuelve sede y programa únicamente desde el servidor', () => {
  const result=resolvePublicInquiry({...input, management_scope:'institution'},mapping,catalog);
  assert.equal(result.value.institutionId,venueId);
  assert.equal(result.value.programId,programId);
  assert.equal('management_scope' in result.value,false);
});
test('rechaza sede inexistente, deshabilitada, carrera ajena y mapeo incompleto', () => {
  assert.equal(resolvePublicInquiry({...input,institutionId:'no-existe'},mapping,catalog).status,404);
  assert.equal(resolvePublicInquiry(input,mapping,{...catalog,institutions:catalog.institutions.map(row=>row.id===institution.id?{...row,visible:false}:row)}).status,403);
  const other=catalog.offerings.find(row=>row.institutionId!==institution.id);
  assert.equal(resolvePublicInquiry({...input,offeringId:other.id},mapping,catalog).status,422);
  assert.equal(resolvePublicInquiry(input,{venues:{},offerings:{}},catalog).status,503);
  assert.equal(resolvePublicInquiry({...input,email:'incorrecto'},mapping,catalog).status,400);
});
