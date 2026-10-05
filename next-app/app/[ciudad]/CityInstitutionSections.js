"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";

function InstitutionCard({ institution, featured, onOpen }) {
  return (
    <article
      className={`city-institution-card${featured ? " city-institution-card-featured" : ""}`}
      tabIndex="0"
      role="link"
      aria-label={`Ver institución ${institution.name}`}
      onClick={() => onOpen(institution)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(institution);
        }
      }}
    >
      {featured ? (
        <div className="city-institution-card-media">
          <img src={institution.image} alt={institution.name} />
        </div>
      ) : null}
      <div className="city-institution-card-body">
        <span className="city-institution-card-category">{institution.type}</span>
        <h3>{institution.name}</h3>
        {featured ? <p>{institution.description}</p> : null}
        <button
          className="city-institution-card-cta"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(institution);
          }}
        >
          Ver institución
          <svg viewBox="0 0 22 15" fill="none" aria-hidden="true">
            <path d="M4.583 7.5h12.834M11 3.125 17.417 7.5 11 11.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function CityInstitutionSections({
  city,
  institutions,
  cardsRef,
  onOpenInstitution,
  showEmpty,
}) {
  const [interestNotice, setInterestNotice] = useState("");
  const featuredInstitutions = Array.from(
    new Map((city.featuredInstitutions ?? []).filter(Boolean).map((institution) => [institution.id, institution])).values(),
  );
  const featuredIds = new Set(featuredInstitutions.map((institution) => institution.id));
  const catalogInstitutions = institutions.filter((institution) => !featuredIds.has(institution.id));

  function prepareInterest(kind) {
    setInterestNotice(kind === "orientation"
      ? `La inscripción a Orientación Vocacional para ${city.name} estará disponible próximamente.`
      : `Las novedades de Expo Carreras GET para ${city.name} estarán disponibles próximamente.`);
  }

  return (
    <div className="institutions-section city-institution-sections">
      <section className="city-community-block city-orientation-block" aria-labelledby="cityOrientationTitle">
        <div className="city-community-copy">
          <span className="city-community-eyebrow">ORIENTACIÓN VOCACIONAL GRATUITA</span>
          <h2 id="cityOrientationTitle">¿Todavía no sabés qué estudiar?<br /><em>Encontrá tu camino con GET.</em></h2>
          <p>Explorá tus intereses y conocé opciones para tu futuro.</p>
          <button className="city-community-cta" type="button" onClick={() => prepareInterest("orientation")}>Quiero sumarme <span aria-hidden="true">→</span></button>
        </div>
        <figure className="city-orientation-media">
          <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1100&q=84" alt="Estudiantes conversando sobre su futuro académico" />
          <figcaption>Un espacio para pensar tu próximo paso.</figcaption>
        </figure>
      </section>

      <section className="city-community-block city-expo-block" aria-labelledby="cityExpoTitle">
        <div className="city-expo-media">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=84" alt="Jóvenes participando de una actividad educativa" />
          <span className="city-expo-media-label">GET<br /><strong>EXPO</strong></span>
        </div>
        <div className="city-community-copy">
          <span className="city-community-eyebrow">EXPO CARRERAS GET</span>
          <h2 id="cityExpoTitle">Conocé instituciones, descubrí carreras y pensá tu futuro.</h2>
          <p>Próximamente · Fecha a confirmar</p>
          <button className="city-community-cta city-community-cta-light" type="button" onClick={() => prepareInterest("expo")}>Quiero recibir novedades <span aria-hidden="true">→</span></button>
        </div>
      </section>

      {featuredInstitutions.length ? (
        <section className="city-institution-block city-featured-institutions" aria-labelledby="featuredInstitutionsTitle">
          <div className="city-institution-heading">
            <div className="city-hero"><h2 id="featuredInstitutionsTitle">Instituciones Destacadas</h2></div>
          </div>
          <div className="city-featured-institutions-grid">
            {featuredInstitutions.map((institution) => (
              <InstitutionCard key={institution.id} institution={institution} featured onOpen={onOpenInstitution} />
            ))}
          </div>
        </section>
      ) : null}

      {catalogInstitutions.length ? (
        <section className="city-institution-block city-all-institutions" aria-labelledby="allInstitutionsTitle">
          <div className="city-institution-heading">
            <div className="city-hero"><h2 id="allInstitutionsTitle">Todas las instituciones</h2></div>
          </div>
          <div className="city-all-institutions-grid" id="institutionCards" ref={cardsRef}>
            {catalogInstitutions.map((institution) => (
              <InstitutionCard key={institution.id} institution={institution} onOpen={onOpenInstitution} />
            ))}
          </div>
        </section>
      ) : null}

      {showEmpty ? (
        <div id="institutionSearchEmpty" className="featured-search-empty">No encontramos instituciones con esos filtros.</div>
      ) : null}

      <section className="city-commercial-block" aria-labelledby="cityCommercialTitle">
        <div>
          <span className="city-community-eyebrow">PARA INSTITUCIONES Y EMPRESAS</span>
          <h2 id="cityCommercialTitle">Tu propuesta educativa puede estar acá.</h2>
          <p>Mostrá tu oferta, conectá con futuros estudiantes y conocé las opciones para publicar o acompañar nuestras expos.</p>
        </div>
        <Link className="city-commercial-cta" href="/contacto">Quiero ser parte de GET <span aria-hidden="true">→</span></Link>
      </section>

      <p className="city-interest-notice" role="status" aria-live="polite">{interestNotice}</p>
    </div>
  );
}
