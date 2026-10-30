"use client";

import {useState} from "react";
import Link from "next/link";
import CityEditorialImage from "./CityEditorialImage";
import {usePublicEditorial} from "../components/PublicEditorialContext";
import {showCityOrientation} from "../../lib/catalog/city-template.mjs";
import {DesignIcon} from "../components/ApprovedHomeUI";

const reference="/assets/approved-home/city-reference/";
const institutionHref=(city,institution)=>`/${city.slug}/${institution.slug}`;
function InstitutionCard({city,institution}) {
  const careers=institution.careers??[];
  const modalities=[...new Set(careers.map(career=>career.modality).filter(Boolean))];
  const fallback=reference+(institution.slug?.includes("siglo-21")?"campus.jpg":"institute.jpg");
  return <article className="school-card">
    <div className="school-photo">
      <CityEditorialImage src={institution.image} fallbackSrc={fallback} illustrativeLabel alt={institution.image&&!institution.image.includes("unsplash.com")?institution.name:"Imagen ilustrativa de educación; no corresponde a la fachada de la sede"} width={1200} height={800} sizes="(max-width: 619px) 114px, (max-width: 900px) 45vw, 380px" loading="lazy"/>
      <span className="featured-label">DESTACADA</span>
    </div>
    <div className="school-body">
      <div className="school-type">{institution.type}<span>{city.name}</span></div>
      <h3>{institution.name}</h3>
      {institution.description?<p>{institution.description}</p>:null}
      <div className="school-facts">
        {careers.length>0?<span>{careers.length} {careers.length===1?"carrera publicada":"carreras publicadas"}</span>:null}
        {modalities.map(modality=><span key={modality}>{modality}</span>)}
      </div>
      <div className="school-bottom">
        <span>{institution.address||city.name}</span>
        <Link href={institutionHref(city,institution)} aria-label={`Ver institución ${institution.name}`}>Explorar carreras <DesignIcon name="arrow"/></Link>
      </div>
    </div>
  </article>;
}
function DirectoryEntry({city,institution}) {
  const initials=institution.name.split(/\s+/).filter(word=>!/^(de|del|la|el|y)$/i.test(word)).slice(0,2).map(word=>word[0]).join("").toUpperCase();
  const count=institution.careers?.length??0;
  return <Link className="directory-card" href={institutionHref(city,institution)} aria-label={`Ver institución ${institution.name}`}>
    <span className="directory-initial" aria-hidden="true">{initials}</span>
    <span className="directory-info"><strong>{institution.name}</strong><small>{count>0?`${count} ${count===1?"carrera publicada":"carreras publicadas"}`:institution.type}</small></span>
    <span className="directory-arrow" aria-hidden="true"><DesignIcon name="arrow"/></span>
  </Link>;
}
export default function CityInstitutionSections({city,institutions=[],searching=false,onHelp}) {
  const [expanded,setExpanded]=useState(false);
  const orientation=usePublicEditorial("orientation");
  const footer=usePublicEditorial("footer");
  const featured=Array.from(new Map((city.featuredInstitutions??[]).filter(Boolean).map(institution=>[institution.id,institution])).values());
  const visibleFeatured=expanded?featured:featured.slice(0,6);
  const visibleIds=new Set(visibleFeatured.map(institution=>institution.id));
  const directory=searching?institutions:institutions.filter(institution=>!visibleIds.has(institution.id));
  const whatsapp=footer?.whatsappHref||"https://wa.me/5493865751273";
  const inquiryHref=message=>{const url=new URL(whatsapp);url.searchParams.set("text",message);return url.href;};
  const orientationHref=inquiryHref(`Hola GET, quisiera participar de Orientación Vocacional en ${city.name}.`);
  const expoHref=inquiryHref(`Hola GET, quisiera recibir novedades de la próxima Expo Carreras GET en ${city.name}.`);
  return <>
    <section className="help-grid wrap" id="orientacion">
      {showCityOrientation(city,orientation)?<article className="orientation" aria-labelledby="cityOrientationTitle">
        <div><span className="eyebrow">{orientation.eyebrow}</span>
          <h2 id="cityOrientationTitle">{city.orientationTitle||<>{orientation.titleBefore}<br/>{orientation.titleAfter}</>}</h2>
          <p>{city.orientationDescription||orientation.description}</p>
          <a className="text-button" href={orientationHref} target="_blank" rel="noopener noreferrer">Quiero participar <DesignIcon name="arrow"/></a>
          <small className="action-note">Solicitá información por WhatsApp.</small>
        </div>
        <div className="orientation-image"><CityEditorialImage src={city.orientationImage||orientation.image} fallbackSrc={reference+"students.jpg"} alt={orientation.imageAlt||"Jóvenes compartiendo una actividad"} width={1100} height={1422} sizes="182px" loading="lazy"/><span>{orientation.caption||"Encontrá tu camino."}</span></div>
      </article>:null}
      {city.expoVisible!==false?<article className="expo" aria-labelledby="cityExpoTitle">
        <div className="expo-head"><span className="eyebrow">UN ENCUENTRO CON TU FUTURO</span><span className="soon">Próximamente</span></div>
        <div className="expo-title" id="cityExpoTitle">EXPO<span>GET</span><span className="expo-spark" aria-hidden="true"><DesignIcon name="spark"/></span></div>
        {city.expoTitle?<p>{city.expoTitle}</p>:null}
        <p>{city.expoDescription||"Instituciones, carreras y nuevas posibilidades. Todo en un mismo lugar."}</p>
        <a className="text-button" href={expoHref} target="_blank" rel="noopener noreferrer">Avisame de la próxima Expo <DesignIcon name="arrow"/></a>
        <small className="action-note">Recibí información por WhatsApp.</small>
      </article>:null}
    </section>
    {featured.length>0?<section className="featured wrap" id="instituciones" aria-labelledby="featuredInstitutionsTitle">
      <div className="section-top"><div><div className="eyebrow">CONOCÉ DÓNDE PODÉS ESTUDIAR</div><h2 id="featuredInstitutionsTitle">{city.featuredInstitutionsTitle||"Instituciones destacadas"}<span className="gold-dot">.</span></h2></div><a href="#directorio">Ver todas las instituciones <DesignIcon name="arrow"/></a></div>
      <div className="featured-grid" id="featuredGrid">{visibleFeatured.map(institution=><InstitutionCard key={institution.id} city={city} institution={institution}/>)}</div>
      {featured.length>6?<div className="featured-more"><button type="button" onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded} aria-controls="featuredGrid">{expanded?"Ver menos instituciones destacadas":"Ver más instituciones destacadas"} <DesignIcon name="chevron"/></button></div>:null}
    </section>:<span id="instituciones"/>}
    <section className="directory wrap" id="directorio" aria-labelledby="allInstitutionsTitle">
      <div className="section-top"><div><div className="eyebrow">SEGUÍ EXPLORANDO</div><h2 id="allInstitutionsTitle">{searching?"Resultados de instituciones":`Más instituciones en ${city.name}`}<span className="gold-dot">.</span></h2></div></div>
      <div className="directory-grid" id="directoryGrid">{directory.map(institution=><DirectoryEntry key={institution.id} city={city} institution={institution}/>)}</div>
      {directory.length===0?<p className="directory-empty">{searching?"No encontramos instituciones con esa búsqueda.":featured.length?"Todas las instituciones disponibles en esta ciudad están presentadas arriba.":"Todavía no hay instituciones publicadas en esta ciudad."}</p>:null}
      <div className="directory-foot"><span>¿No encontraste lo que buscabas?</span><button type="button" onClick={onHelp}>Te ayudamos a encontrar opciones <DesignIcon name="arrow"/></button></div>
    </section>
    {city.commercialVisible!==false?<section className="partner wrap" aria-labelledby="cityCommercialTitle">
      <div><span className="eyebrow gold">TU INSTITUCIÓN TAMBIÉN PUEDE ESTAR ACÁ</span><h2 id="cityCommercialTitle">{city.commercialTitle||"Tu propuesta educativa puede estar acá."}</h2>{city.commercialDescription?<p>{city.commercialDescription}</p>:null}</div>
      <Link className="gold-button" href={city.commercialHref||"/contacto"}>{city.commercialCtaLabel||"Quiero ser parte de GET"} <DesignIcon name="arrow"/></Link>
      <span className="partner-decoration" aria-hidden="true"><DesignIcon name="arrow"/></span>
    </section>:null}
  </>;
}
