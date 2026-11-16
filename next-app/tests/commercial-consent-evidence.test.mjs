import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {commercialConsent,validCommercialEvidence,COMMERCIAL_NOTICE} from '../lib/privacy/commercial-consent.mjs';
import {INQUIRY_PRIVACY_VERSION} from '../lib/privacy/inquiry-consent.mjs';
import {handleCommercialContact,createContactGuard} from '../lib/integration/commercial-contact.mjs';
import {openLocalCommercialInbox} from '../lib/control/commercial-inbox.mjs';
const accepted={privacyConsent:true,privacyVersion:INQUIRY_PRIVACY_VERSION};
const evidence=commercialConsent(accepted),rate='b'.repeat(64);
const actor={id:randomUUID(),role:'ADMINISTRADOR',active:true};
const input={institutionName:'Ensayo aislado',name:'Prueba',phone:'000',email:'qa@example.invalid',plan:'Básico',message:''};
const request=(body,key=randomUUID())=>new Request('http://localhost:4004/api/commercial-contact',{method:'POST',headers:{origin:'http://localhost:4004','content-type':'application/json','idempotency-key':key},body:JSON.stringify(body)});

test('commercial consent requires explicit boolean and exact version; origin/time cannot be supplied',()=>{
 for(const value of [null,{}, {...accepted,privacyConsent:'true'}, {...accepted,privacyConsent:false},{...accepted,privacyVersion:'old'}])assert.equal(commercialConsent(value),null);
 assert.equal(validCommercialEvidence(evidence),true);
 for(const extra of [{accepted:false},{sourcePath:'/inventado'},{receivedAt:'2000-01-01'},{ip:'1.2.3.4'},{noticeVersion:'other'}])assert.equal(validCommercialEvidence({...evidence,...extra}),false);
 assert.equal(evidence.noticeVersion,COMMERCIAL_NOTICE.version);
});

test('endpoint rejects absent consent before persistence; persists only server-derived evidence',async()=>{
 let count=0,got;
 const persistence={receive:async(_key,_payload,_address,e)=>{count++;got=e;return {status:201,receiptId:randomUUID()};}};
 const opts={env:{NODE_ENV:'development',GET_CONTACT_STORE:'local'},persistence};
 for(const consent of [{},{...accepted,privacyConsent:false},{...accepted,privacyVersion:'old'}])assert.equal((await handleCommercialContact(request({...input,...consent}),{...opts,guard:createContactGuard()})).status,400);
 assert.equal(count,0);
 assert.equal((await handleCommercialContact(request({...input,...accepted,receivedAt:'2000',sourcePath:'/wrong'}),{...opts,guard:createContactGuard()})).status,201);
 assert.deepEqual(got,evidence);
});

test('durable evidence uses server clock and retries/status changes never replace it',async()=>{
 let clock=Date.parse('2026-11-15T12:00:00Z');
 const db=await openLocalCommercialInbox(':memory:',{now:()=>clock});
 try{
   assert.throws(()=>db.receive(randomUUID(),input,rate));
   const key=randomUUID(),first=db.receive(key,input,rate,evidence);
   const original=db.list(actor).rows[0].consent_evidence;
   assert.deepEqual(original,{...evidence,receivedAt:'2026-11-15T12:00:00.000Z'});
   clock+=10000;assert.deepEqual(db.receive(key,input,rate,evidence),first);
   db.change(actor,{id:first.receiptId,status:'cerrada',expectedRevision:0});
   assert.deepEqual(db.list(actor).rows[0].consent_evidence,original);
   assert.equal(db.list(actor).total,1);
   for(const role of ['LECTOR','UNKNOWN'])assert.throws(()=>db.list({...actor,role}));
 }finally{db.close();}
});
