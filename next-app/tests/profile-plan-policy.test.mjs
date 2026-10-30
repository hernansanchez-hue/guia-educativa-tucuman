import test from 'node:test';
import assert from 'node:assert/strict';
import {institutionProfileTier,institutionProfileCapabilities} from '../lib/catalog/commercial-policy.mjs';

test('Premium and Profesional are paid profiles',()=>{
 for(const plan of ['Premium','Profesional',' PREMIUM ','profesional']){
  assert.equal(institutionProfileTier({plan}),'paid');
  const permissions=institutionProfileCapabilities({plan});
  assert.equal(permissions.gallery,true);
  assert.equal(permissions.institutionWhatsApp,true);
  assert.equal(permissions.animatedCover,true);
  assert.equal(permissions.maxFeaturedCareers,5);
 }
});
test('Basico is free, without institutional gallery or direct WhatsApp',()=>{
 for(const plan of ['Básico','Basico',' básico ']){
  const permissions=institutionProfileCapabilities({plan});
  assert.equal(permissions.tier,'free');
  assert.equal(permissions.gallery,false);
  assert.equal(permissions.institutionWhatsApp,false);
  assert.equal(permissions.maxFeaturedCareers,0);
 }
});
test('unknown plans remain pending, never inferred from brand or editorial flags',()=>{
 for(const record of [null,{}, {plan:'Otro'}, {name:'Universidad Siglo 21',premium:true,featured:true}]){
  const permissions=institutionProfileCapabilities(record);
  assert.equal(permissions.tier,'pending');
  assert.equal(permissions.classificationPending,true);
  assert.equal(permissions.institutionWhatsApp,false);
 }
});
