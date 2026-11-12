"use client";
import Link from 'next/link';
import s from '../workspace.module.css';
export default function AdminError({reset}){return <section className={s.card} role="alert"><h2>No pudimos cargar este contenido</h2><p className={s.muted}>Reintentá en unos momentos. Tus cambios guardados se conservan.</p><div className={s.filters}><button className={s.primary} onClick={reset}>Reintentar</button><Link className={s.secondary} href="/admin">Volver al panel</Link></div></section>;}
