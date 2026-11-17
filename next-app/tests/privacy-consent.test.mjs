import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {allowsCareerInquiry} from '../lib/catalog/profile-presentation.mjs';
import {transformSync} from 'esbuild';
import * as jsxRuntime from 'react/jsx-runtime';
import {legalConfig,getMissingPrivacyConfig} from '../lib/legal-config.js';
import {INQUIRY_PRIVACY_VERSION,hasInquiryConsent} from '../lib/privacy/inquiry-consent.mjs';

test('privacy uses only the confirmed identity and contact address, without approving other legal documents',()=>{
  assert.equal(legalConfig.legalName,'César Hernán Sánchez');
  assert.equal(legalConfig.privacyEmail,'hernan@guiaeducativatuc.com.ar');
  assert.equal(legalConfig.contactAddress,'Cristóbal Colón 601, Concepción, Tucumán, Argentina');
  assert.equal(legalConfig.legalAddress,'PENDIENTE_DEFINIR');
  assert.equal(legalConfig.privacyRetention,'manual-purpose-review');
  assert.equal(legalConfig.privacyReviewStatus,'approved-by-controller');
  assert.equal(legalConfig.legalReviewStatus,'draft');
  assert.equal('dni' in legalConfig,false);
  assert.deepEqual(getMissingPrivacyConfig(),[]);
  assert.deepEqual(getMissingPrivacyConfig({...legalConfig,privacyEmail:''}),['privacyEmail']);
});

test('consent requires a literal boolean and the exact current privacy version',()=>{
  assert.equal(hasInquiryConsent({privacyConsent:true,privacyVersion:INQUIRY_PRIVACY_VERSION}),true);
  for(const input of [null,{}, {privacyConsent:'true',privacyVersion:INQUIRY_PRIVACY_VERSION}, {privacyConsent:true,privacyVersion:'DRAFT-001'}]) assert.equal(hasInquiryConsent(input),false);
});

const compiled=transformSync(readFileSync(new URL('../app/components/approved/InquiryForm.js',import.meta.url),'utf8'),{loader:'jsx',format:'cjs',jsx:'automatic'}).code;
function formHarness({fail=false,plan='Premium',featured=true,valid=true}={}) {
  const states=[],sent=[];
  const modules={
    '../../../lib/catalog/profile-presentation.mjs':{allowsCareerInquiry},
    react:{useState:value=>[value,next=>states.push(next)],useRef:value=>({current:value})},
    'react/jsx-runtime':jsxRuntime,
    'next/link':{default:'a',__esModule:true},
    '../../../lib/public-leads':{submitPublicInquiry:async payload=>{sent.push(payload);if(fail)throw Error('private provider detail');return 'receipt';}},
    '../../../lib/privacy/inquiry-consent.mjs':{INQUIRY_PRIVACY_VERSION},
    './DesignShared':{Icon:()=>null},
  };
  const compiledModule={exports:{}};
  new Function('require','module','exports','FormData',compiled)(name=>{
    assert.ok(Object.hasOwn(modules,name),'Unexpected dependency '+name);return modules[name];
  },compiledModule,compiledModule.exports,class {constructor(form){return form.fields;}});
  const tree=compiledModule.exports.default({institution:{id:'example-venue',name:'Institución elegida',plan,careers:[{id:'academic',offeringId:'academic-offer',featured}]},career:{id:'academic',name:'Carrera'},offering:{id:'academic-offer'}});
  const fields=new Map(Object.entries({name:'Persona de prueba',phone:'3811234567',email:'test@example.invalid',query:'Consulta de prueba',consent:'on'}));
  let resets=0;
  return {tree,states,sent,resets:()=>resets,run:()=>tree.props.onSubmit({preventDefault(){},currentTarget:{fields,reportValidity:()=>valid,reset:()=>resets++}})};
}
const visibleText=node=>Array.isArray(node)?node.map(visibleText).join(''):node&&typeof node==='object'?visibleText(node.props?.children):node==null?'':String(node);

test('educational consent identifies the recipient only for eligible cards',()=>{
  for(const plan of ['Básico','Profesional','']) assert.equal(formHarness({plan}).tree,null);
  assert.equal(formHarness({featured:false}).tree,null);
  {
    const {tree}=formHarness();
    assert.match(visibleText(tree),/enviar mis datos a Institución elegida mediante GET Instituciones/);
    assert.match(visibleText(tree),/Política de Privacidad/);
  }
});
test('failed academic delivery keeps the form, does not persist PII or claim success',async()=>{
  const form=formHarness({fail:true});await form.run();
  assert.equal(form.sent.length,1);
  assert.equal(form.sent[0].privacyConsent,true);
  assert.equal(form.sent[0].privacyVersion,INQUIRY_PRIVACY_VERSION);
  assert.equal(form.resets(),0);
  assert.ok(form.states.some(value=>typeof value==='string'&&value.startsWith('La recepción no fue confirmada.')));
  assert.ok(!form.states.some(value=>typeof value==='string'&&value.includes('private provider')));
  const source=readFileSync(new URL('../app/components/approved/InquiryForm.js',import.meta.url),'utf8');
  assert.doesNotMatch(source,/savePublicLead|localStorage|sessionStorage/);
});
test('academic form validates before sending and clears only after confirmed reception',async()=>{
  const invalid=formHarness({valid:false});await invalid.run();assert.equal(invalid.sent.length,0);
  const valid=formHarness();await valid.run();assert.equal(valid.resets(),1);
  assert.ok(valid.states.includes('Tu consulta fue recibida correctamente.'));
});
