import {serviceVisuals,defaultVisual} from '../data/serviceVisuals';
export default function ServiceHero({ serviceSlug, title, description,visual:override,image,design }) {
  const visual = override || serviceVisuals[serviceSlug] || defaultVisual;

  return (
    <section className={`services-hero service-image-hero service-image-hero--${visual.tone}`} style={{...(image?{backgroundImage:`url(${image})`,backgroundSize:'cover'}:{}),...(design?.height?{minHeight:`clamp(300px, 45vw, ${design.height}px)`}:{})}}>
      <div className="service-image-hero-visual" aria-hidden="true">
        <span className="service-image-hero-orbit service-image-hero-orbit--one" />
        <span className="service-image-hero-orbit service-image-hero-orbit--two" />
        <span className="service-image-hero-glyph">{visual.glyph}</span>
        <span className="service-image-hero-node service-image-hero-node--one" />
        <span className="service-image-hero-node service-image-hero-node--two" />
        <span className="service-image-hero-node service-image-hero-node--three" />
      </div>
      <div className="service-image-hero-shade" aria-hidden="true" style={design?.overlay?{background:`rgba(7,21,47,${design.overlay})`}:undefined} />
      <div className="service-image-hero-content">
        <span className="eyebrow">Servicio GET</span>
        <h1 style={design?{...(design.color?{color:design.color}:{}),...(design.titleSize?{fontSize:`clamp(28px, 4vw, ${design.titleSize}px)`}:{}),...(design.align?{textAlign:design.align}:{})}:undefined}>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="service-image-hero-detail" aria-label={`${visual.label}: ${visual.detail}`}>
        <strong>{visual.label}</strong>
        <span>{visual.detail}</span>
      </div>
    </section>
  );
}
