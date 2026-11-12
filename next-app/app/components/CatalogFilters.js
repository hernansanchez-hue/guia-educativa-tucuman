"use client";
import {useRef,useState} from 'react';
import Link from 'next/link';
import PublicImage from './PublicImage';
import {matchesSearch} from '../../lib/catalog/search.mjs';
import {directoryPage,filterDirectory} from '../../lib/catalog/directory-filters.mjs';

/** Compact published projections only: no curricula, drafts or private payloads. */
export default function CatalogFilters({kind,items,cities=[],careers=[],initialQuery='',initialCity='',initialFilters={}}){
 const [query,setQuery]=useState(initialQuery),[city,setCity]=useState(initialFilters.city||initialCity),[type,setType]=useState(initialFilters.type||''),[ownership,setOwnership]=useState(initialFilters.ownership||''),[institution,setInstitution]=useState(initialFilters.institution||''),[modality,setModality]=useState(initialFilters.modality||''),[page,setPage]=useState(initialFilters.page||1);
 const queryRef=useRef(null),countRef=useRef(null);
 const isInstitution=kind==='institutions',offers=items.flatMap(i=>i.offerings||[]);
 const unique=values=>[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const cityOptions=[...new Map((isInstitution?items.flatMap(i=>i.venues.map(v=>v.city)):offers.map(o=>o.city).filter(c=>c.slug)).map(c=>[c.slug,c])).values()].sort((a,b)=>a.name.localeCompare(b.name,'es'));
 const shown=filterDirectory(items,kind,{query,city,type,ownership,institution,modality});
 const {pages,current,visible}=directoryPage(shown,page);
 const change=setter=>e=>{setter(e.target.value);setPage(1);};
 const select=(label,value,setter,options)=><label><span>{label}</span><select aria-label={label} value={value} onChange={change(setter)}><option value="">Todas</option>{options.map(v=><option key={v.value} value={v.value}>{v.label}</option>)}</select></label>;
 const options=values=>unique(values).map(v=>({value:v,label:v}));
 const cityMatches=isInstitution&&query.trim()?cities.filter(c=>matchesSearch(query,c.name)):[];
 const careerMatches=isInstitution&&query.trim()?careers.filter(c=>matchesSearch(query,c.name)).slice(0,12):[];
 const reset=()=>{setQuery('');setCity('');setType('');setOwnership('');setInstitution('');setModality('');setPage(1);queryRef.current?.focus();};
 const move=next=>{setPage(next);countRef.current?.focus({preventScroll:true});countRef.current?.scrollIntoView({block:'start'});};
 return <>
  <form className="catalog-filters" role="search" onSubmit={e=>{e.preventDefault();setPage(1);}}>
   <label><span>Buscar</span><input ref={queryRef} aria-label={isInstitution?'Buscar instituciones':'Buscar carreras'} type="search" placeholder={isInstitution?'Institución, ciudad o carrera...':'Carrera, ciudad o institución...'} value={query} onChange={change(setQuery)}/></label>
   {select('Ciudad',city,setCity,cityOptions.map(c=>({value:c.slug,label:c.name})))}
   {isInstitution?<>{select('Tipo',type,setType,options(items.map(i=>i.category)))}{select('Gestión',ownership,setOwnership,options(items.map(i=>i.ownership)))}</>:<>{select('Institución',institution,setInstitution,[...new Map(offers.map(o=>[o.institution.slug,o.institution])).values()].sort((a,b)=>a.name.localeCompare(b.name,'es')).map(i=>({value:i.slug,label:i.name})))}{select('Modalidad',modality,setModality,options(offers.map(o=>o.offering.modality)))}</>}
  </form>
  {cityMatches.length?<section className="catalog-search-related" aria-label="Ciudades encontradas"><h2>Ciudades</h2><div className="related-institutions">{cityMatches.map(c=><Link key={c.slug} href={'/'+c.slug}>{c.name} →</Link>)}</div></section>:null}
  {careerMatches.length?<section className="catalog-search-related" aria-label="Carreras encontradas"><h2>Carreras</h2><div className="related-institutions">{careerMatches.map(c=><Link key={c.slug} href={'/carreras/'+c.slug}>{c.name} →</Link>)}</div></section>:null}
  <p className="catalog-results-count" aria-live="polite" ref={countRef} tabIndex={-1}>{shown.length} {isInstitution?(shown.length===1?'institución':'instituciones'):(shown.length===1?'carrera':'carreras')}</p>
  <section className={isInstitution?'institutions-index-grid':'careers-index-grid'} aria-label={isInstitution?'Resultados de instituciones':'Resultados de carreras'}>
   {visible.map((i,index)=>isInstitution?<Link href={`/instituciones/${i.slug}`} prefetch={false} key={i.slug}>{i.image?<PublicImage src={i.image} alt={i.imageAlt||''} width={124} height={148} loading={index===0?'eager':'lazy'} sizes="62px"/>:null}<div><small>{i.type}</small><h2>{i.name}</h2><p>{i.venues.length} {i.venues.length===1?'sede':'sedes'} en Tucumán</p><strong>Ver institución ↗</strong></div></Link>:<Link className="career-index-card" href={`/carreras/${i.slug}`} prefetch={false} key={i.slug}>{i.image?<PublicImage className="career-thumb" src={i.image} alt={i.imageAlt||''} width={140} height={148} loading={index===0?'eager':'lazy'} sizes="70px"/>:null}<span>{new Set(i.offerings.map(o=>o.institution.slug)).size} {new Set(i.offerings.map(o=>o.institution.slug)).size===1?'institución':'instituciones'}</span><h2>{i.name}</h2>{i.description?<p>{i.description}</p>:null}<strong>Ver carrera <b>↗</b></strong></Link>)}
   {!shown.length?<div className="empty" role="status"><p>No encontramos resultados con esos filtros.</p><button className="reset" type="button" onClick={reset}>Limpiar filtros</button></div>:null}
  </section>
  {shown.length>0?<nav className="catalog-pagination" aria-label="Páginas del catálogo"><button type="button" disabled={current===1} onClick={()=>move(current-1)}>Anterior</button><span>{current} / {pages}</span><button type="button" disabled={current===pages} onClick={()=>move(current+1)}>Siguiente</button></nav>:null}
 </>;
}
