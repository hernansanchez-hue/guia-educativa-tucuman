import test from 'node:test';
import assert from 'node:assert/strict';
import {openLocalStore} from '../lib/control/local-store.mjs';
import {prepareCreation,epoch,patchOnly,seeds} from '../lib/control/creation.mjs';
import {project,prepareContentWrite} from '../lib/control/domain.mjs';
import {makeEditor,assemble,previewData} from '../lib/control/workspace.mjs';
const make=(key,moduleId,_kind,data)=>({key,moduleId,payload:{_kind,data},visibility:'published'});
const fixture=()=>['uno','dos'].map(id=>make(id,'cities','city',{id,slug:id,name:'Ciudad '+id,institutionIds:[],featuredInstitutionIds:[]}));
function setup(){
 const db=openLocalStore(':memory:'),base=fixture(),owner='responsable',writer='editor',reader='lector';
 db.bootstrap(owner,'Responsable de prueba');db.setMember(owner,writer,'Redacción','EDITOR',true);db.setMember(owner,reader,'Lectura','LECTOR',true);
 const records=()=>db.records(owner),pub=()=>project(base,db.published()),admin=()=>assemble(base,records());
 const propose=input=>prepareCreation(input,project(base,records(),true),project(base,records()));
 const create=(input,who=writer)=>{const plan=propose(input);db.write(who,plan.key,'save',0,plan.draft,null,epoch(records()));return plan.key;};
 const mutate=(key,op,patch=null,version=null,who=owner)=>{const rows=records(),revision=rows.find(r=>r.key===key).revision;
 const result=prepareContentWrite(base,rows,db.member(who),{key,op,patch,revision});db.write(who,key,op,revision,result.value,version,result.generation);return result;};
 return {db,base,owner,writer,reader,records,pub,admin,propose,create,mutate};
}
const institution={kind:'institution',name:'Instituto de Ensayo',cityId:'uno',type:'Instituto',address:'Dirección de prueba'};
const career={kind:'career',name:'Carrera de Ensayo'};
test('alta atómica de institución y sede; estado privado, vista previa, edición, publicación y retiro por historial',()=>{
 const x=setup(),snapshot=JSON.stringify(x.base);try{
 const key=x.create(institution);assert.equal(x.pub().length,2);
 const m=makeEditor(x.admin(),key);assert.equal(m.kind,'institution');assert.equal(m.unpublished,true);assert.equal(m.url,null);assert.deepEqual(m.patch,{});
 assert.equal(previewData(m.previewSource,[],key,{address:'Ensayo nuevo'},'normal').props.institution.address,'Ensayo nuevo');
 x.mutate(key,'save',{address:'Ensayo nuevo'},null,x.writer);assert.equal(x.pub().length,2);
 assert.throws(()=>x.mutate(key,'publish',null,null,x.writer));x.mutate(key,'publish');
 const rows=x.pub();assert.equal(rows.length,4);const v=rows.find(e=>e.key===key).payload.data;assert.equal(v.address,'Ensayo nuevo');assert.ok(!v.plan&&!v.featured);
 const first=x.db.history(x.owner).find(h=>h.key===key&&h.operation==='publish');
 x.mutate(key,'restore',null,first.id);assert.equal(x.pub().length,4);assert.equal(makeEditor(x.admin(),key).restoringAbsence,true);
 assert.ok(x.mutate(key,'publish').removed);assert.equal(x.pub().length,2);assert.equal(x.admin().venues.length,0);assert.equal(JSON.stringify(x.base),snapshot);
 const removal=x.db.history(x.owner).find(h=>h.key===key&&h.operation==='publish');
 x.mutate(key,'restore',null,removal.id);assert.equal(x.pub().length,2);assert.equal(makeEditor(x.admin(),key).unpublished,true);
 assert.equal(makeEditor(x.admin(),key).cityOptions.length,0);assert.throws(()=>x.mutate(key,'save',{cityId:'dos'}),/primera publicación/);
 x.mutate(key,'publish');assert.equal(x.admin().venues.length,1);
 }finally{x.db.close();}
});
test('corregir ciudad solo antes de publicar: valida el destino, la reserva y conserva UUID/slug',()=>{
 const x=setup();try{
  const main=x.create(institution),model=makeEditor(x.admin(),main);
  assert.equal(model.values.cityId,'uno');assert.equal(model.cityOptions.length,2);
  assert.throws(()=>x.mutate(main,'save',{cityId:'ajena'}));assert.throws(()=>x.mutate(main,'save',{cityId:'dos',brandId:'forjada'}));
  const moved=previewData(model.previewSource,[],main,{cityId:'dos'},'normal',null,true);
  assert.equal(moved.props.institution.citySlug,'dos');
  x.mutate(main,'save',{cityId:'dos',address:'Dirección corregida'});assert.equal(x.pub().length,2);
  assert.equal(makeEditor(x.admin(),main).values.cityId,'dos');x.mutate(main,'publish');
  const actual=x.pub().find(e=>e.key===main).payload.data;assert.equal(actual.citySlug,'dos');assert.equal(actual.slug,'instituto-de-ensayo');assert.ok(main.endsWith(actual.id));
  assert.throws(()=>x.mutate(main,'save',{cityId:'uno'}),/primera publicación/);
  const second=x.create({kind:'venue',brandId:actual.brandId,cityId:'uno',type:'Instituto'});
  assert.throws(()=>x.mutate(second,'save',{cityId:'dos'}),/dirección pública/);
 }finally{x.db.close();}
});
test('sedes comparten marca, maestra reutilizable y oferta específica; no hay identidades duplicadas ni huérfanas',()=>{
 const x=setup();try{
 const vkey=x.create(institution);x.mutate(vkey,'publish');const venue=x.admin().venues[0],brand=x.admin().brands[0];
 const v2=x.create({kind:'venue',brandId:brand.id,cityId:'dos',type:'Instituto'});x.mutate(v2,'publish');assert.equal(x.admin().brands.length,1);
 assert.throws(()=>x.create({...institution,name:'Instituto de Ensáyo'}));assert.throws(()=>x.create({kind:'venue',brandId:brand.id,cityId:'dos',type:'Instituto'}));
 const mkey=x.create(career);let master=x.admin().masters[0];assert.ok(master.unpublished);
 assert.equal(previewData(makeEditor(x.admin(),mkey).previewSource,[],mkey,{description:'Prueba'},'normal').kind,'master');
 const input={kind:'offering',institutionId:venue.id,careerId:master.id,degree:'Título de prueba',duration:'Dos años',modality:'Presencial'};
 assert.throws(()=>x.create(input));x.mutate(mkey,'publish');assert.equal(makeEditor(x.admin(),mkey).url,null);
 const okey=x.create(input);assert.ok(x.admin().offers[0].unpublished);assert.throws(()=>x.create(input));assert.ok(!x.pub().some(e=>e.key===okey));
 x.mutate(okey,'save',{duration:'Tres años'},null,x.writer);x.mutate(okey,'publish');assert.equal(x.pub().find(e=>e.key===okey).payload.data.duration,'Tres años');
 assert.equal(makeEditor(x.admin(),mkey).url,'/carreras/carrera-de-ensayo');
 assert.throws(()=>x.create({...career,name:'CARRERA DE ENSAYO'}));assert.equal(x.admin().masters.length,1);
 x.mutate(vkey,'save',{visible:false});x.mutate(vkey,'publish');assert.ok(x.pub().find(e=>e.key==='marca/'+brand.id));assert.ok(x.pub().find(e=>e.key===v2));assert.equal(x.pub().find(e=>e.key===vkey),undefined);
 const first=x.db.history(x.owner).filter(h=>h.key===mkey&&h.operation==='publish').at(-1);
 x.mutate(mkey,'restore',null,first.id);assert.throws(()=>x.mutate(mkey,'publish'),/vinculado/);
 }finally{x.db.close();}
});
test('descartar libera la identidad reservada; revisiones atómicas rechazan altas simultáneas y campos de privilegio',()=>{
 const x=setup();try{
 assert.throws(()=>x.create(institution,x.reader));assert.throws(()=>x.create({...institution,plan:'Premium'}));assert.throws(()=>x.create({...career,other:1}));assert.throws(()=>x.create({...institution,cityId:'inexistente'}));
 const a=x.propose(career),b=x.propose(career),clock=epoch(x.records());x.db.write(x.owner,a.key,'save',0,a.draft,null,clock);
 assert.throws(()=>x.db.write(x.owner,b.key,'save',0,b.draft,null,clock),/catálogo/);assert.throws(()=>x.create(career),/existe/);
 assert.throws(()=>x.mutate(a.key,'save',{_created:b.draft._created}));assert.ok(x.mutate(a.key,'discard').removed);assert.ok(!x.admin().masters.length);
 const again=x.create(career);assert.notEqual(again,a.key);assert.equal(seeds(x.records().find(r=>r.key===again).draft).length,1);assert.deepEqual(patchOnly(x.records().find(r=>r.key===again).draft),{});
 }finally{x.db.close();}
});
