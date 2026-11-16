import test from 'node:test';
import assert from 'node:assert/strict';
import {ATTRIBUTION_KEY,PUBLIC_ORIGIN,consentedAttribution,isPublicMeasurementEnvironment,publicPageTitles,sanitizeCampaign,sanitizeReferrer} from '../lib/analytics/attribution.mjs';
import {CONSENT_KEY,clearAnalyticsCookies,initializeAnalytics} from '../lib/analytics/public-tracking.mjs';
import {editorialCatalog} from '../lib/admin/editorial-model.mjs';
import {getVersionedPublicCatalogEntries} from '../lib/catalog/versioned-public-catalog.mjs';

function browser(status='granted',origin=PUBLIC_ORIGIN){
 const store=new Map([[CONSENT_KEY,JSON.stringify({version:1,status,updatedAt:Date.now()})]]);
 const storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};
 const target={location:{origin,hostname:new URL(origin).hostname,pathname:'/concepcion',search:'?utm_source=google&utm_medium=cpc&utm_campaign=carreras&email=private@example.test'},document:{cookie:'',referrer:'https://www.google.com/search?q=private'},localStorage:storage,sessionStorage:storage,store};
 target.self=target;target.top=target;return target;
}
const paths=new Set(['/concepcion','/carreras/abogacia']);
test('only closed taxonomy, no arbitrary values, duplicate UTM, IDs or terms',()=>{
 const campaign=sanitizeCampaign('?utm_source=google&utm_medium=cpc&utm_campaign=carreras&utm_content=banner&utm_id=private&utm_term=private@example.test&gclid=secret');
 assert.equal(campaign.campaign_source,'google');assert.equal(campaign.campaign_name,'carreras');
 assert.equal(campaign.campaign_id,'');assert.equal(campaign.campaign_term,'');
 for(const field of ['utm_source','utm_medium','utm_campaign','utm_content']) for(const value of ['private@example.test','3815550000','token-private','email/name']) assert.ok(Object.values(sanitizeCampaign('?'+field+'='+encodeURIComponent(value))).every(v=>v===''));
 assert.equal(sanitizeCampaign('?utm_source=google&utm_source=facebook').campaign_source,'');
 assert.equal(sanitizeReferrer('https://www.google.com/search?q=private#token'),'https://google.com/');
 for(const ref of ['https://person.example.test/private','https://person.google.com/','https://google.com.evil.test','https://user:pass@google.com','javascript:alert(1)']) assert.equal(sanitizeReferrer(ref),'');
});
test('no attribution storage or GA initialization before consent or on test hosts',()=>{
 for(const status of ['unset','denied']) {const target=browser(status);assert.equal(initializeAnalytics(target,paths),null);assert.equal(target.store.has(ATTRIBUTION_KEY),false);assert.equal(target.dataLayer,undefined);}
 for(const origin of ['http://localhost:4004','https://preview.netlify.app','https://other.example']) {const target=browser('granted',origin);assert.equal(isPublicMeasurementEnvironment(target.location),false);assert.equal(initializeAnalytics(target,paths),null);assert.equal(target.store.has(ATTRIBUTION_KEY),false);}
});
test('config and page events preserve sanitized acquisition and catalog titles only',()=>{
 const target=browser(),titles={'/concepcion':'Concepción | GET','/carreras/abogacia':'Abogacía en Tucumán | GET'};
 const runtime=initializeAnalytics(target,paths,titles);runtime.page();runtime.page();
 const config=target.dataLayer.find(entry=>entry[0]==='config')[2];
 assert.equal(config.campaign_source,'google');assert.equal(config.page_referrer,'https://google.com/');assert.notEqual(config.ignore_referrer,true);
 assert.equal(config.send_page_view,false);assert.equal(config.page_title,'Concepción | GET');
 assert.equal(JSON.stringify(target.dataLayer).includes('private'),false);
 assert.equal(target.store.get(ATTRIBUTION_KEY).includes('private'),false);
 target.location.pathname='/carreras/abogacia';runtime.page();
 const event=target.dataLayer.filter(e=>e[0]==='event'&&e[1]==='page_view').at(-1)[2];
 assert.equal(event.page_title,titles['/carreras/abogacia']);assert.equal(event.page_referrer,PUBLIC_ORIGIN+'/concepcion');
 clearAnalyticsCookies(target);assert.equal(target.store.has(ATTRIBUTION_KEY),false);
});
test('sanitized attribution expires after 30 minutes and is revalidated when read',()=>{
 const target=browser();consentedAttribution(target,1000);target.location.search='';target.document.referrer='';
 assert.equal(consentedAttribution(target,2000).campaign.campaign_source,'google');
 assert.equal(consentedAttribution(target,1801001).campaign.campaign_source,'');
 target.store.set(ATTRIBUTION_KEY,JSON.stringify({version:1,at:2000,campaign:{campaign_source:'private@example.test'},referrer:'https://unknown.example/private'}));
 assert.equal(consentedAttribution(target,3000).campaign.campaign_source,'');
 assert.equal(consentedAttribution(target,3000).referrer,'');
});
test('published catalog titles distinguish real cities, institutions and careers',()=>{
 const catalog=editorialCatalog(getVersionedPublicCatalogEntries(),{includeLegacy:false});
 const titles=publicPageTitles(catalog);
 assert.match(titles['/concepcion'],/Concepción/);
 assert.match(titles['/concepcion/universidad-siglo-21/carreras/abogacia'],/Abogacía.*Siglo 21.*Concepción/);
});
