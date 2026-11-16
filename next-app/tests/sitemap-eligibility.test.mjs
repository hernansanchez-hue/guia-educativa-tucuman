import test from 'node:test';
import assert from 'node:assert/strict';
import {editorialCatalog,cityPageFromCatalog,careerPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {indexablePublicPaths} from '../lib/admin/seo-projection.mjs';
import {institutionDesignPage} from '../lib/catalog/institution-design.mjs';
import {hasFeaturedCareerProfile} from '../lib/catalog/profile-presentation.mjs';
import {cityDiscoveryEntries} from '../lib/public-catalog/home-discovery.mjs';
import {resolveCitySlides} from '../lib/admin/city-slider.mjs';

const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
const extended={events:[],services:[],trainings:[],trainingOfferings:[]};
const allOffers=catalog.offerings.map(o=>{const i=catalog.institutions.find(i=>i.id===o.institutionId),c=catalog.careers.find(c=>c.id===o.careerId);return `/${i.citySlug}/${i.slug}/carreras/${c.slug}`;});
function profileAllowed(path){const [city,institution,,career]=path.slice(1).split('/');const page=institutionDesignPage(catalog,careerPageFromCatalog(catalog,city,institution,career));return Boolean(page&&hasFeaturedCareerProfile(page.institution,page.career));}

test('sitemap applies exactly the profile route gate without changing plans/catalog',()=>{
 const before=JSON.stringify(catalog);
 const paths=indexablePublicPaths([...allOffers,'/ciudades','/administrador','/admin/login','/carreras/abogacia','/instituciones/universidad-siglo-21'],catalog,extended);
 for(const path of new Set(allOffers)) assert.equal(paths.includes(path),profileAllowed(path),path);
 assert.ok(paths.includes('/concepcion/universidad-siglo-21/carreras/abogacia'));
 assert.ok(paths.includes('/carreras/abogacia'));assert.ok(paths.includes('/instituciones/universidad-siglo-21'));
 for(const path of ['/ciudades','/administrador','/admin/login'])assert.ok(!paths.includes(path));
 assert.equal(JSON.stringify(catalog),before);
});
test('city search and automatic/manual slider links cannot grant paid career profiles',()=>{
 for(const c of catalog.cities){
  const city=cityPageFromCatalog(catalog,c.slug);
  for(const entry of [...cityDiscoveryEntries(city).map(e=>e.href),...resolveCitySlides(city).map(e=>e.route)]) if(entry.includes('/carreras/')) assert.ok(profileAllowed(entry),entry);
 }
 const city=cityPageFromCatalog(catalog,'concepcion'),institution=city.institutions.find(i=>i.slug==='universidad-siglo-21');
 const slides=[{id:'manual-test',institutionId:institution.id,careerId:'contador-publico',title:'Contador Público',href:'/concepcion/universidad-siglo-21/carreras/contador-publico',active:true}];
 assert.equal(resolveCitySlides({...city,slides})[0].route,'/concepcion/universidad-siglo-21#carreras');
});
