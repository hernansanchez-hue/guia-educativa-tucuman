import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {CONSENT_KEY, RECEIPTS_KEY, CONSENT_MAX_AGE, MEASUREMENT_ID, decodeConsent, publicPath, pageContext, safeEvent, initializeAnalytics, disableAnalytics, clearAnalyticsCookies, trackConfirmedSubmission} from '../lib/analytics/public-tracking.mjs';

const paths = new Set(['/','/concepcion','/monteros','/concepcion/universidad-siglo-21','/concepcion/universidad-siglo-21/carreras/abogacia','/carreras/abogacia','/instituciones/universidad-siglo-21','/contacto']);
function browser(status = 'granted', pathname = '/concepcion') {
  const cookies = [];
  const target = {location:{pathname,origin:'https://guiaeducativatuc.com.ar',search:'',hostname:'guiaeducativatuc.com.ar'},localStorage:{getItem:() => JSON.stringify({version:1,status,updatedAt:Date.now()})},document:{referrer:'',get cookie(){return '_ga=abc; _ga_KY9E5NG5V2=def; sb-auth=secret';},set cookie(value){cookies.push(value);}},cookies};
  target.self = target;target.top = target;
  return target;
}
const events = target => (target.dataLayer || []).filter(entry => entry[0] === 'event');

test('consent requires explicit unexpired valid opt-in', () => {
  for(const value of [null,'broken','{}',JSON.stringify({version:1,status:'granted'}),JSON.stringify({version:2,status:'granted',updatedAt:Date.now()})]) assert.equal(decodeConsent(value),'unset');
  const now=Date.now();
  assert.equal(decodeConsent(JSON.stringify({version:1,status:'granted',updatedAt:now}),now),'granted');
  assert.equal(decodeConsent(JSON.stringify({version:1,status:'denied',updatedAt:now}),now),'denied');
  assert.equal(decodeConsent(JSON.stringify({version:1,status:'granted',updatedAt:now+1000}),now),'unset');
  assert.equal(decodeConsent(JSON.stringify({version:1,status:'granted',updatedAt:now-CONSENT_MAX_AGE-1}),now),'unset');
  assert.equal(CONSENT_KEY,'get.analytics-consent.v1');
});

test('only exact published allowlisted paths can be sent; queries and hashes are removed', () => {
  assert.equal(publicPath('/concepcion/?email=secret@example.com#token',paths),'/concepcion');
  for(const path of ['/admin','/administrador','/api/contact']) assert.equal(publicPath(path,new Set([...paths,path])),null);
  for(const path of ['/secret@example.com','/concepcion/new-draft']) assert.equal(publicPath(path,paths),null);
  assert.equal(publicPath('/concepcion/unpublished',paths),null);
  assert.equal(publicPath('/ADMIN',new Set(['/ADMIN'])),null);
  assert.equal(publicPath(undefined,paths),null);
});

test('page types distinguish city, institution and career without user data', () => {
  assert.equal(pageContext('/concepcion').page_type,'city');
  assert.equal(pageContext('/concepcion/universidad-siglo-21').page_type,'institution');
  assert.equal(pageContext('/concepcion/universidad-siglo-21/carreras/abogacia').career_slug,'abogacia');
  assert.equal(pageContext('/carreras/abogacia').page_type,'career');
  assert.equal(pageContext('/contacto').page_type,'public');
});

test('events cannot include arbitrary names, URL queries, hashes, search or external referrers', () => {
  const event=safeEvent('search','/concepcion?email=person@example.com#secret',paths);
  assert.equal(event.params.page_location,'https://guiaeducativatuc.com.ar/concepcion');
  assert.equal(event.params.page_referrer,'');
  assert.equal(event.params.page_title,'GET · city');
  assert.equal(JSON.stringify(event).includes('person@'),false);
  assert.equal('search_term' in event.params,false);
  assert.equal(safeEvent('unexpected','/concepcion',paths),null);
  assert.equal(safeEvent('page_view','/admin',new Set(['/admin'])),null);
});

test('no initialization, queue or events without consent, in iframe, or on admin/drafts', () => {
  for(const [status,path] of [['denied','/concepcion'],['unset','/concepcion'],['granted','/admin'],['granted','/administrador'],['granted','/draft']]) {
    const target=browser(status,path);
    assert.equal(initializeAnalytics(target,paths),null);
    assert.equal(target.dataLayer,undefined);
    assert.equal(target['ga-disable-'+MEASUREMENT_ID],true);
  }
  const frame=browser();frame.top={};
  assert.equal(initializeAnalytics(frame,paths),null);
});

test('one config and one page_view per page across repeated mounts; manual views', () => {
  const target=browser();const runtime=initializeAnalytics(target,paths);
  runtime.page();runtime.page();initializeAnalytics(target,paths).page();
  assert.equal(target.dataLayer.filter(entry=>entry[0]==='config').length,1);
  const config=target.dataLayer.find(entry=>entry[0]==='config');
  assert.equal(config[1],MEASUREMENT_ID);assert.equal(config[2].send_page_view,false);
  assert.equal(config[2].allow_google_signals,false);assert.equal(config[2].allow_ad_personalization_signals,false);
  assert.equal(events(target).filter(entry=>entry[1]==='page_view').length,1);
  assert.equal(events(target).filter(entry=>entry[1]==='view_city').length,1);
  target.location.pathname='/concepcion/universidad-siglo-21/carreras/abogacia';runtime.page();runtime.page();
  assert.equal(events(target).filter(entry=>entry[1]==='page_view').length,2);
  assert.equal(events(target).filter(entry=>entry[1]==='view_career').length,1);
});

