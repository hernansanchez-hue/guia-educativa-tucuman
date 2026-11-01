"use client";
import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import NetworkBackground from '../NetworkBackground';
import PublicFooter from '../PublicFooter';
import {usePublicEditorial} from '../PublicEditorialContext';
import {DesignDialog} from '../ApprovedHomeUI';
import './shared.css';
import {icons} from './reference-fragments';

export function Icon({name='arrow-up'}) {
 const aliases={'arrow-up':'arrow','arrow-down':'chevron','arrow-left':'previous','arrow-right':'next',building:'school',graduation:'cap',people:'school',compass:'spark',message:'book',calendar:'school',clock:'pause',monitor:'school',info:'spark',plus:'spark',close:'spark',menu:'book',eye:'search',route:'arrow',social:'spark',tools:'school',target:'spark',mic:'book',mail:'book',link:'arrow',sliders:'pause',check:'chevron',lock:'school',scales:'school',share:'arrow',copy:'book'};
 return <i><svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{__html:icons[name]||icons[aliases[name]]||icons['arrow-up']}}/></i>;
}
export {DesignDialog as Dialog};
export const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function whatsappUrl(number,message='') {const n=String(number||'').replace(/\D/g,'');return n?`https://wa.me/${n.startsWith('54')?n:'54'+n}${message?'?text='+encodeURIComponent(message):''}`:null;}
export function useGetContact(){const f=usePublicEditorial('footer');return message=>`${f.whatsappHref||'https://wa.me/5493865751273'}?text=${encodeURIComponent(message)}`;}
export function tabKeys(event){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;const tabs=[...(event.target.closest('[role="tablist"]')||event.currentTarget).querySelectorAll('[role="tab"]')];const i=tabs.indexOf(event.target);if(i<0)return;event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;tabs[n].focus();tabs[n].click();}
export function DesignShell({kind,city,children,paid=false}){
 const [open,setOpen]=useState(false),[paused,setPaused]=useState(false);const nav=usePublicEditorial('navigation'),footer=usePublicEditorial('footer');const pathname=usePathname();
 return <><div className={`get-approved design-${kind} ${paid?'paid':'free'} ${paused?'motion-paused':''}`}>
  <NetworkBackground className="design-network" paused={paused} lineIntensity={2.3}/><Link className="skip" href="#contenido">Ir al contenido</Link>
  <header className="header" id="inicio"><Link className="brand" href={city?`/${city.slug}`:'/'} aria-label="GET — Inicio"><img src={nav.logo||footer.logo} alt="Guía Educativa Tucumán" width="142" height="54"/></Link>
   <nav id="approved-nav" aria-label="Navegación principal" className={open?'open':''}>{nav.items.filter(x=>x.visible!==false).map(item=><Link key={item.id} href={item.contextual&&city?`/${city.slug}`:item.href} className={pathname===item.href||(item.href==='/instituciones'&&city)?'active':undefined} aria-current={pathname===item.href?'page':undefined} onClick={()=>setOpen(false)}>{item.label}</Link>)}</nav>
   <div className="header-end">{city?<Link className="city-choice" href={`/${city.slug}`}><Icon name="pin"/>{city.name}</Link>:null}<Link className="button navy" href={nav.courseHref}>{nav.courseLabel}<Icon/></Link></div>
   <button className="menu-toggle icon-button" aria-label={open?'Cerrar menú':'Abrir menú'} aria-expanded={open} aria-controls="approved-nav" onClick={()=>setOpen(!open)}><Icon name="menu"/></button>
  </header>
  <div id="contenido">{children}</div>
  <div className="wrap motion-control"><button className="text-button" aria-pressed={paused} onClick={()=>setPaused(!paused)}><Icon name={paused?'play':'pause'}/>{paused?'Activar movimiento':'Pausar movimiento'}</button></div>
 </div><PublicFooter/></>;
}
export function Logo({institution}){const src=institution.logoUrl||(institution.slug==='universidad-siglo-21'?'/assets/universidad-siglo-21-logo.png':institution.slug==='instituto-santa-barbara'?'/assets/approved/about/santa-logo.png':/^https?:|^\//.test(institution.logo||'')?institution.logo:null);return src?<img src={src} alt={institution.name} width="140" height="85"/>:<span className="logo-text">{institution.name}</span>;}
export function EmptyPhoto({label='Fotografía de la sede pendiente'}){return <div className="empty-photo"><Icon name="building"/><span>{label}</span></div>;}
// Never attribute stock imagery to an actual campus. Explicit CMS verification is required.
export function campusImages(i){return (i.verifiedGallery||[]).map(x=>typeof x==='string'?x:x.url).filter(Boolean).concat(i.imageVerified===true&&i.image?[i.image]:[]);}
export function Location({institution,city,id='ubicacion'}){
 const address=institution.address;const conflict=city.slug!=='concepcion'&&/concepci[oó]n/i.test(address||'');const usable=Boolean(address)&&!conflict;
 const query=[institution.name,address,city.name,'Tucumán'].filter(Boolean).join(', '),maps=usable?(institution.mapsUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`):null;
 return <section className="location-section" id={id}><div className="location-copy"><p className="eyebrow">ESTAMOS CERCA</p><h2>Vení a conocernos<span className="gold-dot">.</span></h2><p className="address"><Icon name="pin"/><span><strong>{usable?address:'Dirección de la sede a confirmar'}</strong><br/>{city.name}, Tucumán</span></p><p>{institution.hours||institution.openingHours||'Consultá los horarios de atención antes de acercarte.'}</p>{maps?<Link className="button outline" href={maps} target="_blank" rel="noopener">Cómo llegar <Icon/></Link>:<Link className="text-button" href="#consulta">Consultar ubicación <Icon/></Link>}</div><div className="map-panel">{usable?<><iframe title={`Ubicación publicada de ${institution.name} en ${city.name}`} src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><Link href={maps} target="_blank" rel="noopener">Abrir en Google Maps <Icon/></Link></>:<EmptyPhoto label="Ubicación exacta pendiente de verificación"/>}</div></section>;
}
