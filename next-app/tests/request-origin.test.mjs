import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hasTrustedPublicOrigin} from '../lib/security/request-origin.mjs';
import {handleCommercialContact} from '../lib/integration/commercial-contact.mjs';

const publicOrigin='https://guiaeducativatuc.com.ar';
const production={NODE_ENV:'production',NETLIFY:'true',GET_CONTROL_ORIGIN:publicOrigin};
const request=(origin,url='http://internal-function:3000/api/commercial-contact',extra={})=>new Request(url,{method:'POST',headers:{...(origin?{Origin:origin}:{}),...extra},body:'{}'});

test('Netlify internal URL does not reject the exact configured public origin',()=>{
  assert.equal(hasTrustedPublicOrigin(request(publicOrigin),production),true);
  assert.equal(hasTrustedPublicOrigin(request(publicOrigin,'http://localhost:3000/api/public-inquiries'),production),true);
});
test('production rejects other origins, malformed origins and forwarded-header spoofing',()=>{
  for(const origin of [null,'null','https://example.invalid','http://guiaeducativatuc.com.ar',publicOrigin+'.example.invalid',publicOrigin+'/',publicOrigin+'/path','http://localhost:3000']){
    assert.equal(hasTrustedPublicOrigin(request(origin,'http://localhost:3000/api/commercial-contact',{'X-Forwarded-Host':'guiaeducativatuc.com.ar','X-Forwarded-Proto':'https'}),production),false);
  }
});
test('production fails closed without a valid configured public origin',()=>{
  for(const value of [undefined,'invalid',publicOrigin+'/path',publicOrigin+'?q=1','https://user:password@example.invalid','http://guiaeducativatuc.com.ar']){
    assert.equal(hasTrustedPublicOrigin(request(publicOrigin),{...production,GET_CONTROL_ORIGIN:value}),false);
  }
});
test('development and isolated local builds preserve exact same-origin checks',()=>{
  const local='http://localhost:4004';
  assert.equal(hasTrustedPublicOrigin(request(local,local+'/api/commercial-contact'),{}),true);
  assert.equal(hasTrustedPublicOrigin(request(local,local+'/api/commercial-contact'),{NODE_ENV:'production',GET_CONTROL_ORIGIN:publicOrigin}),true);
  assert.equal(hasTrustedPublicOrigin(request('http://localhost:4005',local+'/api/commercial-contact'),{}),false);
});
test('commercial handler reaches consent validation through proxy without persisting',async()=>{
  const r=await handleCommercialContact(request(publicOrigin,undefined,{'Content-Type':'application/json','Idempotency-Key':'33333333-3333-4333-8333-333333333333'}),{env:production,persistence:{receive:()=>assert.fail('must not persist without consent')}});
  assert.equal(r.status,400);
  assert.ok((await r.json()).message.includes('Privacidad'));
});
test('academic and commercial entry points use the same origin guard',()=>{
  for(const file of ['../app/api/public-inquiries/route.js','../lib/integration/commercial-contact.mjs']){
    assert.ok(readFileSync(new URL(file,import.meta.url),'utf8').includes('hasTrustedPublicOrigin(request'));
  }
});
