"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { departmentAction } from "../../lib/public-catalog/home-map-interaction";
import { HOME_CONTENT, homeTitleStyle } from '../../lib/admin/home-editorial.mjs';
import {matchesSearch,searchText} from '../../lib/catalog/search.mjs';

const WIDTH = 520;
const HEIGHT = 550;
const PADDING = 18;

function geometryBounds(features) {
  const bounds = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const feature of features) for (const polygon of feature.geometry.coordinates) for (const ring of polygon) for (const [lon, lat] of ring) {
    bounds.minX = Math.min(bounds.minX, lon);
    bounds.maxX = Math.max(bounds.maxX, lon);
    bounds.minY = Math.min(bounds.minY, lat);
    bounds.maxY = Math.max(bounds.maxY, lat);
  }
  return bounds;
}

function pathsFor(features) {
  const bounds = geometryBounds(features);
  const scale = Math.min((WIDTH - PADDING * 2) / ((bounds.maxX - bounds.minX) * 0.89), (HEIGHT - PADDING * 2) / (bounds.maxY - bounds.minY));
  const horizontal = (WIDTH - (bounds.maxX - bounds.minX) * 0.89 * scale) / 2;
  const vertical = (HEIGHT - (bounds.maxY - bounds.minY) * scale) / 2;
  const point = ([lon, lat]) => `${(horizontal + (lon - bounds.minX) * 0.89 * scale).toFixed(2)},${(vertical + (bounds.maxY - lat) * scale).toFixed(2)}`;
  return features.map((feature) => ({
    id: feature.properties.id,
    name: feature.properties.name,
    path: feature.geometry.coordinates.map((polygon) => polygon.map((ring) => `M${ring.map(point).join("L")}Z`).join("")).join(""),
  }));
}

function normalize(value) {
  return searchText(value);
}

function plural(count, singular, pluralValue) {
  return `${count} ${count === 1 ? singular : pluralValue}`;
}

