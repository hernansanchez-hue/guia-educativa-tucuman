// UI acceptance in an explicitly isolated harness; never bypasses real Auth.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {HOME_CONTENT} from '../lib/admin/home-editorial.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/cesar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output='C:/Users/cesar/.codex/visualizations/2026/07/30/019fb113-3399-7862-ba8d-41e4e6b5f0cd';
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],layouts=[],interactions=[],publicChecks=[];
try {
  for(const width of [1440,1280,768,390]){
    const p=await browser.newPage({viewport:{width,height:900}});
    p.on('pageerror',e=>errors.push(e.message));
    await p.goto('http://127.0.0.1:4015/admin/home');
    await p.getByRole('heading',{name:'Home',exact:true}).waitFor();
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await p.screenshot({path:`${output}/home-admin-${width}.png`});
    layouts.push({width,overflow:false,actions:'TEST HARNESS ONLY'});
    if(width===1440){
      const frame=p.frameLocator('iframe').first();
      await frame.locator('.home-map-hero h1').waitFor();
      assert.equal(await frame.locator('.public-site-background-lines').count(),0);
      assert.equal(await frame.locator('footer').count(),0);
      await p.getByRole('button',{name:'Portada',exact:true}).click();
      await p.locator('[id="field-root.data.titleBefore"]').fill('Título temporal Home');
      await frame.locator('h1').filter({hasText:'Título temporal Home'}).waitFor();
      assert.equal(await frame.locator('h1').getAttribute('data-cms-selected'),'true');
      interactions.push('unsaved text and highlight rendered by real HomeMapClient');
      const frames=p.frames().filter(f=>f.url().includes('/vista-previa/home'));
      await frames[0].evaluate(()=>{window.__homeScrollCalls=0;Element.prototype.scrollIntoView=function(){window.__homeScrollCalls++;};});
      await p.locator('[id="field-root.data.titleBefore"]').fill('Otra prueba Home');
      await frame.locator('h1').filter({hasText:'Otra prueba Home'}).waitFor();
      assert.equal(await frames[0].evaluate(()=>window.__homeScrollCalls),0);
      interactions.push('typing in the same field does not trigger scroll');
      await frame.locator('h1 span').click();
      await p.waitForFunction(()=>document.activeElement?.id==='field-root.data.titleHighlight');
      assert.equal(await p.locator('[id="field-root.data.titleHighlight"]').evaluate(el=>el===document.activeElement),true);
      interactions.push('click-to-edit selects the specific highlighted title, not its parent');
      await p.getByRole('button',{name:'Guardar borrador',exact:true}).click();
      await p.getByRole('status').filter({hasText:'Borrador guardado'}).waitFor();
      await p.getByRole('button',{name:'Publicar cambios',exact:true}).first().click();
      await p.getByRole('dialog').getByRole('button',{name:'Publicar',exact:true}).click();
      await p.getByRole('status').filter({hasText:'Publicado ·'}).waitFor();
      interactions.push('save/publish UI · simulated actions, no database mutation');
      await p.locator('[id="field-root.data.titleBefore"]').fill('Descartar Home');
      await p.getByRole('button',{name:'Descartar cambios',exact:true}).click();
      assert.equal(await p.locator('[id="field-root.data.titleBefore"]').inputValue(),'Otra prueba Home');
      interactions.push('discard restores the saved draft');
      for(const device of ['Tablet','Móvil','Desktop']){
        await p.getByRole('button',{name:device,exact:true}).first().click();
        assert.equal(await frames[0].evaluate(()=>innerWidth),{Tablet:768,'Móvil':390,Desktop:1440}[device]);
      }
      interactions.push('preview uses real responsive viewports');
    }
    if(width===390){
      await p.getByRole('button',{name:'Vista previa',exact:true}).click();
      const modal=p.getByRole('region',{name:'Vista previa en vivo'}).first();
      await modal.frameLocator('iframe').locator('h1').waitFor();
      await modal.getByRole('button',{name:'Móvil',exact:true}).click();assert.equal(await modal.getByRole('button',{name:'Móvil',exact:true}).getAttribute('aria-pressed'),'true');
      assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      interactions.push('mobile full preview modal without overflow');
    }
    await p.close();
  }
  for(const width of [1440,768,390]){
    const p=await browser.newPage({viewport:{width,height:900}});
    p.on('pageerror',e=>errors.push(e.message));
    const response=await p.goto('http://localhost:4004/',{waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    assert.equal(await p.locator('h1').textContent(),`${HOME_CONTENT.titleBefore} ${HOME_CONTENT.titleHighlight} ${HOME_CONTENT.titleAfter}`);
    assert.equal(await p.locator('video source').getAttribute('src'),HOME_CONTENT.video);
    assert.equal(await p.locator('.home-map-hero-logo').getAttribute('src'),HOME_CONTENT.logo);
    assert.equal(await p.locator('footer').count(),0);
    assert.equal(await p.locator('.public-site-background-lines').count(),0);
    assert.equal(await p.locator('.home-map-department').count(),17);
    const geometry=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,logo:document.querySelector('.home-map-hero-logo').getBoundingClientRect().toJSON(),h1:document.querySelector('h1').getBoundingClientRect().toJSON()}));
    assert.equal(geometry.overflow,false);
    assert.equal(Math.round(geometry.logo.width),160);
    // Before-change screenshots: same 900px viewport and original title metrics.
    assert.ok(Math.abs(geometry.h1.height-({1440:108,768:69.09375,390:134.75}[width]))<1);
    await p.getByRole('searchbox').fill('Concepción');
    await p.getByRole('option').filter({hasText:'Concepción'}).first().waitFor();
    await p.getByRole('button',{name:'Limpiar búsqueda'}).click();
    await p.screenshot({path:`${output}/home-after-${width}.png`});
    publicChecks.push({...geometry,search:true,video:true,footer:false,backgroundLines:false});
    await p.close();
  }
  for(const route of ['/admin/home','/admin/vista-previa/home']){
    const response=await fetch(`http://localhost:4004${route}`,{redirect:'manual'});
    assert.equal(response.status,307);
    assert.match(response.headers.get('location'),/\/admin\/login/);
    assert.match(response.headers.get('cache-control'),/no-store/);
    assert.match(response.headers.get('x-robots-tag'),/noindex/);
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({layouts,interactions,publicChecks,anonymousGuards:2,errors,realAuth:'NOT TESTED'},null,2));
}finally{await browser.close();}
