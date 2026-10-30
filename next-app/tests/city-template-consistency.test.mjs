import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {editorialCatalog,cityPageFromCatalog,institutionPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {resolveCitySlides} from '../lib/admin/city-slider.mjs';
import {GET_CITY_BANNER,resolveCityBanner,showCityOrientation} from '../lib/catalog/city-template.mjs';
import {orientationContent} from '../app/data/publicSiteContent.js';
import nextConfig from '../next.config.mjs';
const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
const cities=catalog.cities.map(c=>cityPageFromCatalog(catalog,c.slug));
const require=createRequire(import.meta.url);
const {ImageConfigContext}=require('next/dist/shared/lib/image-config-context.shared-runtime');
const {imageConfigDefault}=require('next/dist/shared/lib/image-config');
// Isolated React rendering does not run Next's configuration loader.
const render=child=>renderToStaticMarkup(createElement(ImageConfigContext.Provider,{value:{...imageConfigDefault,...nextConfig.images}},child));
function component(source){
 const built=buildSync({stdin:{contents:source,resolveDir:fileURLToPath(new URL('..',import.meta.url)),loader:'jsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',loader:{'.js':'jsx'},external:['react','react-dom','next/*']});
 const compiled={exports:{}};
 new Function('require','module','exports',built.outputFiles[0].text)(require,compiled,compiled.exports);
 return compiled.exports;
}
const {Hero,Sections,PublicEditorialProvider}=component(`
 export {default as Hero} from './app/[ciudad]/CityFeaturedCareers.js';
 export {default as Sections} from './app/[ciudad]/CityInstitutionSections.js';
 export {PublicEditorialProvider} from './app/components/PublicEditorialContext.js';
`);
const sections=(city,orientation=orientationContent)=>render(createElement(PublicEditorialProvider,{content:{orientation}},createElement(Sections,{city,institutions:city.institutions,onOpenInstitution:()=>{}})));

test('A: all 27 localities resolve the same dynamic city template without named-city branches',async()=>{
 assert.equal(cities.length,27);
 const route=await readFile(new URL('../app/[ciudad]/page.js',import.meta.url),'utf8');
 const client=await readFile(new URL('../app/[ciudad]/CityPageClient.js',import.meta.url),'utf8');
 assert.ok(route.includes('<CityPageClient city={city} />'));
 for(const marker of ['<header className="header"','<CityFeaturedCareers','<CityInstitutionSections','<PublicFooter'])assert.ok(client.includes(marker));
 assert.ok(!/city\.slug\s*===\s*["'](?:concepcion|monteros|aguilares)/.test(client));
 for(const city of cities)assert.ok(city.slug&&city.institutions.length>0);
});
test('B: orientation is a shared global singleton, not the legacy three-city allowlist',()=>{
 for(const city of cities){assert.equal(showCityOrientation(city,orientationContent),true);assert.ok(sections(city).includes('id="cityOrientationTitle"'));}
 const next={...orientationContent,cityIds:[],titleBefore:'Título global de prueba',description:'Texto global de prueba'};
 for(const city of cities)assert.ok(sections(city,next).includes('Título global de prueba'));
 assert.equal(showCityOrientation({id:'new-uuid',slug:'localidad-futura'},next),true);
 assert.deepEqual(orientationContent.cityIds,['concepcion','monteros','aguilares']);
});
test('C: every city has a banner, and existing commercial slides are unchanged',()=>{
 for(const city of cities){const banner=resolveCityBanner(city),html=render(createElement(Hero,{city}));assert.ok(html.includes(`data-banner-kind="${banner.kind}"`));assert.ok(html.includes('<h2'));if(banner.kind==='commercial')assert.deepEqual(banner.slides,resolveCitySlides(city));}
 for(const slug of ['concepcion','monteros','aguilares'])assert.equal(resolveCityBanner(cities.find(c=>c.slug===slug)).kind,'commercial');
});
test('D: a future city without banners or paid placements receives GET editorial content',()=>{
 const city={id:'future-uuid',slug:'localidad-futura',name:'Localidad futura',institutions:[]};
 const banner=resolveCityBanner(city),html=render(createElement(Hero,{city}));
 assert.equal(banner.kind,'editorial');assert.equal(banner.image,GET_CITY_BANNER.image);assert.equal(banner.slides.length,0);
 assert.ok(html.includes('Localidad futura'));assert.ok(html.includes('Ver instituciones'));assert.ok(!html.includes('city-featured-institution'));
});
test('E: editorial fallback never fills Premium slots with normal PDF institutions',()=>{
 const city=cities.find(c=>c.slug==='famailla'),html=sections(city);
 assert.equal(resolveCityBanner(city).kind,'editorial');assert.equal(resolveCitySlides(city).length,0);
 assert.ok(!html.includes('id="featuredGrid"'));assert.ok(!html.includes('class="school-card"'));
});
test('F/G: all city institutions remain present, with no general career grid',()=>{
 for(const city of cities){const html=sections(city);assert.ok(html.includes('id="allInstitutionsTitle"'));assert.ok(!html.includes('city-all-careers'));assert.ok(!html.includes('cityAllCareersTitle'));for(const institution of city.institutions)assert.ok(html.includes(`Ver institución ${institution.name.replaceAll('&','&amp;').replaceAll('"','&quot;')}`));}
});
test('H: institution → career relationships and all catalog totals survive the template correction',async()=>{
 assert.deepEqual({cities:catalog.cities.length,brands:catalog.brands.length,campuses:catalog.institutions.length,careerMasters:catalog.careers.length,territorialOffers:catalog.offerings.length,generalOffers:catalog.brands.reduce((n,b)=>n+(b.generalOffers?.length||0),0)},{cities:27,brands:93,campuses:125,careerMasters:195,territorialOffers:198,generalOffers:128});
 for(const slug of ['ies-concepcion','instituto-santa-barbara'])assert.ok(institutionPageFromCatalog(catalog,'concepcion',slug).institution.careers.length>0);
});

test('featured lists are compact and never hide or duplicate institutions beyond six cards',()=>{
 const original=cities.find(c=>c.slug==='concepcion');
 for(const count of [0,1,2,3,6,9]){
  const institutions=Array.from({length:count},(_,index)=>({...original.institutions[0],id:'fixture-'+index,slug:'fixture-'+index,name:'Institución fixture '+index}));
  const city={...original,institutions,featuredInstitutions:institutions};
  const html=sections(city);
  assert.equal((html.match(/class="school-card"/g)||[]).length,Math.min(count,6));
  for(const institution of institutions)assert.equal(html.split('aria-label="Ver institución '+institution.name+'"').length-1,1);
  assert.equal(html.includes('Ver más instituciones destacadas'),count>6);
 }
});
test('I: Expo and closing blocks are shared; explicit visibility and custom banners are respected',()=>{
 for(const city of cities){const html=sections(city);assert.ok(html.includes('cityExpoTitle'));assert.ok(html.includes('cityCommercialTitle'));}
 const city={...cities.find(c=>c.slug==='famailla'),heroTitle:'Banner propio aprobado',heroImage:'/assets/catalog/education.webp',heroDescription:'Descripción propia'};
 assert.equal(resolveCityBanner(city).title,city.heroTitle);assert.equal(resolveCityBanner(city).image,city.heroImage);
 assert.equal(showCityOrientation({...city,orientationVisible:false},orientationContent),false);
 assert.equal(showCityOrientation(city,{...orientationContent,visible:false}),false);
});
