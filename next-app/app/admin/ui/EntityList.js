"use client";
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Icon from './Icon';
import {archiveEntity,duplicateEntity} from '../(protected)/editor-actions';
import {canAdmin} from '../../../lib/admin/permissions.mjs';
import s from '../workspace.module.css';
export const statusLabels={draft:'Borrador',published:'Publicado',pending_changes:'Cambios pendientes',archived:'Archivado'};
export default function EntityList({type,rows,count,catalog,actor,page=1,q='',state='',city='',institution='',featured='',modality=''}){
 const router=useRouter(),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const label={ciudades:'Ciudades',instituciones:'Instituciones',carreras:'Carreras'}[type];
 const pageHref=n=>`?${new URLSearchParams({q,state,city,institution,featured,modality,page:String(n)})}`;
 async function action(row,duplicate=false){
  if(!duplicate&&!window.confirm('¿Archivar este contenido? Dejará de mostrarse en el sitio. El historial se conserva.'))return;
  setBusy(true);try{
   if(duplicate){const result=await duplicateEntity(row.id);router.push(`/admin/${type}/${result.document.id}`);}
   else{await archiveEntity(row.id);router.refresh();}
  }catch{setNotice('No se pudo completar la acción. Revisá tus permisos.');}finally{setBusy(false);}
 }
 return <><div className={s.pageHeading}><div><h1>{label}</h1><p>{type==='ciudades'?'Elegí una ciudad y editá sus secciones en el orden de la página.':'Encontrá el contenido y abrí su editor.'}</p></div><Link href={`/admin/${type}/nuevo`} className={s.primary}><Icon name='plus'/>Agregar {type==='ciudades'?'ciudad':type==='instituciones'?'institución':'carrera'}</Link></div>
 <section className={s.card}><form className={s.filters} method='get'><label><Icon name='search'/><input name='q' defaultValue={q} placeholder='Buscar por nombre' aria-label='Buscar por nombre'/></label>
 {type!=='ciudades'?<select name='city' defaultValue={city} aria-label='Ciudad'><option value=''>Todas las ciudades</option>{catalog.cities.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>:null}
 {type==='carreras'?<select name='institution' defaultValue={institution} aria-label='Institución'><option value=''>Todas las instituciones</option>{catalog.institutions.filter(i=>!city||i.cityId===city).map(i=><option key={i.id} value={i.id}>{i.name} · {catalog.cities.find(c=>c.id===i.cityId)?.name}</option>)}</select>:null}
 <select name='state' defaultValue={state} aria-label='Estado'><option value=''>Todos los estados</option>{Object.entries(statusLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
 {type==='carreras'?<details className={s.filterDetails}><summary>Más filtros</summary><label>Modalidad<select name='modality' defaultValue={modality}><option value=''>Todas</option>{['Presencial','Virtual','Semipresencial'].map(m=><option key={m}>{m}</option>)}</select></label></details>:null}
 <button className={s.secondary}>Buscar</button></form>
 <div className={type==='ciudades'?s.cityGrid:s.contentRows}>{rows.map(row=>{
  const d=row.draft.data,inst=catalog.institutions.find(i=>i.id===(type==='instituciones'?d.id:d.institutionId)),master=catalog.careers.find(c=>c.id===d.careerId),brand=catalog.brands.find(b=>b.id===d.brandId);
  const name=d.name||brand?.name||master?.name||d.degree,cityName=catalog.cities.find(c=>c.id===(d.cityId||inst?.cityId))?.name;
  const publicHref=type==='ciudades'?`/${d.slug}`:type==='instituciones'?inst?`/${inst.citySlug}/${d.slug}`:null:inst&&master?`/${inst.citySlug}/${inst.slug}/carreras/${master.slug}`:null;
  const image=type==='ciudades'?d.heroImage||catalog.institutions.find(i=>i.cityId===d.id)?.image:type==='instituciones'?brand?.logoUrl||d.image:d.image;
  return <article className={type==='ciudades'?s.cityCard:s.contentRow} key={row.id}>
   {image?<img className={s.rowImage} src={image.replace('/media/cms/','/admin/media/')} alt=''/>:<span className={s.rowImage}><Icon name={type==='ciudades'?'city':'building'}/></span>}
   <div className={s.rowInfo}><h2>{name}</h2><p>{type==='ciudades'?`${catalog.institutions.filter(i=>i.cityId===d.id).length} instituciones`:type==='instituciones'?`${cityName||'Sede nueva'} · ${catalog.offerings.filter(o=>o.institutionId===d.id).length} carreras`:`${inst?.name||'Institución'} · ${cityName||''}`}</p>{type==='carreras'?<small>{d.modality} · {d.duration}</small>:null}<span className={`${s.badge} ${row.state==='published'?s.published:''}`}>{statusLabels[row.state]}</span></div>
   <div className={s.rowActions}><Link className={s.primary} href={`/admin/${type}/${row.id}`}>{type==='ciudades'?'Editar página':'Editar'} <Icon name='arrow' size={16}/></Link><details className={s.actionsMenu}><summary aria-label={`Más acciones de ${name}`}>⋯</summary><div>{publicHref&&['published','pending_changes'].includes(row.state)?<a href={publicHref} target='_blank' rel='noopener noreferrer'>Ver página</a>:null}<Link href={`/admin/vista-previa/${row.id}`} target='_blank'>Vista previa</Link><button disabled={busy} onClick={()=>action(row,true)}>Duplicar</button>{canAdmin(actor,'archive')&&row.state!=='archived'?<button disabled={busy} onClick={()=>action(row)}>Archivar</button>:null}</div></details></div>
  </article>;
 })}</div>
 {!rows.length?<div className={s.empty}><h3>No hay resultados</h3><p>Probá otra búsqueda o creá un borrador.</p></div>:null}
 <footer className={s.pagination}><span>{count} resultados</span>{page>1?<Link href={pageHref(page-1)}>Anterior</Link>:null}{page*25<count?<Link href={pageHref(page+1)}>Siguiente</Link>:null}</footer><p role='status'>{notice}</p></section></>;
}
