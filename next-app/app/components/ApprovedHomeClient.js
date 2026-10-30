"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import "../home-entry.css";
import NetworkBackground from "./NetworkBackground";
import {DesignIcon as Icon,moveTo} from "./ApprovedHomeUI";
import {normalizeSearch as normalize} from "../../lib/public-catalog/home-discovery.mjs";

const featuredSlugs=["concepcion","san-miguel-de-tucuman","monteros","aguilares","yerba-buena","tafi-viejo"];
const photos={concepcion:["concepcion.webp","Catedral de la Inmaculada Concepción"],"san-miguel-de-tucuman":["capital.webp","Casa de Gobierno, San Miguel de Tucumán"],monteros:["monteros.webp","Iglesia Nuestra Señora del Rosario, Monteros"]};
const asset=name=>"/assets/approved-home/"+name;

function CityCard({city}){
 const photo=photos[city.slug];
 return <Link className={"city-card "+(photo?"photo-city":"compact-city")} href={`/${city.slug}`} prefetch={false} aria-label={city.name+": ver instituciones y carreras"}>
  {photo&&<Image className="city-picture" src={asset(photo[0])} alt={photo[1]} fill sizes="(max-width:640px) 100vw,33vw"/>}
  <div className="city-card-top"><span>TUCUMÁN</span><Icon name="pin"/></div><h3>{city.name}</h3>
  <div className="city-card-bottom"><span>Ver instituciones y carreras</span><span><Icon/></span></div>
 </Link>;
}

