"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import PublicFooter from "../../../../components/PublicFooter";
import PublicFloatingHeader from "../../../../components/PublicFloatingHeader";
import { savePublicLead, submitPublicInquiry } from "../../../../../lib/public-leads";
import { heroStyle } from "../../../../../lib/admin/hero-style.mjs";

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
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");
  const formSubmitting = useRef(false);
  const [highlightedSection, setHighlightedSection] = useState("");
  const [videoUnavailable,setVideoUnavailable]=useState(false);
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
  useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    window.clearTimeout(highlightTimer.current);
    setHighlightedSection(sectionId);
    highlightTimer.current = window.setTimeout(() => setHighlightedSection(""), 1250);
  }

  async function saveCareerLead(event) {
    event.preventDefault();
    if (formSubmitting.current) return;
    formSubmitting.current = true;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const lead = {
      institution: institution.name,
      city: city.name,
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      career: career.name,
      shift: String(formData.get("shift") || ""),
      query: String(formData.get("query") || "").trim(),
    };
    setFormError("");
    try {
      await submitPublicInquiry({institutionId:institution.id, offeringId:offering.id, name:lead.name, phone:lead.phone, email:lead.email, query:lead.query});
      setFormSent(true);
      form.reset();
    } catch {
      const saved = savePublicLead(lead);
      setFormSent(false);
      setFormError(saved ? "La recepción no fue confirmada. La consulta quedó guardada solo en este navegador." : "La recepción no fue confirmada. Conservá tus datos e intentá más tarde.");
    } finally {
      formSubmitting.current = false;
    }
  }

  return (
    <div className="app-shell career-page-shell-wrap">
      <PublicFloatingHeader homeHref={`/${city.slug}`} />

      <section id="careerPage" className="page active career-page" aria-live="polite">
        <div className="career-page-shell">
          <div className="career-detail-layout">
            <main className="career-detail-main">
              <section className="career-page-hero career-overview">
                <div className="career-page-copy">
                  <p id="careerPageInstitution" className="career-overview-context">Estudiá</p>
                  <h1 id="careerPageName" style={heroStyle(offering.cmsDesign)}>{career.name}</h1>
                  {offering.degree?.trim().toLocaleLowerCase("es") !== career.name.trim().toLocaleLowerCase("es") ? <p id="careerPageTitle" className="career-overview-degree">{offering.degree}</p> : null}
                  <p id="careerHeroDescription" className="career-hero-description career-overview-description">
                    {career.description}
                  </p>
                </div>
                <div className="career-overview-media">{offering.video&&!videoUnavailable?<video id="careerPageImage" className="career-page-image" src={offering.video} poster={offering.image||undefined} controls playsInline preload="metadata" onError={()=>setVideoUnavailable(true)} aria-label={`Video de ${career.name}`}/>:offering.image?<img id="careerPageImage" className="career-page-image" src={offering.image} alt={offering.imageAlt||career.name}/>:null}</div>
              </section>

              {(career.description||career.workField||career.studyPlan.length||career.requirements.length||career.faq.length)?<nav className="career-section-tabs career-section-navigation" aria-label="Contenido de la carrera">
                {career.description||career.graduateProfile?<button type="button" onClick={() => navigateToSection("careerAboutSection")}>La carrera</button>:null}
                {career.workField?<button type="button" onClick={() => navigateToSection("careerFieldSection")}>Salida laboral</button>:null}
                {career.studyPlan.length||studyPlanPdf?<button type="button" onClick={() => navigateToSection("careerPlanSection")}>Plan de estudios</button>:null}
                {career.requirements.length||career.faq.length?<button type="button" onClick={() => navigateToSection("careerRequirementsSection")}>Requisitos</button>:null}
              </nav>:null}

              {career.description||career.graduateProfile?<section id="careerAboutSection" className={`career-info-section career-about-section${highlightedSection === "careerAboutSection" ? " is-highlighted" : ""}`}>
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
              </section>:null}

              {career.workField?<section id="careerFieldSection" className={`career-info-section career-field-section${highlightedSection === "careerFieldSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>SALIDA LABORAL</span><h2>Ámbitos donde podés desarrollarte</h2></div>
                <p id="careerField" className="career-field-description">{career.workField}</p>
                <div id="careerFieldChips" className="career-field-chips">
                  {FIELD_CHIPS.map((item) => (
                    <span className="career-field-chip" key={item}>{item}</span>
                  ))}
                </div>
              </section>:null}

              {career.studyPlan.length||studyPlanPdf?<section id="careerPlanSection" className={`career-info-section career-plan-section${highlightedSection === "careerPlanSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>PLAN DE ESTUDIOS</span><h2>Cómo se organiza tu formación</h2></div>
                <ol id="careerStudyPlan" className="career-study-plan">
                  {career.studyPlan.map((item, index) => (
                    <li key={index}><strong>{typeof item === 'string' ? `${index + 1}° Año` : item.label}</strong><span>{typeof item === 'string' ? item : item.subjects.join(' · ')}</span></li>
                  ))}
                </ol>
                {studyPlanPdf ? <div className="career-plan-actions"><a className="career-plan-pdf" href={studyPlanPdf} target="_blank" rel="noopener">Descargar plan de estudios <span aria-hidden="true">↗</span></a></div> : null}
              </section>:null}

              {career.requirements.length||career.faq.length?<section id="careerRequirementsSection" className={`career-info-section career-requirements-section${highlightedSection === "careerRequirementsSection" ? " is-highlighted" : ""}`}>
                <div className="career-section-heading"><span>INGRESO</span><h2>Todo lo que necesitás para comenzar</h2></div>
                <div className="career-requirements-grid">
                  <div className="career-requirements-group">
                    <h3>Requisitos de ingreso</h3>
                    <ul id="careerRequirements" className="career-requirements-list">{career.requirements.map((item, index) => (
                      <li key={index}>
                        <span className="career-requirement-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item}</span>
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m7 12 3.2 3.2L17.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </li>
                    ))}</ul>
                  </div>
                  <div className="career-faq-list"><h3>Más información</h3><div id="careerFaq">{career.faq.map((item,index) => (
                    <details className="career-faq-item" key={index}><summary>{item.question}</summary><p>{item.answer}</p></details>
                  ))}</div></div>
                </div>
              </section>:null}
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
                  {whatsappNumber?<><div className="career-form-divider">o completá el formulario</div>
                  <a id="careerWhatsappButton" className="btn career-whatsapp" href={whatsappHref} target="_blank" rel="noopener">Hablar por WhatsApp</a></>:null}
                  <p id="careerFormMessage" className={formSent ? "" : "hidden"} style={{ color: "var(--exito)", fontWeight: 800 }}>Consulta enviada correctamente.</p>
                  {formError ? <p role="alert">{formError}</p> : null}
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
