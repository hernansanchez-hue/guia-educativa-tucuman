import test from 'node:test';
import assert from 'node:assert/strict';
import {seedExtendedEntries,extendedCatalog} from '../lib/admin/extended-editorial.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';
import {namespaceExtended,publicExtendedEntries,isExtendedRecord,extendedGroups} from '../lib/control/extended.mjs';
import {openLocalStore} from '../lib/control/local-store.mjs';
import {project,prepareContentWrite,validatePatch,referencedMedia} from '../lib/control/domain.mjs';
import {prepareCreation,epoch} from '../lib/control/creation.mjs';
import {assemble,makeEditor,previewData} from '../lib/control/workspace.mjs';
import {filterPublicEvents} from '../lib/events/public-events.mjs';

const base=()=>[...getVersionedPublicCatalogEntries(),...namespaceExtended(seedExtendedEntries().filter(e=>['events','services'].includes(e.moduleId)))];
function fixture(){
  const db=openLocalStore(':memory:'),entries=base();
  db.bootstrap('owner','Ensayo aislado');db.setMember('owner','editor','Edición','EDITOR',true);db.setMember('owner','reader','Lectura','LECTOR',true);
  const rows=()=>db.records('owner'),published=()=>project(entries,db.published());
  const write=(key,op,patch,who='owner',version=null)=>{
    const r=rows(),revision=r.find(x=>x.key===key)?.revision||0;
    const result=prepareContentWrite(entries,r,db.member(who),{key,op,revision,patch});
    db.write(who,key,op,revision,result.value,version,result.generation);return result;
  };
  return {db,entries,rows,published,write};
}
test('el namespace conserva identidades y separa ambos main sin modificar las fuentes heredadas',()=>{
  const raw=seedExtendedEntries(),before=JSON.stringify(raw),entries=namespaceExtended(raw);
  assert.equal(new Set(entries.map(e=>e.moduleId+':'+e.key)).size,entries.length);
  assert.ok(entries.some(e=>e.key==='extended/events/main'));
  assert.ok(entries.some(e=>e.key==='extended/services/main'));
  assert.deepEqual(namespaceExtended(entries),entries);
  assert.deepEqual(publicExtendedEntries(entries),raw);
  assert.equal(JSON.stringify(raw),before);
  assert.deepEqual(extendedCatalog(entries,{includeLegacy:false}).events.map(e=>e.id),extendedCatalog(raw,{includeLegacy:false}).events.map(e=>e.id));
  const hidden=entries.map(e=>e.payload._kind==='service'?{...e,payload:{...e.payload,data:{...e.payload.data,visible:false}}}:e);
  assert.equal(extendedCatalog(publicExtendedEntries(hidden)).services.length,0);
  assert.equal(extendedCatalog(publicExtendedEntries(entries)).events.length,extendedCatalog(raw).events.length);
});
test('evento: borrador privado, validación de confirmación, publicación, ocultar y restore con historial',()=>{
  const x=fixture(),before=JSON.stringify(x.entries),event=x.entries.find(e=>e.payload._kind==='event'),key=event.key;
  try{
    assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,0);
    x.write(key,'save',{status:'Confirmado'},'editor');
    assert.throws(()=>x.write(key,'publish'),/fecha real/);
    assert.throws(()=>x.write(key,'publish',null,'editor'),/permiso/);
    assert.throws(()=>x.write(key,'save',{description:'No permitido'},'reader'),/permiso/);
    const patch={status:'Confirmado',startDate:'2027-04-10',location:'Auditorio de ensayo',ctaHref:'/contacto',ctaLabel:'Consultar'};
    x.write(key,'save',patch,'editor');
    const model=makeEditor(assemble(x.entries,x.rows()),key),preview=previewData(model.previewSource,[],key,model.patch,'normal');
    assert.equal(preview.props.event.startDate,patch.startDate);
    assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,0);
    x.write(key,'publish');assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,1);
    x.write(key,'save',{...patch,visible:false});x.write(key,'publish');
    assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,0);
    const hidden=x.db.history('owner').find(e=>e.operation==='publish');
    x.write(key,'restore',null,'owner',hidden.id);
    assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,0);
    x.write(key,'publish');assert.equal(filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events).length,1);
    assert.ok(x.db.history('owner').some(e=>e.operation==='restore'));assert.equal(JSON.stringify(x.entries),before);
  }finally{x.db.close();}
});
test('servicio y textos de agenda usan el mismo editor, sin colisiones ni pérdida de campos no editados',()=>{
 const x=fixture();try{
   const entry=x.entries.find(e=>e.payload._kind==='service'&&e.payload.data.slug==='redes-sociales'),original=structuredClone(entry.payload.data);
   x.write(entry.key,'save',{content:'Texto de prueba aislada',seo:{title:'SEO de ensayo'}});
   assert.equal(extendedCatalog(x.published(),{includeLegacy:false}).services.find(e=>e.id===original.id).content,undefined);
   const model=makeEditor(assemble(x.entries,x.rows()),entry.key);
   assert.equal(previewData(model.previewSource,[],entry.key,model.patch).props.service.content,'Texto de prueba aislada');
   x.write(entry.key,'publish');
   const current=extendedCatalog(x.published(),{includeLegacy:false}).services.find(e=>e.id===original.id);
   assert.equal(current.slug,original.slug);assert.deepEqual(current.visual,original.visual);assert.equal(current.cmsSeo.title,'SEO de ensayo');
   const agenda=x.entries.find(e=>e.key==='extended/events/main');
   x.write(agenda.key,'save',{copy:{...agenda.payload.data.copy,text02:'Título de ensayo'}});x.write(agenda.key,'publish');
   const ext=extendedCatalog(x.published(),{includeLegacy:false});assert.equal(ext.eventsPage.copy.text02,'Título de ensayo');
   assert.equal(ext.servicesPage.heroTitle,x.entries.find(e=>e.key==='extended/services/main').payload.data.heroTitle);
   assert.ok(Object.values(extendedGroups('service')).flat().some(f=>f.path==='root.data.content'));
 }finally{x.db.close();}
});
test('alta de evento conserva privacidad, ciudad real, slug único y permite publicar sin insertar demos',()=>{
 const x=fixture();try{
  const city=x.entries.find(e=>e.payload._kind==='city'),input={kind:'event',name:'Encuentro de prueba aislada',cityId:city.payload.data.id,category:'Encuentro'};
  const plan=prepareCreation(input,project(x.entries,x.rows(),true),x.published());
  assert.ok(isExtendedRecord(plan));x.db.write('editor',plan.key,'save',0,plan.draft,null,epoch(x.rows()));
  assert.equal(extendedCatalog(x.published(),{includeLegacy:false}).events.length,7);
  const model=makeEditor(assemble(x.entries,x.rows()),plan.key);assert.equal(model.unpublished,true);assert.equal(model.url,null);
  assert.throws(()=>prepareCreation(input,project(x.entries,x.rows(),true),x.published()),/evento/);
  x.write(plan.key,'save',{visible:true,status:'Confirmado',startDate:'2027-05-02',location:'Sede de ensayo',image:'/assets/events/evento.jpg'});
  x.write(plan.key,'publish');
  const result=filterPublicEvents(extendedCatalog(x.published(),{includeLegacy:false}).events);assert.equal(result.length,1);assert.equal(result[0].city,city.payload.data.name);
 }finally{x.db.close();}
});
test('se rechazan IDs/slugs/planes, URLs privadas, fechas imposibles y asociaciones inexistentes',()=>{
 const entries=base(),event=entries.find(e=>e.payload._kind==='event');
 for(const patch of [{id:'otro'},{slug:'otro'},{plan:'Premium'},{image:'/administrador/archivo/secreto.png'},{ctaHref:'javascript:alert(1)'},{startDate:'2027-02-30'},{city:'No existe'},{institutions:['no-existe']}]){
   assert.throws(()=>validatePatch(event,patch,entries),JSON.stringify(patch));
 }
 const id='00000000-0000-4000-a000-000000000001.png';
 assert.deepEqual([...referencedMedia(validatePatch(event,{image:'/media/control/'+id},entries))],[id]);
});
