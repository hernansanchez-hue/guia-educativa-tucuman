'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import styles from '../home-entry.module.css';

export default function HomeEntryMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggle = useRef(null);

  function closeOnEscape(event) {
    if (event.key !== 'Escape') return;
    setOpen(false);
    toggle.current?.focus();
  }

  return (
    <div className={styles.navigation} onKeyDown={closeOnEscape}>
      <button ref={toggle} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
        Menú
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav id={menuId} aria-label="Navegación principal" className={`${styles.navLinks} ${open ? styles.navOpen : ''}`}>
        <Link href="/" aria-current="page" onClick={() => setOpen(false)}>Inicio</Link>
        <Link href="/instituciones" prefetch={false} onClick={() => setOpen(false)}>Instituciones</Link>
<Link href="/carreras" prefetch={false} onClick={() => setOpen(false)}>Carreras</Link>
      </nav>
    </div>
  );
}
