import test from 'node:test';
import assert from 'node:assert/strict';
import {filterDirectory,directoryPage} from '../lib/catalog/directory-filters.mjs';

const entry=(city,institution,modality)=>({city:{slug:city,name:city==='concepcion'?'Concepción':city},institution:{slug:institution,name:institution},offering:{modality}});
const careers=[{slug:'abogacia',name:'Abogacía',description:'Derecho y justicia',offerings:[entry('concepcion','uno','Virtual'),entry('monteros','dos','Presencial')]},{slug:'general',name:'Carrera institucional',offerings:[entry('','uno','A distancia')]}];
const institutions=[{slug:'uno',name:'Institución Uno',type:'Universidad privada',category:'Universidad',ownership:'Privado',venues:[{city:{slug:'concepcion',name:'Concepción'}}],careers:[{name:'Abogacía'}]}];

test('directories ignore accents and keep real institution/career/city search',()=>{
 assert.equal(filterDirectory(careers,'careers',{query:'abogacia'}).length,1);
 assert.equal(filterDirectory(careers,'careers',{query:'justicia'}).length,1);
 assert.equal(filterDirectory(institutions,'institutions',{query:'concepcion'}).length,1);
 assert.equal(filterDirectory(institutions,'institutions',{query:'abogacia'}).length,1);
});
test('career city/institution/modality filters must match the same offering',()=>{
 assert.equal(filterDirectory(careers,'careers',{city:'concepcion',institution:'dos'}).length,0);
 assert.equal(filterDirectory(careers,'careers',{city:'concepcion',institution:'uno',modality:'Virtual'}).length,1);
 assert.equal(filterDirectory(careers,'careers',{city:'concepcion',modality:'Presencial'}).length,0);
 assert.equal(filterDirectory(careers,'careers',{institution:'uno'}).length,2);
});
test('unassigned institutional offers stay visible without inventing a territorial association',()=>{
 assert.equal(filterDirectory(careers,'careers',{}).length,2);
 assert.equal(filterDirectory(careers,'careers',{city:'concepcion'}).length,1);
});
test('institution filters combine and empty/reset never alter the source',()=>{
 const before=JSON.stringify(institutions);
 assert.equal(filterDirectory(institutions,'institutions',{city:'concepcion',type:'Universidad',ownership:'Privado'}).length,1);
 assert.equal(filterDirectory(institutions,'institutions',{ownership:'Estatal'}).length,0);
 assert.equal(filterDirectory(institutions,'institutions',{}).length,1);
 assert.equal(JSON.stringify(institutions),before);
});
test('pagination clamps invalid and stale pages and retains every result',()=>{
 const items=Array.from({length:125},(_,i)=>i);
 assert.deepEqual(directoryPage(items,6),{pages:6,current:6,visible:[120,121,122,123,124]});
 assert.equal(directoryPage(items,999).current,6);
 assert.equal(directoryPage(items,'bad').current,1);
 assert.equal(directoryPage(items,-1).current,1);
 assert.equal(directoryPage(items,1.5).current,1);
 assert.deepEqual(directoryPage([],999),{pages:1,current:1,visible:[]});
});
