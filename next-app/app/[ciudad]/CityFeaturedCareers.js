"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";

const CANONICAL_CAREER_SEGMENTS = {
  "licenciatura-en-administracion": "lic-en-administracion",
};

function createFeaturedCareers(city) {
  return city.institutions
    .flatMap((institution) => institution.careers.map((career) => {
      const isTraining = /capacitaci/i.test(institution.type ?? "");
      const segment = CANONICAL_CAREER_SEGMENTS[career.slug] ?? career.slug;

      return {
        ...career,
        id: `${institution.id}-${career.id}`,
        institutionName: institution.name,
        institution: {
          name: institution.name,
          description: institution.description,
          image: institution.image,
          type: institution.type,
          route: `/${city.slug}/${institution.slug}`,
        },
        route: `/${city.slug}/${institution.slug}/${isTraining ? "capacitaciones" : "carreras"}/${segment}`,
      };
    }))
    .slice(0, 5);
}

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={direction === "previous" ? "M14.5 5 7.5 12l7 7M8 12h9" : "m9.5 5 7 7-7 7M7 12h9"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CityFeaturedCareers({ city, onOpenCareer, onOpenInstitution }) {
  const featuredCareers = useMemo(() => createFeaturedCareers(city), [city]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef(0);
  const total = featuredCareers.length;
  const activeCareer = featuredCareers[activeIndex] ?? featuredCareers[0];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || total < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % total);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, total]);

  if (!activeCareer) return null;

  function changeCareer(direction) {
    setActiveIndex((index) => (index + direction + total) % total);
  }

  function finishSwipe(event) {
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 45) changeCareer(distance < 0 ? 1 : -1);
  }

  return (
    <section
      className="city-featured"
      aria-labelledby="featuredCareersTitle"
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={finishSwipe}
    >
      <div className="city-featured-backdrop" style={{ backgroundImage: `url(${activeCareer.image})` }} aria-hidden="true" />
      <div className="city-featured-shade" aria-hidden="true" />
      <div className="city-featured-inner">
        <article className="city-featured-copy">
          <h1 id="featuredCareersTitle">{activeCareer.name}</h1>
          <p className="city-featured-description">{activeCareer.description}</p>
          <button className="city-featured-cta" type="button" onClick={() => onOpenCareer(activeCareer.route)}>
            Ver carrera <span aria-hidden="true">→</span>
          </button>
        </article>

        <aside className="city-featured-institution" aria-label={`Institución: ${activeCareer.institution.name}`}>
          {activeCareer.institution.image ? (
            <img src={activeCareer.institution.image} alt="" />
          ) : null}
          <div className="city-featured-institution-copy">
            <span>{activeCareer.institution.type}</span>
            <h2>{activeCareer.institution.name}</h2>
            {activeCareer.institution.description ? <p>{activeCareer.institution.description}</p> : null}
            <button type="button" onClick={() => onOpenInstitution(activeCareer.institution.route)}>
              Conocer más <strong aria-hidden="true">→</strong>
            </button>
          </div>
        </aside>
      </div>

      <div className="city-featured-controls">
        <div className="city-featured-arrows">
          <button type="button" onClick={() => changeCareer(-1)} aria-label="Carrera destacada anterior"><ArrowIcon direction="previous" /></button>
          <button type="button" onClick={() => changeCareer(1)} aria-label="Siguiente carrera destacada"><ArrowIcon direction="next" /></button>
        </div>
        <div className="city-featured-dots" aria-label="Elegir carrera destacada">
          {featuredCareers.map((career, index) => (
            <button
              className={index === activeIndex ? "active" : ""}
              key={career.id}
              type="button"
              aria-label={`Mostrar ${career.name}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
