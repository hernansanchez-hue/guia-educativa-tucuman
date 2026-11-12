/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import EightDesignShell from '../components/approved/EightDesignShell';
import {isConfirmedEvent, eventStartDate, eventDateLabel} from '../../lib/events/public-events.mjs';
import './approved-events.css';

export default function EventDetailClient({event, institutionNames = []}) {
  const confirmed = isConfirmedEvent(event);
  return <EightDesignShell>
    <main className="events-main event-detail-main">
      <section className="event-detail-hero">
        {event.image ? <img src={event.image} alt={confirmed ? event.name : 'Imagen ilustrativa; evento no confirmado'} fetchPriority="high"/> : null}
        <div className="event-detail-hero-content" style={event.cmsDesign?.align ? {textAlign: event.cmsDesign.align} : undefined}>
          <Link href="/eventos">← Volver a la agenda</Link>
          <span>{event.category} · {event.city}</span>
          <h1 style={event.cmsDesign ? {color: event.cmsDesign.color, fontSize: event.cmsDesign.titleSize ? `clamp(32px,6vw,${event.cmsDesign.titleSize}px)` : undefined} : undefined}>{event.name}</h1>
          <p>{event.description}</p>
          {confirmed ? <strong><time dateTime={eventStartDate(event)}>{eventDateLabel(event)}</time>{event.time ? ` · ${event.time}` : ''}{event.endDate ? ` — ${event.endDate}` : ''}</strong> : <strong>No confirmado · Datos de demostración</strong>}
        </div>
      </section>
      <section className="event-detail-overview events-section">
        <div><span className="eyebrow">{confirmed ? 'Información del encuentro' : 'Evento de demostración'}</span><h2>{confirmed ? 'Acerca del evento' : 'Una estructura lista para cada encuentro.'}</h2><p>{event.content || (confirmed ? event.description : 'Este registro conserva una muestra de la ficha. No anuncia un evento confirmado ni tiene inscripciones abiertas. La fecha, ubicación y participación deben confirmarse antes de aparecer en la agenda.')}</p></div>
        <dl><div><dt>Ciudad</dt><dd>{event.city}</dd></div><div><dt>Ubicación</dt><dd>{event.location || 'Ubicación a confirmar'}</dd></div><div><dt>Fecha</dt><dd>{confirmed ? eventDateLabel(event) : 'Fecha a confirmar'}</dd></div><div><dt>Instituciones</dt><dd>{institutionNames.length ? institutionNames.join(' · ') : 'A confirmar'}</dd></div></dl>
      </section>
      {(event.gallery?.length || event.video) ? <section className="event-detail-gallery events-section"><div className="events-section-intro"><div><span className="eyebrow">{confirmed ? 'Cobertura' : 'Imágenes ilustrativas'}</span><h2>{confirmed ? 'Galería del evento' : 'Referencia visual del encuentro'}</h2></div></div><div>{(event.gallery || []).filter(Boolean).map((image, index) => <img src={image} alt={confirmed ? `${event.name} — imagen ${index + 1}` : 'Fotografía ilustrativa, no corresponde a un evento confirmado'} loading="lazy" key={`${event.id}-${index}`}/>)}{event.video ? <video controls preload="metadata" src={event.video} aria-label="Video del evento"/> : null}</div></section> : null}
      <section className="events-final-cta"><div><span className="eyebrow">Presencia compartida</span><h2>¿Querés sumar tu propuesta?</h2><p>Conversemos sobre cómo participar con GET en próximos eventos.</p></div><div><Link className="events-primary-action" href={confirmed && event.ctaHref ? event.ctaHref : '/contacto'}>{confirmed && event.ctaLabel ? event.ctaLabel : 'Quiero participar con GET'} <span aria-hidden="true">→</span></Link></div></section>
    </main>
  </EightDesignShell>;
}
