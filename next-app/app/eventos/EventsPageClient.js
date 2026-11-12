"use client";

/* eslint-disable @next/next/no-img-element */
import {useMemo, useState} from 'react';
import Link from 'next/link';
import EightDesignShell from '../components/approved/EightDesignShell';
import {usePublicEditorial} from '../components/PublicEditorialContext';
import {eventsPageContent} from '../data/eventsPageContent';
import {filterPublicEvents, isConfirmedEvent, eventStartDate, eventDateLabel} from '../../lib/events/public-events.mjs';
import './approved-events.css';

function HeroTitle({text}) {
  const accent = 'GET está presente.';
  const index = String(text || '').indexOf(accent);
  return index < 0 ? text : <>{text.slice(0, index)}<em>{accent}</em>{text.slice(index + accent.length)}</>;
}

export default function EventsPageClient({events = [], content = eventsPageContent}) {
  const page = content || eventsPageContent;
  const copy = page.copy || eventsPageContent.copy;
  const footer = usePublicEditorial('footer');
  const [city, setCity] = useState('Todos');
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('');
  const confirmed = useMemo(() => events.filter(isConfirmedEvent), [events]);
  const cities = ['Todos', ...new Set(confirmed.map(event => event.city))];
  const categories = ['Todos', ...new Set(confirmed.map(event => event.category))];
  const filtered = useMemo(() => filterPublicEvents(events, {query, city, category, month}), [events, query, city, category, month]);
  const reset = () => { setCity('Todos'); setCategory('Todos'); setQuery(''); setMonth(''); };
  const hasFilters = Boolean(query || month || city !== 'Todos' || category !== 'Todos');

  return <EightDesignShell>
    <main className="events-main">
      <section className="events-hero">
        {page.heroImage ? <img src={page.heroImage} alt={page.heroAlt || ''} fetchPriority="high"/> : null}
        <div className="events-hero-content" style={page.cmsDesign?.align ? {textAlign: page.cmsDesign.align} : undefined}>
          <span className="eyebrow" data-edit-id="root.data.copy.text01">{copy.text01}</span>
          <h1 style={page.cmsDesign ? {color: page.cmsDesign.color, fontSize: page.cmsDesign.titleSize ? `clamp(32px,6vw,${page.cmsDesign.titleSize}px)` : undefined} : undefined} data-edit-id="root.data.copy.text02"><HeroTitle text={copy.text02}/></h1>
          <p data-edit-id="root.data.copy.text03">{copy.text03}</p>
          <a href={page.heroCtaHref || '#proximos-eventos'} className="events-hero-action" data-edit-id="root.data.copy.text04">{copy.text04}<span aria-hidden="true">{copy.text05}</span></a>
        </div>
        <div className="events-hero-badge"><strong data-edit-id="root.data.copy.text06">{copy.text06}</strong><span data-edit-id="root.data.copy.text07">{copy.text07}</span></div>
      </section>

      <section className="events-motion events-section">
        <div className="events-motion-copy"><span className="eyebrow" data-edit-id="root.data.copy.text08">{copy.text08}</span><h2 data-edit-id="root.data.copy.text09">{copy.text09}</h2><p data-edit-id="root.data.copy.text10">{copy.text10}</p></div>
        <div className="events-motion-points">{(page.motionPoints || []).map((item, index) => <div className="events-motion-point" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong></div>)}</div>
      </section>

      <section className="events-upcoming events-section" id="proximos-eventos" aria-labelledby="upcoming-events-title">
        <div className="events-section-intro"><div><span className="eyebrow" data-edit-id="root.data.copy.text12">{copy.text12}</span><h2 id="upcoming-events-title" data-edit-id="root.data.copy.text13">{copy.text13}</h2><p data-edit-id="root.data.copy.text14">{copy.text14}</p></div><span className="events-demo-note">{confirmed.length ? 'Agenda confirmada' : 'Sin fechas confirmadas'}</span></div>
        <form className="events-filters" aria-label="Filtros de eventos" onSubmit={event => event.preventDefault()}>
          <div className="events-search-row"><label htmlFor="event-search">Buscar</label><input id="event-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nombre, actividad o ciudad" autoComplete="off"/><label htmlFor="event-month">Mes</label><input id="event-month" type="month" value={month} onChange={event => setMonth(event.target.value)}/></div>
          <div><span>{copy.text16}</span><div className="events-filter-pills">{cities.map(item => <button className={city === item ? 'active' : ''} type="button" aria-pressed={city === item} onClick={() => setCity(item)} key={item}>{item}</button>)}</div></div>
          <div><span>{copy.text17}</span><div className="events-filter-pills">{categories.map(item => <button className={category === item ? 'active' : ''} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div>
        </form>
        <div className="events-results-summary"><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'evento' : 'eventos'}</p>{hasFilters ? <button className="reset" type="button" onClick={reset}>Limpiar filtros</button> : null}</div>
        <div className="events-grid">{filtered.map(event => <article className="event-card" key={event.id}><div className="event-card-media">{event.image ? <img src={event.image} alt="" loading="lazy"/> : null}<span>{event.category}</span></div><div className="event-card-content"><div className="event-card-meta"><span>{event.city}</span><time dateTime={eventStartDate(event)}>{eventDateLabel(event)}{event.time ? ` · ${event.time}` : ''}</time></div><h3>{event.name}</h3><p>{event.description}</p><Link href={`/eventos/${event.slug}`}>Ver evento <span aria-hidden="true">→</span></Link></div></article>)}</div>
        {!filtered.length ? <div className="empty event-empty"><p>{confirmed.length ? 'No hay eventos que coincidan con estos filtros.' : 'Todavía no hay eventos con fecha y ubicación confirmadas. Publicaremos la agenda cuando esté disponible.'}</p>{hasFilters ? <button className="reset" type="button" onClick={reset}>Ver todos</button> : null}</div> : null}
      </section>

      <section className="events-presence events-section"><div className="events-presence-intro"><span className="eyebrow" data-edit-id="root.data.copy.text21">{copy.text21}</span><h2 data-edit-id="root.data.copy.text22">{copy.text22}</h2><p data-edit-id="root.data.copy.text23">{copy.text23}</p></div><div className="events-capabilities">{(page.capabilities || []).map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item}</h3></article>)}</div></section>

      <section className="events-partnership events-section"><div><span className="eyebrow" data-edit-id="root.data.copy.text24">{copy.text24}</span><h2 data-edit-id="root.data.copy.text25">{copy.text25}</h2><p data-edit-id="root.data.copy.text26">{copy.text26}</p></div><div className="events-partnership-actions"><Link className="events-primary-action" href="/contacto" data-edit-id="root.data.copy.text27">{copy.text27}<span aria-hidden="true">{copy.text28}</span></Link><Link className="events-secondary-action" href="/servicios" data-edit-id="root.data.copy.text29">{copy.text29}<span aria-hidden="true">{copy.text30}</span></Link></div></section>

      <section className="events-coverage events-section"><div className="events-section-intro"><div><span className="eyebrow" data-edit-id="root.data.copy.text31">{copy.text31}</span><h2 data-edit-id="root.data.copy.text32">{copy.text32}</h2><p data-edit-id="root.data.copy.text33">{copy.text33}</p></div><span className="events-demo-note" data-edit-id="root.data.copy.text34">{copy.text34}</span></div><div className="events-coverage-gallery">{(page.coverageImages || []).map((src, index) => <article key={src}><img src={src} alt="Imagen ilustrativa de actividades y encuentros" loading="lazy"/><span data-edit-id={`root.data.copy.text${35 + index}`}>{copy[`text${35 + index}`]}</span></article>)}</div><p className="events-image-note">Imágenes ilustrativas. La cobertura de cada evento se publicará cuando esté disponible.</p></section>

      <section className="events-final-cta"><div><span className="eyebrow" data-edit-id="root.data.copy.text38">{copy.text38}</span><h2 data-edit-id="root.data.copy.text39">{copy.text39}</h2><p data-edit-id="root.data.copy.text40">{copy.text40}</p></div><div><Link className="events-primary-action" href="/contacto" data-edit-id="root.data.copy.text41">{copy.text41}<span aria-hidden="true">{copy.text42}</span></Link>{footer.whatsappHref ? <a className="events-whatsapp-action" href={footer.whatsappHref} target="_blank" rel="noopener noreferrer" data-edit-id="root.data.copy.text43">{copy.text43}<span aria-hidden="true">{copy.text44}</span></a> : null}</div></section>
    </main>
  </EightDesignShell>;
}
