'use client';
import Link from 'next/link';
import {useState} from 'react';

export default function InstitutionCareers({model,selected,change,onlyFeatured,canEdit}){
  const [query,search]=useState('');
  const offers=model.offers||[];
  const chosen=selected.map(id=>offers.find(o=>o.id===id||o.careerId===id)).filter(Boolean);
  const matches=(o)=>!query||o.name.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'));
  const url=(o,preview=false)=>'/administrador?'+new URLSearchParams({section:'ofertas',key:o.key,...(preview?{tab:'Vista previa'}:{})});
  const add=(offer)=>{if(!model.paid||chosen.length>=5||chosen.some(o=>o.careerId===offer.careerId))return;change([...selected,offer.id]);};
  const move=(i,step)=>{const next=selected.slice();[next[i],next[i+step]]=[next[i+step],next[i]];change(next);};
  function links(o){return <><Link href={url(o)}>{canEdit?'Editar página':'Ver página en el editor'}</Link><Link href={url(o,true)}>Vista previa</Link></>;}
  return <div className="gc-offer-management"><div className="gc-composer-toolbar"><strong>{onlyFeatured?(chosen.length+' / '+(model.paid?5:0)+' destacadas'):offers.length+' ofertas en la sede'}</strong>{canEdit&&!model.unpublished&&<Link className="gc-link gc-add-offer" href={'/administrador?'+new URLSearchParams({section:'ofertas',new:'oferta',venue:model.id})}>+ Agregar carrera</Link>}</div>
    {model.unpublished&&<p>Publicá la nueva sede antes de vincular una oferta.</p>}
    {onlyFeatured&&<><p>{model.paid?'El orden de esta lista es el orden de las tarjetas de la ficha pública.':'Este perfil no tiene habilitadas tarjetas destacadas. Su plan se conserva.'}</p>
      {chosen.map((o,n)=><div key={o.id} className="gc-offer-row"><span className="gc-position">{String(n+1).padStart(2,'0')}</span><div><strong>{o.name}</strong><small>{o.modality||'Oferta de la sede'}</small><div className="gc-inline-links">{links(o)}</div></div>
        {canEdit&&<div className="gc-row-order"><button className="secondary" aria-label={'Subir '+o.name} disabled={!n} onClick={()=>move(n,-1)}>↑</button><button className="secondary" aria-label={'Bajar '+o.name} disabled={n===chosen.length-1} onClick={()=>move(n,1)}>↓</button><button type="button" className="gc-text" onClick={()=>change(selected.filter(id=>id!==o.id&&id!==o.careerId))}>Quitar de destacados</button></div>}</div>)}</>}
    <label>Buscar carrera de la sede<input type="search" value={query} onChange={e=>search(e.target.value)} placeholder="Nombre de la carrera"/></label>
    {offers.filter(o=>matches(o)&&(!onlyFeatured||!chosen.some(c=>c.id===o.id))).map(o=>{const same=chosen.some(c=>c.careerId===o.careerId);return <div key={o.id} className="gc-offer-row"><div><strong>{o.name}</strong><small>{o.modality||'Modalidad no informada'} · {o.dirty?'Borrador':o.visible?'Publicada':'Oculta'}</small><div className="gc-inline-links">{links(o)}</div></div>{canEdit&&model.paid&&!same&&o.visible&&<button className="secondary" disabled={chosen.length>=5} onClick={()=>add(o)}>Destacar carrera</button>}{!onlyFeatured&&same&&<span className="gc-badge live">Destacada</span>}</div>;})}
    {!offers.length&&<p>Esta sede todavía no tiene ofertas académicas.</p>}
    {query&&!offers.some(matches)&&<p>No hay carreras que coincidan con la búsqueda.</p>}
  </div>;
}
