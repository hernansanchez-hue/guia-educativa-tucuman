"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_CITIES = [
  { slug: "concepcion", name: "Concepción" },
  { slug: "monteros", name: "Monteros" },
  { slug: "aguilares", name: "Aguilares" },
];

function normalizeCityText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function LocationIcon() {
  return (
    <svg className="city-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

export default function CitySelector({ cities = DEFAULT_CITIES }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const visibleCities = useMemo(() => {
    const normalizedQuery = normalizeCityText(query);
    return cities.filter((city) => normalizeCityText(city.name).includes(normalizedQuery));
  }, [cities, query]);

  function openSearchedCity() {
    const city = visibleCities[0];
    if (city) router.push(`/${city.slug}`);
  }

  function openCity(city) {
    router.push(`/${city.slug}`);
  }

  function handleCitySearchKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      openSearchedCity();
    }
  }

  return (
    <div className="city-box" aria-label="Selector de ciudades">
      <h2>Elegí tu ciudad</h2>
      <div className="city-search" role="search">
        <svg viewBox="0 0 30 30" aria-hidden="true">
          <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
        </svg>
        <input id="citySearchInput" type="search" placeholder="Buscar ciudad" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleCitySearchKey} />
        <button type="button" onClick={openSearchedCity} aria-label="Buscar ciudad" title="Buscar ciudad">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
        </button>
        <span className="city-search-divider" aria-hidden="true" />
        <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda" title="Limpiar búsqueda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div className="cities">
        {cities.map((city) => (
          <button
            className={visibleCities.includes(city) ? "city-card" : "city-card hidden"}
            data-city={city.name}
            key={city.slug}
            onClick={() => openCity(city)}
          >
            <span className="city-card-head"><LocationIcon /><strong>{city.name}</strong></span>
          </button>
        ))}
        <p className={visibleCities.length ? "city-empty hidden" : "city-empty"}>No encontramos esa ciudad.</p>
      </div>
    </div>
  );
}
