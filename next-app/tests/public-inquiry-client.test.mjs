import test from 'node:test';
import assert from 'node:assert/strict';
import {submitPublicInquiry} from '../lib/public-leads.js';

test('same payload retry uses one idempotency key and keeps the receiver contract',async()=>{
 const previous=global.fetch,calls=[];
 global.fetch=async (url,options)=>{calls.push({url,...options});if(calls.length===1)throw new Error('simulated network failure');return Response.json({ok:true,receiptId:'isolated-receipt'});};
 const inquiry={name:'Synthetic fixture',email:'fixture@example.test',institutionId:'fixture-id'};
 try {
  await assert.rejects(submitPublicInquiry(inquiry),/simulated/);
  assert.equal(await submitPublicInquiry(inquiry),'isolated-receipt');
  await submitPublicInquiry({...inquiry,institutionId:'other-fixture'});
  assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);
  assert.notEqual(calls[1].headers['Idempotency-Key'],calls[2].headers['Idempotency-Key']);
  assert.deepEqual(JSON.parse(calls[1].body),{...inquiry,website:''});
  assert.ok(calls.every(c=>c.url==='/api/public-inquiries'));
 } finally {global.fetch=previous;}
});
test('edge 429 and invalid/failed responses never become successful receipts',async()=>{
 const previous=global.fetch;
 try {
  for(const [response,message] of [[new Response('Rate limited',{status:429}),/Esperá un minuto/],[new Response('Bad gateway',{status:502}),/No se confirmó/],[Response.json({ok:false},{status:400}),/No se confirmó/],[Response.json({ok:true}),/No se confirmó/]]) {
   global.fetch=async()=>response;
   await assert.rejects(submitPublicInquiry({name:'Synthetic fixture'}),message);
  }
 } finally {global.fetch=previous;}
});
