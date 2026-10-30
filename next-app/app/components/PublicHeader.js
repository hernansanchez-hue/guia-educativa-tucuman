"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {usePublicEditorial} from "./PublicEditorialContext";
import PublicHeaderFrame from "./PublicHeaderFrame";
import PublicImage from './PublicImage';
import {isPublicNavigationItemActive} from '../data/publicSiteContent';

const THEME_EVENT = "guia-educativa-theme-change";

function subscribeToTheme(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getThemeSnapshot() {
  return localStorage.getItem("guiaEducativaTheme") === "dark";
}

export default function PublicHeader({ variant = "city-hero", citySearch = null, homeHref = "/", withinFrame = false }) {
  const router = useRouter();
  const pathname=usePathname();
  const menu=usePublicEditorial("navigation"),footer=usePublicEditorial("footer");
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  const darkMode = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => false,
  );

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem(
      "guiaEducativaTheme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  function toggleTheme() {
    const nextDarkMode = !darkMode;
    localStorage.setItem(
      "guiaEducativaTheme",
      nextDarkMode ? "dark" : "light",
    );
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  function goHome() {
    setMenuOpen(false);
    router.push(homeHref);
  }



  function goCourses() {
    setMenuOpen(false);
    router.push(menu.courseHref);
  }

  function submitHeaderSearch(event) {
    event.preventDefault();
    const query = headerQuery.trim();
    router.push(query ? `/instituciones?buscar=${encodeURIComponent(query)}` : "/instituciones");
  }

  const themeLabel = darkMode ? "Activar modo claro" : "Activar modo oscuro";
  const resolvedCitySearch = citySearch || (
    <form className="institution-search-bar city-header-search" onSubmit={submitHeaderSearch}>
      <span className="city-header-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </span>
      <label className="institution-search-field">
        <input type="search" aria-label={menu.searchPlaceholder || "Buscar carreras e instituciones"} placeholder={menu.searchPlaceholder} autoComplete="off" value={headerQuery} onChange={(event) => setHeaderQuery(event.target.value)} />
      </label>
    </form>
  );

  const header = (
    <header className={variant === "city-hero" ? "site-header city-hero-header visible" : "site-header visible"}>
      <button className="logo" onClick={goHome} aria-label="Volver al inicio">
        {variant === "city-hero" ? (
          <span className="city-hero-logo" aria-hidden="true"><PublicImage src={footer.logo||menu.logo} alt="" width={908} height={542} sizes="180px" loading="eager" /></span>
        ) : (
          <span className="public-logo-compact" aria-hidden="true">
            <PublicImage className="public-logo-light" src="/assets/get-logo-oficial.png" alt="" width={5225} height={5225} sizes="180px" />
            <PublicImage className="public-logo-dark" src="/assets/get-logo-hero-blanco-dorado.png" alt="" width={1254} height={1254} sizes="180px" />
          </span>
        )}
      </button>

      <nav
        id="siteMenu"
        className={menuOpen ? "site-nav open" : "site-nav"}
        aria-label="Navegación principal"
      >
        {menu.items.filter(item=>item.visible).map(item=>{const active=isPublicNavigationItemActive(item,pathname,homeHref);return <button key={item.id} className={active?'active':''} aria-current={active?'page':undefined} data-nav={item.id} data-edit-id={`root.data.items.${menu.items.indexOf(item)}`} onClick={()=>{setMenuOpen(false);router.push(item.contextual?homeHref:item.href);}}>{item.label}</button>;})}
        <button className="mobile-course-link" onClick={goCourses}>{menu.courseLabel}</button>
        <button
          className="mobile-menu-close"
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Cerrar menú"
          title="Cerrar menú"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </nav>

      {variant === "city-hero" ? (
        <div className="city-header-search-slot">{resolvedCitySearch}</div>
      ) : null}

      <div className="site-header-actions">
        {variant !== "city-hero" ? (
          <button
            id="themeToggle"
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <svg className="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
            </svg>
            <svg className="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.5 15.4A8.5 8.5 0 0 1 8.6 3.5 8.5 8.5 0 1 0 20.5 15.4z" />
            </svg>
          </button>
        ) : null}

        <button className="course-cta" onClick={goCourses}>
          <svg viewBox="0 0 23 19" fill="none" aria-hidden="true">
            <path d="m7.438 13.985 3.77 3.77 3.769-3.77m-3.774-4.712v8.482" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.576 15.012a4.712 4.712 0 0 0-2.714-8.567h-1.188a7.54 7.54 0 1 0-12.949 6.87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {menu.courseLabel}
        </button>

        <button
          className="mobile-menu-toggle"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          title="Abrir menú"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );

  return withinFrame ? header : <PublicHeaderFrame><PublicHeader variant={variant} citySearch={citySearch} homeHref={homeHref} withinFrame /></PublicHeaderFrame>;
}