test('consent default denied before config, ads never granted', () => {
  const target=browser();initializeAnalytics(target,paths);
  assert.deepEqual(Array.from(target.dataLayer[0]).slice(0,2),['consent','default']);
  assert.equal(target.dataLayer[0][2].analytics_storage,'denied');
  assert.equal(target.dataLayer[1][2].analytics_storage,'granted');
  for(const item of target.dataLayer.filter(entry=>entry[0]==='consent')) for(const key of ['ad_storage','ad_user_data','ad_personalization']) assert.equal(item[2][key],'denied');
});

test('route and permission guards block events after initialization; returning reenables without reconfig', () => {
  const target=browser();const runtime=initializeAnalytics(target,paths);runtime.page();
  target.location.pathname='/admin';assert.equal(runtime.emit('click_whatsapp'),false);
  disableAnalytics(target);target.location.pathname='/monteros';assert.equal(runtime.emit('search'),false);
  initializeAnalytics(target,paths).page();assert.equal(target['ga-disable-'+MEASUREMENT_ID],false);
  assert.equal(target.dataLayer.filter(entry=>entry[0]==='config').length,1);
  target.localStorage.getItem=()=>JSON.stringify({version:1,status:'denied',updatedAt:Date.now()});
  assert.equal(runtime.emit('generate_lead'),false);
});

test('cookie withdrawal targets only GA cookies, not authentication or preferences', () => {
  const target=browser();clearAnalyticsCookies(target);
  assert.ok(target.cookies.length>0);
  assert.ok(target.cookies.every(cookie=>cookie.startsWith('_ga=;')||cookie.startsWith('_ga_KY9E5NG5V2=;')));
  assert.ok(target.cookies.every(cookie=>cookie.includes('Max-Age=0')));
});

test('confirmed receipt triggers only one safe event, also after reload, without receipt data', async () => {
  const emitted=[],storage=new Map();
  const target=browser();initializeAnalytics(target,paths);
  Object.assign(target,{crypto:webcrypto,dispatchEvent:event=>emitted.push(event),sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}});
  global.window=target;
  const previous=global.CustomEvent;
  global.CustomEvent=class {constructor(type,options){this.type=type;this.detail=options.detail;}};
  try {
    await Promise.all([trackConfirmedSubmission('academic','receipt-private-1'),trackConfirmedSubmission('academic','receipt-private-1')]);
    await trackConfirmedSubmission('commercial','receipt-private-2');await trackConfirmedSubmission('academic','');await trackConfirmedSubmission('other','receipt-private-3');
    assert.equal(emitted.length,2);assert.deepEqual(emitted[0].detail,{kind:'academic'});
    assert.equal(JSON.stringify(emitted).includes('receipt-private'),false);
    assert.equal(storage.get(RECEIPTS_KEY).includes('receipt-private'),false);
    const reloaded=await import('../lib/analytics/public-tracking.mjs?reload-test');
    assert.equal(await reloaded.trackConfirmedSubmission('academic','receipt-private-1'),false);
    assert.equal(emitted.length,2);
    clearAnalyticsCookies(target);assert.equal(storage.has(RECEIPTS_KEY),false);
    target.localStorage.getItem=()=>JSON.stringify({version:1,status:'denied',updatedAt:Date.now()});
    assert.equal(await trackConfirmedSubmission('academic','receipt-private-4'),false);
    assert.equal(storage.size,0);assert.equal(emitted.length,2);
  } finally {delete global.window;if(previous)global.CustomEvent=previous;else delete global.CustomEvent;}
});

test('server gate is fail-closed and success hook follows confirmed server receipt', () => {
  const wrapper=readFileSync(new URL('../app/components/PublicAnalytics.js',import.meta.url),'utf8');
  assert.ok(wrapper.includes("process.env.GET_GA_MANUAL_MEASUREMENT_CONFIRMED === 'true'"));
  assert.ok(wrapper.includes('configured ? await getIndexablePublicRoutePaths() : []'));
  const leads=readFileSync(new URL('../lib/public-leads.js',import.meta.url),'utf8');
  assert.ok(leads.indexOf("trackConfirmedSubmission('academic'")>leads.indexOf('!result.receiptId'));
});

test('reopening preferences uses footer event, not a floating CTA overlay', () => {
  const source=readFileSync(new URL('../app/components/PublicAnalyticsClient.js',import.meta.url),'utf8');
  const css=readFileSync(new URL('../app/components/public-analytics.css',import.meta.url),'utf8');
  assert.equal(source.includes('className="get-analytics-preferences"'),false);
  assert.equal(css.includes('.get-analytics-preferences'),false);
  assert.ok(source.includes("window.addEventListener('get:analytics-preferences', open)"));
  assert.ok(source.includes('returnFocus.current?.focus?.({preventScroll:true})'));
  assert.ok(source.includes('panel.current?.focus({preventScroll:true})'));
});
