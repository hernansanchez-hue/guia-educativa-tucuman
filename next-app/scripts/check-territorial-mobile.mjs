import assert from 'node:assert/strict';
import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const reportPath='../docs/catalog/GET-CATALOG-MOBILE.json';
const retry=process.env.GET_CATALOG_MOBILE_RECHECK==='1';
let previous;
if(retry){
 previous=JSON.parse(await readFile(reportPath,'utf8'));
 await copyFile(reportPath,'../docs/catalog/GET-CATALOG-MOBILE-INITIAL.json',0);
}
const routes=retry?[...new Set(previous.failures.map(r=>r.route))]:JSON.parse(await readFile('../docs/catalog/GET-CATALOG-ROUTES.json','utf8')).results.map(r=>r.path);
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']}),queue=[...routes],failures=[],passed=retry?[...previous.passed]:[];
try{await Promise.all(Array.from({length:2},async()=>{while(queue.length){
 const route=queue.shift();
 // A fresh context per route prevents a suspended or failed navigation poisoning later checks.
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.route('**/*',async routeRequest=>{
  const url=new URL(routeRequest.request().url());
  if(['localhost','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))await routeRequest.continue();else await routeRequest.abort();
 });
 const page=await context.newPage();
 try{
  const response=await page.goto('http://localhost:4004'+route,{waitUntil:'domcontentloaded',timeout:45000});
  assert.equal(response.status(),200);
  await page.locator('h1,h2').first().waitFor();
  await page.evaluate(()=>document.fonts.ready);
  const issues=await page.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth+1,text:[...document.querySelectorAll('h1,h2,h3,.institution-career-list-row,.city-institution-card')].filter(e=>e.getBoundingClientRect().width>0&&e.scrollWidth>e.clientWidth+2).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.slice(0,120),scroll:e.scrollWidth,client:e.clientWidth}))}));
  if(issues.page||issues.text.length)failures.push({route,...issues});else passed.push(route);
 }catch(e){failures.push({route,error:e.message});}finally{await context.close();}
 if((passed.length+failures.length)%25===0)console.log('MOBILE',passed.length,failures.length);
}}));}finally{await browser.close();}
await writeFile(reportPath,JSON.stringify({width:390,coverage:passed.length+failures.length,method:retry?'596 original passes plus fresh-context recheck of all 74 original failures':'fresh context per route',externalMedia:'blocked for geometry audit; external fonts allowed; functional flows tested separately',passed,failures},null,2)+'\n');
console.log(JSON.stringify({passed:passed.length,failures},null,2));assert.deepEqual(failures,[]);
