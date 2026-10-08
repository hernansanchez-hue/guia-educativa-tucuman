/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import PublicFloatingHeader from "../../components/PublicFloatingHeader";
import PublicFooter from "../../components/PublicFooter";
import { events, getEvent } from "../../data/events";
import "../../[ciudad]/ciudad.css";
import "../eventos.css";

export function generateStaticParams() { return events.map((event) => ({ slug: event.slug })); }

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  return <div className="app-shell events-page">
    <PublicFloatingHeader />
    <main className="events-main event-detail-main">
      <section className="event-detail-hero"><img src={event.image} alt="" /><div /><div className="event-detail-hero-content"><Link href="/eventos">← Volver a eventos</Link><span>{event.category} · {event.city}</span><h1>{event.name}</h1><p>{event.description}</p><strong>{event.date}</strong></div></section>
      <section className="event-detail-overview events-section"><div><span className="eyebrow">Evento de demostración</span><h2>Una estructura lista para cada encuentro.</h2><p>Cuando el evento esté confirmado, esta página permitirá completar su portada, fecha, ubicación, instituciones participantes, imágenes, videos y las acciones realizadas por GET.</p></div><dl><div><dt>Ciudad</dt><dd>{event.city}</dd></div><div><dt>Ubicación</dt><dd>{event.location}</dd></div><div><dt>Instituciones</dt><dd>A confirmar</dd></div></dl></section>
      <section className="event-detail-gallery events-section"><div className="events-section-intro"><div><span className="eyebrow">Cobertura</span><h2>Galería del evento</h2></div></div><div>{event.gallery.map((image, index) => <img src={image} alt="Placeholder de galería" key={`${event.id}-${index}`} />)}</div></section>
      <section className="events-final-cta"><div><span className="eyebrow">Presencia compartida</span><h2>¿Querés sumar tu propuesta?</h2><p>Conversemos sobre cómo participar con GET en próximos eventos.</p></div><div><Link className="events-primary-action" href="/contacto">Quiero participar con GET <span>→</span></Link></div></section>
    </main>
    <PublicFooter />
  </div>;
}
