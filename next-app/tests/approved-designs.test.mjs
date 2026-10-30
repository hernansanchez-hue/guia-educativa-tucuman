import test from 'node:test';
import assert from 'node:assert/strict';
import {selectedProfileCareers,hasFeaturedCareerProfile,safeStudyPlanPdf} from '../lib/catalog/profile-presentation.mjs';
import {institutionDesignPage} from '../lib/catalog/institution-design.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {editorialCatalog,institutionPageFromCatalog} from '../lib/admin/editorial-model.mjs';

test('only explicitly featured careers get paid cards, with a maximum of five',()=>{
 const careers=Array.from({length:9},(_,i)=>({id:String(i),featured:i<7}));
 assert.equal(selectedProfileCareers({plan:'Profesional',careers}).length,5);
 assert.equal(selectedProfileCareers({plan:'Básico',careers}).length,0);
 assert.equal(selectedProfileCareers({featured:true,careers}).length,0);
 assert.equal(selectedProfileCareers({plan:'Premium',careers:careers.map(c=>({...c,featured:false}))}).length,0);
 assert.deepEqual(selectedProfileCareers({plan:'Premium',careers,featuredCareerIds:['8']}).map(c=>c.id),['8']);
 assert.equal(hasFeaturedCareerProfile({plan:'Premium',careers,featuredCareerIds:['8']},{id:'0'}),false);
});
test('PDF support rejects unsafe or missing resources',()=>{
 for(const href of ['',undefined,'javascript:alert(1)','//example.com/p.pdf','https://example.com/p.html'])assert.equal(safeStudyPlanPdf({studyPlanPdf:href}),null);
 assert.equal(safeStudyPlanPdf({studyPlanPdf:'/assets/plan.pdf'}),'/assets/plan.pdf');
});
test('page adapter preserves all 198 territorial offerings without mutating shared catalog',()=>{
 const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
 const before=JSON.stringify(catalog);let count=0;
 assert.deepEqual([catalog.cities.length,catalog.institutions.length,catalog.careers.length,catalog.offerings.length],[27,125,195,198]);
 for(const institution of catalog.institutions){
  const page=institutionDesignPage(catalog,institutionPageFromCatalog(catalog,institution.citySlug,institution.slug));
  const ids=page.institution.careers.map(c=>c.offeringId).filter(Boolean);
  assert.equal(ids.length,new Set(ids).size);
  for(const id of ids)assert.equal(catalog.offerings.find(o=>o.id===id).institutionId,institution.id);
  count+=ids.length;
 }
 assert.equal(count,198);assert.equal(JSON.stringify(catalog),before);
});

test('Siglo 21 Concepcion explicitly features only Abogacia and links its real page',()=>{
 const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
 const page=institutionDesignPage(catalog,institutionPageFromCatalog(catalog,'concepcion','universidad-siglo-21'));
 const selected=selectedProfileCareers(page.institution);
 assert.deepEqual(selected.map(c=>c.id),['abogacia']);
 assert.equal(selected[0].offeringId,'universidad-siglo-21-concepcion-abogacia');
 assert.equal(selected[0].routePath,'/concepcion/universidad-siglo-21/carreras/abogacia');
 assert.equal(hasFeaturedCareerProfile(page.institution,{id:'abogacia'}),true);
 assert.equal(hasFeaturedCareerProfile(page.institution,{id:'contador-publico'}),false);
 assert.equal(page.institution.careers.filter(c=>c.id!=='abogacia').length,3);
});
