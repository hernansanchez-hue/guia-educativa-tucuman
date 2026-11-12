'use client';
import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {previewUrl} from './media-options.mjs';

function Thumbnail({src,empty}) {
  return src ? <Image unoptimized className="gc-row-image" src={previewUrl(src)} width={68} height={50} alt="" referrerPolicy="no-referrer"/> :
    <span className="gc-row-placeholder" aria-hidden="true">{empty}</span>;
}
export default function CityComposer({actionTarget, m, slider, values, set, pick, initial, focus, Field, goPreview, canEdit}) {
  const k=slider?'slides':'placements', rows=values[k]||[],options=m.slideOptions||[],venues=m.venues||[];
  const [open,expand]=useState(!slider?initial||'':''),[adding,showAdd]=useState(!slider&&!!initial&&!rows.some(x=>x.id===initial));
  const [venue,chooseVenue]=useState(!slider?initial||'':''),[pos,position]=useState(''),[search,find]=useState('');
  const editRef=useRef(null),addRef=useRef(null);
  const replace=a=>set(k,a);
  const setOpen=id=>{expand(old=>old===id?'':id);focus(id);};
  const selected=rows.find(r=>r.id===open);
  useEffect(()=>{if(open&&editRef.current&&!slider&&initial===open) editRef.current.scrollIntoView({block:'nearest'});},[open,initial,slider]);
  const openNewSlide=()=>{
    const id=crypto.randomUUID();
    replace([...rows,{id,institutionId:'',careerId:'',title:'',description:'',image:'',href:'',ctaLabel:'Conocer la carrera',active:true}]);
    expand(id);focus(id);
    requestAnimationFrame(()=>document.getElementById('gc-edit-'+id)?.focus());
  };
  const arrange=(i,d)=>{const next=i+d;if(next<0||next>=rows.length)return;const a=rows.slice();[a[i],a[next]]=[a[next],a[i]];replace(a);};
  const remove=(x,i)=>{if(!confirm(slider?'¿Retirar esta diapositiva? La carrera seguirá en el catálogo.':'¿Quitar esta institución de destacados? Su plan y su ficha se conservan.'))return;
    replace(rows.filter((_,n)=>n!==i));if(open===x.id)expand('');};
  const addPlacement=()=>{
    if(!venues.some(v=>v.id===venue&&v.visible)||rows.some(r=>r.id===venue))return;
    const idx=Number(pos||rows.length+1)-1;if(!Number.isInteger(idx)||idx<0||idx>rows.length)return;
    const a=rows.slice();a.splice(idx,0,{id:venue,active:true});replace(a);expand(venue);focus(venue);showAdd(false);chooseVenue('');position('');
  };
  const menu=slider?'+ Nueva diapositiva':'+ Agregar institución';
  return <div className="gc-composer">
    <div className="gc-composer-toolbar"><span><strong>{rows.length}</strong> {slider?'diapositivas':'instituciones'} · {rows.filter(r=>r.active).length} visibles</span>
    {actionTarget&&canEdit&&createPortal(<button type="button" className="gc-context-action" disabled={slider&&!options.length} onClick={slider?openNewSlide:()=>{showAdd(!adding);requestAnimationFrame(()=>addRef.current?.focus());}}>{menu}</button>,actionTarget)}</div>
    {!slider&&adding&&canEdit&&<div className="gc-creation-inset"><strong>Agregar a destacados en {m.title}</strong>
      <label>Buscar institución<input ref={addRef} value={search} onChange={e=>find(e.target.value)} placeholder="Escribí un nombre"/></label>
      <label>Institución *<select value={venue} onChange={e=>chooseVenue(e.target.value)}><option value="">Elegí una institución</option>{venues.filter(v=>v.visible&&!rows.some(r=>r.id===v.id)&&(v.id===venue||v.name.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')))).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
      <label>Posición<input type="number" min={1} max={rows.length+1} value={pos} placeholder={String(rows.length+1)} onChange={e=>position(e.target.value)}/></label>
      <div className="gc-tools"><button disabled={!venue||!Number.isInteger(Number(pos||rows.length+1))||Number(pos||rows.length+1)<1||Number(pos||rows.length+1)>rows.length+1} onClick={addPlacement}>Confirmar en el borrador</button><button className="secondary" onClick={()=>showAdd(false)}>Cancelar</button></div>
      <small>Se usa la ficha existente; no cambia el plan.</small></div>}
    {slider&&!options.length&&<div className="gc-ux-empty"><strong>Primero vinculá una carrera a una sede de esta ciudad.</strong><p>La diapositiva necesita una ficha pública real como destino.</p>{canEdit&&<Link href="/administrador?section=ofertas&new=oferta">Crear una oferta académica →</Link>}</div>}
    {!rows.length&&<div className="gc-ux-empty"><strong>{slider?'Este slider no tiene diapositivas.':'Todavía no hay instituciones destacadas.'}</strong><p>{slider?'Podés crear la primera sin duplicar una carrera.':'Elegí una sede existente para darle una posición en esta ciudad.'}</p></div>}
    <div className="gc-composer-list">{rows.map((x,i)=>{
      const v=venues.find(v=>v.id===(slider?x.institutionId:x.id)),opt=slider?options.find(o=>o.institutionId===x.institutionId&&o.careerId===x.careerId&&o.href===x.href):null;
      const label=slider?x.title||'Nueva diapositiva':x.displayName||v?.name||'Institución';
      const upd=changes=>replace(rows.map((o,n)=>n===i?{...o,...changes}:o));
      const chooseCareer=id=>{const r=options.find(o=>o.id===id&&o.institutionId===x.institutionId);if(r)upd({careerId:r.careerId,href:r.href,title:x.title||r.careerName||r.title,description:x.description||r.description||'',image:x.image||r.image||''});};
      return <article key={x.id} className={'gc-composer-row'+(open===x.id?' opened':'')}>
        <div className="gc-composer-summary"><span className="gc-position">{String(i+1).padStart(2,'0')}</span><Thumbnail src={x.image||(!slider&&v?.image)} empty={slider?'▶':'GET'}/><div><strong>{label}</strong><small>{slider?v?.name||'Sin institución vinculada':v?.name||m.title}</small></div><span className={'gc-badge '+(x.active?'live':'')}>{x.active?'Visible':'Oculta'}</span></div>
        <div className="gc-composer-actions"><button type="button" className="gc-text" aria-expanded={open===x.id} onClick={()=>setOpen(x.id)}>{open===x.id?'Cerrar':canEdit?'Editar':'Ver detalle'}</button>
        <button type="button" className="gc-text" onClick={()=>{focus(x.id);goPreview();}}>Vista previa</button>{!slider&&v?.url&&v.visible&&<a href={v.url} target="_blank" rel="noreferrer">Ficha pública ↗</a>}
        {canEdit&&<div className="gc-row-order"><button className="secondary" aria-label={'Subir '+label} disabled={!i} onClick={()=>arrange(i,-1)}>↑</button><button className="secondary" aria-label={'Bajar '+label} disabled={i===rows.length-1} onClick={()=>arrange(i,1)}>↓</button></div>}</div>
        {open===x.id&&<fieldset ref={editRef} className="gc-fields gc-row-edit" disabled={!canEdit}><legend className="gc-sr">{label}</legend>
          {slider?<><label>Institución *<select id={'gc-edit-'+x.id} value={x.institutionId||''} onChange={e=>upd({institutionId:e.target.value,careerId:'',href:''})}><option value="">Seleccioná la institución</option>{venues.filter(v=>options.some(o=>o.institutionId===v.id)).map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
          <label>Carrera vinculada *<select disabled={!x.institutionId} value={opt?.id||''} onChange={e=>chooseCareer(e.target.value)}><option value="">Seleccioná la carrera</option>{options.filter(o=>o.institutionId===x.institutionId).map(o=><option key={o.id} value={o.id}>{o.careerName||o.title}{o.modality?' · '+o.modality:''}</option>)}</select></label>
          <Field k="title" label="Título de la diapositiva *" value={x.title} set={v=>upd({title:v})} pick={pick}/>
          <Field k="ctaLabel" label="Texto del botón *" value={x.ctaLabel} set={v=>upd({ctaLabel:v})} pick={pick}/>
          {x.href&&<a href={x.href} target="_blank" rel="noreferrer">Ver destino del botón ↗</a>}</>:<Field k="displayName" label="Nombre visible en la tarjeta" value={x.displayName} set={v=>upd({displayName:v})} pick={pick}/>}
          {!slider&&<small>Nombre oficial: {v?.name}. El cambio se aplica solo a esta tarjeta.</small>}
          <Field k="description" label="Descripción" value={x.description} set={v=>upd({description:v})} pick={pick}/>
          <Field k="image" label={slider?'Fotografía *':'Fotografía de la tarjeta'} value={x.image} set={v=>upd({image:v})} pick={pick}/>
          <label className="gc-check"><input type="checkbox" checked={x.active} onChange={e=>upd({active:e.target.checked})}/> Visible al publicar</label>
          {canEdit&&<button type="button" className="gc-text gc-danger" onClick={()=>remove(x,i)}>{slider?'Retirar diapositiva':'Quitar de destacados'}</button>}
        </fieldset>}
      </article>;
    })}</div>
    {slider&&selected&&!selected.careerId&&<small>Elegí una institución y su carrera para ver la diapositiva en el slider.</small>}
  </div>;
}
