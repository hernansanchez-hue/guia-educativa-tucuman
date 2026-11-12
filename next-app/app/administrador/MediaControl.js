'use client';
import Image from 'next/image';
import EditorialIcon from './EditorialIcon';
import {useEffect,useRef,useState} from 'react';
import {Library} from './Tools';
import {previewUrl} from './media-options.mjs';

export function MediaControl({field,label,value,onChange,onChoose}){
  const gallery=field==='gallery',pdf=field==='studyPlanPdf';
  const rows=gallery?(value||[]):value?[value]:[];
  const [link,type]=useState('');
  const select=()=>onChoose(pdf?'pdf':'image',src=>onChange(gallery?[...new Set([...rows.filter(Boolean),src])]:src));
  return <div className="gc-media-field"><strong>{label}</strong>
    {!!rows.length&&<div className="gc-media-strip">{rows.map((src,i)=><div className="gc-media-tile" key={src+'-'+i}>
      {pdf?<a href={previewUrl(src)} target="_blank" rel="noreferrer">Abrir PDF ↗</a>:<Image unoptimized src={previewUrl(src)} width={180} height={112} alt={label+' '+(i+1)} referrerPolicy="no-referrer"/>}
      <button className="gc-text" type="button" aria-label={'Quitar '+label+' '+(i+1)} onClick={()=>onChange(gallery?rows.filter((_,n)=>n!==i):'')}>Quitar</button></div>)}</div>}
    <button className="secondary" type="button" onClick={select}><EditorialIcon name="image"/>{pdf?(rows.length?'Cambiar PDF':'Elegir PDF'):gallery?'Agregar imagen':rows.length?'Cambiar imagen':'Elegir imagen'}</button>
    <details className="gc-external-url"><summary>Usar un enlace existente</summary><label>Dirección del {pdf?'PDF':'recurso'}<input value={link} onChange={e=>type(e.target.value)} placeholder="https://…"/></label><button className="secondary" type="button" disabled={!/^(?:https:\/\/|\/(?!\/))[^<>\s\\]+$/.test(link.trim())||pdf&&!/\.pdf(?:[?#]|$)/i.test(link.trim())} onClick={()=>{const src=link.trim();onChange(gallery?[...new Set([...rows,src])]:src);type('');}}>Usar enlace</button></details>
  </div>;
}
export function MediaDialog({kind,catalogAssets,onClose,onPick}){
  const ref=useRef(null);
  useEffect(()=>{const d=ref.current;if(!d.open)d.showModal();return()=>{if(d.open)d.close();};},[]);
  return <dialog ref={ref} className="gc-picker gc-visual-picker" aria-label={kind==='pdf'?'Seleccionar PDF':'Seleccionar imagen'} onCancel={e=>{e.preventDefault();onClose();}}><button type="button" className="secondary gc-close-picker" onClick={onClose}>Cerrar ✕</button><Library kind={kind} catalogAssets={catalogAssets} onPick={onPick}/></dialog>;
}
