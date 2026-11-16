"use client";
import {useEffect, useMemo, useRef, useState, useSyncExternalStore} from 'react';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import {CONSENT_EVENT, SUBMISSION_EVENT, MEASUREMENT_ID, readAnalyticsConsent, storeAnalyticsConsent, initializeAnalytics, disableAnalytics, clearAnalyticsCookies, publicPath, pageContext} from '../../lib/analytics/public-tracking.mjs';
import './public-analytics.css';
import {isPublicMeasurementEnvironment} from '../../lib/analytics/attribution.mjs';
import {completedSearchGate} from '../../lib/analytics/search-completions.mjs';

function subscribeConsent(callback) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {window.removeEventListener(CONSENT_EVENT, callback);window.removeEventListener('storage', callback);};
}
const getConsent = () => readAnalyticsConsent();
const serverConsent = () => 'unset';
const subscribeBrowser = () => () => {};
const isTopLevel = () => window.self === window.top;
const serverFalse = () => false;
const isProductionLocation = () => isPublicMeasurementEnvironment(window.location);
const isBootstrapped = () => Boolean(window.__getAnalytics);
function subscribeRuntime(callback) {
  window.addEventListener('get:analytics-initialized', callback);
  return () => window.removeEventListener('get:analytics-initialized', callback);
}
const privatePath = path => /^\/(?:admin|administrador|api|_next)(?:\/|$)/i.test(path || '');

export default function PublicAnalyticsClient({configured = false, publicPaths = [], publicTitles = {}}) {
  const pathname = usePathname();
  const paths = useMemo(() => new Set(publicPaths), [publicPaths]);
  const consent = useSyncExternalStore(subscribeConsent, getConsent, serverConsent);
  const [preferences, setPreferences] = useState(false);
  const panel = useRef(null);
  const returnFocus = useRef(null);
  const topLevel = useSyncExternalStore(subscribeBrowser, isTopLevel, serverFalse);
  const production = useSyncExternalStore(subscribeBrowser, isProductionLocation, serverFalse);
  const bootstrapped = useSyncExternalStore(subscribeRuntime, isBootstrapped, serverFalse);
  const [ready, setReady] = useState(false);
  const privateRoute = privatePath(pathname);
  const allowed = configured && production && consent === 'granted' && topLevel && Boolean(publicPath(pathname, paths));

  useEffect(() => {
    // A CMS live-preview iframe must never emit public analytics.
    const open = event => {
      const trigger=event.detail?.trigger;
      returnFocus.current=trigger instanceof HTMLElement ? trigger : event.target instanceof HTMLElement ? event.target : document.activeElement;
      setPreferences(true);
    };
    window.addEventListener('get:analytics-preferences', open);
    return () => window.removeEventListener('get:analytics-preferences', open);
  }, []);

  useEffect(() => {if(preferences)panel.current?.focus({preventScroll:true});},[preferences]);

  useEffect(() => {
    if (!allowed) {disableAnalytics();return;}
    // Queue sanitized configuration and consent BEFORE loading the Google tag.
    initializeAnalytics(window, paths, publicTitles);
  }, [allowed, paths, publicTitles]);

  useEffect(() => {if (ready && allowed) window.__getAnalytics?.page();}, [ready, allowed, pathname]);

  useEffect(() => {
    if (!ready || !allowed) return;
    const complete = completedSearchGate(() => window.__getAnalytics?.emit('search'));
    const searchInput = target => target instanceof HTMLInputElement && (target.type === 'search' || /buscar/i.test(target.placeholder || ''));
    const search = input => {
      if (!searchInput(input)) return;
      complete(input);
    };
    // A pause while typing is not a completed search. Count submit/Enter or a
    // selected suggestion, deduplicating Enter followed by the form's submit.
    const onKeyDown = event => {if(event.key === 'Enter' && !event.isComposing) search(event.target);};
    const onSubmit = event => {
      const input = event.target.querySelector?.('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="buscar"]');
      if (input) search(input);
    };
    const onClick = event => {
      const result = event.target.closest?.('[data-get-search-result]');
      if (result) {
        const scope = result.closest('[role="dialog"], .search-area, #results');
        const input = scope?.querySelector('input[type="search"]') || (scope?.id === 'results' ? scope.parentElement.querySelector('input[type="search"]') : null);
        if (input) search(input);
      }
      const anchor = event.target.closest?.('a[href]');
      if (!anchor) return;
      let url;
      try {url = new URL(anchor.href, window.location.origin);} catch {return;}
      if (['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(url.hostname)) window.__getAnalytics?.emit('click_whatsapp');
      else if (/\.pdf$/i.test(url.pathname) && pageContext(pathname).page_type === 'career') window.__getAnalytics?.emit('download_study_plan');
      if (url.origin === window.location.origin && privatePath(url.pathname)) disableAnalytics();
    };
    const onPop = () => {if (privatePath(window.location.pathname)) disableAnalytics();};
    const onConfirmed = event => {
      if (event.detail?.kind === 'academic') window.__getAnalytics?.emit('generate_lead');
      if (event.detail?.kind === 'commercial') window.__getAnalytics?.emit('commercial_inquiry_received');
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('submit', onSubmit, true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPop);
    window.addEventListener(SUBMISSION_EVENT, onConfirmed);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('submit', onSubmit, true);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPop);
      window.removeEventListener(SUBMISSION_EVENT, onConfirmed);
    };
  }, [ready, allowed, pathname]);

  useEffect(() => {
    // Also honor withdrawal in another tab. Reload unloads Google's internal
    // listeners/timers rather than merely hiding the script element.
    if (consent !== 'granted' && window.__getAnalytics) {
      disableAnalytics();clearAnalyticsCookies();window.location.reload();
    }
  }, [consent]);

  const choose = status => {
    if (status === 'denied') {disableAnalytics();clearAnalyticsCookies();}
    storeAnalyticsConsent(status);
    setPreferences(false);
    returnFocus.current?.focus?.({preventScroll:true});
  };
  const closePreferences = () => {setPreferences(false);returnFocus.current?.focus?.({preventScroll:true});};
  if (privateRoute || !topLevel) return null;
  const showPreferences = preferences || consent === 'unset';
  return <>
    {allowed && bootstrapped ? <Script id="get-ga4-loader" src={'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID} strategy="afterInteractive" onReady={() => setReady(true)} /> : null}
    {showPreferences ? <section ref={panel} tabIndex={-1} className="get-analytics-consent" aria-label="Preferencias de analítica" onKeyDown={event=>{if(event.key==='Escape'&&consent!=='unset')closePreferences();}}>
      <h2>Tu privacidad</h2>
      <p>Con tu permiso, usamos Google Analytics para medir visitas e interacciones y mejorar GET. No enviamos tus datos de contacto ni el texto que buscás. Podés rechazar o retirar tu permiso en cualquier momento.</p>
      {!configured ? <p className="get-analytics-consent__note">La medición está desactivada hasta completar su configuración.</p> : null}
      <Link href="/privacidad">Información de privacidad</Link>
      <div className="get-analytics-consent__actions">
        <button type="button" onClick={() => choose('denied')}>{consent === 'granted' ? 'Retirar permiso' : 'Rechazar'}</button>
        <button type="button" onClick={() => choose('granted')}>Aceptar analítica</button>
      </div>
      {consent === 'granted' ? <p className="get-analytics-consent__note">Retirar el permiso recarga esta página para detener la medición.</p> : null}
      {consent !== 'unset' ? <button className="get-analytics-consent__close" type="button" onClick={closePreferences}>Cerrar preferencias</button> : null}
    </section> : null}
  </>;
}
