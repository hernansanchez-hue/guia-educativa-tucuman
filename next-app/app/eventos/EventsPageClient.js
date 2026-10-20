"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import PublicFloatingHeader from "../components/PublicFloatingHeader";
import PublicFooter from "../components/PublicFooter";
import {eventCategories} from "../data/events";
import {eventsPageContent} from "../data/eventsPageContent";



export default function EventsPageClient({events,content=eventsPageContent}) {
const eventCities=['Todos',...new Set(events.map(e=>e.city))],eventCapabilities=content.capabilities;
  const [city, setCity] = useState("Todos");
  const [category, setCategory] = useState("Todos");
  const filteredEvents = useMemo(() => events.filter((event) => (city === "Todos" || event.city === city) && (category === "Todos" || event.category === category)), [city, category, events]);

  return <div className="app-shell events-page">
    <PublicFloatingHeader />
    <main className="events-main">
      <section className="events-hero" style={content.cmsDesign?.height?{minHeight:`clamp(300px,55vw,${content.cmsDesign.height}px)`}:undefined}>
        <img src={content.heroImage} alt={content.heroAlt} />
        <div className="events-hero-shade" style={content.cmsDesign?.overlay?{background:`linear-gradient(90deg,rgba(8,20,48,${content.cmsDesign.overlay}),rgba(10,25,55,${content.cmsDesign.overlay*.25}))`}:undefined} aria-hidden="true" />
        <div className="events-hero-content" style={content.cmsDesign?.align?{textAlign:content.cmsDesign.align}:undefined}><span className="eyebrow" data-edit-id="root.data.copy.text01">{content.copy.text01}</span><h1 style={content.cmsDesign?{color:content.cmsDesign.color,fontSize:content.cmsDesign.titleSize?`clamp(32px,6vw,${content.cmsDesign.titleSize}px)`:undefined}:undefined} data-edit-id="root.data.copy.text02">{content.copy.text02}</h1><p data-edit-id="root.data.copy.text03">{content.copy.text03}</p><a href={content.heroCtaHref} className="events-hero-action" data-edit-id="root.data.copy.text04">{content.copy.text04}<span data-edit-id="root.data.copy.text05">{content.copy.text05}</span></a></div>
        <div className="events-hero-badge"><strong data-edit-id="root.data.copy.text06">{content.copy.text06}</strong><span data-edit-id="root.data.copy.text07">{content.copy.text07}</span></div>
      </section>

      <section className="events-motion events-section">
        <div className="events-motion-copy"><span className="eyebrow" data-edit-id="root.data.copy.text08">{content.copy.text08}</span><h2 data-edit-id="root.data.copy.text09">{content.copy.text09}</h2><p data-edit-id="root.data.copy.text10">{content.copy.text10}</p></div>
        <div className="events-motion-points">{content.motionPoints.map((item, index) => <div className="events-motion-point" key={item}><span data-edit-id="root.data.copy.text11">{content.copy.text11}{index + 1}</span><strong>{item}</strong></div>)}</div>
      </section>

      <section className="events-upcoming events-section" id="proximos-eventos" aria-labelledby="upcoming-events-title">
        <div className="events-section-intro"><div><span className="eyebrow" data-edit-id="root.data.copy.text12">{content.copy.text12}</span><h2 id="upcoming-events-title" data-edit-id="root.data.copy.text13">{content.copy.text13}</h2><p data-edit-id="root.data.copy.text14">{content.copy.text14}</p></div><span className="events-demo-note" data-edit-id="root.data.copy.text15">{content.copy.text15}</span></div>
        <div className="events-filters" aria-label="Filtros de eventos"><div><span data-edit-id="root.data.copy.text16">{content.copy.text16}</span><div className="events-filter-pills">{eventCities.map((item) => <button className={city === item ? "active" : ""} type="button" onClick={() => setCity(item)} key={item}>{item}</button>)}</div></div><div><span data-edit-id="root.data.copy.text17">{content.copy.text17}</span><div className="events-filter-pills">{[...new Set([...eventCategories,...events.map(e=>e.category)])].map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div></div>
        <div className="events-grid">{filteredEvents.map((event) => <article className="event-card" key={event.id}><div className="event-card-media"><img src={event.image} alt="" /><span>{event.category}</span></div><div className="event-card-content"><div className="event-card-meta"><span>{event.city}</span><span>{event.date}</span></div><h3>{event.name}</h3><p>{event.description}</p><Link href={`/eventos/${event.slug}`} data-edit-id="root.data.copy.text18">{content.copy.text18}<span data-edit-id="root.data.copy.text19">{content.copy.text19}</span></Link></div></article>)}</div>
        {filteredEvents.length === 0 ? <p className="events-empty" data-edit-id="root.data.copy.text20">{content.copy.text20}</p> : null}
      </section>

      <section className="events-presence events-section"><div className="events-presence-intro"><span className="eyebrow" data-edit-id="root.data.copy.text21">{content.copy.text21}</span><h2 data-edit-id="root.data.copy.text22">{content.copy.text22}</h2><p data-edit-id="root.data.copy.text23">{content.copy.text23}</p></div><div className="events-capabilities">{eventCapabilities.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>)}</div></section>

      <section className="events-partnership events-section"><div><span className="eyebrow" data-edit-id="root.data.copy.text24">{content.copy.text24}</span><h2 data-edit-id="root.data.copy.text25">{content.copy.text25}</h2><p data-edit-id="root.data.copy.text26">{content.copy.text26}</p></div><div className="events-partnership-actions"><Link className="events-primary-action" href="/contacto" data-edit-id="root.data.copy.text27">{content.copy.text27}<span data-edit-id="root.data.copy.text28">{content.copy.text28}</span></Link><Link className="events-secondary-action" href="/servicios" data-edit-id="root.data.copy.text29">{content.copy.text29}<span data-edit-id="root.data.copy.text30">{content.copy.text30}</span></Link></div></section>

      <section className="events-coverage events-section"><div className="events-section-intro"><div><span className="eyebrow" data-edit-id="root.data.copy.text31">{content.copy.text31}</span><h2 data-edit-id="root.data.copy.text32">{content.copy.text32}</h2><p data-edit-id="root.data.copy.text33">{content.copy.text33}</p></div><span className="events-demo-note" data-edit-id="root.data.copy.text34">{content.copy.text34}</span></div><div className="events-coverage-gallery"><article><img src={content.coverageImages[0]} alt="Placeholder de cobertura de evento" /><span data-edit-id="root.data.copy.text35">{content.copy.text35}</span></article><article><img src={content.coverageImages[1]} alt="Placeholder de público en evento" /><span data-edit-id="root.data.copy.text36">{content.copy.text36}</span></article><article><img src={content.coverageImages[2]} alt="Placeholder de actividad comunitaria" /><span data-edit-id="root.data.copy.text37">{content.copy.text37}</span></article></div></section>

      <section className="events-final-cta"><div><span className="eyebrow" data-edit-id="root.data.copy.text38">{content.copy.text38}</span><h2 data-edit-id="root.data.copy.text39">{content.copy.text39}</h2><p data-edit-id="root.data.copy.text40">{content.copy.text40}</p></div><div><Link className="events-primary-action" href="/contacto" data-edit-id="root.data.copy.text41">{content.copy.text41}<span data-edit-id="root.data.copy.text42">{content.copy.text42}</span></Link><a className="events-whatsapp-action" href="https://wa.me/5493865751273" target="_blank" rel="noopener" data-edit-id="root.data.copy.text43">{content.copy.text43}<span data-edit-id="root.data.copy.text44">{content.copy.text44}</span></a></div></section>
    </main>
    <PublicFooter />
  </div>;
}
