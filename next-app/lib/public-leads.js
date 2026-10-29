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
  const response = await fetch('/api/public-inquiries', {
    method: 'POST',
    headers: {'Content-Type':'application/json', 'Idempotency-Key':crypto.randomUUID()},
    body: JSON.stringify({...inquiry, website:''}),
  });
  const result = await response.json();
  if (!response.ok || !result.ok || !result.receiptId) throw new Error(result.message || 'No se confirmó la recepción');
  return result.receiptId;
}
