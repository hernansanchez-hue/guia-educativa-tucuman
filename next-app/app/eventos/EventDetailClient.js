/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import PublicFloatingHeader from '../components/PublicFloatingHeader';
import PublicFooter from '../components/PublicFooter';
export default function EventDetailClient({event,institutionNames=[]}){
  return <div className="app-shell events-page">
    <PublicFloatingHeader />
    <main className="events-main event-detail-main">
      <section className="event-detail-hero" style={event.cmsDesign?.height?{minHeight:`clamp(300px,55vw,${event.cmsDesign.height}px)`}:undefined}><img src={event.image} alt="" /><div style={event.cmsDesign?.overlay?{background:`linear-gradient(90deg,rgba(8,20,48,${event.cmsDesign.overlay}),rgba(8,20,48,${event.cmsDesign.overlay*.32}))`}:undefined}/><div className="event-detail-hero-content" style={event.cmsDesign?.align?{textAlign:event.cmsDesign.align}:undefined}><Link href="/eventos">← Volver a eventos</Link><span>{event.category} · {event.city}</span><h1 style={event.cmsDesign?{color:event.cmsDesign.color,fontSize:event.cmsDesign.titleSize?`clamp(32px,6vw,${event.cmsDesign.titleSize}px)`:undefined}:undefined}>{event.name}</h1><p>{event.description}</p><strong>{event.date}{event.time?` · ${event.time}`:''}{event.startDate?` · ${event.startDate}`:''}{event.endDate?` — ${event.endDate}`:''}</strong></div></section>
      <section className="event-detail-overview events-section"><div><span className="eyebrow">Evento de demostración</span><h2>Una estructura lista para cada encuentro.</h2><p>{event.content||"Cuando el evento esté confirmado, esta página permitirá completar su portada, fecha, ubicación, instituciones participantes, imágenes, videos y las acciones realizadas por GET."}</p></div><dl><div><dt>Ciudad</dt><dd>{event.city}</dd></div><div><dt>Ubicación</dt><dd>{event.location}</dd></div><div><dt>Instituciones</dt><dd>{institutionNames.length?institutionNames.join(' · '):'A confirmar'}</dd></div></dl></section>
      <section className="event-detail-gallery events-section"><div className="events-section-intro"><div><span className="eyebrow">Cobertura</span><h2>Galería del evento</h2></div></div><div>{event.gallery.map((image, index) => <img src={image} alt="Placeholder de galería" key={`${event.id}-${index}`} />)}{event.video?<video controls preload='metadata' src={event.video} style={{width:'100%',borderRadius:16}} aria-label='Video del evento'/>:null}</div></section>
      <section className="events-final-cta"><div><span className="eyebrow">Presencia compartida</span><h2>¿Querés sumar tu propuesta?</h2><p>Conversemos sobre cómo participar con GET en próximos eventos.</p></div><div><Link className="events-primary-action" href={event.ctaHref||"/contacto"}>{event.ctaLabel||"Quiero participar con GET"} <span>→</span></Link></div></section>
    </main>
    <PublicFooter />
  </div>;
}
