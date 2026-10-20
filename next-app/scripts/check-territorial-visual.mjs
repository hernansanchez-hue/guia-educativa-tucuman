import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {editorialCatalog,institutionPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false}),inst=catalog.institutions.find(i=>i.citySlug==='famailla'&&catalog.offerings.some(o=>o.institutionId===i.id));
const career=institutionPageFromCatalog(catalog,'famailla',inst.slug).institution.careers[0];
const baseUrl=process.env.GET_BASE_URL||'http://localhost:4004';
const output=process.env.GET_VISUAL_OUTPUT||'C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd';
const empty=catalog.institutions.find(i=>i.citySlug==='famailla'&&!catalog.offerings.some(o=>o.institutionId===i.id));
const routes=['/','/ciudades','/concepcion','/monteros','/aguilares','/famailla','/instituciones',`/famailla/${inst.slug}`,'/carreras',`/famailla/${inst.slug}/carreras/${career.slug}`,`/instituciones/${inst.slug}`,`/carreras/${career.slug}`,'/concepcion/universidad-siglo-21','/concepcion/ies-concepcion','/concepcion/instituto-santa-barbara',`/famailla/${empty.slug}`];
const browser=await chromium.launch({channel:'msedge',headless:true}),views=[],errors=[],flows=[];
try{
 if(!process.env.GET_CATALOG_FLOWS_ONLY)for(const [width,height]of [[1920,1080],[1440,900],[1366,768],[768,1024],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
  for(const [index,route]of routes.entries()){
   const response=await page.goto(baseUrl+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);
   await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   if(overflow){console.log('OVERFLOW',width,route,await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(e).position!=='fixed').slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,90),right:e.getBoundingClientRect().right}))));}
   assert.equal(overflow,false,`${width} ${route}`);
   if(route==='/'){assert.equal(await page.locator('video').count(),1);assert.equal(await page.locator('footer').count(),0);assert.equal(await page.locator('.public-site-background-lines').count(),0);}
   if(route==='/famailla'){assert.equal(await page.locator('.city-featured-institutions').count(),0);assert.equal(await page.locator('.city-featured-institution').count(),0);assert.equal(await page.locator('.city-all-institutions .city-institution-card').count(),4);}
   if(route==='/concepcion')assert.ok(await page.locator('.city-featured-institutions .city-institution-card').count()>=2);
   if(['/concepcion','/monteros','/aguilares','/famailla'].includes(route)){assert.equal(await page.locator('.city-all-careers,#cityAllCareersTitle').count(),0);assert.equal(await page.getByRole('heading',{name:'Todas las carreras',exact:true}).count(),0);assert.equal(await page.locator('.city-all-institutions').count(),1);}
   if([`/famailla/${inst.slug}`,'/concepcion/ies-concepcion','/concepcion/instituto-santa-barbara'].includes(route))assert.ok(await page.locator('.institution-career-list-row').count()>0);
   if(route===`/famailla/${empty.slug}`)assert.equal(await page.locator('.institution-all-careers').count(),0);
   const shot=`${output}/catalog-${width}-${index}.png`;await page.screenshot({path:shot,fullPage:true});views.push({width,height,route,overflow:false,screenshot:shot});
  }
  await page.close();console.log('RESPONSIVE PASS',width,routes.length);
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(baseUrl+'/instituciones?buscar=San%20Luis%20Gonzaga');await page.locator('.catalog-filters input').waitFor();assert.equal(await page.locator('.institutions-index-grid>a').count(),1);flows.push('Buscar institución nueva por nombre');
 await page.locator('.catalog-filters input').fill('Famailla');assert.ok(await page.getByRole('region',{name:'Ciudades encontradas'}).count()||await page.locator('[aria-label="Ciudades encontradas"]').count());assert.equal(await page.locator('.institutions-index-grid>a').count(),4);flows.push('Buscar ciudad sin tilde');
 await page.locator('.catalog-filters input').fill('Dónde estudiar inglés');assert.ok(await page.locator('[aria-label="Carreras encontradas"] a').count()>0);flows.push('Buscar carrera con consulta natural');
 await page.goto(baseUrl+'/carreras?ciudad=famailla');await page.getByLabel('Ciudad',{exact:true}).waitFor();assert.equal(await page.getByLabel('Ciudad',{exact:true}).inputValue(),'famailla');assert.equal(await page.locator('.career-index-card').count(),5);flows.push('Filtro de carrera y ciudad desde enlace');
 for(const [name,route,careerText]of [['IES Concepción','/concepcion/ies-concepcion','Tecnico Superior en Computacion y Redes'],['Instituto Santa Bárbara','/concepcion/instituto-santa-barbara','Radiología e Imagenología']]){await page.goto(baseUrl+'/concepcion');await page.locator('.city-all-institutions').getByRole('link',{name:`Ver institución ${name}`,exact:true}).click();await page.waitForURL('**'+route);await page.getByRole('button',{name:'Ver más carreras',exact:true}).click();assert.equal(await page.getByRole('heading',{name:careerText,exact:true}).isVisible(),true);flows.push(`Ciudad → ${name} → carreras reales; expandir listado`);}
 await page.goto(baseUrl+'/');await page.getByRole('searchbox',{name:'Buscar ciudad, institución o carrera'}).fill('Dónde estudiar radiología');assert.ok(await page.getByRole('listbox',{name:'Resultados de búsqueda'}).getByRole('option').count()>0);flows.push('Buscador global encuentra Radiología');await page.getByRole('searchbox',{name:'Buscar ciudad, institución o carrera'}).fill('Arquitectura');assert.equal(await page.locator('.home-map-results a[href="/carreras/arquitectura-y-urbanismo"]').count(),1);flows.push('Buscador global conserva oferta universitaria general sin atribuir campus');
 await page.close();assert.deepEqual(errors,[]);
}finally{await browser.close();await writeFile(output+(process.env.GET_CATALOG_FLOWS_ONLY?'/GET-CATALOG-FLOWS.json':'/GET-CATALOG-VISUAL.json'),JSON.stringify({views,flows,errors},null,2));}
console.log(JSON.stringify({views:views.length,flows,errors},null,2));
