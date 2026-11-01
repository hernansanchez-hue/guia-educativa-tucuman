"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {usePublicEditorial} from "./PublicEditorialContext";
import PublicImage from './PublicImage';

export default function PublicFooter({onGoHome} = {}) {
  const router = useRouter();
  const content=usePublicEditorial("footer");

  function goHome() {
    if (onGoHome) { onGoHome(); return; }
    router.push("/");
  }

  function follow(item) { if(item.href) { if(item.href.startsWith("/")) router.push(item.href); else window.open(item.href,"_blank","noopener,noreferrer"); } else footerComingSoon(item.alert||item.label); }

  function footerComingSoon(item) {
    window.alert(`${item} estará disponible próximamente.`);
  }

  return (
    <footer id="siteFooter" className="site-footer">
      <div className="footer-inner">
        <div className="footer-column">
          <button className="footer-logo" type="button" onClick={goHome} aria-label="Volver al inicio">
            <span className="city-footer-logo" aria-hidden="true">
              <PublicImage src={content.logo} data-edit-id="root.data.logo" alt="" width={908} height={542} sizes="250px" loading="lazy" />
            </span>
          </button>
          <p className="footer-brand-copy">{content.brandCopy}</p>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">{content.exploreTitle}</h3>
          <div className="footer-link-list">
            {content.explore.filter(item=>item.visible!==false).map((item,index)=><button type="button" key={item.id} data-edit-id={`root.data.explore.${index}`} onClick={()=>follow(item)}>{item.label}</button>)}
            <Link href="/administrador">Acceso para instituciones</Link>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">{content.contactTitle}</h3>
          <div className="footer-contact-list">
            <a className="footer-contact-link" href={content.mapsHref} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span data-edit-id="root.data.address">{content.address}</span>
            </a>
            <a className="footer-contact-link" href={content.whatsappHref} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7Z" />
                <path d="M8.2 8.1c.3 3.8 2.1 5.7 5.7 7 .7.2 1.4-.6 1.7-1.2l-2.2-1-1 1c-1.3-.6-2.4-1.7-3-3l1-1-1.1-2.2c-.7 0-1.6.1-2.1.4Z" />
              </svg>
              <span>{content.phone}</span>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">{content.appTitle}</h3>
          <div className="footer-app-buttons">
            <button className="footer-app-button" type="button" onClick={() => follow({href:content.androidHref,alert:"La aplicación para Android"})}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.6 3.1 14.9 12 3.6 20.9c-.4-.4-.6-.9-.6-1.5V4.6c0-.6.2-1.1.6-1.5Zm12.3 9.7 2.7 2.1-11.9 6.7 9.2-8.8Zm3.8-3c.8.5.8 1.4 0 1.9l-2.3 1.3-2.9-2.3 2.9-2.3 2.3 1.4ZM6.7 2.4l11.9 6.7-2.7 2.1-9.2-8.8Z" />
              </svg>
              <span><small>{content.androidNote}</small><strong>{content.androidLabel}</strong></span>
            </button>
            <button className="footer-app-button" type="button" onClick={() => follow({href:content.iosHref,alert:"La aplicación para iPhone"})}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.8 12.8c0-2.5 2.1-3.7 2.2-3.8-1.2-1.7-3-1.9-3.7-1.9-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.2 3.2-2.5 1-1.4 1.4-2.8 1.5-2.9-.1 0-3.2-1.2-3.2-4.2ZM14.3 5.5c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.4.7-3.2 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.5-.6 3.3-1.5Z" />
              </svg>
              <span><small>{content.iosNote}</small><strong>{content.iosLabel}</strong></span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer-social-box">
        <strong>{content.socialTitle}</strong>
        <div className="footer-social-links">
          {content.social.filter(item=>item.visible!==false).map((item,index)=><button className="footer-social-link" type="button" key={item.id} data-edit-id={`root.data.social.${index}`} onClick={()=>follow(item)}>{item.label}</button>)}
          <a className="footer-social-link" href={content.whatsappHref} target="_blank" rel="noopener">{content.whatsappLabel}</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{content.copyright}</p>
        <button className="footer-contact-link" type="button" onClick={goHome}>{content.homeLabel}</button>
      </div>
    </footer>
  );
}
