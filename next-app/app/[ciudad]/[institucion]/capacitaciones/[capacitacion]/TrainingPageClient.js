"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicFooter from "../../../../components/PublicFooter";
import PublicHeader from "../../../../components/PublicHeader";

const FIELD_CHIPS = ["Instituciones públicas y privadas", "Organizaciones vinculadas al sector", "Ejercicio profesional y consultoría"];

function readLeads() {
  try {
    const value = localStorage.getItem("guiaEducativaLeads");
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export default function TrainingPageClient({ city, institution, program, offering }) {
  const router = useRouter();
  const [formSent, setFormSent] = useState(false);
  const campus = offering.campus || institution.address;
  const whatsapp = offering.whatsapp || institution.whatsapp || "";
  const digits = whatsapp.replace(/\D/g, "");
  const number = digits.startsWith("54") ? digits : `54${digits}`;
  const whatsappHref = `https://wa.me/${number}?text=${encodeURIComponent(`Hola, quiero información sobre ${program.name}`)}`;
  const facts = [["Duración", offering.duration], ["Sede", campus], ["Título", offering.certification], ["Validez", offering.nationalValidity], ["Turnos", offering.shifts], ["Modalidad", offering.modality]];

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveTrainingLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const leads = readLeads();
    leads.unshift({
      date: new Date().toISOString(),
      leadType: "training",
      institution: institution.name,
      institutionId: institution.id,
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      training: program.name,
      trainingProgramId: program.id,
      career: program.name,
      shift: String(data.get("shift") || ""),
      query: String(data.get("query") || "").trim(),
    });
    localStorage.setItem("guiaEducativaLeads", JSON.stringify(leads));
    setFormSent(true);
    form.reset();
  }

  return (
    <div className="app-shell">
      <PublicHeader />
      <section id="careerPage" className="page active" aria-live="polite">
        <div className="career-page-shell">
          <button className="btn light" type="button" onClick={() => router.push(`/${city.slug}/${institution.slug}`)}>Volver a la institución</button>
          <div className="career-detail-layout">
            <main className="career-detail-main">
              <section className="career-page-hero">
                <div className="career-page-copy">
                  <span className="eyebrow">{institution.name} · {city.name}</span>
                  <h1>{program.name}</h1>
                  <p>{offering.certification}</p>
                  <div className="career-facts">{facts.map(([label, value]) => <div className="career-fact" key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
                </div>
                <img className="career-page-image" src={offering.image} alt={program.name} />
                <p className="career-hero-description">{program.description}</p>
              </section>
              <nav className="career-section-tabs" aria-label="Secciones de la capacitación">
                <button type="button" onClick={() => scrollTo("trainingAboutSection")}>Sobre la capacitación</button>
                <button type="button" onClick={() => scrollTo("trainingPlanSection")}>Contenidos</button>
                <button type="button" onClick={() => scrollTo("trainingFieldSection")}>Campo laboral</button>
                <button type="button" onClick={() => scrollTo("trainingRequirementsSection")}>Requisitos e ingreso</button>
                <button type="button" onClick={() => scrollTo("trainingFaqSection")}>Más información</button>
              </nav>
              <section id="trainingAboutSection" className="career-info-section"><div className="career-about-layout"><div><h2>Sobre la capacitación</h2><p>{program.description}</p><h2 style={{ marginTop: 20 }}>Perfil del egresado</h2><p>{program.profile}</p></div><div className="career-feature-list"><span>Formación práctica en entornos reales</span><span>Docentes especializados</span><span>Herramientas profesionales actuales</span></div></div></section>
              <section id="trainingFieldSection" className="career-info-section"><div className="career-field-header"><span className="career-field-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 7h16v13H4z"/><path d="M9 7V4h6v3M4 12h16"/></svg></span><div><h2>Campo laboral</h2><p>{program.workField}</p></div></div><div className="career-field-chips">{FIELD_CHIPS.map((item) => <span className="career-field-chip" key={item}>{item}</span>)}</div></section>
              <section id="trainingPlanSection" className="career-info-section"><h2>Contenidos</h2><p style={{ marginBottom: 15 }}>Conocé la organización general de la capacitación.</p><ol className="career-study-plan">{program.contents.map((item, index) => <li key={item}><strong>{index + 1}° Año</strong>{item}</li>)}</ol></section>
              <section id="trainingRequirementsSection" className="career-info-section"><h2>Requisitos de ingreso</h2><ul>{program.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section id="trainingFaqSection" className="career-info-section"><h2>Preguntas frecuentes</h2><div>{program.faq.map((item) => <div className="career-faq-item" key={item.question}><strong>{item.question}</strong><p>{item.answer}</p></div>)}</div></section>
            </main>
            <aside className="career-contact-sidebar">
              <section className="career-info-section career-interest-card">
                <h2>¿Te interesa esta capacitación?</h2><p>Dejanos tus datos y la institución se contactará.</p>
                <form className={offering.formEnabled ? "form-grid" : "form-grid hidden"} onSubmit={saveTrainingLead}>
                  <input name="name" required placeholder="Nombre y Apellido"/><input name="phone" required placeholder="Teléfono / WhatsApp" inputMode="tel"/><input name="email" required placeholder="Email" type="email"/>
                  <select name="shift" defaultValue=""><option value="">¿En qué turno te interesa?</option><option>Mañana</option><option>Tarde</option><option>Noche</option></select>
                  <textarea name="query" placeholder="Escribí tu consulta (opcional)"/><a className="btn career-whatsapp" href={whatsappHref} target="_blank" rel="noopener">Hablar por WhatsApp</a><div className="career-form-divider">o completá el formulario</div><button className="btn light" type="submit">Enviar consulta</button><p className={formSent ? "" : "hidden"} style={{ color: "var(--exito)", fontWeight: 800 }}>Consulta enviada correctamente.</p>
                </form>
              </section>
              <section className="career-info-section"><h2>Información rápida</h2><div className="career-quick-info"><div className="career-quick-row"><span><small>Institución</small><strong>{institution.name}</strong></span></div><div className="career-quick-row"><span><small>Sede</small><strong>{campus}</strong></span></div><div className="career-quick-row"><span><small>Certificación</small><strong>{offering.certification}</strong></span></div><div className="career-quick-row"><span><small>Validez</small><strong>{offering.nationalValidity}</strong></span></div></div><button className="btn light" type="button" style={{ width: "100%", marginTop: 18 }} onClick={() => router.push(`/${city.slug}/${institution.slug}`)}>Ver más capacitaciones</button></section>
            </aside>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
