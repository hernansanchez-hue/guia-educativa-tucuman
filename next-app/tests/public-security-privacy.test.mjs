import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import config from '../next.config.mjs';
import {contentSecurityPolicy,securityHeaders} from '../lib/security/headers.mjs';

test('CSP permits the existing runtime, maps and media without eval in production',()=>{
 const csp=contentSecurityPolicy(false);
 for(const directive of ["default-src 'self'","object-src 'none'","base-uri 'self'","frame-ancestors 'self'","script-src-attr 'none'","form-action 'self'"])assert.ok(csp.includes(directive));
 assert.ok(!csp.includes("'unsafe-eval'"));
 assert.ok(contentSecurityPolicy(true).includes("'unsafe-eval'"));
 assert.ok(csp.includes('https://zomoblpgurchkxvkkutj.supabase.co'));
 assert.ok(csp.includes('https://www.google.com'));
 assert.ok(csp.includes('https://www.googletagmanager.com'));
 assert.ok(!csp.includes('txqxbndfiestxjjojlgh'));
 assert.deepEqual(securityHeaders().map(h=>h.key),['Content-Security-Policy','X-Content-Type-Options','Referrer-Policy','Permissions-Policy']);
});
test('HSTS is host-scoped and does not upgrade localhost or unverified subdomains',async()=>{
 const headers=await config.headers();
 const hsts=headers.find(r=>r.headers.some(h=>h.key==='Strict-Transport-Security'));
 const host=new RegExp('^'+hsts.has[0].value+'$');
 assert.ok(host.test('guiaeducativatuc.com.ar'));
 assert.ok(host.test('www.guiaeducativatuc.com.ar'));
 assert.ok(!host.test('guiaeducativatucXcomXar'));
 assert.ok(!host.test('localhost:4004'));
 assert.ok(!host.test('admin.guiaeducativatuc.com.ar'));
 assert.equal(hsts.headers[0].value,'max-age=31536000');
});
test('privacy notice contains confirmed responsibility, real destinations and manual retention',()=>{
 const page=readFileSync(new URL('../app/privacidad/page.js',import.meta.url),'utf8');
 assert.doesNotMatch(page,/Borrador pendiente de validación|responsable legal.*pendiente/);
 assert.match(page,/legalConfig.legalName/);assert.match(page,/legalConfig.contactAddress/);
 assert.match(page,/no como domicilio legal/);assert.match(page,/mailto:/);
 assert.match(page,/GET Instituciones/);assert.match(page,/no borra automáticamente/);
 assert.match(page,/180 días/);assert.match(page,/No envíes una copia de tu DNI/);
 const footer=readFileSync(new URL('../app/components/PublicFooter.js',import.meta.url),'utf8');
 assert.ok(footer.includes('href="/privacidad"'));
 const form=readFileSync(new URL('../app/contacto/ContactForm.js',import.meta.url),'utf8');
 assert.ok(form.indexOf("trackConfirmedSubmission('commercial'")>form.indexOf('!result.receiptId'));
});
test('only the documented Concepcion address is corrected; Siglo21 remains Buenos Aires128',()=>{
 const catalog=JSON.parse(readFileSync(new URL('../lib/catalog/public-catalog.json',import.meta.url),'utf8'));
 const entries=Array.isArray(catalog)?catalog:catalog.documents;
 // The versioned catalog uses entries; tolerate the legacy documents envelope in fixtures.
 const records=entries||catalog.entries;
 assert.equal(records.find(x=>x.key==='sede/instituto-santa-barbara-concepcion').payload.data.address,'Nasif Estéfano 175, Concepción, Tucumán');
 assert.match(records.find(x=>x.key==='sede/universidad-siglo-21-concepcion').payload.data.address,/Buenos Aires 128/);
});
