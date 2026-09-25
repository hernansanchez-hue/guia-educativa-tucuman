"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

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

export default function PublicHeader({ variant = "default", citySearch = null }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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
    router.push("/");
  }

  function goAbout() {
    setMenuOpen(false);
    router.push("/nosotros");
  }

  function goCourses() {
    setMenuOpen(false);
    router.push("/cursos-docentes");
  }

  const themeLabel = darkMode ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <header className={variant === "city-hero" ? "site-header city-hero-header visible" : "site-header visible"}>
      <button className="logo" onClick={goHome} aria-label="Volver al inicio">
        {variant === "city-hero" ? (
          <span className="city-hero-logo" aria-hidden="true"><img src="/assets/get-logo-oficial.png" alt="" /></span>
        ) : (
          <span className="public-logo-compact" aria-hidden="true">
            <img className="public-logo-light" src="/assets/get-logo-oficial.png" alt="" />
            <img className="public-logo-dark" src="/assets/get-logo-hero-blanco-dorado.png" alt="" />
          </span>
        )}
      </button>

      <nav
        id="siteMenu"
        className={menuOpen ? "site-nav open" : "site-nav"}
        aria-label="Navegación principal"
      >
        <button data-nav="inicio" onClick={goHome}>Inicio</button>
        <button data-nav="eventos">Eventos</button>
        <button data-nav="nosotros" onClick={goAbout}>Nosotros</button>
        <button className="mobile-course-link" onClick={goCourses}>Cursos Docentes</button>
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

      {variant === "city-hero" && citySearch ? (
        <div className="city-header-search-slot">{citySearch}</div>
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
          Cursos Docentes
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
}
