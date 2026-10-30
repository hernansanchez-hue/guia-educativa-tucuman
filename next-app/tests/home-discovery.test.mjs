import test from 'node:test';
import assert from 'node:assert/strict';
import {cityDiscoveryEntries,normalizeSearch,searchCityEntries} from '../lib/public-catalog/home-discovery.mjs';
import {editorialCatalog,cityPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {resolveCitySlides} from '../lib/admin/city-slider.mjs';

const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
test('all cities expose every public career detail and institution, never only Premium',()=>{
 let institutions=0,offers=0;
 for(const record of catalog.cities){
  const city=cityPageFromCatalog(catalog,record.slug),entries=cityDiscoveryEntries(city);
  institutions+=entries.filter(e=>e.type==='Institución').length;
  offers+=entries.filter(e=>e.type==='Carrera').length;
  assert.equal(entries.length,new Set(entries.map(e=>e.id)).size);
  for(const institution of city.institutions){
   assert.ok(entries.some(e=>e.href===`/${city.slug}/${institution.slug}`));
   for(const career of institution.careers)assert.ok(entries.some(e=>e.name===career.name&&e.institution===institution.name));
  }
  assert.equal(searchCityEntries(entries,'',{careersOnly:true}).length,entries.filter(e=>e.type==='Carrera').length);
 }
 assert.equal(institutions,125);
 // Three modality pairs share the existing canonical career detail; retain that projection.
 assert.equal(offers,new Set(catalog.offerings.map(o=>`${o.institutionId}/${o.careerId}`)).size);
 assert.equal(catalog.offerings.length,198);
});
test('search normalizes accents and case, keeps city scope and handles empty/no matches',()=>{
 assert.equal(normalizeSearch(' CONCEPCIÓN '),'concepcion');
 const entries=cityDiscoveryEntries(cityPageFromCatalog(catalog,'concepcion'));
 assert.ok(searchCityEntries(entries,'ABOGACIA').some(e=>e.name==='Abogacía'));
 assert.ok(searchCityEntries(entries,'siglo 21',{careersOnly:true}).length>0);
 assert.equal(searchCityEntries(entries,'zz-no-existe').length,0);
 assert.equal(searchCityEntries(entries,'').length,entries.length);
 assert.ok(entries.every(e=>e.href.startsWith('/concepcion/')));
});
test('the carousel includes every real Premium offering beyond the previous five-slide cap',()=>{
 const city=cityPageFromCatalog(catalog,'concepcion'),slides=resolveCitySlides(city);
 assert.equal(slides.length,7);
 assert.equal(new Set(slides.map(s=>s.id)).size,slides.length);
 const entries=cityDiscoveryEntries(city);
 for(const slide of slides)assert.ok(entries.some(e=>e.href===slide.route),slide.route);
 assert.equal(resolveCitySlides(cityPageFromCatalog(catalog,'famailla')).length,0);
});
