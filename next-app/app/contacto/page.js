import EightDesignShell from '../components/approved/EightDesignShell';
import ContactForm from './ContactForm';
import {createPublicMetadata} from '../../lib/seo/public-metadata';
import './contacto.css';

export const metadata = createPublicMetadata({
  title: 'Contacto',
  description: 'Canal comercial para instituciones interesadas en planes, espacios premium y futuras campañas por ciudad.',
  path: '/contacto',
});

export default function ContactPage() {
  return <EightDesignShell>
    <main id="contactPage" className="page active">
      <div className="section-title">
        <div className="hero-copy">
          <span className="eyebrow">Contacto</span>
          <h1>Sumá tu institución a <em>Guía Educativa Tucumán</em></h1>
          <p>Este formulario representa el canal comercial para instituciones interesadas en planes, espacios premium y futuras campañas por ciudad.</p>
        </div>
        <figure className="hero-art navy" aria-hidden="true">
          <svg viewBox="0 0 440 290" preserveAspectRatio="xMidYMid slice" focusable="false">
            <g fill="none" stroke="#f0dbad" opacity=".26">
              <ellipse cx="214" cy="145" rx="194" ry="115" transform="rotate(-18 214 145)"/>
              <ellipse cx="223" cy="150" rx="211" ry="127" transform="rotate(16 223 150)"/>
              <path d="M6 242 411 45M74 23l274 245"/>
            </g>
            <g fill="#e7bf62"><circle cx="79" cy="207" r="4"/><circle cx="372" cy="77" r="4"/></g>
            <g transform="rotate(-10 220 145)" stroke="#cbae6b" strokeWidth="2" strokeLinejoin="round">
              <rect x="114" y="78" width="214" height="135" rx="9" fill="#f6efdf"/>
              <path d="m116 82 105 75L326 82M116 211l80-69m50 0 80 69" fill="none"/>
              <circle cx="220" cy="154" r="13" fill="#dcb552"/>
            </g>
          </svg>
        </figure>
      </div>
      <div className="detail-content contact-detail-content">
        <section className="panel" aria-labelledby="commercial-contact-title">
          <h2 id="commercial-contact-title">Consulta comercial</h2>
          <ContactForm/>
        </section>
        <aside className="panel">
          <h2>Modelo comercial</h2>
          <div className="contact-info">
            <div><strong>Para estudiantes</strong><span>Acceso gratuito para buscar instituciones, carreras y contactos.</span></div>
            <div><strong>Para instituciones</strong><span>Planes de visibilidad, contenido visual, publicidad premium y leads.</span></div>
            <div><strong>Para municipios</strong><span>Convenios para ferias educativas, stands itinerantes y visitas a escuelas.</span></div>
          </div>
        </aside>
      </div>
    </main>
  </EightDesignShell>;
}
