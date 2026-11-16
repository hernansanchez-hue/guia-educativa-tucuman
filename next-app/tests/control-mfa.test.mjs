import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {transformSync} from 'esbuild';
import {verifiedControlSession,verifiedMember} from '../lib/control/identity.mjs';
import {verifyAuthenticator,enrollAuthenticator} from '../lib/control/mfa.mjs';
const id=randomUUID(),factor=randomUUID();
const actor={id,role:'ADMINISTRADOR',active:true};
function harness({verified=false,aal='aal1',claimsError=false,member=actor}={}) {
 const calls=[];
 const client={auth:{
  getUser:async()=>({data:{user:{id,email_confirmed_at:'2026',factors:[{id:factor,status:verified?'verified':'unverified',factor_type:'totp',friendly_name:'Test'}]}},error:null}),
  getClaims:async()=>({data:{claims:{sub:id,aal}},error:claimsError?{}:null}),
 }};
 const store={sessionMember:async(_client,challenge)=>{calls.push(challenge);return member;},member:()=>assert.fail('No privileged membership fallback')};
 return {client,store,calls};
}
test('MFA remains optional until verified, then AAL1 is denied at the shared server boundary',async()=>{
 const plain=harness();assert.deepEqual(await verifiedMember(plain.client,plain.store),actor);
 const protectedSession=harness({verified:true});assert.equal(await verifiedMember(protectedSession.client,protectedSession.store),null);
 assert.equal(protectedSession.calls.length,0);
 const challenge=await verifiedControlSession(protectedSession.client,protectedSession.store,{allowMfaChallenge:true});
 assert.equal(challenge.requiresMfa,true);assert.deepEqual(protectedSession.calls,[true]);
 const elevated=harness({verified:true,aal:'aal2'});assert.deepEqual(await verifiedMember(elevated.client,elevated.store),actor);
 assert.deepEqual(elevated.calls,[false]);
});
test('MFA fails closed for invalid claims, removed membership, inactive user and metadata spoofing',async()=>{
 for(const opts of [{claimsError:true},{member:null},{member:{...actor,active:false}},{member:{...actor,id:randomUUID()}}]){
  const h=harness({verified:true,aal:'aal2',...opts});assert.equal(await verifiedControlSession(h.client,h.store,{allowMfaChallenge:true}),null);
 }
});
test('challenge, enrollment, cancellation and removal use only the owner official Auth APIs',async()=>{
 const calls=[];let verified=true;
 const session={actor,requiresMfa:true,client:{auth:{
   mfa:{listFactors:async()=>({data:{all:[{id:factor,status:verified?'verified':'unverified',factor_type:'totp'}]}}),
     challengeAndVerify:async args=>{calls.push(['verify',args.factorId]);return {data:{},error:null};},
     unenroll:async args=>{calls.push(['remove',args.factorId]);return {error:null};},
     enroll:async()=>{calls.push(['enroll']);return {data:{id:factor,totp:{qr_code:'test-qr',secret:'test-only'}}};}},
   getClaims:async()=>({data:{claims:{sub:id,aal:'aal2'}}}),refreshSession:async()=>({error:null}),
 }}};
 assert.equal((await enrollAuthenticator(session)).ok,false);
 assert.equal((await verifyAuthenticator(session,{id:factor,code:'123456'},{remove:true})).ok,false);
 assert.equal((await verifyAuthenticator(session,{id:factor},{cancel:true})).ok,false);
 assert.equal((await verifyAuthenticator(session,{id:randomUUID(),code:'123456'})).ok,false);
 assert.equal((await verifyAuthenticator(session,{id:factor,code:'123'})).ok,false);
 assert.equal(calls.length,0);
 assert.equal((await verifyAuthenticator(session,{id:factor,code:'123456'})).ok,true);
 session.requiresMfa=false;
 assert.equal((await verifyAuthenticator(session,{id:factor,code:'123456'},{remove:true})).ok,true);
 verified=false;assert.equal((await verifyAuthenticator(session,{id:factor},{cancel:true})).ok,true);
 assert.equal((await enrollAuthenticator(session)).ok,true);
 assert.deepEqual(calls.map(c=>c[0]),['verify','verify','remove','remove','enroll']);
});
test('requireControl redirects before permissions/store access, even for direct server actions',async()=>{
 const code=transformSync(readFileSync(new URL('../lib/control/session.js',import.meta.url),'utf8'),{loader:'js',format:'cjs'}).code;
 let permissionChecks=0;
 const modules={'server-only':{},'next/headers':{cookies:async()=>({getAll:()=>[{name:'get-control-session'}]})},'next/navigation':{redirect:path=>{throw Error(path);}},'@supabase/ssr':{createServerClient:()=>({})},'../admin/environment.mjs':{requireSupabaseConfiguration:()=>({url:'https://example.invalid',key:'public-test'})},'./identity.mjs':{verifiedControlSession:async()=>({actor,requiresMfa:true})},'./domain.mjs':{permit:()=>permissionChecks++},'./store':{controlStore:async()=>({}),controlMode:()=> 'supabase'}};
 const m={exports:{}};new Function('require','module','exports',code)(name=>modules[name],m,m.exports);
 for(const op of ['read','save','publish','restore','members','upload'])await assert.rejects(m.exports.requireControl(op),/\/administrador\/verificar/);
 assert.equal(permissionChecks,0);
});
