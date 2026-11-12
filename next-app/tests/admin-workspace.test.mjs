import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceNavigation,advancedLinks} from '../lib/admin/workspace-navigation.mjs';
import {canAdmin} from '../lib/admin/permissions.mjs';
import {editorFields} from '../lib/admin/editor-fields.mjs';
import {automaticCitySlides,seedCitySlides,resolveCitySlides,validateCitySlides} from '../lib/admin/city-slider.mjs';
import {editorialCatalog,cityPageFromCatalog,validateEditorialPayload} from '../lib/admin/editorial-model.mjs';
import {createContentDocument,saveContentDraft,publishContentDocument,readPublishedContent} from '../lib/admin/content-document.mjs';
const actor={id:'00000000-0000-4000-8000-000000000001',role:'SUPERADMIN',isActive:true};
test('daily navigation groups content and hides incomplete/advanced standalone modules',()=>{
 const groups=workspaceNavigation(actor),routes=groups.flatMap(g=>g.links.map(l=>l[1]));
 assert.deepEqual(groups.map(g=>g.label),['Inicio','Contenido','Recursos','Administración']);
 for(const route of ['home','ciudades','instituciones','carreras','capacitaciones','eventos','servicios','nosotros','orientacion-vocacional','multimedia','ajustes'])assert.ok(routes.includes(route));
 for(const route of ['menus','footer','diseno','configuracion','seo','banners','legal','formularios','contacto','cursos-docentes'])assert.ok(!routes.includes(route));
 assert.equal(new Set(routes).size,routes.length);
});
test('advanced navigation respects protected role capabilities',()=>{
 const editor={...actor,role:'EDITOR'};
 assert.ok(!workspaceNavigation(editor).flatMap(g=>g.links).some(l=>l[1]==='usuarios'));
 assert.deepEqual(advancedLinks(editor).map(l=>l.route),['menus','footer','seo']);
 assert.equal(canAdmin(editor,'publish'),false);assert.equal(canAdmin(editor,'users'),false);
});
test('city editing follows its actual public composition and exposes slider first',()=>{
 const fields=editorFields('city');
 assert.deepEqual(Object.keys(fields).slice(0,6),['Slider principal','Orientación vocacional','Expo Carreras GET','Instituciones destacadas','Todas las instituciones','Propuesta educativa']);
 assert.equal(fields['Slider principal'][0].type,'city-slider');
});
test('renaming sections retains the training name, institution and academic controls',()=>{
 const groups=editorFields('training-offering');
 for(const path of ['shared.data.name','root.data.institutionId'])assert.ok(groups['Información'].some(f=>f.path===path));
 for(const path of ['root.data.duration','root.data.modality'])assert.ok(groups['Datos académicos'].some(f=>f.path===path));
});
for(const slug of ['concepcion','monteros','aguilares'])test(`${slug}: materialized slider preserves all seven approved slides, images, copy and routes`,()=>{
 const city=cityPageFromCatalog(editorialCatalog(),slug),automatic=automaticCitySlides(city),seeded=resolveCitySlides({...city,slides:seedCitySlides(city)});
 assert.equal(automatic.length,7);assert.equal(seeded.length,automatic.length);
 assert.equal(new Set(automatic.map(slide=>slide.id)).size,automatic.length);
 for(let i=0;i<automatic.length;i++){
  assert.equal(seeded[i].title,city.heroTitle||automatic[i].name);
  assert.equal(seeded[i].description,city.heroDescription||automatic[i].description);
  assert.equal(seeded[i].image,city.heroImage||automatic[i].image);
  assert.equal(seeded[i].route,automatic[i].route);
  assert.deepEqual(seeded[i].institution,automatic[i].institution);
 }
});
test('slider ordering, duplicate and visibility operate without mutating the automatic content',()=>{
 const city=cityPageFromCatalog(editorialCatalog(),'concepcion'),slides=seedCitySlides(city),before=structuredClone(slides);
 const next=[{...slides[1],id:'copy'}, {...slides[0],active:false},slides[2]];
 assert.deepEqual(resolveCitySlides({...city,slides:next}).map(s=>s.id),['copy',slides[2].id]);
 assert.deepEqual(slides,before);validateCitySlides(next,{complete:true});
});
test('slider drafts do not leak and publication still creates an immutable version',()=>{
 const city=cityPageFromCatalog(editorialCatalog(),'concepcion'),payload={_kind:'city',data:{...city,slides:seedCitySlides(city)}};
 delete payload.data.institutions;delete payload.data.featuredInstitutions;
 let doc=createContentDocument({moduleId:'cities',entityKey:city.id,payload,actor});doc=publishContentDocument(doc,{expectedRevision:doc.revision,actor});
 const changed=structuredClone(payload);changed.data.slides[0].title='Cambio en borrador';
 doc=saveContentDraft(doc,{payload:validateEditorialPayload(changed),expectedRevision:doc.revision,actor});
 assert.notEqual(readPublishedContent(doc).data.slides[0].title,'Cambio en borrador');
 doc=publishContentDocument(doc,{expectedRevision:doc.revision,actor});
 assert.equal(doc.versions.length,2);assert.equal(readPublishedContent(doc).data.slides[0].title,'Cambio en borrador');assert.deepEqual(doc.versions[0].payload,payload);
});
test('slider rejects executable/private URLs, duplicate IDs and incomplete publication',()=>{
 const city=cityPageFromCatalog(editorialCatalog(),'concepcion'),slide=seedCitySlides(city)[0];
 for(const href of ['javascript:alert(1)','//evil.test','/admin/login','/api/test','/x/../admin/login','/%61dmin/login'])assert.throws(()=>validateCitySlides([{...slide,href}]));
 assert.throws(()=>validateCitySlides([slide,slide]));
 assert.throws(()=>validateCitySlides([{...slide,title:''}],{complete:true}));
 assert.doesNotThrow(()=>validateCitySlides([{...slide,title:''}]));
});
test('public city block overrides are optional and validated without changing the original source',()=>{
 const city=editorialCatalog().cities[0];
 assert.doesNotThrow(()=>validateEditorialPayload({_kind:'city',data:city}));
 assert.throws(()=>validateEditorialPayload({_kind:'city',data:{...city,expoImage:'javascript:x'}}));
 assert.throws(()=>validateEditorialPayload({_kind:'city',data:{...city,orientationVisible:'yes'}}));
});
