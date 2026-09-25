import Link from "next/link";
import PublicFooter from "./components/PublicFooter";
import PublicHeader from "./components/PublicHeader";
import "./[ciudad]/ciudad.css";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="app-shell">
      <PublicHeader />
      <main className="not-found-page">
        <section className="not-found-panel" aria-labelledby="notFoundTitle">
          <span className="eyebrow">Error 404</span>
          <h1 id="notFoundTitle">Página no encontrada</h1>
          <p>La página que buscás no existe o ya no está disponible.</p>
          <Link className="btn" href="/">
            Volver al inicio
          </Link>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
