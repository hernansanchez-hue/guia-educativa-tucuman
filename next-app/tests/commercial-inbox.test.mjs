import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {openLocalCommercialInbox as openStore,permitCommercialInbox,contactStoreMode,inboxQuery,contactFingerprint} from '../lib/control/commercial-inbox.mjs';
import {commercialConsent} from '../lib/privacy/commercial-consent.mjs';
import {handleCommercialContact,createContactGuard} from '../lib/integration/commercial-contact.mjs';
import {INQUIRY_PRIVACY_VERSION} from '../lib/privacy/inquiry-consent.mjs';
const actor={id:'00000000-0000-4000-a000-000000000001',active:true,role:'ADMINISTRADOR'};
const input={institutionName:'Institución de prueba',name:'Persona de prueba',email:'test@example.invalid',phone:'3810000000',plan:'Básico',message:'Consulta aislada'};
const rateKey='a'.repeat(64);
const evidence=commercialConsent({privacyConsent:true,privacyVersion:INQUIRY_PRIVACY_VERSION});
async function openLocalCommercialInbox(...args){
  const db=await openStore(...args);
  return {...db,receive:(key,payload,rate)=>db.receive(key,payload,rate,evidence)};
}
const req=(payload=input,key=randomUUID())=>new Request('http://localhost:4004/api/commercial-contact',{method:'POST',headers:{Origin:'http://localhost:4004','Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({...payload,privacyConsent:true,privacyVersion:INQUIRY_PRIVACY_VERSION})});

test('inbox permission excludes readers, anonymous, inactive and spoofed roles',()=>{
  permitCommercialInbox(actor);permitCommercialInbox({...actor,role:'EDITOR'});
  for(const value of [null,{...actor,role:'LECTOR'},{...actor,active:false},{...actor,role:'SUPERADMIN'},{...actor,id:'invalid'}])assert.throws(()=>permitCommercialInbox(value));
});
test('contact persistence is opt-in, local only in development, never fallback in production',()=>{
  assert.equal(contactStoreMode({}),'off');
  assert.equal(contactStoreMode({GET_CONTACT_STORE:'local',NODE_ENV:'production'}),'off');
  assert.equal(contactStoreMode({GET_CONTACT_STORE:'local',NODE_ENV:'development',NETLIFY:'true'}),'off');
  assert.equal(contactStoreMode({GET_CONTACT_STORE:'local',NODE_ENV:'development'}),'local');
  assert.equal(contactStoreMode({GET_CONTACT_STORE:'supabase'}),'supabase');
});
test('query and fingerprint are bounded and deterministic',()=>{
  assert.equal(inboxQuery({q:'x'.repeat(200),status:'unknown',page:-10}).q.length,120);
  assert.equal(inboxQuery({page:2}).offset,20);assert.equal(inboxQuery({page:NaN}).page,1);
  assert.equal(contactFingerprint(input),contactFingerprint({...input,unknown:'ignored'}));
  assert.notEqual(contactFingerprint(input),contactFingerprint({...input,plan:'Premium'}));
});
test('SQLite file remains durable across reopen; no PII in receipt; idempotency across instances',async()=>{
  const directory=mkdtempSync(join(tmpdir(),'get-commercial-test-'));
  const path=join(directory,'inbox.sqlite'),key=randomUUID();
  let db;
  try {
    db=await openLocalCommercialInbox(path);const first=db.receive(key,{...input,sourcePath:'https://malicious.example/?email=private',source_path:'/admin'},rateKey);
    assert.equal(first.status,201);assert.equal(Object.keys(first).length,2);db.close();db=null;
    db=await openLocalCommercialInbox(path);assert.deepEqual(db.receive(key,input,rateKey),first);
    assert.equal(db.receive(key,{...input,name:'Otra persona'},rateKey).status,409);
    const listed=db.list(actor);assert.equal(listed.total,1);assert.equal(listed.rows[0].email,input.email);
    assert.equal(listed.rows[0].source_path,'/contacto');
    assert.equal('fingerprint' in listed.rows[0],false);assert.equal('idempotency_key' in listed.rows[0],false);
  } finally {db?.close();assert.ok(resolve(directory).startsWith(resolve(tmpdir())+ '\\'));rmSync(directory,{recursive:true});}
});
test('genuine persistence and rate limiting share state, duplicate retry does not consume rate',async()=>{
  let now=Date.now();const db=await openLocalCommercialInbox(':memory:',{now:()=>now});
  try {
    const key=randomUUID(),first=db.receive(key,input,rateKey);
    for(let i=0;i<9;i++)assert.deepEqual(db.receive(key,input,rateKey),first);
    for(let i=0;i<4;i++)assert.equal(db.receive(randomUUID(),input,rateKey).status,201);
    assert.equal(db.receive(randomUUID(),input,rateKey).status,429);
    now+=600001;assert.equal(db.receive(randomUUID(),input,rateKey).status,201);
  } finally {db.close();}
});
test('status changes are optimistic, scoped, searchable and audited without contact PII',async()=>{
  const db=await openLocalCommercialInbox(':memory:');
  try {
    const receipt=db.receive(randomUUID(),input,rateKey),id=receipt.receiptId;
    const result=db.change({...actor,role:'EDITOR'},{id,status:'en_seguimiento',expectedRevision:0});
    assert.equal(result.revision,1);
    assert.throws(()=>db.change(actor,{id,status:'cerrada',expectedRevision:0}),/cambió/);
    assert.throws(()=>db.change({...actor,role:'LECTOR'},{id,status:'cerrada',expectedRevision:1}));
    assert.throws(()=>db.list({...actor,active:false}));
    assert.equal(db.list(actor,{q:'persona',status:'en_seguimiento'}).total,1);
    assert.equal(db.list(actor,{q:'not-present'}).total,0);
    assert.equal(db.list(actor,{q:'%'}).total,0);
    assert.equal(db.list(actor,{status:'nueva'}).total,0);
    const history=db.history(actor,id);assert.equal(history.length,1);assert.equal(history[0].next_status,'en_seguimiento');assert.equal(JSON.stringify(history).includes(input.email),false);
    assert.equal(db.change(actor,{id,status:'en_seguimiento',expectedRevision:1}).revision,1);
    assert.equal(db.history(actor,id).length,1);
  } finally {db.close();}
});
test('public endpoint confirms only after durable insert, never when storage fails',async()=>{
  const db=await openLocalCommercialInbox(':memory:');
  const env={GET_CONTACT_STORE:'local',NODE_ENV:'development'};
  try {
    const persistence={receive:(key,payload)=>db.receive(key,payload,rateKey)};
    const response=await handleCommercialContact(req(),{env,guard:createContactGuard(),persistence});
    assert.equal(response.status,201);const result=await response.json();assert.equal(result.ok,true);assert.equal(db.list(actor).total,1);
    for(const failing of [null,{receive:async()=>{throw Error('private connection details');}},{receive:async()=>({status:503})},{receive:async()=>({status:201})}]){
      const bad=await handleCommercialContact(req(),{env,guard:createContactGuard(),persistence:failing});
      assert.notEqual(bad.status,201);const text=await bad.text();assert.equal(text.includes('private connection'),false);assert.equal(text.includes(input.email),false);
    }
  }finally{db.close();}
});
