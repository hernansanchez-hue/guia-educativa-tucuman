import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import test from 'node:test';
import {isPublicNavigationItemActive,navigationContent,resolvePublicNavigation} from '../app/data/publicSiteContent.js';

const visible=menu=>menu.items.filter(item=>item.visible!==false);

test('the shared public menu exposes only Inicio, Instituciones and Carreras',()=>{
 const items=visible(navigationContent);
 assert.deepEqual(items.map(item=>item.label),['Inicio','Instituciones','Carreras']);
 assert.deepEqual(items.map(item=>item.href),['/','/instituciones','/carreras']);
 assert.equal(items.some(item=>['Eventos','Nosotros'].includes(item.label)),false);
});

test('published legacy navigation is normalized through the shared public configuration',()=>{
 const menu=resolvePublicNavigation({id:'navigation',items:[{id:'eventos',label:'Eventos',href:'/eventos',visible:true}]});
 assert.deepEqual(visible(menu).map(item=>item.id),['inicio','instituciones','carreras']);
});

test('institution and career routes receive their corresponding active public navigation state',()=>{
 const items=navigationContent.items;
 const active=(path,homeHref='/')=>items.filter(item=>isPublicNavigationItemActive(item,path,homeHref)).map(item=>item.id);
 assert.deepEqual(active('/instituciones'),['instituciones']);
 assert.deepEqual(active('/instituciones/universidad-siglo-21'),['instituciones']);
 assert.deepEqual(active('/carreras'),['carreras']);
 assert.deepEqual(active('/carreras/abogacia'),['carreras']);
 assert.deepEqual(active('/concepcion/universidad-siglo-21'),['instituciones']);
 assert.deepEqual(active('/concepcion/universidad-siglo-21/carreras/abogacia'),['carreras']);
 assert.deepEqual(active('/concepcion'),['inicio']);
 assert.deepEqual(active('/concepcion','/concepcion'),['inicio']);
});

test('Eventos and Nosotros remain available routes outside the main navigation',()=>{
 assert.equal(existsSync(new URL('../app/eventos/page.js',import.meta.url)),true);
 assert.equal(existsSync(new URL('../app/nosotros/page.js',import.meta.url)),true);
});