export default function ApprovedHomeClient({cities}){
 const router=useRouter(), header=useRef(null), menuTrigger=useRef(null), searchArea=useRef(null), input=useRef(null), toggle=useRef(null);
 const [menuOpen,setMenuOpen]=useState(false),[allOpen,setAllOpen]=useState(false),[query,setQuery]=useState(""),[popup,setPopup]=useState(false),[active,setActive]=useState(-1),[paused,setPaused]=useState(false);
 const matches=useMemo(()=>cities.filter(c=>normalize(c.name).includes(normalize(query))),[cities,query]);
 const featured=featuredSlugs.map(slug=>cities.find(c=>c.slug===slug)).filter(Boolean);
 useEffect(()=>{
  function outside(e){if(!header.current?.contains(e.target))setMenuOpen(false);if(!searchArea.current?.contains(e.target))setPopup(false);}
  function escape(e){if(e.key==="Escape"){setPopup(false);if(menuOpen){setMenuOpen(false);menuTrigger.current?.focus();}}}
  document.addEventListener("pointerdown",outside);document.addEventListener("focusin",outside);document.addEventListener("keydown",escape);
  return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("focusin",outside);document.removeEventListener("keydown",escape);};
 },[menuOpen]);
 useEffect(()=>{const m=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setPaused(m.matches);update();m.addEventListener("change",update);return()=>m.removeEventListener("change",update);},[]);
 function explore(){setAllOpen(true);setPopup(false);requestAnimationFrame(()=>moveTo("todas-las-ciudades",true));}
 function submit(e){e.preventDefault();const selected=popup&&active>=0?matches[active]:cities.find(c=>normalize(c.name)===normalize(query))||(query.trim()&&matches.length===1?matches[0]:null);if(selected){router.push("/"+selected.slug);return;}setPopup(true);input.current?.focus();}
 function keys(e){if(e.key==="Escape"){setPopup(false);setActive(-1);}if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();setPopup(true);if(matches.length){const next=(active+(e.key==="ArrowDown"?1:-1)+matches.length)%matches.length;setActive(next);document.getElementById("city-option-"+next)?.scrollIntoView({block:"nearest"});}}}
 const jump=(id)=>(e)=>{e.preventDefault();setMenuOpen(false);moveTo(id);};
 return <div className={"get-home-approved"+(paused?" motion-paused":"")} id="inicio">
  <a className="skip" href="#contenido">Saltar al contenido</a><NetworkBackground className="network" paused={paused}/>
  <header className="header" ref={header}>
   <a className="brand" href="#inicio" onClick={jump("inicio")} aria-label="GET, Guía Educativa Tucumán. Inicio"><Image src={asset("logo.png")} alt="GET — Guía Educativa Tucumán" width={135} height={62} priority/></a>
   <nav aria-label="Navegación principal" id="home-nav" className={menuOpen?"open":""}><a className="active" href="#ciudades" onClick={jump("ciudades")}>Elegí tu ciudad</a><a href="#como-funciona" onClick={jump("como-funciona")}>Cómo funciona</a><Link href="/nosotros" onClick={()=>setMenuOpen(false)}>Sobre GET <span>↗</span></Link></nav>
   <Link className="institution-link" href="/contacto">Soy una institución <Icon/></Link>
   <button ref={menuTrigger} type="button" className="menu-toggle" aria-label={menuOpen?"Cerrar menú":"Abrir menú"} aria-expanded={menuOpen} aria-controls="home-nav" onClick={()=>setMenuOpen(!menuOpen)}><span/><span/></button>
  </header>
  <main id="contenido">
   <section className="hero wrap" aria-labelledby="hero-title">
    <div className="hero-copy"><div className="eyebrow"><span/> TU FUTURO, ACÁ EN TUCUMÁN</div><h1 id="hero-title">¿Dónde querés<br/><em>estudiar?</em></h1><p className="intro">Elegí una ciudad y descubrí sus instituciones y carreras. Tu próximo paso empieza acá.</p></div>
    <div className="hero-visual"><div className="photo-wrap"><Image src={asset("students.jpg")} alt="Jóvenes compartiendo un momento al aire libre" width={1100} height={1422} priority sizes="(max-width:640px) 100vw,45vw"/><div className="photo-top"><span className="location-label"><Icon name="pin"/> GET / TUCUMÁN</span></div></div><div className="visual-caption"><div><p className="eyebrow">MUCHOS CAMINOS. TU ELECCIÓN.</p><p>Lo que viene<br/>empieza con vos.</p></div><a href="#ciudades" onClick={jump("ciudades")} className="round-arrow" aria-label="Explorar ciudades"><Icon/></a></div><div className="visual-note"><span>Un lugar para<br/><strong>tu próximo paso.</strong></span></div></div>
    <div className="city-finder"><div className="finder-intro"><span className="finder-count"><span/>{cities.length} ciudades para explorar</span><label htmlFor="citySearch">Buscá tu ciudad</label><button className="text-button" onClick={explore}>Explorar todas las ciudades <span>↓</span></button></div>
     <div className="finder-controls"><div className="search-area" ref={searchArea}><form id="searchForm" role="search" aria-label="Buscar ciudades de Tucumán" onSubmit={submit}><Icon className="search-pin" name="pin"/><input ref={input} type="search" id="citySearch" placeholder="Por ejemplo, Concepción" autoComplete="off" role="combobox" aria-autocomplete="list" aria-controls="suggestions" aria-expanded={popup} aria-activedescendant={popup&&active>=0?"city-option-"+active:undefined} value={query} onChange={e=>{setQuery(e.target.value);setPopup(true);setActive(-1);}} onFocus={()=>{if(query)setPopup(true);}} onKeyDown={keys}/><button type="submit" className="primary">Buscar <Icon name="search"/></button></form>
      <div className="search-popup" hidden={!popup}><p role="status">{query?(matches.length?matches.length+" ciudades encontradas":"No encontramos esa ciudad. Probá otro nombre o explorá el listado completo."):"Elegí una ciudad para ver sus instituciones y carreras."}</p><ul id="suggestions" role="listbox" aria-label="Ciudades encontradas">{matches.map((city,i)=><li key={city.slug} id={"city-option-"+i} role="option" aria-selected={active===i} onPointerDown={e=>e.preventDefault()} onClick={()=>router.push("/"+city.slug)}>{city.name}<span aria-hidden="true">↗</span></li>)}</ul>{!matches.length&&<button className="text-button" onClick={explore}>Ver todas las ciudades</button>}</div>
     </div><div className="shortcuts"><span>También podés ir directo a</span><div>{featured.slice(0,3).map(c=><Link key={c.slug} href={"/"+c.slug}>{c.name}<span>↗</span></Link>)}</div></div><button className="text-button mobile-explore" onClick={explore}>Explorar todas las ciudades <span>↓</span></button></div>
    </div>
   </section>
   <div className="options-strip wrap" aria-label="Qué podés encontrar en GET"><span className="eyebrow">UN MUNDO DE OPCIONES,<br/>CERCA TUYO</span>{[["school","Universidades"],["book","Institutos y terciarios"],["cap","Carreras"]].map(([icon,title])=><div key={icon}><Icon name={icon}/><span>{title}</span></div>)}</div>
   <section className="cities-section wrap" id="ciudades" aria-labelledby="cities-title"><div className="section-heading"><div><p className="eyebrow"><span/> ENCONTRÁ TU LUGAR</p><h2 id="cities-title">Una ciudad.<br className="mobile-only"/> Muchas posibilidades<span className="gold-dot">.</span></h2><p>Entrá directamente a sus instituciones y carreras.</p></div><button className="all-link" onClick={explore}>Todas las ciudades <span className="count">{cities.length}</span><span>↗</span></button></div><div className="city-grid">{featured.map(city=><CityCard key={city.slug} city={city}/>)}</div>
    <div className="all-cities-actions"><button ref={toggle} className="secondary" aria-expanded={allOpen} aria-controls="allCities" onClick={()=>{setAllOpen(!allOpen);if(allOpen)requestAnimationFrame(()=>toggle.current?.scrollIntoView({block:"nearest"}));}}>{allOpen?"Mostrar menos ciudades":"Ver todas las ciudades"}{!allOpen&&<span className="count">{cities.length}</span>}<span className="toggle-arrow">{allOpen?"↑":"↓"}</span></button></div>
    <div className="all-cities" id="allCities" hidden={!allOpen}><div className="directory-heading" id="todas-las-ciudades" tabIndex={-1}><h3>Todas las ciudades, de la A a la Z</h3><span>{cities.length} ciudades para explorar</span></div><ul id="cityDirectory">{cities.map(c=><li key={c.slug}><Link href={"/"+c.slug} prefetch={false}>{c.name}<span aria-hidden="true">↗</span></Link></li>)}</ul></div>
   </section>
   <section className="how-section wrap" id="como-funciona" aria-labelledby="how-title"><div className="how-intro"><p className="eyebrow"><span/> EXPLORÁ. CONOCÉ. ELEGÍ.</p><h2 id="how-title">Tu búsqueda,<br/>un poco más simple.</h2><p>Reunimos las opciones educativas de Tucumán para acompañarte a elegir.</p><a href="#ciudades" onClick={jump("ciudades")} className="text-button">Empezá por tu ciudad <span>↗</span></a></div>
    <div className="map-note"><Image src={asset("tucuman.svg")} alt="Mapa de los departamentos de Tucumán" width={145} height={170}/><div><span className="eyebrow">TU FUTURO TIENE UN LUGAR</span><strong>Encontralo en Tucumán.</strong><small>Geometría: IGN / GeoRef · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a><br/>Mapa adaptado en color.</small></div></div>
    <ol className="steps">{[["pin","Elegí dónde estudiar","Buscá tu ciudad o explorá las que tenés cerca."],["school","Descubrí tus opciones","Conocé las instituciones y sus propuestas educativas."],["cap","Encontrá tu próximo paso","Explorá las carreras y consultá con cada institución."]].map(([icon,title,text],i)=><li key={icon}><span className="step-num">0{i+1}</span><div><Icon name={icon} className="step-icon"/><h3>{title}</h3><p>{text}</p></div><span className="step-arrow" aria-hidden="true">↗</span></li>)}</ol>
   </section>
   <section className="partner wrap" aria-labelledby="partner-title"><div className="partner-art" aria-hidden="true"><span/><span/><span/></div><div><p className="eyebrow">CONSTRUYAMOS MÁS OPORTUNIDADES</p><h2 id="partner-title">Tu institución también<br/>puede ser parte.</h2><p>Acercá tu propuesta educativa a quienes están eligiendo su futuro.</p></div><Link className="gold-button" href="/contacto">Quiero ser parte de GET <Icon/></Link></section>
  </main>
  <footer className="footer wrap"><div className="footer-main"><a href="#inicio" onClick={jump("inicio")} aria-label="GET. Volver al inicio"><Image src={asset("logo.png")} alt="GET — Guía Educativa Tucumán" width={125} height={57}/></a><p>Tu futuro tiene un lugar.<br/><strong>Encontralo en Tucumán.</strong></p><nav aria-label="Enlaces del pie"><a href="#ciudades" onClick={jump("ciudades")}>Ciudades</a><Link href="/instituciones">Instituciones</Link><Link href="/carreras">Carreras</Link><Link href="/nosotros">Sobre GET</Link><Link href="/contacto">Contacto ↗</Link></nav><a className="back-top" href="#inicio" onClick={jump("inicio")} aria-label="Volver arriba">↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Guía Educativa Tucumán</span><span>Hecho para encontrar tu camino.</span></div>
   <details className="photo-credits"><summary>Créditos de fotografías</summary><p>Concepción: <a href="https://commons.wikimedia.org/wiki/File:Catedral_de_Concepci%C3%B3n_de_Tucum%C3%A1n.JPG">Pertile</a>, CC BY-SA 3.0. San Miguel de Tucumán: <a href="https://commons.wikimedia.org/wiki/File:Frente_de_la_Casa_de_Gobierno_de_Tucum%C3%A1n.jpg">Dario Alpern</a>, CC BY-SA 4.0. Monteros: <a href="https://commons.wikimedia.org/wiki/File:Monteros_Tucuman_Iglesia_y_Plaza.JPG">José Lazarte</a>, dominio público. Fotografías históricas de referencia; las adaptaciones conservan sus respectivas licencias.</p></details>
  </footer>
  <button className="motion-toggle" aria-label={paused?"Reanudar animación de fondo":"Pausar animación de fondo"} aria-pressed={paused} onClick={()=>setPaused(!paused)}><span aria-hidden="true">{paused?"▷":"Ⅱ"}</span><span>{paused?"Activar fondo":"Pausar fondo"}</span></button>
 </div>;
}
