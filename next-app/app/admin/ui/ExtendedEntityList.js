"use client";
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {archiveEntity,duplicateEntity} from '../(protected)/editor-actions';
import {canAdmin} from '../../../lib/admin/permissions.mjs';
import {EDITOR_TYPES} from '../../../lib/admin/editorial-model.mjs';
import {statusLabels} from './EntityList';
import s from '../workspace.module.css';
export default function ExtendedEntityList({type,result,q='',state='',city='',page=1,actor}){
 const router=useRouter(),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const {data:rows,count,extended,catalog}=result;
 async function action(row,duplicate=false){if(!duplicate&&!window.confirm('¿Archivar este contenido? Se conservarán sus versiones.'))return;setBusy(true);try{if(duplicate){const r=await duplicateEntity(row.id);router.push(`/admin/${type}/${r.document.id}`);}else{await archiveEntity(row.id);router.refresh();}}catch(e){setError(e.message);}finally{setBusy(false);}}
 const pagination=n=>'?' + new URLSearchParams({q,state,city,page:String(n)});
 return <><div className={s.pageHeading}><div><h1>{EDITOR_TYPES[type].label}</h1><p>Elegí qué querés actualizar.</p></div><div className={s.rowActions}>{type!=='capacitaciones'?<><Link className={s.secondary} href={`/admin/${type}/pagina`}>Editar página de {type==='eventos'?'Eventos':'Servicios'}</Link><Link className={s.primary} href={`/admin/${type}/nuevo`}>Crear {type==='eventos'?'evento':'servicio'}</Link></>:null}</div></div>
 <section className={s.card}><p role='alert'>{error}</p><form className={s.filters}><input name='q' defaultValue={q} aria-label='Buscar' placeholder='Buscar por nombre'/><select name='state' defaultValue={state} aria-label='Estado'><option value=''>Todos los estados</option>{Object.entries(statusLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>{type==='eventos'?<select name='city' defaultValue={city} aria-label='Ciudad'><option value=''>Todas las ciudades</option>{[...new Set(extended.events.map(e=>e.city))].map(c=><option key={c}>{c}</option>)}</select>:null}<button className={s.secondary}>Buscar</button></form>
 <div className={s.contentRows}>{rows.map(row=>{const d=row.draft.data,p=extended.trainings.find(p=>p.id===d.trainingProgramId),i=catalog.institutions.find(i=>i.id===d.institutionId),name=d.name||p?.name||d.certification;return <article className={s.contentRow} key={row.id}>{d.image?<img className={s.rowImage} src={d.image.replace('/media/cms/','/admin/media/')} alt=''/>:null}<div className={s.rowInfo}><h2>{name}</h2><p>{type==='servicios'?`Orden ${d.order??d.ordinal??'—'}`:`${d.city||i?.name||'GET'} · ${d.date||d.duration||''}`}</p><span className={s.badge}>{statusLabels[row.state]}</span></div><div className={s.rowActions}><Link className={s.primary} href={`/admin/${type}/${row.id}`}>Editar →</Link><details className={s.actionsMenu}><summary aria-label={`Más acciones de ${name}`}>⋯</summary><div><Link href={`/admin/vista-previa/modulos/${row.id}`} target='_blank'>Vista previa</Link><button disabled={busy} onClick={()=>action(row,true)}>Duplicar</button>{row.state!=='archived'&&canAdmin(actor,'archive')?<button disabled={busy} onClick={()=>action(row)}>Archivar</button>:null}</div></details></div></article>;})}</div>
 {!rows.length?<p className={s.empty}>No hay resultados.</p>:null}<footer className={s.pagination}><span>{count} resultados</span>{Number(page)>1?<Link href={pagination(Number(page)-1)}>Anterior</Link>:null}{Number(page)*25<count?<Link href={pagination(Number(page)+1)}>Siguiente</Link>:null}</footer></section></>;
}
