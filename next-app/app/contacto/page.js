import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import ContactForm from "./ContactForm";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import "../[ciudad]/ciudad.css";
import "./contacto.css";

export const metadata = createPublicMetadata({
  title: "Contacto",
  description: "Canal comercial para instituciones interesadas en planes, espacios premium y futuras campañas por ciudad.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <div className="app-shell">
      <PublicHeader />
      <section id="contactPage" className="page active">
        <div className="section-title">
          <span className="eyebrow">Contacto</span>
          <h2>Sumá tu institución a Guía Educativa Tucumán</h2>
          <p>Este formulario representa el canal comercial para instituciones interesadas en planes, espacios premium y futuras campañas por ciudad.</p>
        </div>
        <div className="detail-content contact-detail-content">
          <section className="panel">
            <h2>Consulta comercial</h2>
            <ContactForm />
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
      </section>
      <PublicFooter />
    </div>
  );
}
