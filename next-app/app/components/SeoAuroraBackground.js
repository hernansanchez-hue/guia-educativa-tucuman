"use client";

import { useEffect, useRef } from "react";

export default function SeoAuroraBackground({ children,attributes={} }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      if (reducedMotion.matches) return;

      const scrollY = window.scrollY;
      scene.style.setProperty("--seo-shift-a", `${scrollY * -0.055}px`);
      scene.style.setProperty("--seo-shift-b", `${scrollY * 0.085}px`);
      scene.style.setProperty("--seo-shift-c", `${scrollY * -0.035}px`);
      scene.style.setProperty("--seo-shift-x", `${scrollY * 0.028}px`);
      scene.style.setProperty("--seo-shift-x-reverse", `${scrollY * -0.0154}px`);
      scene.style.setProperty("--seo-turn", `${scrollY * 0.006}deg`);
      scene.style.setProperty("--seo-turn-reverse", `${scrollY * -0.0042}deg`);
      scene.style.setProperty("--seo-turn-soft", `${scrollY * 0.0027}deg`);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    const resetForReducedMotion = () => {
      if (reducedMotion.matches) {
        ["--seo-shift-a", "--seo-shift-b", "--seo-shift-c", "--seo-shift-x", "--seo-shift-x-reverse", "--seo-turn", "--seo-turn-reverse", "--seo-turn-soft"].forEach((property) => scene.style.removeProperty(property));
      } else {
        requestUpdate();
      }
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    reducedMotion.addEventListener("change", resetForReducedMotion);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      reducedMotion.removeEventListener("change", resetForReducedMotion);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="seo-aurora-background" {...attributes}>
      <div className="seo-scroll-scene" ref={sceneRef} aria-hidden="true">
        <svg className="seo-scroll-ribbon is-primary" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-90 150C216 38 394 312 686 210C923 127 1048 22 1532 126" />
          <path d="M-80 184C232 84 399 347 702 245C947 161 1098 55 1510 164" />
        </svg>
        <svg className="seo-scroll-ribbon is-secondary" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M1494 216C1204 320 1104 520 848 493C588 465 458 280 146 420C54 462-4 514-84 591" />
          <path d="M1494 252C1200 356 1096 557 836 529C567 499 438 321 131 459C39 501-9 553-78 625" />
        </svg>
        <svg className="seo-scroll-ribbon is-gold" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-62 708C230 547 444 646 650 742C882 851 1058 802 1494 641" />
        </svg>
        <span className="seo-scroll-orbit is-navy" />
        <span className="seo-scroll-orbit is-sky" />
        <span className="seo-scroll-arch" />
        <span className="seo-scroll-dots"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="seo-aurora-background-content">{children}</div>
    </div>
  );
}
