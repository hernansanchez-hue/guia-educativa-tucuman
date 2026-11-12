"use client";
/* eslint-disable @next/next/no-img-element */
import {useState} from 'react';
import Link from 'next/link';
import {mediaDisplayUrl} from '../../../lib/admin/media-validation.mjs';
import ServiceHero from '../../components/ServiceHero';
import '../../servicios/servicios.css';
import s from '../workspace.module.css';
export default function BannerIndex({rows}){
 const [q,setQ]=useState(''),[kind,setKind]=useState(''),[state,setState]=useState('');
 const shown=rows.filter(r=>(!kind||r.kind===kind)&&(!state||r.state===state)&&r.name.toLowerCase().includes(q.toLowerCase()));
 return <section><div className={s.pageHeading}><div><span className={s.eyebrow}>CONTENIDO</span><h1>Banners</h1><p>Acceso a los heroes reales. Cada banner conserva su variante y su único documento editorial.</p></div></div><div className={s.filters}><label>Buscar<input value={q} onChange={e=>setQ(e.target.value)}/></label><label>Tipo<select value={kind} onChange={e=>setKind(e.target.value)}><option value=''>Todos</option>{[...new Set(rows.map(r=>r.kind))].map(k=><option key={k}>{k}</option>)}</select></label><label>Estado<select value={state} onChange={e=>setState(e.target.value)}><option value=''>Todos</option>{[...new Set(rows.map(r=>r.state))].map(k=><option key={k} value={k}>{({published:'Publicado',draft:'Borrador',pending_changes:'Cambios pendientes',archived:'Archivado'})[k]}</option>)}</select></label></div><div className={s.assetGrid}>{shown.map(r=><article key={r.id} className={s.card}>{r.image?<img className={s.mediaThumb} src={mediaDisplayUrl(r.image)} alt={r.name}/>:r.visual?<div className={s.mediaThumb} style={{height:150,overflow:'hidden',background:'#10244a'}} aria-label={`Banner de ${r.name}`}><div style={{width:1000,transform:'scale(.24)',transformOrigin:'top left'}}><ServiceHero title={r.name} description={r.description} visual={r.visual}/></div></div>:<div className={s.mediaThumb}>Hero editorial</div>}<strong>{r.name}</strong><p>{r.kind} · {({published:'Publicado',draft:'Borrador',pending_changes:'Cambios pendientes',archived:'Archivado'})[r.state]}</p><small>Última edición: {new Date(r.updated).toLocaleDateString('es-AR')}</small><p><Link className={s.secondary} href={r.href+'?tab=Hero'}>Editar banner y preview</Link></p></article>)}</div></section>;
}
