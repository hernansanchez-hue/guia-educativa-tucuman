"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicFooter from "../../../../components/PublicFooter";
import PublicHeader from "../../../../components/PublicHeader";

const FIELD_CHIPS = [
  "Instituciones públicas y privadas",
  "Organizaciones vinculadas al sector",
  "Ejercicio profesional y consultoría",
];

function readLeads() {
  try {
    const storedLeads = localStorage.getItem("guiaEducativaLeads");
    return storedLeads ? JSON.parse(storedLeads) : [];
  } catch {
    return [];
  }
}

export default function CareerPageClient({
  city,
  institution,
  career,
  offering,
}) {
  const router = useRouter();
  const [formSent, setFormSent] = useState(false);
  const whatsapp = offering.whatsapp || institution.whatsapp || "";
  const campus = offering.campus || institution.address;
  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const internationalNumber = whatsappNumber.startsWith("54")
    ? whatsappNumber
    : `54${whatsappNumber}`;
  const whatsappHref = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    `Hola, quiero información sobre ${career.name}`,
  )}`;
  const facts = [
    ["Duración", offering.duration],
    ["Sede", campus],
    ["Título", offering.degree],
    ["Validez", offering.nationalValidity],
    ["Turnos", offering.shifts],
    ["Modalidad", offering.modality],
  ];

  function backToInstitution() {
    router.push(`/${city.slug}/${institution.slug}`);
  }

  function scrollCareerSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function saveCareerLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const leads = readLeads();

    leads.unshift({
      date: new Date().toISOString(),
      institution: institution.name,
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      career: career.name,
      shift: String(formData.get("shift") || ""),
      query: String(formData.get("query") || "").trim(),
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
          <button className="btn light" type="button" onClick={backToInstitution}>
            Volver a la institución
          </button>

          <div className="career-detail-layout">
            <main className="career-detail-main">
              <section className="career-page-hero">
                <div className="career-page-copy">
                  <span id="careerPageInstitution" className="eyebrow">
                    {institution.name} · {city.name}
                  </span>
                  <h1 id="careerPageName">{career.name}</h1>
                  <p id="careerPageTitle">{offering.degree}</p>
                  <div id="careerFacts" className="career-facts">
                    {facts.map(([label, value]) => (
                      <div className="career-fact" key={label}>
                        <small>{label}</small>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <img
                  id="careerPageImage"
                  className="career-page-image"
                  src={offering.image}
                  alt={career.name}
                />
                <p id="careerHeroDescription" className="career-hero-description">
                  {career.description}
                </p>
              </section>

              <nav className="career-section-tabs" aria-label="Secciones de la carrera">
                <button type="button" onClick={() => scrollCareerSection("careerAboutSection")}>Sobre la carrera</button>
                <button type="button" onClick={() => scrollCareerSection("careerPlanSection")}>Plan de estudios</button>
                <button type="button" onClick={() => scrollCareerSection("careerFieldSection")}>Campo laboral</button>
                <button type="button" onClick={() => scrollCareerSection("careerRequirementsSection")}>Requisitos e ingreso</button>
                <button type="button" onClick={() => scrollCareerSection("careerFaqSection")}>Más información</button>
              </nav>

              <section id="careerAboutSection" className="career-info-section">
                <div className="career-about-layout">
                  <div>
                    <h2>Sobre la carrera</h2>
                    <p id="careerAbout">{career.description}</p>
                    <h2 style={{ marginTop: 20 }}>Perfil del egresado</h2>
                    <p id="careerProfile">{career.graduateProfile}</p>
                  </div>
                  <div className="career-feature-list">
                    <span>Formación práctica en entornos reales</span>
                    <span>Docentes especializados</span>
                    <span>Herramientas profesionales actuales</span>
                  </div>
                </div>
              </section>

              <section id="careerFieldSection" className="career-info-section">
                <div className="career-field-header">
                  <span className="career-field-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M4 7h16v13H4z" />
                      <path d="M9 7V4h6v3M4 12h16" />
                    </svg>
                  </span>
                  <div>
                    <h2>Campo laboral</h2>
                    <p id="careerField">{career.workField}</p>
                  </div>
                </div>
                <div id="careerFieldChips" className="career-field-chips">
                  {FIELD_CHIPS.map((item) => (
                    <span className="career-field-chip" key={item}>{item}</span>
                  ))}
                </div>
              </section>

              <section id="careerPlanSection" className="career-info-section">
                <h2>Plan de estudios</h2>
                <p style={{ marginBottom: 15 }}>Conocé la organización general de la carrera.</p>
                <ol id="careerStudyPlan" className="career-study-plan">
                  {career.studyPlan.map((item, index) => (
                    <li key={item}><strong>{index + 1}° Año</strong>{item}</li>
                  ))}
                </ol>
              </section>

              <section id="careerRequirementsSection" className="career-info-section">
                <h2>Requisitos de ingreso</h2>
                <ul id="careerRequirements">
                  {career.requirements.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section id="careerFaqSection" className="career-info-section">
                <h2>Preguntas frecuentes</h2>
                <div id="careerFaq">
                  {career.faq.map((item) => (
                    <div className="career-faq-item" key={item.question}>
                      <strong>{item.question}</strong>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <aside className="career-contact-sidebar">
              <section className="career-info-section career-interest-card">
                <h2>¿Te interesa esta carrera?</h2>
                <p>Dejanos tus datos y la institución se contactará.</p>
                <form
                  id="careerLeadForm"
                  className={offering.formEnabled ? "form-grid" : "form-grid hidden"}
                  onSubmit={saveCareerLead}
                >
                  <input name="name" id="careerLeadName" required placeholder="Nombre y Apellido" />
                  <input name="phone" id="careerLeadPhone" required placeholder="Teléfono / WhatsApp" inputMode="tel" />
                  <input name="email" id="careerLeadEmail" required placeholder="Email" type="email" />
                  <select name="shift" id="careerLeadShift" defaultValue="">
                    <option value="">¿En qué turno te interesa?</option>
                    <option>Mañana</option>
                    <option>Tarde</option>
                    <option>Noche</option>
                  </select>
                  <textarea name="query" id="careerLeadQuery" placeholder="Escribí tu consulta (opcional)" />
                  <a id="careerWhatsappButton" className="btn career-whatsapp" href={whatsappHref} target="_blank" rel="noopener">Hablar por WhatsApp</a>
                  <div className="career-form-divider">o completá el formulario</div>
                  <button className="btn light" type="submit">Enviar consulta</button>
                  <p id="careerFormMessage" className={formSent ? "" : "hidden"} style={{ color: "var(--exito)", fontWeight: 800 }}>Consulta enviada correctamente.</p>
                </form>
              </section>

              <section className="career-info-section">
                <h2>Información rápida</h2>
                <div className="career-quick-info">
                  <div className="career-quick-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 21h18M5 21V9l7-4 7 4v12" /></svg>
                    <span><small>Institución</small><strong id="careerQuickInstitution">{institution.name}</strong></span>
                  </div>
                  <div className="career-quick-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12Z" /></svg>
                    <span><small>Sede</small><strong id="careerQuickCampus">{campus}</strong></span>
                  </div>
                  <div className="career-quick-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m12 3 7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7Z" /></svg>
                    <span><small>Título que otorga</small><strong id="careerQuickDegree">{offering.degree}</strong></span>
                  </div>
                  <div className="career-quick-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>
                    <span><small>Validez</small><strong id="careerQuickValidity">{offering.nationalValidity}</strong></span>
                  </div>
                </div>
                <button className="btn light" type="button" style={{ width: "100%", marginTop: 18 }} onClick={backToInstitution}>Ver más carreras de esta institución</button>
              </section>
            </aside>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
