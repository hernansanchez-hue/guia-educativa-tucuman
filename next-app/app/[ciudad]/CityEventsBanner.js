import Link from "next/link";
import {DesignIcon} from "../components/ApprovedHomeUI";
import "./city-events-banner.css";

export default function CityEventsBanner() {
  return <section className="city-events-banner wrap" aria-labelledby="cityEventsTitle">
    <span className="city-events-banner__icon" aria-hidden="true">
      <svg viewBox="0 0 32 32"><rect x="5" y="7" width="22" height="21" rx="4"/><path d="M10 4v6m12-6v6M5 14h22m-17 6h3m6 0h3m-12 4h3"/></svg>
    </span>
    <div className="city-events-banner__content">
      <h2 id="cityEventsTitle">Viví la educación más allá del aula.</h2>
      <p>Descubrí ferias, charlas, encuentros y actividades educativas en Tucumán.</p>
    </div>
    <Link className="gold-button city-events-banner__link" href="/eventos">Explorar eventos <DesignIcon name="arrow"/></Link>
  </section>;
}
