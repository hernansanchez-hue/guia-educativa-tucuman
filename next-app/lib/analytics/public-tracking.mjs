export const MEASUREMENT_ID = 'G-KY9E5NG5V2';
export const CONSENT_KEY = 'get.analytics-consent.v1';
export const CONSENT_EVENT = 'get:analytics-consent';
export const SUBMISSION_EVENT = 'get:confirmed-submission';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const PUBLIC_ORIGIN = 'https://guiaeducativatuc.com.ar';
const RESERVED = new Set(['instituciones','carreras','eventos','servicios','nosotros','contacto','cursos-docentes','privacidad','orientacion-vocacional','ciudades']);
const privatePath = path => /^\/(?:admin|administrador|api|_next)(?:\/|$)/i.test(path);
const submissions = new Set();
let memoryConsent = null;

export function decodeConsent(raw, now = Date.now()) {
  try {
    const value = JSON.parse(raw);
    return value?.version === 1 && ['granted', 'denied'].includes(value.status)
      && Number.isFinite(value.updatedAt) && value.updatedAt <= now
      && now - value.updatedAt <= CONSENT_MAX_AGE ? value.status : 'unset';
  } catch { return 'unset'; }
}

export function readAnalyticsConsent(target = typeof window === 'undefined' ? null : window) {
  if (!target) return 'unset';
  try { return decodeConsent(target.localStorage.getItem(CONSENT_KEY) ?? memoryConsent); }
  catch { return decodeConsent(memoryConsent); }
}

export function storeAnalyticsConsent(status, target = window) {
  if (!['granted', 'denied'].includes(status)) return;
  memoryConsent = JSON.stringify({version: 1, status, updatedAt: Date.now()});
  try { target.localStorage.setItem(CONSENT_KEY, memoryConsent); } catch { /* Optional storage may be disabled. */ }
  target.dispatchEvent(new Event(CONSENT_EVENT));
}

export function publicPath(value, paths) {
  if (typeof value !== 'string') return null;
  const path = value.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  if (privatePath(path) || !paths.has(path)) return null;
  return path;
}

export function pageContext(path) {
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return {page_type: 'home'};
  if (parts[0] === 'instituciones') return {page_type: parts[1] ? 'institution' : 'institution_directory', ...(parts[1] ? {institution_slug: parts[1]} : {})};
  if (parts[0] === 'carreras') return {page_type: parts[1] ? 'career' : 'career_directory', ...(parts[1] ? {career_slug: parts[1]} : {})};
  if (!RESERVED.has(parts[0])) {
    return {page_type: parts[2] === 'carreras' ? 'career' : parts[1] ? 'institution' : 'city',
      city_slug: parts[0], ...(parts[1] ? {institution_slug: parts[1]} : {}), ...(parts[2] === 'carreras' && parts[3] ? {career_slug: parts[3]} : {})};
  }
  return {page_type: parts[0] === 'eventos' ? 'events' : parts[0] === 'servicios' ? 'services' : 'public'};
}

export function safeEvent(name, path, paths) {
  const verifiedPath = publicPath(path, paths);
  if (!verifiedPath || !['page_view','view_city','view_institution','view_career','search','click_whatsapp','download_study_plan','generate_lead','commercial_inquiry_received'].includes(name)) return null;
  // No free text, query/hash, referrer URL, title, phone, email, file URL or CRM receipt enters GA.
  return {name, params: {
    page_location: PUBLIC_ORIGIN + verifiedPath,
    page_title: 'GET · ' + pageContext(verifiedPath).page_type,
    page_referrer: '',
    ...Object.fromEntries(Object.entries(pageContext(verifiedPath)).map(([key, value]) => [key, value.slice(0,100)])),
  }};
}

export function clearAnalyticsCookies(target = window) {
  const names = target.document.cookie.split(';').map(value => value.trim().split('=')[0]).filter(name => /^_ga(?:_|$)/.test(name));
  const host = target.location.hostname;
  const domains = ['', host, '.' + host, ...host.split('.').slice(1,-1).map((_,index) => '.' + host.split('.').slice(index+1).join('.'))];
  for (const name of names) for (const domain of domains) {
    target.document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
  }
}

export function disableAnalytics(target = window) {
  target['ga-disable-' + MEASUREMENT_ID] = true;
  if (target.__getAnalytics) {target.__getAnalytics.active = false;target.__getAnalytics.lastPage = null;}
}

export function initializeAnalytics(target, paths) {
  const allowed = () => readAnalyticsConsent(target) === 'granted' && target.self === target.top
    && Boolean(publicPath(target.location.pathname, paths));
  if (!allowed()) {disableAnalytics(target);return null;}
  if (target.__getAnalytics) {target.__getAnalytics.active = true;target['ga-disable-' + MEASUREMENT_ID] = false;return target.__getAnalytics;}
  target.dataLayer = target.dataLayer || [];
  target.gtag = function () {
    if (!allowed()) return;
    // Keep the official gtag command format (Arguments, not a dataLayer array).
    target.dataLayer.push(arguments);
  };
  target['ga-disable-' + MEASUREMENT_ID] = false;
  target.gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
  target.gtag('consent', 'update', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
  target.gtag('js', new Date());
  const path = publicPath(target.location.pathname, paths);
  const config = safeEvent('page_view', path, paths)?.params || {page_location: PUBLIC_ORIGIN, page_title: 'GET', page_referrer: ''};
  target.gtag('config', MEASUREMENT_ID, {
    ...config, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    ignore_referrer: true, cookie_expires: 60 * 60 * 24 * 180, cookie_update: false,
    campaign_id:'', campaign_source:'', campaign_medium:'', campaign_name:'', campaign_term:'', campaign_content:'',
  });
  const runtime = {
    active: true, lastPage: null,
    emit(name) {
      if (!runtime.active || !allowed()) return false;
      const event = safeEvent(name, target.location.pathname, paths);
      if (!event) return false;
      target.gtag('event', event.name, {...event.params, send_to: MEASUREMENT_ID});
      return true;
    },
    page() {
      const current = publicPath(target.location.pathname, paths);
      if (!current || current === runtime.lastPage || !runtime.active || !allowed()) return;
      runtime.lastPage = current;
      const params = safeEvent('page_view', current, paths).params;
      target.gtag('set', {page_location:params.page_location, page_title:params.page_title, page_referrer:''});
      runtime.emit('page_view');
      const kind = pageContext(current).page_type;
      if (['city','career','institution'].includes(kind)) runtime.emit('view_' + kind);
    },
  };
  target.__getAnalytics = runtime;
  target.dispatchEvent?.(new Event('get:analytics-initialized'));
  return runtime;
}

export function trackConfirmedSubmission(kind, receiptId) {
  if (typeof window === 'undefined' || !['academic','commercial'].includes(kind) || typeof receiptId !== 'string' || !receiptId) return;
  const key = kind + ':' + receiptId;
  if (submissions.has(key)) return;
  // Receipt is used for in-memory duplicate prevention only, never as event data.
  if (submissions.size >= 100) submissions.clear();
  submissions.add(key);
  window.dispatchEvent(new CustomEvent(SUBMISSION_EVENT, {detail: {kind}}));
}
