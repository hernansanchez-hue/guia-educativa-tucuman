"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import PublicFooter from "../../components/PublicFooter";
import PublicHeader from "../../components/PublicHeader";

function CareerMetaIcon({ type }) {
  if (type === "duration") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (type === "modality") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 5h16v12H4z" />
        <path d="M9 21h6" />
      </svg>
    );
  }

  if (type === "city") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M12 21s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="M6 10v5c3 2 9 2 12 0v-5" />
    </svg>
  );
}

export default function InstitutionPageClient({ city, institution }) {
  const router = useRouter();
  const galleryItems = [...institution.gallery, ...institution.gallery];
  const pageClassName = institution.id === "instituto-santa-barbara-concepcion"
    ? "app-shell institution-santa-barbara"
    : "app-shell";

  return (
    <div className={pageClassName}>
      <PublicHeader />

      <section id="detailPage" className="page active" aria-live="polite">
        <button
          className="btn light"
          type="button"
          onClick={() => router.push(`/${city.slug}`)}
        >
          Volver a instituciones
        </button>

        <article className="detail-hero" style={{ marginTop: 18 }}>
          <div
            className="detail-cover"
            id="detailCover"
            style={{ backgroundImage: `url("${institution.image}")` }}
          >
            <div>
              <div className="brand-row">
                <span className="mini-logo" id="detailLogo">
                  {institution.logo}
                </span>
                <span
                  className="eyebrow"
                  id="detailType"
                  style={{ color: "#c8f5df", margin: 0 }}
                >
                  {institution.type} | {city.name}
                </span>
              </div>
              <h1 id="instName">{institution.name}</h1>
              <p id="instSlogan">{institution.slogan}</p>
            </div>
          </div>
        </article>

        <section className="panel" style={{ marginTop: 22 }}>
          <h2 className="detail-section-title">Galería de fotos</h2>
          <div id="institutionGallery" className="creation-gallery">
            <div
              className="creation-marquee"
              style={{ animationDuration: `${institution.gallery.length * 2500}ms` }}
            >
              <div className="creation-marquee-group">
                {galleryItems.map((image, index) => (
                  <article className="creation-card" tabIndex="0" key={`${image}-${index}`}>
                    <img
                      src={image}
                      alt={`Foto ${index + 1} de ${institution.name}`}
                    />
                    <div className="creation-card-overlay">
                      <p>{institution.name}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 className="detail-section-title">Carreras</h2>
          <div id="careerGrid" className="career-grid">
            {institution.careers.map((career) => {
              const careerPath = career.routePath || null;

              return (
              <article className="career-summary-card" key={career.id}>
                <div className="career-summary-image-wrap">
                  <img src={career.image} alt={career.name} />
                  <span className="career-summary-badge">{career.badge}</span>
                </div>
                <div className="career-summary-body">
                  <p className="career-summary-overline">
                    {institution.name} · {city.name}
                  </p>
                  <h3>{career.name}</h3>
                  <div className="career-summary-meta">
                    <span><CareerMetaIcon type="duration" />{career.duration}</span>
                    <span><CareerMetaIcon type="modality" />{career.modality}</span>
                    <span><CareerMetaIcon type="city" />{city.name}</span>
                    <span><CareerMetaIcon type="institution" />{institution.type}</span>
                  </div>
                  <p className="career-summary-degree">
                    Propuesta académica con ficha completa disponible.
                  </p>
                  <div className="career-summary-actions">
                    <button
                      className="btn light career-view-button"
                      type="button"
                      onClick={careerPath ? () => router.push(careerPath) : undefined}
                    >
                      Ver carrera
                    </button>
                    <button className="btn career-consult-button" type="button">
                      Consultar
                    </button>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </section>
      </section>

      <button
        className="admin-fab hidden"
        type="button"
        title="Abrir panel de control"
        aria-label="Abrir panel de control"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      </button>

      <PublicFooter />
    </div>
  );
}
