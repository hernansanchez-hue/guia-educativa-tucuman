import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd';
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],routes=['/admin/diseno','/admin/configuracion','/admin/seo','/admin/seo/redirects','/admin/usuarios','/admin/historial','/admin/buscar'];let views=0;
try{
 for(const width of [1440,1280,1024,768,390]){const p=await browser.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push(e.message));
 for(const route of routes){await p.goto('http://127.0.0.1:4015'+route);await p.locator('h1').waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' '+width);await p.screenshot({path:out+'/final-'+route.split('/').slice(2).join('-')+'-'+width+'.png',fullPage:true});views++;}
 await p.close();}
 const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4015/admin/diseno');await p.locator('#token-font').selectOption('Geist');await p.getByRole('button',{name:'Guardar borrador',exact:true}).click();await p.getByRole('button',{name:'Publicar',exact:true}).click();await p.locator('dialog[open]').waitFor();assert.match(await p.locator('dialog[open]').innerText(),/configuración global/);await p.getByRole('button',{name:'Cancelar',exact:true}).click();
 await p.goto('http://127.0.0.1:4015/admin/seo');await p.getByRole('button',{name:'Editar SEO',exact:true}).first().click();await p.locator('#seo-title').fill('Prueba SEO');await p.getByRole('button',{name:'Guardar borrador',exact:true}).click();await p.getByRole('status').filter({hasText:'simulado'}).waitFor();
 await p.goto('http://127.0.0.1:4015/admin/historial');await p.getByRole('button',{name:'Ver cambio'}).first().click();await p.getByRole('button',{name:'Restaurar esta versión'}).waitFor();await p.getByRole('button',{name:'Restaurar esta versión'}).click();assert.match(await p.locator('dialog[open]').innerText(),/versión 1/);await p.getByRole('button',{name:'Cancelar',exact:true}).click();
 await p.close();assert.deepEqual(errors,[]);console.log(JSON.stringify({views,interactions:3,errors,mode:'isolated fixtures, not real Auth'}));
}finally{await browser.close();}
