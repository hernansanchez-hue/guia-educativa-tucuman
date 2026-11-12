"use client";
import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import Icon from './Icon';
import s from '../workspace.module.css';
const subscribeViewport=notify=>{window.addEventListener('resize',notify);return ()=>window.removeEventListener('resize',notify);};
const viewportDevice=()=>window.innerWidth<=600?'Móvil':window.innerWidth<=1024?'Tablet':'Desktop';
const serverDevice=()=> 'Desktop';
export default function LivePreview({id,parts,activeField='',onSelect,full=false,src}){
 const [choice,setDevice]=useState(null),[width,setWidth]=useState(500),[height,setHeight]=useState(620),[ready,setReady]=useState(false);const holder=useRef(),frame=useRef(),popup=useRef();
 const automaticDevice=useSyncExternalStore(subscribeViewport,viewportDevice,serverDevice),device=choice||(full?automaticDevice:'Desktop');
 const viewport={Desktop:1440,Tablet:768,'Móvil':390}[device],scale=Math.min(1,width/viewport);
 useEffect(()=>{const o=new ResizeObserver(entries=>{const rect=entries[0].contentRect;if(rect.width>0)setWidth(rect.width);if(rect.height>0)setHeight(rect.height);});if(holder.current)o.observe(holder.current);return ()=>o.disconnect();},[]);
 useEffect(()=>{function receive(e){if(e.origin!==location.origin||(e.source!==frame.current?.contentWindow&&e.source!==popup.current))return;if(e.data?.id!==id)return;if(e.data.type==='cms:ready'){setReady(true);e.source.postMessage({type:'cms:update',id,parts,activeField},location.origin);}if(e.data.type==='cms:select')onSelect?.(e.data.field);}window.addEventListener('message',receive);return ()=>window.removeEventListener('message',receive);},[id,parts,activeField,onSelect]);
 useEffect(()=>{if(ready)frame.current?.contentWindow.postMessage({type:'cms:update',id,parts,activeField},location.origin);if(popup.current&&!popup.current.closed)popup.current.postMessage({type:'cms:update',id,parts,activeField},location.origin);},[id,parts,activeField,ready]);
 return <section className={s.previewPanel} aria-label='Vista previa en vivo'><div className={s.previewToolbar}><strong><Icon name='eye' size={14}/> Vista previa</strong><div>{['Desktop','Tablet','Móvil'].map(v=><button type='button' key={v} className={device===v?s.selectedDevice:''} aria-pressed={device===v} onClick={()=>setDevice(v)}>{v}</button>)}</div>{!full?<button type='button' onClick={()=>{popup.current=window.open(src||`/admin/vista-previa/${id}`,'cms-full-preview');}}>Abrir completa ↗</button>:null}</div><div className={s.previewViewport} ref={holder}><iframe ref={frame} src={src||`/admin/vista-previa/${id}`} title={`${device} · Vista previa privada`} sandbox='allow-scripts allow-same-origin' style={{width:viewport,height:Math.max(1,Math.round(height/scale)),transform:`translateX(-${viewport*scale/2}px) scale(${scale})`}} onLoad={()=>{frame.current.contentWindow.postMessage({type:'cms:update',id,parts,activeField},location.origin);}}/></div><div className={s.previewLabel}><span>{ready?'Actualizada en vivo':'Cargando vista previa…'}</span><span>{device} · {viewport} px</span></div></section>;
}
