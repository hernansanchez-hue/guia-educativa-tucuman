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
