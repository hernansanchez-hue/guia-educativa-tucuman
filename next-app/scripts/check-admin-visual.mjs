// Browser acceptance tests against a TEST-ONLY harness and the real public/login routes.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {documents} from '../tests/admin-visual/fixtures.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.GET_PLAYWRIGHT_PATH||'C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=process.env.GET_VISUAL_OUTPUT;
if(!output)throw new Error('Set GET_VISUAL_OUTPUT to an existing screenshot directory.');
const browser=await chromium.launch({channel:'msedge',headless:true});
const result={visual:[],interactions:[],public:[],errors:[]};
const id=(kind,name)=>documents.find(d=>d.draft._kind===kind&&d.draft.data.id===name).id;
const cityId=id('city','concepcion'),instId=id('institution','universidad-siglo-21-concepcion'),offerId=documents.find(d=>d.draft._kind==='offering'&&d.draft.data.institutionId==='universidad-siglo-21-concepcion'&&d.draft.data.careerId==='abogacia').id;
const routes=['/admin','/admin/ciudades','/admin/instituciones','/admin/carreras',`/admin/ciudades/${cityId}`,`/admin/instituciones/${instId}`,`/admin/carreras/${offerId}`];
try{
 for(const width of [1440,1280,1024,768,390]){
  const page=await browser.newPage({viewport:{width,height:1000}});page.on('pageerror',e=>result.errors.push({width,message:e.message}));
  for(const [n,route]of routes.entries()){
   await page.goto('http://127.0.0.1:4015'+route);await page.locator('h1').first().waitFor();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,`${route} overflow at ${width}`);
   if(n>=4&&width>1024){const frame=page.frameLocator('iframe').first();await frame.locator('h1').first().waitFor();const label=await page.getByText('Actualizada en vivo',{exact:true}).first().textContent();assert.equal(label,'Actualizada en vivo');}
   if(width===1440||width===390)await page.screenshot({path:`${output}/cms-${n}-${width}.png`,fullPage:n<4});
   result.visual.push({route,width,overflow:false});
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>result.errors.push({interaction:true,message:e.message}));
 await page.goto('http://127.0.0.1:4015/admin');await page.getByRole('button',{name:'Contraer menú',exact:true}).click();assert.equal(await page.locator('aside').evaluate(e=>e.clientWidth),76);await page.getByRole('button',{name:'Expandir menú',exact:true}).click();assert.equal(await page.locator('aside').evaluate(e=>e.clientWidth),244);result.interactions.push('desktop sidebar collapse');
 await page.goto(`http://127.0.0.1:4015/admin/instituciones/${instId}`);
 await page.getByRole('button',{name:'Contacto',exact:true}).click();await page.getByLabel('Teléfono',{exact:true}).fill('Teléfono prueba visual');
 const frame=page.frameLocator('iframe').first();await frame.locator('#institutionPhone').filter({hasText:'Teléfono prueba visual'}).waitFor();
 assert.equal(await frame.locator('#institutionPhone').getAttribute('data-cms-selected'),'true');
 await frame.locator('#instName').click();await page.getByLabel('Nombre de la institución',{exact:true}).waitFor();result.interactions.push('teléfono live + highlight + click-to-edit');
 await page.getByRole('button',{name:'Guardar borrador',exact:true}).click();await page.getByRole('status').filter({hasText:'Borrador guardado'}).waitFor();result.interactions.push('save draft UI · simulated action');
 await page.getByRole('button',{name:'Publicar cambios',exact:true}).first().click();await page.getByRole('dialog').getByRole('button',{name:'Publicar',exact:true}).click();await page.getByRole('status').filter({hasText:'Publicado ·'}).waitFor();result.interactions.push('publish confirmation UI · simulated action');
 await page.getByRole('button',{name:'Portada',exact:true}).click();await page.getByLabel('Texto de portada',{exact:true}).fill('Cambio temporal');await page.getByRole('button',{name:'Descartar cambios',exact:true}).click();assert.notEqual(await page.getByLabel('Texto de portada',{exact:true}).inputValue(),'Cambio temporal');result.interactions.push('discard restores fields');
 for(const device of ['Tablet','Móvil','Desktop']){await page.getByRole('button',{name:device,exact:true}).first().click();assert.equal(await page.locator('iframe').first().evaluate(e=>Math.round(e.getBoundingClientRect().width/e.ownerDocument.defaultView.getComputedStyle(e).transform.match(/matrix\(([^,]+)/)[1])),{Tablet:768,'Móvil':390,Desktop:1440}[device]);}result.interactions.push('responsive iframe uses real viewport dimensions');
 const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('button',{name:'Abrir completa ↗',exact:true}).click()]);await popup.locator('h1').first().waitFor();await popup.close();result.interactions.push('full preview popup');await page.close();
 const wizard=await browser.newPage({viewport:{width:1280,height:1000}});wizard.on('pageerror',e=>result.errors.push({wizard:true,message:e.message}));await wizard.goto('http://127.0.0.1:4015/admin/ciudades/nuevo');await wizard.getByLabel('Nombre / título',{exact:true}).fill('Ciudad de prueba');assert.equal(await wizard.getByLabel('Dirección de la página',{exact:true}).inputValue(),'ciudad-de-prueba');await wizard.getByRole('button',{name:'Continuar',exact:true}).click();await wizard.getByLabel('Descripción',{exact:true}).fill('Descripción del nuevo borrador');await wizard.getByRole('button',{name:'Continuar',exact:true}).click();await wizard.getByLabel('Título para Google',{exact:true}).fill('SEO de prueba');await wizard.getByRole('button',{name:'Continuar',exact:true}).click();await wizard.frameLocator('iframe').locator('#featuredCareersTitle').filter({hasText:'Ciudad de prueba'}).waitFor();assert.equal(await wizard.frameLocator('iframe').locator('.city-featured-description').textContent(),'Descripción del nuevo borrador');result.interactions.push('new city wizard preview before draft creation');await wizard.close();
 const mobile=await browser.newPage({viewport:{width:390,height:900}});await mobile.goto(`http://127.0.0.1:4015/admin/instituciones/${instId}`);await mobile.getByRole('button',{name:'Abrir menú',exact:true}).click();await mobile.getByRole('dialog').getByRole('link',{name:'Ciudades',exact:true}).waitFor();await mobile.getByRole('button',{name:'Cerrar menú',exact:true}).click();await mobile.getByRole('button',{name:'Vista previa',exact:true}).click();const modal=mobile.getByRole('region',{name:'Vista previa en vivo'}).first();await modal.frameLocator('iframe').locator('#instName').waitFor();assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);await mobile.screenshot({path:`${output}/cms-preview-mobile.png`});await mobile.getByRole('button',{name:'Editar',exact:true}).click();result.interactions.push('mobile drawer and full preview modal');await mobile.close();
 for(const width of [1440,768,390]){
  const p=await browser.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>result.errors.push({real:true,width,message:e.message}));
  for(const route of ['/admin/login','/concepcion','/concepcion/universidad-siglo-21','/concepcion/universidad-siglo-21/carreras/abogacia']){const response=await p.goto('http://localhost:4004'+route);await p.locator('h1').first().waitFor();assert.equal(response.status(),200);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' public overflow');if(width===1440||width===390)await p.screenshot({path:`${output}/real-${route.replaceAll('/','-')}-${width}.png`});result.public.push({route,width,status:200});}
  await p.close();
 }
 assert.deepEqual(result.errors,[]);
 console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
