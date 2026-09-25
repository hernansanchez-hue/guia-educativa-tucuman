"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";

export default function PublicFooter() {
  const router = useRouter();

  function goHome() {
    router.push("/");
  }

  function goAbout() {
    router.push("/nosotros");
  }

  function goCourses() {
    router.push("/cursos-docentes");
  }

  function footerComingSoon(item) {
    window.alert(`${item} estará disponible próximamente.`);
  }

  return (
    <footer id="siteFooter" className="site-footer">
      <div className="footer-inner">
        <div className="footer-column">
          <button className="footer-logo" type="button" onClick={goHome} aria-label="Volver al inicio">
            <span className="public-logo-compact" aria-hidden="true">
              <img className="public-logo-light" src="/assets/get-logo-oficial.png" alt="" />
              <img className="public-logo-dark" src="/assets/get-logo-hero-blanco-dorado.png" alt="" />
            </span>
          </button>
          <p className="footer-brand-copy">Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.</p>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Explorar</h3>
          <div className="footer-link-list">
            <button type="button" onClick={() => footerComingSoon("Preguntas frecuentes")}>Preguntas frecuentes</button>
            <button type="button" onClick={goCourses}>Cursos docentes</button>
            <button type="button" onClick={goAbout}>Lo Próximo</button>
            <button type="button" onClick={goAbout}>Quiénes somos</button>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contacto</h3>
          <div className="footer-contact-list">
            <a className="footer-contact-link" href="https://www.google.com/maps/search/?api=1&query=Dall+Asta+2469%2C+Concepci%C3%B3n%2C+Tucum%C3%A1n" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>Dall Asta 2469, Concepción, Tucumán</span>
            </a>
            <a className="footer-contact-link" href="https://wa.me/5493865751273" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7Z" />
                <path d="M8.2 8.1c.3 3.8 2.1 5.7 5.7 7 .7.2 1.4-.6 1.7-1.2l-2.2-1-1 1c-1.3-.6-2.4-1.7-3-3l1-1-1.1-2.2c-.7 0-1.6.1-2.1.4Z" />
              </svg>
              <span>3865 751273</span>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Descargá la app</h3>
          <div className="footer-app-buttons">
            <button className="footer-app-button" type="button" onClick={() => footerComingSoon("La aplicación para Android")}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 3.1 14.9 12 3.6 20.9c-.4-.4-.6-.9-.6-1.5V4.6c0-.6.2-1.1.6-1.5Zm12.3 9.7 2.7 2.1-11.9 6.7 9.2-8.8Zm3.8-3c.8.5.8 1.4 0 1.9l-2.3 1.3-2.9-2.3 2.9-2.3 2.3 1.4ZM6.7 2.4l11.9 6.7-2.7 2.1-9.2-8.8Z" />
              </svg>
              <span><small>DISPONIBLE PRÓXIMAMENTE EN</small><strong>Google Play</strong></span>
            </button>
            <button className="footer-app-button" type="button" onClick={() => footerComingSoon("La aplicación para iPhone")}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.8 12.8c0-2.5 2.1-3.7 2.2-3.8-1.2-1.7-3-1.9-3.7-1.9-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.2 3.2-2.5 1-1.4 1.4-2.8 1.5-2.9-.1 0-3.2-1.2-3.2-4.2ZM14.3 5.5c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.5-.6 3.3-1.5Z" />
              </svg>
              <span><small>DESCARGAR PRÓXIMAMENTE EN</small><strong>App Store</strong></span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-social-box">
        <strong>Seguinos en redes</strong>
        <div className="footer-social-links">
          {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((network) => (
            <button className="footer-social-link" type="button" key={network} onClick={() => footerComingSoon(network)}>{network}</button>
          ))}
          <a className="footer-social-link" href="https://wa.me/5493865751273" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2026 Guía Educativa Tucumán. Todos los derechos reservados.</p>
        <button className="footer-contact-link" type="button" onClick={goHome}>Volver al inicio</button>
      </div>
    </footer>
  );
}
