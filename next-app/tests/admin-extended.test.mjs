import test from 'node:test';
import assert from 'node:assert/strict';
import {seedExtendedEntries,extendedCatalog,EXTENDED_KINDS,extendedTrainingPage,validateExtendedPayload} from '../lib/admin/extended-editorial.mjs';
import {editorialCatalog,seedEditorialEntries,pageForEntry,relatedRoutes,publicationRedirects,composeInstitution} from '../lib/admin/editorial-model.mjs';
import {editorFields,setField} from '../lib/admin/editor-fields.mjs';
import {createContentDocument,publishContentDocument,saveContentDraft,readPublishedContent,createPreviewPayload} from '../lib/admin/content-document.mjs';
import {newEditorialPreview} from '../lib/admin/new-editorial-preview.mjs';
import {events} from '../app/data/events.js';
import {services} from '../app/data/services.js';
import {trainingPrograms} from '../app/data/trainingPrograms.js';
import {editorialLinkWarnings,validateExtendedPublication} from '../lib/admin/editor-links.mjs';
const actor={id:'extended-domain-test',role:'SUPERADMIN',isActive:true};
const seeds=()=>seedExtendedEntries();
test('34 extended documents contain only approved events, services and actual trainings',()=>{
 const rows=seeds(),ext=extendedCatalog(rows);assert.equal(rows.length,34);assert.deepEqual(ext.events.map(e=>e.id),events.map(e=>e.id));assert.deepEqual(ext.services.map(s=>s.name),services.map(s=>s.name));assert.deepEqual(ext.trainings.map(t=>t.name),trainingPrograms.map(t=>t.name));assert.equal(ext.about.team.length,5);rows.forEach(e=>validateExtendedPayload(e.payload));
});
test('extended imports are idempotent and tombstones never resurrect source data',()=>{const rows=seeds();assert.deepEqual(extendedCatalog(rows),extendedCatalog([...rows,...rows]));const service=rows.find(e=>e.payload._kind==='service');assert.ok(!extendedCatalog([{...service,visibility:'hidden',payload:null}]).services.some(s=>s.id===service.payload.data.id));});
for(const kind of ['event','service','training-offering','about','orientation','navigation','footer']){
 test(`${kind}: draft and preview remain private, publish appends immutable history`,()=>{
 const e=seeds().find(e=>e.payload._kind===kind);let doc=createContentDocument({moduleId:e.moduleId,entityKey:e.key,payload:e.payload,actor});doc=publishContentDocument(doc,{expectedRevision:doc.revision,actor});const before=readPublishedContent(doc),p=structuredClone(doc.draft);if(kind==='training-offering')p.data.duration='Duración de prueba';else if(kind==='about')p.data.copy.text01='Texto de prueba';else if(kind==='footer')p.data.address='Dirección de prueba';else if(kind==='navigation')p.data.searchPlaceholder='Texto de prueba';else if(kind==='orientation')p.data.description='Texto de prueba';else p.data.name='Nombre de prueba';
 validateExtendedPayload(p);assert.deepEqual(createPreviewPayload(doc,p,actor),p);doc=saveContentDraft(doc,{payload:p,expectedRevision:doc.revision,actor});assert.deepEqual(readPublishedContent(doc),before);doc=publishContentDocument(doc,{expectedRevision:doc.revision,actor});assert.deepEqual(readPublishedContent(doc),p);assert.deepEqual(doc.versions[0].payload,before);assert.equal(doc.versions.length,2);
 });
}
test('every visual module resolves actual public props and editor fields',()=>{const c=editorialCatalog([...seedEditorialEntries(),...seeds()]);for(const kind of Object.keys(EXTENDED_KINDS).filter(k=>k!=='training')){const e=seeds().find(e=>e.payload._kind===kind);assert.ok(pageForEntry(c,e).props,kind);assert.ok(Object.keys(editorFields(kind)).length>1,kind);}});
test('service and event slug changes create targeted redirects without changing stable IDs',()=>{for(const kind of ['event','service']){const rows=seeds(),before=editorialCatalog(structuredClone(rows)),e=rows.find(e=>e.payload._kind===kind),old=e.payload.data.slug;e.payload.data.slug=old+'-actualizado';const after=editorialCatalog(rows),redirects=publicationRedirects(before,after);assert.ok(redirects.some(r=>r.from.endsWith('/'+old)&&r.to.endsWith('/'+old+'-actualizado')));assert.ok(!relatedRoutes(after,[e]).includes('/'));}});
test('training updates reach its page and institution summaries, with contextual routes',()=>{const rows=seeds(),program=rows.find(e=>e.payload._kind==='training');program.payload.data.name='Nombre editado';const c=editorialCatalog(rows),ext=extendedCatalog(rows),o=ext.trainingOfferings.find(o=>o.trainingProgramId===program.payload.data.id),i=c.institutions.find(i=>i.id===o.institutionId),page=extendedTrainingPage(c,ext,i.citySlug,i.slug,program.payload.data.slug);assert.equal(page.program.name,'Nombre editado');assert.equal(composeInstitution(c,i.id).careers.find(s=>s.id===program.payload.data.id).name,'Nombre editado');});
test('creation previews use the event/service renderer without persisting or inventing identities',()=>{for(const type of ['eventos','servicios']){const parts=newEditorialPreview(type,{name:'Nuevo',slug:'nuevo'});assert.equal(parts[0].payload._kind,type==='eventos'?'event':'service');assert.ok(pageForEntry(editorialCatalog(parts),parts[0]).props);assert.equal(parts[0].payload.data.name,'Nuevo');}});
test('orientation visibility is not discarded by singleton fallback',()=>{const e=seeds().find(e=>e.payload._kind==='orientation');e.payload.data.visible=false;assert.equal(extendedCatalog([e]).orientation.visible,false);});
test('unsafe resources, arbitrary fields, invalid graphics and executable markup are rejected',()=>{
 const p=seeds().find(e=>e.payload._kind==='event').payload;
 for(const gallery of [['javascript:x'],['/admin/media/a.png'],['//other.test/a.png'],['/docs/legal/draft.pdf']])assert.throws(()=>validateExtendedPayload({...p,data:{...p.data,gallery}}));
 for(const data of [{...p.data,image:'http://unsafe.test/a.png'},{...p.data,name:'<script>x</script>'},{...p.data,privateKey:'secret'},{...p.data,slug:'../admin'}])assert.throws(()=>validateExtendedPayload({...p,data}));
 const service=seeds().find(e=>e.payload._kind==='service').payload;assert.throws(()=>validateExtendedPayload({...service,data:{...service.data,visual:{...service.data.visual,tone:'random'}}}));
});
test('team collections are editable without JSON, visibility/order do not change public markup schema',()=>{const e=seeds().find(e=>e.payload._kind==='about'),team=e.payload.data.team;e.payload.data.team=[{...team[1],visible:false},team[0],...team.slice(2)];assert.ok(validateExtendedPayload(e.payload));const f=editorFields('about').Equipo.find(f=>f.type==='collection');assert.ok(f.itemFields.some(f=>f.path==='photo'));assert.ok(f.itemFields.some(f=>f.path==='visible'));const next=setField({root:e.payload},'root.data.team.1.name','Nombre editable');assert.equal(next.root.data.team[1].name,'Nombre editable');});
test('menu destinations outside the actual catalog are warned, contextual navigation stays intact',()=>{const p=seeds().find(e=>e.payload._kind==='navigation').payload;p.data.items.push({id:'test',label:'Destino de prueba',href:'/ruta-inexistente',contextual:false,visible:true});assert.equal(editorialLinkWarnings(editorialCatalog(seeds()),p).length,1);});
test('publication validates dates and incomplete visible team rows without rejecting drafts',()=>{const p=seeds().find(e=>e.payload._kind==='about').payload;p.data.team[0].name='';assert.ok(validateExtendedPayload(p));assert.throws(()=>validateExtendedPublication(p));const e=seeds().find(e=>e.payload._kind==='event').payload;assert.throws(()=>validateExtendedPublication({...e,data:{...e.data,startDate:'2027-02-10',endDate:'2027-01-01'}}));});

