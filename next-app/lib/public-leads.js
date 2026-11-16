import {trackConfirmedSubmission} from './analytics/public-tracking.mjs';

const pendingKeys = new Map();
async function inquiryKey(body) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2,'0')).join('');
  const now = Date.now();
  for (const [key,value] of pendingKeys) if (now-value.at > 10*60*1000) pendingKeys.delete(key);
  if (!pendingKeys.has(fingerprint)) {
    if (pendingKeys.size >= 20) pendingKeys.delete(pendingKeys.keys().next().value);
    pendingKeys.set(fingerprint,{key:crypto.randomUUID(),at:now});
  }
  // Same in-page payload/retry uses the receptor's existing idempotency contract.
  // No contact fields or fingerprints are written to browser storage.
  return pendingKeys.get(fingerprint).key;
}

export function savePublicLead(lead) {
  try {
    const storedLeads = localStorage.getItem("guiaEducativaLeads");
    const leads = storedLeads ? JSON.parse(storedLeads) : [];

    leads.unshift({
      date: new Date().toISOString(),
      ...lead,
    });

    localStorage.setItem("guiaEducativaLeads", JSON.stringify(leads));
    return true;
  } catch {
    return false;
  }
}

export async function submitPublicInquiry(inquiry) {
  const body = JSON.stringify({...inquiry, website:''});
  const response = await fetch('/api/public-inquiries', {
    method: 'POST',
    headers: {'Content-Type':'application/json', 'Idempotency-Key':await inquiryKey(body)},
    body,
  });
  if (response.status === 429) throw new Error('Demasiados intentos. Esperá un minuto antes de volver a enviar.');
  let result;
  try { result = await response.json(); } catch { throw new Error('No se confirmó la recepción. Podés volver a intentar.'); }
  if (!response.ok || !result.ok || !result.receiptId) throw new Error(result.message || 'No se confirmó la recepción');
  trackConfirmedSubmission('academic', result.receiptId);
  return result.receiptId;
}