export default function HomeMapClient({ catalog, content = HOME_CONTENT }) {
  const router = useRouter();
  const [features, setFeatures] = useState([]);
  const [mapError, setMapError] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const shapes = useMemo(() => features.length ? pathsFor(features) : [], [features]);
  const activeId = hovered ?? selected;
  const activeShape = shapes.find((shape) => shape.id === activeId);
  const department = activeId ? (catalog.byDepartment[activeId] ?? { cities: [], institutionCount: 0, careerCount: 0 }) : null;
  const results = useMemo(() => {
    const term = normalize(query);
    return term ? catalog.search.filter((entry) => matchesSearch(term,entry.label,entry.context)).slice(0, 7) : [];
  }, [catalog.search, query]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/assets/tucuman-departamentos.geojson", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`GeoJSON HTTP ${response.status}`); return response.json(); })
      .then((data) => {
        if (data.type !== "FeatureCollection" || data.features?.length !== 17) throw new Error("Invalid Tucumán department GeoJSON");
        setFeatures(data.features);
      })
      .catch((error) => { if (error.name !== "AbortError") setMapError(true); });
    return () => controller.abort();
  }, []);

  function select(shape, fromKeyboard = false) {
    setSelected(shape.id);
    setHovered(null);
    const available = catalog.byDepartment[shape.id]?.cities ?? [];
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const action = departmentAction(available, canHover, fromKeyboard);
    if (action.type === "navigate") router.push(action.href);
  }

  function submitSearch(event) {
    event.preventDefault();
    if (results[0]) router.push(results[0].href);
  }

  return (
    <main className="home-map-hero">
      {content.videoVisible && <video key={content.video} className="home-map-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
        <source src={content.video} type="video/mp4" />
      </video>}
      <div className="home-map-backdrop" aria-hidden="true" style={content.cmsDesign?.overlay ? {background:`linear-gradient(100deg, rgba(7, 21, 47, ${content.cmsDesign.overlay}), rgba(7, 21, 47, ${Math.max(.5,content.cmsDesign.overlay-.16)}))`} : undefined} />
      <div className="home-map-content">
        <header className="home-map-brand">
          <img className="home-map-hero-logo" src={content.logo} alt={content.logoAlt} style={content.cmsDesign?.logoSize ? {width:`min(100%, ${content.cmsDesign.logoSize}px)`} : undefined} />
        </header>

        <h1 style={homeTitleStyle(content.cmsDesign)}>{content.titleBefore} <span>{content.titleHighlight}</span> {content.titleAfter}</h1>

        <div className="home-map-explorer">
          <div className="home-map-search-wrap">
            <form className="home-map-search" role="search" onSubmit={submitSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></svg>
              <input aria-label="Buscar ciudad, institución o carrera" type="search" autoComplete="off" placeholder={content.searchPlaceholder} value={query} onChange={(event) => { setQuery(event.target.value); setShowResults(true); }} onFocus={() => setShowResults(true)} />
              {query && <button type="button" onClick={() => { setQuery(""); setShowResults(false); }} aria-label="Limpiar búsqueda">×</button>}
            </form>
            {showResults && query && <div className="home-map-results" role="listbox" aria-label="Resultados de búsqueda">
              {results.length ? results.map((entry, index) => <a key={`${entry.href}-${index}`} href={entry.href} role="option" aria-selected="false"><small>{entry.type}</small><strong>{entry.label}</strong>{entry.context && <span>{entry.context}</span>}</a>) : <p>No encontramos resultados.</p>}
            </div>}
          </div>

          <div className="home-map-graphic" aria-label="Mapa interactivo de los 17 departamentos de Tucumán">
            {mapError ? <p className="home-map-fallback">No se pudo cargar el mapa. Usá el buscador para explorar GET.</p> : shapes.length ? <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label="Departamentos de Tucumán">
              {shapes.map((shape) => {
                const available = (catalog.byDepartment[shape.id]?.cities.length ?? 0) > 0;
                return <path key={shape.id} d={shape.path} fillRule="evenodd" className={`home-map-department${activeId === shape.id ? " is-active" : ""}${available ? " has-city" : ""}`} tabIndex={0} role="button" aria-label={`${shape.name}: ${plural(catalog.byDepartment[shape.id]?.cities.length ?? 0, "ciudad disponible", "ciudades disponibles")}`} aria-pressed={selected === shape.id} onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(shape.id); }} onPointerLeave={() => setHovered(null)} onClick={() => select(shape)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(shape, true); } }}><title>{shape.name}</title></path>;
              })}
            </svg> : <p className="home-map-fallback">Cargando mapa de Tucumán…</p>}
            <span className="home-map-attribution">Geometría: IGN / GeoRef · CC BY 4.0</span>
          </div>

          <div className="home-map-details">
            <section className="home-map-panel" aria-live="polite" aria-atomic="true">
              <span className="home-map-eyebrow">{activeShape ? content.departmentLabel : content.provinceLabel}</span>
              <h2>{activeShape?.name ?? content.provinceName}</h2>
              <p>{activeShape ? plural(department.cities.length, "ciudad disponible", "ciudades disponibles") : plural(catalog.province.cityCount, "ciudad disponible", "ciudades disponibles")}</p>
              <div className="home-map-stats">
                <div><strong>{activeShape ? department.institutionCount : catalog.province.institutionCount}</strong><span>{content.institutionsLabel}</span></div>
                <div><strong>{activeShape ? department.careerCount : catalog.province.careerCount}</strong><span>{content.careersLabel}</span></div>
              </div>
              {activeShape ? department.cities.length === 0 ? <p className="home-map-coming">{content.comingText}</p> : <div className="home-map-cities"><h3>{department.cities.length > 1 ? content.selectCityLabel : content.cityAvailableLabel}</h3>{department.cities.map((city) => <a key={city.slug} href={`/${city.slug}`}>{content.cityLinkLabel} {city.name} <span aria-hidden="true">→</span></a>)}</div> : <p className="home-map-hint">{content.hint}</p>}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
