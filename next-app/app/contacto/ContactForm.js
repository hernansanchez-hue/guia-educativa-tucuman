'use client';

import {useRef, useState} from 'react';
import {usePublicEditorial} from '../components/PublicEditorialContext';
import Link from 'next/link';
import {trackConfirmedSubmission} from '../../lib/analytics/public-tracking.mjs';
import {INQUIRY_PRIVACY_VERSION} from '../../lib/privacy/inquiry-consent.mjs';
import {COMMERCIAL_NOTICE} from '../../lib/privacy/commercial-consent.mjs';

export default function ContactForm() {
  const footer = usePublicEditorial('footer');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const requestRef = useRef(null);
  const sendingRef = useRef(false);
  const statusRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sendingRef.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const input = Object.fromEntries(new FormData(form));
    input.privacyConsent = input.privacyConsent === 'on';
    input.privacyVersion = INQUIRY_PRIVACY_VERSION;
    const serialized = JSON.stringify(input);
    // Keep the same key after network errors: an uncertain delivery must not become a new message.
    if (!requestRef.current || requestRef.current.payload !== serialized) {
      requestRef.current = {payload: serialized, key: crypto.randomUUID()};
    }
    sendingRef.current = true;
    setStatus('sending');
    setMessage('Enviando tu consulta…');
    try {
      const response = await fetch('/api/commercial-contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Idempotency-Key': requestRef.current.key},
        body: serialized,
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || !result.receiptId) {
        throw new Error(result.message || 'No pudimos confirmar la recepción. Intentá nuevamente más tarde.');
      }
      setStatus('success');
      trackConfirmedSubmission('commercial', result.receiptId);
      setMessage('Recibimos tu consulta. El equipo de GET se pondrá en contacto con vos.');
      form.reset();
      requestRef.current = null;
    } catch (error) {
      setStatus('error');
      setMessage(error.name === 'TimeoutError' || error.name === 'TypeError'
        ? 'No pudimos confirmar la recepción. Conservamos tus datos en el formulario para que puedas reintentar.'
        : error.message);
    } finally {
      sendingRef.current = false;
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return <form className="form-grid" onSubmit={handleSubmit} aria-busy={status === 'sending'}>
    <label htmlFor="contact-institution">Nombre de la institución<input id="contact-institution" name="institutionName" required minLength="2" maxLength="200" placeholder="Nombre de la institución" autoComplete="organization"/></label>
    <label htmlFor="contact-name">Persona de contacto<input id="contact-name" name="name" required minLength="2" maxLength="200" placeholder="Persona de contacto" autoComplete="name"/></label>
    <label htmlFor="contact-phone">WhatsApp<input id="contact-phone" name="phone" required minLength="3" maxLength="50" placeholder="WhatsApp" inputMode="tel" autoComplete="tel"/></label>
    <label htmlFor="contact-email">Email<input id="contact-email" name="email" required maxLength="320" placeholder="Email" type="email" autoComplete="email"/></label>
    <label htmlFor="contact-plan">Plan de interés<select id="contact-plan" name="plan" required defaultValue=""><option value="" disabled>Plan de interés</option><option>Básico</option><option>Profesional</option><option>Premium</option></select></label>
    <label className="full" htmlFor="contact-message">Mensaje<textarea id="contact-message" name="message" rows="4" maxLength="4000" placeholder="Mensaje"/></label>
    <label className="commercial-contact-trap" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <p className="form-note full">Usaremos estos datos para responder a esta consulta comercial. No incluyas información sensible.</p>
    <label className="form-note full commercial-contact-consent"><input type="checkbox" name="privacyConsent" required/><span>{COMMERCIAL_NOTICE.beforeLink}<Link href="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</Link>{COMMERCIAL_NOTICE.afterLink}</span></label>
    <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Enviar consulta'}</button>
    {message ? <div className={`form-note commercial-contact-status ${status === 'error' ? 'is-error' : ''}`} role={status === 'error' ? 'alert' : 'status'} tabIndex={-1} ref={statusRef}>
      <p>{message}</p>
      {status === 'error' && footer.whatsappHref ? <a href={footer.whatsappHref} target="_blank" rel="noopener noreferrer">Contactar a GET por WhatsApp ↗</a> : null}
    </div> : null}
  </form>;
}
