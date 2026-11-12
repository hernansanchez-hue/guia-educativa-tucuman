'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Link, { useLinkStatus } from 'next/link';
import styles from './city-entry-list.module.css';

// Remember SPA Back navigation, while a fresh document starts with the same empty search as SSR.
let rememberedQuery = '';

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

function CityDestination({ name }) {
  const { pending } = useLinkStatus();
  return (
    <>
      <span>{name}</span>
      {pending ? <span className={styles.spinner} aria-hidden="true" /> : (
        <svg className={styles.arrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
      )}
      <span className={styles.srOnly} role="status">{pending ? `Abriendo ${name}…` : ''}</span>
    </>
  );
}

export default function CityEntryList({ cities, compact = false, remember = false, label = 'Elegí una ciudad para entrar' }) {
  const id = useId();
  const input = useRef(null);
  const [query, setQuery] = useState(() => remember ? rememberedQuery : '');
  const normalized = normalize(query);
  const visibleCities = useMemo(() => cities.filter(city => normalize(city.name).includes(normalized)), [cities, normalized]);
  const rowCount = Math.ceil(visibleCities.length / 2);

  function updateQuery(value) {
    if (remember) rememberedQuery = value;
    setQuery(value);
  }

  function clearQuery() {
    updateQuery('');
    input.current?.focus();
  }

  return (
    <section className={`${styles.picker} ${compact ? styles.compact : ''}`} aria-label="Elegir ciudad">
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.search}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
        <input ref={input} id={id} type="search" placeholder="Buscar ciudad…" autoComplete="off" spellCheck={false} value={query} aria-describedby={`${id}-count`} onChange={event => updateQuery(event.target.value)} onKeyDown={event => {
          if (event.key === 'Enter') event.preventDefault();
          if (event.key === 'Escape' && query) { event.preventDefault(); event.stopPropagation(); clearQuery(); }
        }} />
        {query && <button type="button" className={styles.clear} aria-label="Limpiar búsqueda de ciudad" onClick={clearQuery}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>}
      </div>
      <p id={`${id}-count`} className={styles.count} role="status" aria-live="polite" aria-atomic="true">
        {normalized ? `${visibleCities.length} ${visibleCities.length === 1 ? 'ciudad encontrada' : 'ciudades encontradas'}` : `${cities.length} ciudades · Orden alfabético`}
      </p>
      {visibleCities.length ? (
        <ul className={styles.list} aria-label="Ciudades disponibles" style={{ '--city-rows': rowCount }}>
          {visibleCities.map(city => (
            <li key={city.slug}>
              <Link className={styles.cityLink} href={`/${city.slug}`} prefetch={false} data-city-link={city.slug}>
                <CityDestination name={city.name} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>No encontramos esa ciudad. Revisá el nombre o volvé a ver todas.</p>
          <button type="button" onClick={clearQuery}>Ver todas las ciudades</button>
        </div>
      )}
    </section>
  );
}
