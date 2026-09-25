"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import CitySelector from "./CitySelector";

export default function HomeClient({ cities }) {
  useEffect(() => {
    const darkMode = localStorage.getItem("guiaEducativaTheme") === "dark";
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem("guiaEducativaTheme", darkMode ? "dark" : "light");
  }, []);

  return (
    <div className="app-shell">
      <header className="home-header">
        <div className="logo" aria-label="Guía Educativa Tucumán">
          <span className="home-brand-logo" aria-hidden="true"><img src="/assets/get-logo-hero-blanco-dorado.png" alt="" /></span>
        </div>
      </header>

      <main id="home" className="home">
        <video className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
          <source src="https://res.cloudinary.com/disj9fs8m/video/upload/q_auto/v1782350401/get/hero/v2l8k0maxocxnxf0yerh.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="home-inner">
          <h1>Toda la oferta educativa de <span>Tucumán</span> en un solo lugar</h1>

          <CitySelector cities={cities} />
        </div>
      </main>

      <button className="admin-fab" type="button" title="Abrir panel de control" aria-label="Abrir panel de control">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      </button>
    </div>
  );
}
