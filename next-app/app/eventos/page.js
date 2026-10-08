"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import PublicFloatingHeader from "../components/PublicFloatingHeader";
import PublicFooter from "../components/PublicFooter";
import { eventCategories, eventCities, events } from "../data/events";
import "../[ciudad]/ciudad.css";
import "./eventos.css";

const eventCapabilities = [
  "Stand GET", "Difusión de carreras", "Activaciones con el público", "Códigos QR", "Orientación educativa", "Promoción institucional", "Registro de interesados", "Cobertura en redes", "Videos y contenido", "Entrevistas", "Juegos y dinámicas", "Merchandising",
];

export default function EventsPage() {
  const [city, setCity] = useState("Todos");
  const [category, setCategory] = useState("Todos");
  const filteredEvents = useMemo(() => events.filter((event) => (city === "Todos" || event.city === city) && (category === "Todos" || event.category === category)), [city, category]);

  return <div className="app-shell events-page">
    <PublicFloatingHeader />
    <main className="events-main">
      <section className="events-hero">
        <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=88" alt="Personas compartiendo un evento al aire libre" />
        <div className="events-hero-shade" aria-hidden="true" />
        <div className="events-hero-content"><span className="eyebrow">GET en territorio</span><h1>Donde pasa algo, GET está presente.</h1><p>Durante el año nos acercamos a eventos deportivos, culturales, municipales, educativos y sociales para llevar oportunidades a cada ciudad.</p><a href="#proximos-eventos" className="events-hero-action">Ver próximos eventos <span>↓</span></a></div>
        <div className="events-hero-badge"><strong>2027</strong><span>Presencia territorial</span></div>
      </section>

      <section className="events-motion events-section">
        <div className="events-motion-copy"><span className="eyebrow">GET en movimiento</span><h2>No esperamos que las personas busquen la información. La acercamos.</h2><p>Participamos de actividades en distintas ciudades con información educativa, experiencias, orientación, códigos QR y acciones que conectan propuestas con personas reales.</p></div>
        <div className="events-motion-points">{["Información educativa", "Orientación", "Experiencias", "Material y códigos QR"].map((item, index) => <div className="events-motion-point" key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div>
      </section>

      <section className="events-upcoming events-section" id="proximos-eventos" aria-labelledby="upcoming-events-title">
        <div className="events-section-intro"><div><span className="eyebrow">Agenda territorial</span><h2 id="upcoming-events-title">Próximos eventos</h2><p>Conocé los espacios donde GET estará presente próximamente.</p></div><span className="events-demo-note">Eventos de demostración</span></div>
        <div className="events-filters" aria-label="Filtros de eventos"><div><span>Ciudad</span><div className="events-filter-pills">{eventCities.map((item) => <button className={city === item ? "active" : ""} type="button" onClick={() => setCity(item)} key={item}>{item}</button>)}</div></div><div><span>Tipo</span><div className="events-filter-pills">{eventCategories.map((item) => <button className={category === item ? "active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div></div>
        <div className="events-grid">{filteredEvents.map((event) => <article className="event-card" key={event.id}><div className="event-card-media"><img src={event.image} alt="" /><span>{event.category}</span></div><div className="event-card-content"><div className="event-card-meta"><span>{event.city}</span><span>{event.date}</span></div><h3>{event.name}</h3><p>{event.description}</p><Link href={`/eventos/${event.slug}`}>Ver evento <span>→</span></Link></div></article>)}</div>
        {filteredEvents.length === 0 ? <p className="events-empty">No hay eventos de demostración que coincidan con estos filtros.</p> : null}
      </section>

      <section className="events-presence events-section"><div className="events-presence-intro"><span className="eyebrow">Para instituciones y empresas</span><h2>Mucho más que estar presentes.</h2><p>Convertimos cada encuentro en una oportunidad de visibilidad, conversación y conexión con públicos reales.</p></div><div className="events-capabilities">{eventCapabilities.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></article>)}</div></section>

      <section className="events-partnership events-section"><div><span className="eyebrow">Presencia compartida</span><h2>Tu institución también puede estar ahí.</h2><p>Trabajar con GET no es solo aparecer en la web. Tu propuesta puede formar parte de las acciones presenciales que llevamos a los eventos de cada comunidad.</p></div><div className="events-partnership-actions"><Link className="events-primary-action" href="/contacto">Quiero participar con GET <span>→</span></Link><Link className="events-secondary-action" href="/servicios">Conocer nuestros servicios <span>→</span></Link></div></section>

      <section className="events-coverage events-section"><div className="events-section-intro"><div><span className="eyebrow">Cobertura de eventos</span><h2>Así vivimos cada evento</h2><p>Un espacio preparado para compartir las historias, imágenes y momentos que se generan en el territorio.</p></div><span className="events-demo-note">Próximamente</span></div><div className="events-coverage-gallery"><article><img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=82" alt="Placeholder de cobertura de evento" /><span>Galerías y videos</span></article><article><img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=82" alt="Placeholder de público en evento" /><span>Encuentros reales</span></article><article><img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=82" alt="Placeholder de actividad comunitaria" /><span>Historias de ciudad</span></article></div></section>

      <section className="events-final-cta"><div><span className="eyebrow">Construyamos presencia</span><h2>¿Organizás un evento?</h2><p>Queremos conocerlo. GET busca estar presente en los espacios que reúnen a cada comunidad.</p></div><div><Link className="events-primary-action" href="/contacto">Contarnos sobre un evento <span>→</span></Link><a className="events-whatsapp-action" href="https://wa.me/5493865751273" target="_blank" rel="noopener">Hablar por WhatsApp <span>↗</span></a></div></section>
    </main>
    <PublicFooter />
  </div>;
}
