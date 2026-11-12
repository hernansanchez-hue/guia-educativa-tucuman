import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hasFeaturedCareerProfile,selectedProfileCareers} from '../lib/catalog/profile-presentation.mjs';

test('training proposals share the actual paid explicit-selection entitlement, never editorial flags',()=>{
 const program={id:'operador-de-pc'};
 for(const institution of [{plan:'Básico'},{plan:'Sin clasificar'},{featured:true,premium:true},{plan:'Premium'}]){
  assert.equal(hasFeaturedCareerProfile({...institution,careers:[program]},program),false);
 }
 assert.equal(hasFeaturedCareerProfile({plan:'Profesional',careers:[program],featuredCareerIds:[program.id]},program),true);
});
test('paid academic and training selections share the same maximum of five',()=>{
 const careers=Array.from({length:6},(_,i)=>({id:'proposal-'+i,featured:true}));
 const institution={plan:'Premium',careers};
 assert.equal(selectedProfileCareers(institution).length,5);
 assert.equal(hasFeaturedCareerProfile(institution,careers[5]),false);
});
test('direct training route checks the published institution selection before rendering',()=>{
 const source=readFileSync(new URL('../app/[ciudad]/[institucion]/capacitaciones/[capacitacion]/page.js',import.meta.url),'utf8');
 const check=source.indexOf('hasFeaturedCareerProfile(profile.institution, page.program)');
 assert.ok(check>source.indexOf('const profile = await getInstitutionPageCatalog'));
 assert.ok(source.indexOf('return <TrainingPageClient',check)>check);
 assert.ok(source.includes('redirect(`/${ciudad}/${institucion}#carreras`)'));
});
