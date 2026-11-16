// Only campaign taxonomy, never arbitrary URL values or free text.
export const PUBLIC_ORIGIN = 'https://guiaeducativatuc.com.ar';
const sources = new Set(['google','bing','facebook','instagram','youtube','linkedin','whatsapp','newsletter','get','qa-get']);
const mediums = new Set(['organic','cpc','social','email','referral','qr','print','verification']);
const campaigns = new Set(['expo-get','orientacion-vocacional','cursos-docentes','instituciones','carreras','get-verificacion-20261115']);
const contents = new Set(['header','footer','hero','banner','post','story','bio','qr']);
const referrers = new Set(['google.com','google.com.ar','bing.com','facebook.com','m.facebook.com','l.facebook.com','lm.facebook.com','instagram.com','l.instagram.com','youtube.com','linkedin.com','t.co']);
export const ATTRIBUTION_KEY = 'get.analytics-attribution.v1';
const maxAge = 30 * 60 * 1000;

export function isPublicMeasurementEnvironment(location) {
  return location?.origin === PUBLIC_ORIGIN;
}
export function sanitizeCampaign(search = '') {
  const query = new URLSearchParams(search);
  const result = {campaign_id:'',campaign_source:'',campaign_medium:'',campaign_name:'',campaign_term:'',campaign_content:''};
  for (const [key, field, allowed] of [['utm_source','campaign_source',sources],['utm_medium','campaign_medium',mediums],['utm_campaign','campaign_name',campaigns],['utm_content','campaign_content',contents]]) {
    const value = query.getAll(key);
    if (value.length === 1 && allowed.has(value[0])) result[field] = value[0];
  }
  return result;
}
export function sanitizeReferrer(value = '') {
  try {
    const url = new URL(value);
    if (!['https:','http:'].includes(url.protocol) || url.username || url.password || url.port) return '';
    const hostname = url.hostname.replace(/^www\./, '');
    return referrers.has(hostname) ? 'https://' + hostname + '/' : '';
  } catch { return ''; }
}

// Caller must already have checked opt-in. Store sanitized taxonomy only, for this
// tab/session; do not collect a landing URL or persist anything before acceptance.
export function consentedAttribution(target, now = Date.now()) {
  const campaign = sanitizeCampaign(target.location.search);
  const fresh = {version:1,at:now,campaign,referrer:sanitizeReferrer(target.document.referrer)};
  let previous;
  try { previous = JSON.parse(target.sessionStorage?.getItem(ATTRIBUTION_KEY)); } catch { /* Optional storage. */ }
  if (!campaign.campaign_source && !campaign.campaign_name && previous?.version === 1 && Number.isFinite(previous.at) && previous.at <= now && now-previous.at < maxAge) {
    const q = new URLSearchParams({utm_source:previous.campaign?.campaign_source || '',utm_medium:previous.campaign?.campaign_medium || '',utm_campaign:previous.campaign?.campaign_name || '',utm_content:previous.campaign?.campaign_content || ''});
    return {campaign:sanitizeCampaign(q),referrer:sanitizeReferrer(previous.referrer)};
  }
  try { target.sessionStorage?.setItem(ATTRIBUTION_KEY,JSON.stringify(fresh)); } catch { /* Measurement still works without session storage. */ }
  return {campaign,referrer:fresh.referrer};
}

export function publicPageTitles(catalog, extended = {}) {
  const titles = {'/':'Elegí tu ciudad | GET','/carreras':'Carreras en Tucumán | GET','/instituciones':'Instituciones de Tucumán | GET','/contacto':'Contacto | GET','/nosotros':'Sobre GET','/servicios':'Servicios | GET','/eventos':'Eventos | GET','/cursos-docentes':'Cursos docentes | GET','/privacidad':'Política de privacidad | GET'};
  for (const city of catalog.cities) titles['/'+city.slug] = city.name+' | GET';
  for (const institution of catalog.institutions) {
    const city = catalog.cities.find(c=>c.slug===institution.citySlug);
    titles['/'+institution.citySlug+'/'+institution.slug] = institution.name+' en '+(city?.name || institution.citySlug)+' | GET';
    titles['/instituciones/'+institution.slug] = institution.name+' | GET';
  }
  for (const career of catalog.careers) titles['/carreras/'+career.slug] = career.name+' en Tucumán | GET';
  for (const offering of catalog.offerings) {
    const institution=catalog.institutions.find(i=>i.id===offering.institutionId),career=catalog.careers.find(c=>c.id===offering.careerId);
    if(institution && career) titles['/'+institution.citySlug+'/'+institution.slug+'/carreras/'+career.slug] = career.name+' · '+titles['/'+institution.citySlug+'/'+institution.slug];
  }
  for(const [kind,prefix] of [['events','eventos'],['services','servicios']]) for(const item of extended[kind] || []) titles['/'+prefix+'/'+item.slug] = (item.title || item.name)+' | GET';
  return titles;
}
