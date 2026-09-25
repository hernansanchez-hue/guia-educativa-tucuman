"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import CityFeaturedCareers from "./CityFeaturedCareers";

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function institutionModality(institution) {
  if (institution.plan === "Premium") return "Presencial y Online";
  if (/online|distancia|virtual/i.test(`${institution.description} ${institution.slogan}`)) return "Online";
  return "Presencial";
}

function institutionLevel(institution) {
  const text = `${institution.type} ${institution.name}`.toLowerCase();
  if (text.includes("universidad")) return "universidad";
  if (/curso|capacitaci|academia/.test(text)) return "curso";
  return "terciario";
}

export default function CityPageClient({ city }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modality, setModality] = useState("");
  const [level, setLevel] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ query: "", modality: "", level: "" });
  const cardsRef = useRef(null);

  const filteredInstitutions = useMemo(() => {
    const normalizedQuery = normalizeText(appliedFilters.query);
    return city.institutions.filter((institution) => {
      const searchable = normalizeText([
        institution.name,
        institution.description,
        ...institution.careers.map((career) =>
          typeof career === "string" ? career : career.name,
        ),
      ].join(" "));
      const modalityText = normalizeText(institutionModality(institution));
      const modalityMatches = !appliedFilters.modality
        || (appliedFilters.modality === "mixta" && modalityText.includes("presencial") && modalityText.includes("online"))
        || (appliedFilters.modality === "presencial" && modalityText.includes("presencial"))
        || (appliedFilters.modality === "online" && modalityText.includes("online"));
      return (!normalizedQuery || searchable.includes(normalizedQuery))
        && modalityMatches
        && (!appliedFilters.level || institutionLevel(institution) === appliedFilters.level);
    });
  }, [appliedFilters, city.institutions]);

  function applyInstitutionSearch(event) {
    event.preventDefault();
    setAppliedFilters({ query, modality, level });
    window.requestAnimationFrame(() => {
      cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openInstitution(institution) {
    router.push(`/${city.slug}/${institution.slug}`);
  }

  const cityHeaderSearch = (
    <form className="institution-search-bar city-header-search" onSubmit={applyInstitutionSearch}>
      <button className="institution-search-submit city-header-search-icon" type="submit" aria-label="Buscar" title="Buscar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </button>
      <label className="institution-search-field">
        <input id="institutionSearchInput" type="search" placeholder="Buscar carreras, instituciones..." autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {/* Preserved for the existing filtering contract; advanced filters are intentionally outside the visible hero UI. */}
      <select id="institutionModalityFilter" aria-label="Modalidad" value={modality} onChange={(event) => setModality(event.target.value)}>
        <option value="">Modalidad</option>
        <option value="presencial">Presencial</option>
        <option value="online">Online</option>
        <option value="mixta">Presencial y Online</option>
      </select>
      <select id="institutionLevelFilter" aria-label="Nivel" value={level} onChange={(event) => setLevel(event.target.value)}>
        <option value="">Nivel</option>
        <option value="universidad">Universidad</option>
        <option value="terciario">Terciario</option>
        <option value="curso">Cursos y capacitaciones</option>
      </select>
    </form>
  );

  return (
    <div className="app-shell city-page-shell">
      <section id="cityPage" className="page active city-page-redesign" aria-live="polite">
        <div className="city-showcase-panel">
          <PublicHeader variant="city-hero" citySearch={cityHeaderSearch} />

          <CityFeaturedCareers
            key={city.slug}
            city={city}
            onOpenCareer={(route) => router.push(route)}
            onOpenInstitution={(route) => router.push(route)}
          />
        </div>

        <div className="institutions-section">
          <div className="city-hero"><h2 id="cityTitle">{city.title}</h2></div>
          <div className="cards" id="institutionCards" ref={cardsRef}>
            {filteredInstitutions.map((institution) => (
              <article
                className="card"
                tabIndex="0"
                role="link"
                aria-label={`Ver institución ${institution.name}`}
                key={institution.id}
                onClick={() => openInstitution(institution)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openInstitution(institution);
                  }
                }}
              >
                <div className="card-media">
                  <img src={institution.image} alt={institution.name} />
                  <span>{institution.media}</span>
                </div>
                <div className="card-body">
                  <span className="badge">{institution.type}</span>
                  <h3>{institution.name}</h3>
                  <p>{institution.description}</p>
                  <button
                    className="card-cta"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openInstitution(institution);
                    }}
                  >
                    Ver institución
                    <svg viewBox="0 0 22 15" fill="none" aria-hidden="true">
                      <path d="M4.583 7.5h12.834M11 3.125 17.417 7.5 11 11.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div id="institutionSearchEmpty" className={filteredInstitutions.length ? "featured-search-empty hidden" : "featured-search-empty"}>No encontramos instituciones con esos filtros.</div>
        </div>
      </section>

      <button className="admin-fab hidden" type="button" title="Abrir panel de control" aria-label="Abrir panel de control">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      </button>

      <PublicFooter />
    </div>
  );
}
