import test from 'node:test';
import assert from 'node:assert/strict';
import {openLocalStore} from '../lib/control/local-store.mjs';
import {applyPatch,validatePatch,project} from '../lib/control/domain.mjs';
import {assemble,makeEditor,previewData} from '../lib/control/workspace.mjs';
import {editorialCatalog,cityPageFromCatalog} from '../lib/admin/editorial-model.mjs';
import {resolveCitySlides} from '../lib/admin/city-slider.mjs';

const row=(moduleId,key,_kind,data)=>({moduleId,key,visibility:'published',payload:{_kind,data}});
function fixture(){
 return [
  row('cities','ciudad-a','city',{id:'ciudad-a',slug:'ciudad-a',name:'Ciudad de ensayo A',institutionIds:['v'],featuredInstitutionIds:[]}),
  row('cities','ciudad-b','city',{id:'ciudad-b',slug:'ciudad-b',name:'Ciudad de ensayo B',institutionIds:[],featuredInstitutionIds:[]}),
  row('institutions','marca/m','brand',{id:'m',slug:'m',name:'Nombre oficial de ensayo'}),
  row('institutions','sede/v','institution',{id:'v',slug:'v',brandId:'m',cityId:'ciudad-a',type:'Instituto de ensayo',gallery:[],plan:'Básico',featuredCareerIds:[],featured:false,premium:false}),
  row('careers','carrera/c','career',{id:'c',slug:'c',name:'Carrera de ensayo',studyPlan:[],requirements:[],faq:[]}),
  row('careers','oferta/o','offering',{id:'o',careerId:'c',institutionId:'v',degree:'Título de ensayo',visible:true}),
 ];
}
test('Crear un slide que nunca estuvo en el carrusel, usar imagen subida, vista previa, publicar, desactivar y restaurar',()=>{
 const db=openLocalStore(':memory:'),base=fixture(),owner='editorial-qa';
 try{
  db.bootstrap(owner,'Equipo de ensayo');
  const read=()=>cityPageFromCatalog(editorialCatalog(project(base,db.published()),{includeLegacy:false}),'ciudad-a');
  const current=makeEditor(assemble(base,[]),'ciudad-a');
  assert.equal(resolveCitySlides(read()).length,0);assert.equal(current.slideOptions.length,1);
  const option=current.slideOptions[0],id='00000000-0000-4000-a000-000000000001.png';
  db.upload(owner,{id,name:'Ilustración QA.png',mime:'image/png'},Buffer.from('isolated-store-test'));
  const slide={id:'slide-qa',institutionId:option.institutionId,careerId:option.careerId,title:'Título editorial',description:'Texto de prueba',image:'/media/control/'+id,href:option.href,ctaLabel:'Explorar',active:true};
  const draft=validatePatch(base[0],{slides:[slide]},base);
  assert.throws(()=>validatePatch(base[1],draft,base));
  assert.throws(()=>validatePatch(base[0],{slides:[{...slide,href:'https://example.org/'}]},base));
  db.write(owner,'ciudad-a','save',0,draft);assert.deepEqual(resolveCitySlides(read()),[]);
  assert.equal(resolveCitySlides(previewData(base,db.records(owner),'ciudad-a',draft,'slider',slide.id).city)[0].title,slide.title);
  db.write(owner,'ciudad-a','publish',1);assert.equal(resolveCitySlides(read())[0].route,'/ciudad-a/v/carreras/c');
  assert.equal(read().institutions[0].plan,'Básico');assert.deepEqual(read().institutions[0].featuredCareerIds,[]);
  db.write(owner,'ciudad-a','save',2,{slides:[{...slide,active:false}]});db.write(owner,'ciudad-a','publish',3);assert.deepEqual(resolveCitySlides(read()),[]);
  const event=db.history(owner).filter(x=>x.operation==='publish').at(-1);
  db.write(owner,'ciudad-a','restore',4,null,event.id);db.write(owner,'ciudad-a','publish',5);
  assert.deepEqual(resolveCitySlides(read()),[]);assert.equal(db.assets(owner).length,1);
 }finally{db.close();}
});
test('El nombre visible de la destacada se limita a esa tarjeta; no cambia la identidad ni la condición comercial',()=>{
 const base=fixture(),p={placements:[{id:'v',active:true,displayName:'Nombre en la tarjeta',description:'Presentación editorial'}]};
 const patch=validatePatch(base[0],p,base),rows=project(base,[{key:'ciudad-a',published:patch}]);
 const page=cityPageFromCatalog(editorialCatalog(rows,{includeLegacy:false}),'ciudad-a');
 assert.equal(page.featuredInstitutions[0].name,'Nombre en la tarjeta');
 assert.equal(page.institutions[0].name,'Nombre oficial de ensayo');
 assert.equal(page.featuredInstitutions[0].id,'v');assert.equal(page.institutions[0].plan,'Básico');
 assert.throws(()=>validatePatch(base[1],p,base));assert.deepEqual(base[0].payload.data.featuredInstitutionIds,[]);
});
test('La vista privada representa la página completa aunque no tenga ficha destacada publicada',()=>{
 const base=fixture(),preview=previewData(base,[],'oferta/o',{name:'Nombre propuesto',workField:'Campo laboral QA'},'normal');
 assert.equal(preview.kind,'career');assert.equal(preview.paid,false);assert.equal(preview.props.career.name,'Nombre propuesto');assert.equal(preview.props.career.workField,'Campo laboral QA');
 assert.equal(base[4].payload.data.name,'Carrera de ensayo');assert.equal(applyPatch(base[3],{}),base[3]);
});
