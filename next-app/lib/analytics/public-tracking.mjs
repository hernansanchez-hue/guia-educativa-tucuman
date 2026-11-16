import {PUBLIC_ORIGIN, ATTRIBUTION_KEY, isPublicMeasurementEnvironment, consentedAttribution} from './attribution.mjs';
export const MEASUREMENT_ID = 'G-KY9E5NG5V2';
export const CONSENT_KEY = 'get.analytics-consent.v1';
export const CONSENT_EVENT = 'get:analytics-consent';
export const SUBMISSION_EVENT = 'get:confirmed-submission';
export const RECEIPTS_KEY = 'get.analytics-receipts.v1';
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
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

export function safeEvent(name, path, paths, titles = {}) {
  const verifiedPath = publicPath(path, paths);
  if (!verifiedPath || !['page_view','view_city','view_institution','view_career','search','click_whatsapp','download_study_plan','generate_lead','commercial_inquiry_received'].includes(name)) return null;
  // Titles come only from the published catalog, never document.title or input.
  return {name, params: {
    page_location: PUBLIC_ORIGIN + verifiedPath,
    page_title: (titles[verifiedPath] || 'GET · ' + pageContext(verifiedPath).page_type).slice(0,300),
    page_referrer: '',
    ...Object.fromEntries(Object.entries(pageContext(verifiedPath)).map(([key, value]) => [key, value.slice(0,100)])),
  }};
}

export function clearAnalyticsCookies(target = window) {
  try { target.sessionStorage?.removeItem(ATTRIBUTION_KEY); } catch { /* Optional storage. */ }
  try { target.sessionStorage?.removeItem(RECEIPTS_KEY); } catch { /* Optional storage. */ }
  submissions.clear();
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

export function initializeAnalytics(target, paths, titles = {}) {
  const allowed = () => readAnalyticsConsent(target) === 'granted' && target.self === target.top
    && isPublicMeasurementEnvironment(target.location) && Boolean(publicPath(target.location.pathname, paths));
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
  const attribution = consentedAttribution(target);
  const path = publicPath(target.location.pathname, paths);
  const config = safeEvent('page_view', path, paths, titles)?.params || {page_location: PUBLIC_ORIGIN, page_title: 'GET', page_referrer: ''};
  target.gtag('config', MEASUREMENT_ID, {
    ...config, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    page_referrer: attribution.referrer, cookie_expires: 60 * 60 * 24 * 180, cookie_update: false,
    ...attribution.campaign,
  });
  const runtime = {
    active: true, lastPage: null, referrer: attribution.referrer,
    emit(name) {
      if (!runtime.active || !allowed()) return false;
      const event = safeEvent(name, target.location.pathname, paths, titles);
      if (!event) return false;
      target.gtag('event', event.name, {...event.params, page_referrer:runtime.referrer, send_to: MEASUREMENT_ID});
      return true;
    },
    page() {
      const current = publicPath(target.location.pathname, paths);
      if (!current || current === runtime.lastPage || !runtime.active || !allowed()) return;
      if(runtime.lastPage) runtime.referrer = PUBLIC_ORIGIN + runtime.lastPage;
      runtime.lastPage = current;
      const params = safeEvent('page_view', current, paths, titles).params;
      target.gtag('set', {page_location:params.page_location, page_title:params.page_title, page_referrer:runtime.referrer});
      runtime.emit('page_view');
      const kind = pageContext(current).page_type;
      if (['city','career','institution'].includes(kind)) runtime.emit('view_' + kind);
    },
  };
  target.__getAnalytics = runtime;
  target.dispatchEvent?.(new Event('get:analytics-initialized'));
  return runtime;
}

export async function trackConfirmedSubmission(kind, receiptId) {
  if (typeof window === 'undefined' || !['academic','commercial'].includes(kind) || typeof receiptId !== 'string' || !receiptId || receiptId.length > 200) return false;
  const target = window;
  const allowed = () => readAnalyticsConsent(target) === 'granted' && isPublicMeasurementEnvironment(target.location) && target.__getAnalytics?.active && !privatePath(target.location.pathname);
  if (!allowed()) return false;
  // Only a digest is retained in the opted-in tab, never the receipt itself.
  // This survives a reload/replayed receipt and is removed with consent withdrawal.
  let key;
  try {
    const bytes = await target.crypto.subtle.digest('SHA-256', new TextEncoder().encode(kind + ':' + receiptId));
    key = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
  } catch { return false; }
  if (!allowed() || submissions.has(key)) return false;
  const now = Date.now();
  let previous = [];
  try {
    const stored = JSON.parse(target.sessionStorage?.getItem(RECEIPTS_KEY));
    if (Array.isArray(stored)) previous = stored.filter(item => /^[a-f0-9]{64}$/.test(item?.key) && Number.isFinite(item.at) && item.at <= now && now-item.at < 30*60*1000).slice(-100);
  } catch { /* Optional storage. */ }
  if (previous.some(item => item.key === key)) return false;
  if (submissions.size >= 100) submissions.clear();
  submissions.add(key);
  try { target.sessionStorage?.setItem(RECEIPTS_KEY, JSON.stringify([...previous.slice(-99),{key,at:now}])); } catch { /* In-memory deduplication remains available. */ }
  target.dispatchEvent(new CustomEvent(SUBMISSION_EVENT, {detail: {kind}}));
  return true;
}
