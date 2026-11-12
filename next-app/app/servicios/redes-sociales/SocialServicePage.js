import Link from 'next/link';
import EightDesignShell from '../../components/approved/EightDesignShell';
import ServiceHero from '../../components/ServiceHero';

export default function SocialServicePage({service}) {
  const gallery = (service.gallery || []).filter(Boolean);
  return <EightDesignShell>
    <main className="services-main">
      <Link className="service-back-link" href="/servicios">← Todos los servicios</Link>
      <ServiceHero serviceSlug={service.id} title={service.name} description={service.description} visual={service.visual} image={service.image} design={service.cmsDesign}/>
      {service.content ? <section className="service-editorial-content"><p style={{whiteSpace: 'pre-line'}}>{service.content}</p></section> : null}
      <section className="service-gallery" aria-label={gallery.length ? 'Galería del servicio' : 'Composición gráfica del servicio'}>{gallery.length ? gallery.map((url, index) => <div key={url} role="img" aria-label={`Imagen del servicio ${index + 1}`} style={{backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center'}}/>) : <><div aria-hidden="true"/><div aria-hidden="true"/><div aria-hidden="true"/></>}</section>
      <section className="services-cta"><h2>{service.ctaTitle || 'Hablemos de tu próxima acción.'}</h2><a className="btn" href={service.ctaHref || 'https://wa.me/5493865751273'}>{service.ctaLabel || 'WhatsApp'}</a></section>
    </main>
  </EightDesignShell>;
}
