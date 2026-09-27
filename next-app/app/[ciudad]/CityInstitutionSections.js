/* eslint-disable @next/next/no-img-element */

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
  const featuredInstitutions = Array.from(
    new Map((city.featuredInstitutions ?? []).filter(Boolean).map((institution) => [institution.id, institution])).values(),
  );
  const featuredIds = new Set(featuredInstitutions.map((institution) => institution.id));
  const catalogInstitutions = institutions.filter((institution) => !featuredIds.has(institution.id));

  return (
    <div className="institutions-section city-institution-sections">
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
    </div>
  );
}
