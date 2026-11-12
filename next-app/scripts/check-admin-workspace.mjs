// Isolated UI fixtures only. No Auth, remote content writes, uploads or emails.
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {documents} from '../tests/admin-visual/fixtures.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=process.env.GET_VISUAL_OUTPUT;
if(!output)throw Error('GET_VISUAL_OUTPUT is required.');
const base='http://127.0.0.1:4015';
const city=documents.find(d=>d.draft._kind==='city'&&d.draft.data.id==='concepcion').id;
const inst=documents.find(d=>d.draft._kind==='institution'&&d.draft.data.id==='universidad-siglo-21-concepcion').id;
const offer=documents.find(d=>d.draft._kind==='offering').id;
const routes=[['dashboard','/admin'],['ciudades','/admin/ciudades'],['concepcion',`/admin/ciudades/${city}`],['instituciones','/admin/instituciones'],['institucion',`/admin/instituciones/${inst}`],['carreras','/admin/carreras'],['carrera',`/admin/carreras/${offer}`],['eventos','/admin/eventos'],['servicios','/admin/servicios'],['orientacion','/admin/orientacion-vocacional'],['nosotros','/admin/nosotros'],['multimedia','/admin/multimedia'],['ajustes','/admin/ajustes'],['seo','/admin/seo'],['usuarios','/admin/usuarios'],['historial','/admin/historial'],['home','/admin/home'],['capacitaciones','/admin/capacitaciones']];
const sizes=[[1920,1080],[1440,900],[1366,768],[768,1024],[390,844]];
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],result={views:0,flows:[],screenshots:[],mode:'isolated UI fixtures; not a human authenticated acceptance'};
try{
 for(const [width,height]of (process.env.GET_CMS_FLOWS_ONLY==='1'?[]:sizes)){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  for(const [label,route]of routes){
   await page.goto(base+route);await page.locator('h1').first().waitFor();
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} overflow at ${width}`);
   if([1920,1440,390].includes(width)){
    const filename=`cms-ux-${label}-${width}.png`;
    await page.screenshot({path:output+'/'+filename,fullPage:!['concepcion','institucion','carrera'].includes(label),animations:'disabled'});
    result.screenshots.push(filename);
   }
   result.views++;
  }
  await page.close();console.log(`Responsive ${width}×${height}: ${routes.length} views OK`);
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/admin');
 await page.locator('section').filter({has:page.getByRole('heading',{name:'Accesos rápidos'})}).getByRole('link',{name:'Editar página'}).first().click();
 await page.getByRole('heading',{name:'Slider principal',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Editar diapositiva',exact:true}).count(),5);
 await page.getByRole('button',{name:'Editar diapositiva',exact:true}).first().click();
 await page.getByLabel('Título',{exact:true}).fill('Portada de prueba');
 await page.frameLocator('iframe').first().locator('#featuredCareersTitle').filter({hasText:'Portada de prueba'}).waitFor();
 await page.getByRole('button',{name:'Duplicar',exact:true}).first().click();
 assert.equal(await page.getByRole('button',{name:'Editar diapositiva',exact:true}).count(),6);
 await page.getByRole('button',{name:'Guardar borrador',exact:true}).click();await page.getByRole('status').filter({hasText:'Borrador guardado'}).waitFor();
 await page.screenshot({path:output+'/cms-ux-slider-1440.png',animations:'disabled'});
 result.flows.push('Dashboard → Concepción → slider: edit, live preview, duplicate, save draft (simulated)');
 await page.goto(base+'/admin/instituciones');await page.getByRole('link',{name:'Editar',exact:true}).first().click();await page.getByRole('heading',{name:'Información',exact:true}).waitFor();result.flows.push('Instituciones → editar');
 await page.goto(base+'/admin/carreras');await page.getByRole('link',{name:'Editar',exact:true}).first().click();await page.getByRole('button',{name:/Portada/}).click();await page.getByLabel('Imagen principal',{exact:true}).waitFor({state:'attached'});result.flows.push('Carreras → editar → Portada');
 await page.goto(base+'/admin/eventos');await page.getByRole('link',{name:'Crear evento',exact:true}).click();await page.getByRole('heading',{name:'Crear evento',exact:true}).waitFor();await page.getByLabel('Nombre / título',{exact:true}).fill('Evento de revisión');assert.equal(await page.getByLabel('Dirección de la página',{exact:true}).inputValue(),'evento-de-revision');await page.getByRole('button',{name:'Continuar',exact:true}).click();await page.getByRole('button',{name:'Elegir o subir imagen',exact:true}).click();await page.getByRole('dialog',{name:'Biblioteca multimedia',exact:true}).getByRole('button').filter({hasText:'Logo GET'}).click();await page.getByRole('dialog',{name:'Detalle del archivo',exact:true}).getByRole('button',{name:'Seleccionar archivo',exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),0);result.flows.push('Eventos → crear evento + dirección automática + MediaPicker sin diálogos bloqueados');
 await page.goto(base+'/admin/multimedia');await page.getByRole('button',{name:'+ Subir archivo',exact:true}).click();await page.getByRole('dialog',{name:'Subir archivo'}).waitFor();result.flows.push('Multimedia → subir archivo (no upload)');
 await page.goto(base+'/admin/usuarios');await page.getByRole('button',{name:'+ Invitar persona',exact:true}).click();await page.getByRole('dialog',{name:'Invitar persona'}).waitFor();await page.getByRole('dialog',{name:'Invitar persona'}).getByLabel('Email',{exact:true}).waitFor();result.flows.push('Usuarios → invitar (no email)');
 await page.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844}});mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto(base+`/admin/instituciones/${inst}`);await mobile.getByRole('button',{name:'Abrir menú',exact:true}).click();await mobile.getByRole('dialog').getByRole('link',{name:'Ciudades',exact:true}).waitFor();await mobile.getByRole('button',{name:'Cerrar menú',exact:true}).click();await mobile.getByRole('button',{name:'Vista previa',exact:true}).click();await mobile.frameLocator('iframe').first().locator('#instName').waitFor();await mobile.getByRole('button',{name:'Editar',exact:true}).click();await mobile.getByRole('heading',{name:'Información',exact:true}).waitFor();result.flows.push('Mobile menu + Editar / Vista previa');await mobile.close();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({...result,errors},null,2));
}finally{await browser.close();}
