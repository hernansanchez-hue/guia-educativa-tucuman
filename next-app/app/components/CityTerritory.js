'use client';

import { useRef } from 'react';
import Link from 'next/link';
import CityEntryList from './CityEntryList';
import styles from './city-territory.module.css';

export default function CityTerritory({ city, cities, query, onQueryChange, onSearch }) {
  const dialog = useRef(null);
  const trigger = useRef(null);

  function openPicker() {
    dialog.current?.showModal();
    dialog.current?.querySelector('input')?.focus();
  }

  return (
    <section className={styles.territory} aria-labelledby="city-territory-title">
      <div className={styles.heading}>
        <p className={styles.breadcrumb}>TU CIUDAD. TU PRÓXIMO PASO.</p>
        <h1 id="city-territory-title">Tu futuro empieza<br />en <em>{city.name}.</em></h1>
        <p className={styles.intro}>Descubrí qué estudiar y dónde hacerlo. Todas tus opciones, más cerca.</p>
        <form className={styles.search} role="search" aria-label={`Buscar carrera o institución en ${city.name}`} onSubmit={onSearch}>
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="¿Qué te gustaría estudiar?" aria-label="Buscar carrera o institución" autoComplete="off" value={query} onChange={event => onQueryChange(event.target.value)} />
          <button type="submit">Buscar <span aria-hidden="true">↗</span></button>
        </form>
        <div className={styles.quick}><span>Empezá por acá</span><a href="#featuredCareersTitle">Explorar carreras ↗</a><a href="#allInstitutionsTitle">Ver instituciones ↗</a><a href="#cityOrientationTitle">Necesito orientación ↗</a></div>
      </div>
      {cities.length ? <button ref={trigger} type="button" className={styles.change} onClick={openPicker} aria-haspopup="dialog">⌖ {city.name} <span aria-hidden="true">⌄</span></button> : <Link className={styles.change} href="/">Cambiar ciudad</Link>}
      <dialog ref={dialog} className={styles.dialog} aria-labelledby="city-dialog-title" onClose={() => trigger.current?.focus()}>
        <div className={styles.dialogHeader}>
          <h2 id="city-dialog-title">Cambiar ciudad</h2>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar selector de ciudades">✕</button>
        </div>
        <p className={styles.current}>Estás viendo {city.name}.</p>
        <CityEntryList key={city.slug} cities={cities} compact />
      </dialog>
    </section>
  );
}
