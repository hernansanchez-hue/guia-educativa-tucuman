import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {editorialCatalog,cityPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {resolveCityBanner} from '../lib/catalog/city-template.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
const cities=catalog.cities.map(c=>cityPageFromCatalog(catalog,c.slug));
const baseUrl=process.env.GET_BASE_URL||'http://localhost:4004';
const output='C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd';
const representative=new Set(['concepcion','aguilares','monteros','famailla','burruyacu']);
const widths=[[1920,1080],[1440,900],[1366,768],[768,1024],[390,844]];
const results=[],errors=[],flows=[];
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});
try{
 for(const [width,height] of widths){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push({width,error:e.message}));
  for(const city of cities){
   const response=await page.goto(baseUrl+'/'+city.slug,{waitUntil:'domcontentloaded',timeout:45000});assert.equal(response.status(),200);
   await page.locator('#cityOrientationTitle').waitFor();await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const q=s=>document.querySelector(s),has=s=>!!q(s);
    const layout=q('.city-featured').getBoundingClientRect();
    return {header:has('.public-header-frame .site-header'),banner:has('.city-featured'),bannerKind:q('.city-featured').dataset.bannerKind,orientation:has('#cityOrientationTitle'),expo:has('#cityExpoTitle'),commercial:has('#cityCommercialTitle'),allInstitutions:has('.city-all-institutions'),institutionCount:document.querySelectorAll('.city-all-institutions .city-institution-card').length,featuredInstitutions:document.querySelectorAll('.city-featured-institutions .city-institution-card').length,paidBanner:has('.city-featured-institution'),footer:document.querySelectorAll('footer').length,background:has('.public-site-background-lines'),generalCareerGrid:has('.city-all-careers,#cityAllCareersTitle'),canonical:q('link[rel="canonical"]')?.href,title:document.title,overflow:document.documentElement.scrollWidth>innerWidth+1,textOverflow:[...document.querySelectorAll('#cityPage h1,#cityPage h2,#cityPage h3')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent),bannerWidth:Math.round(layout.width),bannerHeight:Math.round(layout.height),order:[...document.querySelectorAll('.site-header,.city-featured,.city-orientation-block,.city-expo-block,.city-featured-institutions,.city-all-institutions,.city-commercial-block,footer')].map(e=>e.tagName==='FOOTER'?'footer':e.classList.contains('site-header')?'header':e.classList[0]==='city-community-block'?e.classList[1]:e.classList.contains('city-institution-block')?e.classList[1]:e.classList[0])};
   });
   for(const key of ['header','banner','orientation','expo','commercial','allInstitutions','background'])assert.equal(state[key],true,`${city.slug} ${width} ${key}`);
   assert.equal(state.footer,1);assert.equal(state.generalCareerGrid,false);
   assert.equal(state.overflow,false,`${city.slug} ${width}: overflow`);assert.deepEqual(state.textOverflow,[],`${city.slug} ${width}: title clipping`);
   assert.equal(state.institutionCount,city.institutions.length);assert.equal(state.featuredInstitutions,city.featuredInstitutions.length);
   const kind=resolveCityBanner(city).kind;assert.equal(state.bannerKind,kind);assert.equal(state.paidBanner,kind==='commercial');
   assert.equal(new URL(state.canonical).pathname,'/'+city.slug);assert.ok(state.title.includes(city.name));
   let screenshot;
   if(representative.has(city.slug)){screenshot=output+`/city-template-${width}-${city.slug}.png`;await page.screenshot({path:screenshot,fullPage:true});}
   results.push({city:city.name,slug:city.slug,width,height,...state,screenshot});
  }
  await context.close();console.log('CITY TEMPLATE PASS',width,cities.length);
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await page.goto(baseUrl+'/famailla');await page.getByRole('button',{name:'Ver instituciones',exact:true}).click();
 await page.waitForFunction(()=>Math.abs(document.getElementById('allInstitutionsTitle').getBoundingClientRect().top)<10);flows.push('Fallback GET lleva a las instituciones de la misma ciudad');
 await page.getByRole('button',{name:'Quiero sumarme',exact:false}).click();await page.getByRole('status').filter({hasText:'Famaillá'}).waitFor();flows.push('Orientación global conserva aviso próximo contextual y no inventa inscripción');
 await page.getByRole('button',{name:'Quiero recibir novedades',exact:false}).click();assert.ok((await page.locator('.city-interest-notice').innerText()).includes('Expo Carreras GET para Famaillá'));flows.push('Expo conserva su estado próximo sin inventar un evento territorial');
 await page.goto(baseUrl+'/');assert.equal(await page.locator('video').count(),1);assert.equal(await page.locator('footer').count(),0);assert.equal(await page.locator('.public-site-background-lines').count(),0);flows.push('Home principal conserva video y exclusiones');
 await page.close();assert.deepEqual(errors,[]);
}finally{
 await browser.close();
 const matrix=cities.map(city=>{const rows=results.filter(r=>r.slug===city.slug),all=fn=>rows.length===widths.length&&rows.every(fn);return {city:city.name,route:'/'+city.slug,header:all(r=>r.header)?'PASS':'FAIL',banner:all(r=>r.banner)?'PASS':'FAIL',bannerKind:resolveCityBanner(city).kind,orientation:all(r=>r.orientation)?'PASS':'FAIL',expo:all(r=>r.expo)?'PASS':'FAIL',premium:city.featuredInstitutions.length?'PASS':'NO APLICA',institutions:all(r=>r.institutionCount===city.institutions.length)?'PASS':'FAIL',footer:all(r=>r.footer===1)?'PASS':'FAIL',seo:all(r=>!!r.canonical&&r.title.includes(city.name))?'PASS':'FAIL',responsive:all(r=>!r.overflow&&!r.textOverflow.length)?'PASS':'FAIL'};});
 await writeFile('../docs/catalog/GET-CITY-TEMPLATE-AUDIT.json',JSON.stringify({checkedAt:new Date().toISOString(),widths,views:results.length,matrix,results,flows,errors},null,2)+'\n');
}
console.log(JSON.stringify({cities:cities.length,views:results.length,flows,errors},null,2));
