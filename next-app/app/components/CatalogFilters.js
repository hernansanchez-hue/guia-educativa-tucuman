"use client";
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {matchesSearch} from '../../lib/catalog/search.mjs';
import './catalog-filters.css';
/** Compact projections only: no full curricula, presentations or draft payloads. */
export default function CatalogFilters({kind,items,cities=[],careers=[],initialQuery='',initialCity=''}){
 const [query,setQuery]=useState(initialQuery),[city,setCity]=useState(initialCity),[type,setType]=useState(''),[ownership,setOwnership]=useState(''),[institution,setInstitution]=useState(''),[modality,setModality]=useState(''),[page,setPage]=useState(1);
 const isInstitution=kind==='institutions',offers=items.flatMap(i=>i.offerings||[]);
 const unique=values=>[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const cityOptions=[...new Map((isInstitution?items.flatMap(i=>i.venues.map(v=>v.city)):offers.map(o=>o.city).filter(c=>c.slug)).map(c=>[c.slug,c])).values()].sort((a,b)=>a.name.localeCompare(b.name,'es'));
 const shown=items.filter(i=>isInstitution?
  matchesSearch(query,i.name,i.type,i.venues.map(v=>v.city.name),i.careers.map(c=>c.name))&&(!city||i.venues.some(v=>v.city.slug===city))&&(!type||i.category===type)&&(!ownership||i.ownership===ownership):
  matchesSearch(query,i.name,i.offerings.map(o=>[o.institution.name,o.city.name]))&&i.offerings.some(o=>(!city||o.city.slug===city)&&(!institution||o.institution.slug===institution)&&(!modality||o.offering.modality===modality)));
 const pages=Math.max(1,Math.ceil(shown.length/24)),current=Math.min(page,pages),visible=shown.slice((current-1)*24,current*24);
 const change=setter=>e=>{setter(e.target.value);setPage(1);};
 const select=(label,value,setter,options)=><label><span>{label}</span><select aria-label={label} value={value} onChange={change(setter)}><option value="">Todas</option>{options.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></label>;
 const options=values=>unique(values).map(v=>({value:v,label:v}));
 const cityMatches=isInstitution&&query.trim()?cities.filter(c=>matchesSearch(query,c.name)):[];
 const careerMatches=isInstitution&&query.trim()?careers.filter(c=>matchesSearch(query,c.name)).slice(0,12):[];
 return <>
  <form className="catalog-filters" role="search" onSubmit={e=>e.preventDefault()}>
   <label><span>Buscar</span><input aria-label={isInstitution?'Buscar instituciones':'Buscar carreras'} type="search" placeholder={isInstitution?'Institución, ciudad o carrera...':'Carrera, ciudad o institución...'} value={query} onChange={change(setQuery)}/></label>
   {select('Ciudad',city,setCity,cityOptions.map(c=>({value:c.slug,label:c.name})))}
   {isInstitution?<>{select('Tipo',type,setType,options(items.map(i=>i.category)))}{select('Gestión',ownership,setOwnership,options(items.map(i=>i.ownership)))}</>:<>{select('Institución',institution,setInstitution,[...new Map(offers.map(o=>[o.institution.slug,o.institution])).values()].sort((a,b)=>a.name.localeCompare(b.name,'es')).map(i=>({value:i.slug,label:i.name})))}{select('Modalidad',modality,setModality,options(offers.map(o=>o.offering.modality)))}</>}
  </form>
  {cityMatches.length?<section className="catalog-search-related" aria-label="Ciudades encontradas"><h2>Ciudades</h2>{cityMatches.map(c=><Link key={c.slug} href={'/'+c.slug}>{c.name} →</Link>)}</section>:null}
  {careerMatches.length?<section className="catalog-search-related" aria-label="Carreras encontradas"><h2>Carreras</h2>{careerMatches.map(c=><Link key={c.slug} href={'/carreras/'+c.slug}>{c.name} →</Link>)}</section>:null}
  <p className="catalog-results-count" aria-live="polite">{shown.length} {isInstitution?'instituciones':'carreras'}</p>
  <section className={isInstitution?'institutions-index-grid':'careers-index-grid'}>
   {visible.map(i=>isInstitution?<Link href={`/instituciones/${i.slug}`} key={i.slug}><Image src={i.image} alt={i.imageAlt||''} width={640} height={400} loading="lazy" sizes="(max-width: 720px) 100vw, 33vw" unoptimized={!i.image.startsWith('/assets/catalog/')}/><div><small>{i.type}</small><h2>{i.name}</h2><p>{i.venues.length} {i.venues.length===1?'sede':'sedes'} en Tucumán</p><strong>Ver institución →</strong></div></Link>:<Link className="career-index-card" href={`/carreras/${i.slug}`} key={i.slug}>{i.image?<Image className="catalog-career-image" src={i.image} alt={i.imageAlt||''} width={640} height={400} loading="lazy" sizes="(max-width: 600px) 100vw, 33vw" unoptimized={!i.image.startsWith('/assets/catalog/')}/>:null}<span>{new Set(i.offerings.map(o=>o.institution.slug)).size} instituciones</span><h2>{i.name}</h2>{i.description?<p>{i.description}</p>:null}<strong>Ver carrera <b>→</b></strong></Link>)}
  </section>
  {!shown.length?<p role="status">No encontramos resultados con esos filtros.</p>:null}
  {pages>1?<nav className="catalog-pagination" aria-label="Páginas del catálogo"><button type="button" disabled={current===1} onClick={()=>setPage(current-1)}>Anterior</button><span>{current} / {pages}</span><button type="button" disabled={current===pages} onClick={()=>setPage(current+1)}>Siguiente</button></nav>:null}
 </>;
}
