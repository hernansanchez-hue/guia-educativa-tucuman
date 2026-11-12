import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publicFooterLinks} from '../lib/public-catalog/footer-links.mjs';
import config from '../next.config.mjs';

test('retired city index has an exact 301, never a duplicate public page',async()=>{
 const rules=await config.redirects();
 assert.deepEqual(rules.find(r=>r.source==='/ciudades'),{source:'/ciudades',destination:'/',statusCode:301});
 const routes=readFileSync(new URL('../lib/public-catalog/public-routes-catalog.js',import.meta.url),'utf8');
 assert.equal(routes.includes('"/ciudades"'),false);
});
test('footer required destinations survive legacy content, without duplicates or demo actions',()=>{
 const links=publicFooterLinks([{id:'old',label:'Old',href:'/nosotros'},{id:'dup',label:'Duplicate',href:'/nosotros'},{id:'choose',label:'Elegir ciudad',href:'/ciudades'},{id:'demo',label:'FAQ',href:''},{id:'institucional',label:'Instituciones',href:'https://instituciones.example.test'}]);
 assert.deepEqual(links.slice(0,6).map(l=>l.href),['/instituciones','/carreras','/cursos-docentes','/servicios','/nosotros','/contacto']);
 assert.equal(new Set(links.map(l=>l.href)).size,links.length);
 assert.ok(links.some(l=>l.href==='/#ciudades'));
 assert.ok(links.some(l=>l.id==='institucional'));
 assert.ok(!links.some(l=>!l.href||l.href==='/ciudades'));
});
test('footer suppresses previously published Events links without removing contextual service links',()=>{
 const links=publicFooterLinks([
  {id:'eventos',label:'Eventos',href:'/eventos'},
  {id:'event-detail',label:'Agenda',href:'/eventos/actividad'},
  {id:'legacy-agenda',label:'Agenda',href:'https://guiaeducativatuc.com.ar/eventos/?ciudad=concepcion'},
  {id:'service',label:'Eventos en ciudades',href:'/servicios/eventos-en-ciudades'},
 ]);
 assert.ok(!links.some(l=>l.href.includes('/eventos')&&!l.href.startsWith('/servicios/')));
 assert.ok(links.some(l=>l.id==='service'));
});

