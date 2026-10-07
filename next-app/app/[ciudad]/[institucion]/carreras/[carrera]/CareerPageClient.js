"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicFooter from "../../../../components/PublicFooter";
import { savePublicLead } from "../../../../../lib/public-leads";

const FIELD_CHIPS = [
  "Instituciones públicas y privadas",
  "Organizaciones vinculadas al sector",
  "Ejercicio profesional y consultoría",
];

export default function CareerPageClient({
  city,
  institution,
  career,
  offering,
}) {
  const router = useRouter();
  const [formSent, setFormSent] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState("");
  const highlightTimer = useRef();
  const whatsapp = offering.whatsapp || institution.whatsapp || "";
  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const internationalNumber = whatsappNumber.startsWith("54")
    ? whatsappNumber
    : `54${whatsappNumber}`;
  const whatsappHref = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    `Hola, quiero información sobre ${career.name}`,
  )}`;
  const studyPlanPdf = career.studyPlanPdf || career.study_plan_pdf || offering.studyPlanPdf || offering.study_plan_pdf;
  const institutionLogoSrc = institution.slug === "universidad-siglo-21"
    ? "/assets/universidad-siglo-21-logo.png"
    : null;

  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  function backToInstitution() {
    router.push(`/${city.slug}/${institution.slug}`);
  }

  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    window.clearTimeout(highlightTimer.current);
    setHighlightedSection(sectionId);
    highlightTimer.current = window.setTimeout(() => setHighlightedSection(""), 1250);
  }

  function saveCareerLead(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    savePublicLead({
      institution: institution.name,
      city: city.name,
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      career: career.name,
      shift: String(formData.get("shift") || ""),
      query: String(formData.get("query") || "").trim(),
    });
    setFormSent(true);
    form.reset();
  }

  return (
    <div className="app-shell career-page-shell-wrap">
      <header className="career-brand-header">
        <button className="career-get-brand" type="button" onClick={() => router.push(`/${city.slug}`)} aria-label={`Ir a la home de ${city.name}`}>
          <img src="/assets/get-city-hero-logo.png" alt="Guía Educativa Tucumán" />
        </button>
        <span className="career-brand-divider" aria-hidden="true" />
        <button className="career-institution-brand" type="button" onClick={backToInstitution} aria-label={`Ir a ${institution.name}`}>
          <span className={`career-institution-mark${institutionLogoSrc ? " career-institution-mark-logo" : ""}`} aria-hidden="true">
            {institutionLogoSrc ? <img src={institutionLogoSrc} alt="" /> : institution.logo || institution.name.slice(0, 3)}
          </span>
        </button>
      </header>

      <section id="careerPage" className="page active career-page" aria-live="polite">
        <div className="career-page-shell">
          <div className="career-detail-layout">
            <main className="career-detail-main">
              <section className="career-page-hero career-overview">
                <div className="career-page-copy">
                  <p id="careerPageInstitution" className="career-overview-context">Estudiá</p>
                  <h1 id="careerPageName">{career.name}</h1>
                  {offering.degree?.trim().toLocaleLowerCase("es") !== career.name.trim().toLocaleLowerCase("es") ? <p id="careerPageTitle" className="career-overview-degree">{offering.degree}</p> : null}
                  <p id="careerHeroDescription" className="career-hero-description career-overview-description">
                    {career.description}
                  </p>
                </div>
                <div className="career-overview-media"><img id="careerPageImage" className="career-page-image" src={offering.image} alt={career.name} /></div>
              </section>

              <nav className="career-section-tabs career-section-navigation" aria-label="Contenido de la carrera">
                <button type="button" onClick={() => navigateToSection("careerAboutSection")}>La carrera</button>
                <button type="button" onClick={() => navigateToSection("careerFieldSection")}>Salida laboral</button>
                <button type="button" onClick={() => navigateToSection("careerPlanSection")}>Plan de estudios</button>
                <button type="button" onClick={() => navigateToSection("careerRequirementsSection")}>Requisitos</button>
              </nav>

              <section id="careerAboutSection" className={`career-info-section career-about-section${highlightedSection === "careerAboutSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>LA CARRERA</span><h2>Una formación para proyectar tu futuro</h2></div>
                <div className="career-about-layout">
                  <div>
                    <h3>Sobre la carrera</h3>
                    <p id="careerAbout">{career.description}</p>
                  </div>
                  <div>
                    <h3>Perfil del egresado</h3>
                    <p id="careerProfile">{career.graduateProfile}</p>
                  </div>
                </div>
              </section>

              <section id="careerFieldSection" className={`career-info-section career-field-section${highlightedSection === "careerFieldSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>SALIDA LABORAL</span><h2>Ámbitos donde podés desarrollarte</h2></div>
                <p id="careerField" className="career-field-description">{career.workField}</p>
                <div id="careerFieldChips" className="career-field-chips">
                  {FIELD_CHIPS.map((item) => (
                    <span className="career-field-chip" key={item}>{item}</span>
                  ))}
                </div>
              </section>

              <section id="careerPlanSection" className={`career-info-section career-plan-section${highlightedSection === "careerPlanSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>PLAN DE ESTUDIOS</span><h2>Cómo se organiza tu formación</h2></div>
                <ol id="careerStudyPlan" className="career-study-plan">
                  {career.studyPlan.map((item, index) => (
                    <li key={item}><strong>{index + 1}° Año</strong><span>{item}</span></li>
                  ))}
                </ol>
                {studyPlanPdf ? <div className="career-plan-actions"><a className="career-plan-pdf" href={studyPlanPdf} target="_blank" rel="noopener">Descargar plan de estudios <span aria-hidden="true">↗</span></a></div> : null}
              </section>

              <section id="careerRequirementsSection" className={`career-info-section career-requirements-section${highlightedSection === "careerRequirementsSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>INGRESO</span><h2>Todo lo que necesitás para comenzar</h2></div>
                <div className="career-requirements-grid">
                  <div className="career-requirements-group">
                    <h3>Requisitos de ingreso</h3>
                    <ul id="careerRequirements" className="career-requirements-list">{career.requirements.map((item, index) => (
                      <li key={item}>
                        <span className="career-requirement-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item}</span>
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m7 12 3.2 3.2L17.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </li>
                    ))}</ul>
                  </div>
                  <div className="career-faq-list"><h3>Más información</h3><div id="careerFaq">{career.faq.map((item) => (
                    <details className="career-faq-item" key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
                  ))}</div></div>
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
                  <button className="btn light" type="submit">Enviar consulta</button>
                  <div className="career-form-divider">o completá el formulario</div>
                  <a id="careerWhatsappButton" className="btn career-whatsapp" href={whatsappHref} target="_blank" rel="noopener">Hablar por WhatsApp</a>
                  <p id="careerFormMessage" className={formSent ? "" : "hidden"} style={{ color: "var(--exito)", fontWeight: 800 }}>Consulta enviada correctamente.</p>
                </form>
              </section>

            </aside>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
