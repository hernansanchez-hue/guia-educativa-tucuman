import s from '../workspace.module.css';
export default function LoadingAdmin(){return <section className={s.card} role="status" aria-live="polite"><h2>Cargando tu espacio de trabajo…</h2><p className={s.muted}>Estamos consultando el contenido de GET.</p></section>;}
