"use client";

import {useRef,useState,useId,useSyncExternalStore} from "react";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import NetworkBackground from "../NetworkBackground";
import PublicFooter from "../PublicFooter";
import {usePublicEditorial} from "../PublicEditorialContext";
import {DesignIcon,DesignDialog} from "../ApprovedHomeUI";
import {isPublicNavigationItemActive} from "../../data/publicSiteContent";
import "./eight-design.css";

const motionQuery="(prefers-reduced-motion: reduce)";
const reducedSnapshot=()=>window.matchMedia(motionQuery).matches;
const subscribeMotion=notify=>{const media=window.matchMedia(motionQuery);media.addEventListener("change",notify);return ()=>media.removeEventListener("change",notify);};
// One shared frame for the eight approved public templates; not a second site.
export default function EightDesignShell({children}) {
 const navigation=usePublicEditorial("navigation"),footer=usePublicEditorial("footer");
 const pathname=usePathname(),router=useRouter(),menuId=useId();
 const [open,setOpen]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState(""),[paused,setPaused]=useState(false);
 const menuButton=useRef(null);
 const reduced=useSyncExternalStore(subscribeMotion,reducedSnapshot,()=>false);
 const items=navigation.items.filter(item=>item.visible!==false);
 function closeMenu(event){if(event.key==="Escape"){setOpen(false);menuButton.current?.focus();}}
 function submitSearch(event){
  event.preventDefault();
  const target=event.nativeEvent.submitter?.value==="careers"?"/carreras":"/instituciones";
  setSearch(false);router.push(target+"?buscar="+encodeURIComponent(query.trim()));
 }
 const links=items.map(item=><Link key={item.id} href={item.href==="/ciudades"?"/":item.href} aria-current={isPublicNavigationItemActive(item,pathname)?"page":undefined} onClick={()=>setOpen(false)}>{item.label}</Link>);
 return <><div className="get-eight">
  <NetworkBackground className="eight-network" paused={paused}/>
  <a className="skip" href="#principal">Ir al contenido</a>
  <header className="topbar" onKeyDown={closeMenu}>
   <Link className="logo" href="/" aria-label="GET — Inicio"><img src={navigation.logo||footer.logo} alt="Guía Educativa Tucumán" width="115" height="46"/></Link>
   <nav aria-label="Principal">{links}</nav>
   <div className="tools">
    <Link className="city-link" href="/#ciudades">⌖ Tucumán</Link>
    <button className="search-open" type="button" aria-label="Buscar carreras e instituciones" onClick={()=>setSearch(true)}><DesignIcon name="search"/></button>
    <Link className="course-link" href={navigation.courseHref}>{navigation.courseLabel} <span aria-hidden="true">↗</span></Link>
    <button ref={menuButton} className="menu-btn" type="button" aria-label={open?"Cerrar menú":"Abrir menú"} aria-expanded={open} aria-controls={menuId} onClick={()=>setOpen(!open)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{open?<path d="m6 6 12 12M18 6 6 18"/>:<path d="M4 7h16M4 12h16M4 17h16"/>}</svg></button>
   </div>
   <nav id={menuId} className="mobile-nav" aria-label="Menú móvil" hidden={!open}>{links}<Link href="/#ciudades" onClick={()=>setOpen(false)}>Elegir ciudad</Link></nav>
  </header>
<div id="principal" tabIndex={-1}>{children}</div>
<button className="motion" type="button" aria-pressed={reduced||paused} disabled={reduced} title={reduced?"La preferencia de movimiento reducido del sistema está activa":undefined} onClick={()=>setPaused(!paused)}><DesignIcon name={reduced||paused?"play":"pause"}/>{reduced?"Movimiento reducido":paused?"Activar fondo":"Pausar fondo"}</button>
  <DesignDialog open={search} onClose={()=>setSearch(false)} title="¿Qué querés encontrar?" id="eight-search">
   <form className="eight-search" onSubmit={submitSearch} role="search">
    <label>Buscar carreras o instituciones<input type="search" autoFocus required maxLength={160} autoComplete="off" value={query} onChange={e=>setQuery(e.target.value)} placeholder={navigation.searchPlaceholder}/></label>
    <div className="eight-search-actions"><button className="button" type="submit" value="institutions">Buscar instituciones</button><button className="button gold" type="submit" value="careers">Buscar carreras</button></div>
   </form>
  </DesignDialog>
 </div><PublicFooter/></>;
}

