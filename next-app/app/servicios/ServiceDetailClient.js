import Link from 'next/link';
import PublicHeader from '../components/PublicHeader';
import PublicHeaderFrame from '../components/PublicHeaderFrame';
import PublicFooter from '../components/PublicFooter';
import ServiceHero from '../components/ServiceHero';
export default function ServiceDetailClient({service:s}){
  return <div className="app-shell services-page">
    <PublicHeaderFrame><PublicHeader variant="city-hero" /></PublicHeaderFrame>
    <main className="services-main">
      <Link className="service-back-link" href="/servicios">← Todos los servicios</Link>
      <ServiceHero serviceSlug={s.id} title={s.name} description={s.description} visual={s.visual} image={s.image} design={s.cmsDesign} />
      <section className="service-gallery">{s.gallery?.some(Boolean)?s.gallery.filter(Boolean).map((url,index)=><div key={index} style={{backgroundImage:`url(${url})`,backgroundSize:"cover",backgroundPosition:"center"}}/>):<><div /><div /><div /></>}</section>
      <section className="services-cta"><h2>{s.ctaTitle||"Hablemos de tu próxima acción."}</h2><a className="btn" href={s.ctaHref||"https://wa.me/5493865751273"}>{s.ctaLabel||"WhatsApp"}</a></section>
    </main>
    <PublicFooter />
  </div>;
}
