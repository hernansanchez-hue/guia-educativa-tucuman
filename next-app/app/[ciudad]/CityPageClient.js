"use client";

import {useMemo,useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import PublicFooter from "../components/PublicFooter";
import CityFeaturedCareers from "./CityFeaturedCareers";
import CityInstitutionSections from "./CityInstitutionSections";
import NetworkBackground from "../components/NetworkBackground";
import {DesignIcon as Icon,DesignDialog,moveTo} from "../components/ApprovedHomeUI";
import {cityDiscoveryEntries,searchCityEntries,normalizeSearch} from "../../lib/public-catalog/home-discovery.mjs";

export default function CityPageClient({city}) {return <CityHome key={city.slug} city={city}/>;}

function CityHome({city}){
 const router=useRouter();
 const [query,setQuery]=useState(""),[searched,setSearched]=useState(false),[panel,setPanel]=useState(null),[cityQuery,setCityQuery]=useState(""),[careerQuery,setCareerQuery]=useState("");
 const entries=useMemo(()=>cityDiscoveryEntries(city),[city]);
 const results=searchCityEntries(entries,query);
 const careerResults=searchCityEntries(entries,careerQuery,{careersOnly:true});
 const cities=(city.entryCities??[]).filter(c=>normalizeSearch(c.name).includes(normalizeSearch(cityQuery)));
 const filteredInstitutions=searched&&query.trim()?city.institutions.filter(i=>results.some(r=>r.href===`/${city.slug}/${i.slug}`||r.href.startsWith(`/${city.slug}/${i.slug}/`))):city.institutions;
 function search(e){e.preventDefault();setSearched(true);}
 const jump=id=>e=>{e.preventDefault();moveTo(id);};
 const openCareers=()=>{setCareerQuery("");setPanel("careers");};
 const resultList=(items)=><ul className="modal-list">{items.map(r=><li key={r.id}><Link href={r.href} prefetch={false}><strong>{r.name}</strong><small>{r.type}{r.institution?" · "+r.institution:""}</small></Link></li>)}</ul>;
 return <div className="get-city-approved" id="city-home-top">
  <NetworkBackground className="network"/>
  <header className="header"><Link className="brand" href="/" aria-label="GET Inicio"><Image src="/assets/approved-home/logo.png" alt="GET Guía Educativa Tucumán" width={132} height={48} priority/></Link>
   <nav aria-label="Navegación principal"><Link href="/" className="active">Inicio</Link><a href="#instituciones" onClick={jump("instituciones")}>Instituciones</a><button onClick={openCareers}>Carreras</button></nav>
   <div className="header-right"><button className="city" aria-haspopup="dialog" onClick={()=>{setCityQuery("");setPanel("cities");}}><Icon name="pin"/>{city.name}<span><Icon name="chevron"/></span></button><Link className="courses" href="/cursos-docentes">Cursos Docentes <span><Icon/></span></Link></div>
  </header>
  <main id="inicio">
   <section className="intro wrap" aria-labelledby="city-territory-title"><div className="eyebrow"><span className="tiny-line"/> TU CIUDAD. TU PRÓXIMO PASO.</div><h1 id="city-territory-title">Tu futuro empieza<br/>en <em>{city.name}.</em></h1><p>Descubrí qué estudiar y dónde hacerlo.<br className="mobile-only"/> Todas tus opciones, más cerca.</p>
    <form className="search" onSubmit={search} role="search" aria-label={"Buscar carrera o institución en "+city.name}><Icon name="search"/><input type="search" placeholder="¿Qué te gustaría estudiar?" aria-label="Buscar carrera o institución" autoComplete="off" value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit">Buscar <span><Icon/></span></button></form>
    <div className="quick"><span>Empezá por acá</span><button onClick={openCareers}>Explorar carreras ↗</button><a href="#instituciones" onClick={jump("instituciones")}>Ver instituciones ↗</a><a href="#orientacion" onClick={jump("orientacion")}>Necesito orientación ↗</a></div>
    {searched&&<div id="results" aria-live="polite">{!query.trim()?<p>Escribí una carrera o institución para buscar en {city.name}.</p>:results.length?<><p>{results.length} resultados en {city.name}</p>{resultList(results)}</>:<><p>No encontramos coincidencias en {city.name}.</p><a href="#orientacion" onClick={jump("orientacion")}>Conocer orientación</a><Link href="/carreras">Explorar el catálogo general de carreras</Link></>}</div>}
   </section>
   <CityFeaturedCareers city={city} dialogOpen={panel!==null} onOpenCareer={route=>router.push(route)} onOpenInstitution={route=>router.push(route)}/>
   <CityInstitutionSections city={city} institutions={filteredInstitutions} searching={searched&&!!query.trim()} onHelp={()=>setPanel("help")}/>
  </main>
  <PublicFooter onGoHome={()=>moveTo("city-home-top")}/>
  <DesignDialog open={panel!==null} onClose={()=>setPanel(null)} title={panel==="cities"?"Elegí tu ciudad":panel==="careers"?"Carreras en "+city.name:"Te ayudamos a encontrar opciones"} id="city-panel">
   {panel==="cities"&&<><label className="dialog-search">Buscar ciudad<input type="search" value={cityQuery} onChange={e=>setCityQuery(e.target.value)} placeholder="Nombre de ciudad" autoFocus/></label><ul className="modal-list">{cities.map(c=><li key={c.slug}><Link href={"/"+c.slug} aria-current={c.slug===city.slug?"page":undefined} onClick={()=>setPanel(null)}>{c.name}{c.slug===city.slug?" · Ciudad actual":""}<Icon/></Link></li>)}</ul>{!cities.length&&<p>No encontramos esa ciudad.</p>}</>}
   {panel==="careers"&&<><label className="dialog-search">Buscar carrera<input type="search" value={careerQuery} onChange={e=>setCareerQuery(e.target.value)} placeholder="Carrera o institución" autoFocus/></label>{careerResults.length?resultList(careerResults):<p>{careerQuery?"No encontramos coincidencias.":"Todavía no hay carreras publicadas en esta ciudad."}</p>}</>}
   {panel==="help"&&<div className="help-actions"><button className="gold-button" onClick={openCareers}>Buscar carreras <Icon/></button><button className="text-button" onClick={()=>{setPanel(null);requestAnimationFrame(()=>moveTo("orientacion"));}}>Conocer orientación <Icon/></button></div>}
  </DesignDialog>
 </div>;
}
