"use client";
import {useEffect,useMemo,useRef,useState} from 'react';
import {editorialCatalog,cityPageFromCatalog,validateEditorialPayload} from '../../../lib/admin/editorial-model.mjs';
import {extendedPageForEntry} from '../../../lib/admin/extended-editorial.mjs';
import {previewSelectors} from '../../../lib/admin/editor-fields.mjs';
import EventsPageClient from '../../eventos/EventsPageClient';
import EventDetailClient from '../../eventos/EventDetailClient';
import ServicesPageClient from '../../servicios/ServicesPageClient';
import ServiceDetailClient from '../../servicios/ServiceDetailClient';
import AboutPageClient from '../../nosotros/AboutPageClient';
import TrainingPageClient from '../../[ciudad]/[institucion]/capacitaciones/[capacitacion]/TrainingPageClient';
import CityPageClient from '../../[ciudad]/CityPageClient';
import PublicSiteBackground from '../../components/PublicSiteBackground';
import {PublicEditorialProvider} from '../../components/PublicEditorialContext';
export default function ExtendedPreviewHost({id,initialParts,entries}){
 const [parts,setParts]=useState(initialParts),[active,setActive]=useState(''),root=useRef(),previous=useRef('');
 const result=useMemo(()=>{const updates=parts.map(p=>({...p,payload:['event','service','training-offering'].includes(p.payload._kind)?{...p.payload,data:{...p.payload.data,visible:true}}:p.payload,visibility:'published'})),catalog=editorialCatalog([...entries,...updates]);return {page:extendedPageForEntry(catalog,updates[0]),catalog};},[parts,entries]);
 useEffect(()=>{const peer=window.opener||window.parent;function receive(e){if(e.origin!==location.origin||e.source!==peer||e.data?.id!==id||e.data.type!=='cms:update')return;try{const next=e.data.parts;if(!Array.isArray(next)||next.length!==initialParts.length||next.some((p,i)=>p.key!==initialParts[i].key||p.moduleId!==initialParts[i].moduleId))return;next.forEach(p=>validateEditorialPayload(p.payload));setParts(next);setActive(e.data.activeField||'');}catch{/* Invalid preview messages never render. */}}window.addEventListener('message',receive);peer.postMessage({type:'cms:ready',id},location.origin);return ()=>window.removeEventListener('message',receive);},[id,initialParts]);
 useEffect(()=>{const node=root.current;node?.querySelectorAll('[data-cms-selected]').forEach(n=>{n.removeAttribute('data-cms-selected');n.style.outline='';n.style.outlineOffset='';});const selectors=previewSelectors[parts[0].payload._kind]||{},prefix=Object.keys(selectors).sort((a,b)=>b.length-a.length).find(p=>active===p||active.startsWith(p+'.'));const target=node?.querySelector(`[data-edit-id~="${active.replace(/[^a-zA-Z0-9._-]/g,'')}"]`)||(prefix?node?.querySelector(selectors[prefix]):null);if(target){target.setAttribute('data-cms-selected','true');target.style.outline='2px solid #c9971a';target.style.outlineOffset='4px';if(previous.current!==active)target.scrollIntoView({block:'nearest',behavior:'smooth'});}previous.current=active;function click(e){const tagged=e.target.closest?.('[data-edit-id]');let field=tagged?.getAttribute('data-edit-id')?.split(' ')[0];if(!field)for(const [k,s]of Object.entries(selectors))if(e.target.closest?.(s)){field=k;break;}if(field)(window.opener||window.parent).postMessage({type:'cms:select',id,field},location.origin);if(e.target.closest?.('a,button,[role="link"]')){e.preventDefault();e.stopPropagation();}}node?.addEventListener('click',click,true);return ()=>node?.removeEventListener('click',click,true);},[parts,active,id]);
 const {page,catalog}=result;if(!page.props)return <p>Completá las relaciones para ver el contenido.</p>;
 const props=JSON.parse(JSON.stringify(page.props).replaceAll('/media/cms/','/admin/media/')),site=JSON.parse(JSON.stringify(page.siteContent).replaceAll('/media/cms/','/admin/media/'));
 const views={event:<EventDetailClient {...props}/>, 'events-page':<EventsPageClient {...props}/>,service:<ServiceDetailClient {...props}/>, 'services-page':<ServicesPageClient {...props}/>,about:<AboutPageClient {...props}/>, 'training-offering':<TrainingPageClient {...props}/>};
 return <div ref={root} onSubmitCapture={e=>{e.preventDefault();e.stopPropagation();}}><PublicEditorialProvider content={site}><PublicSiteBackground previewPath='/preview-public'>{views[page.kind]||<CityPageClient city={cityPageFromCatalog(catalog,props.citySlug)}/>}</PublicSiteBackground></PublicEditorialProvider></div>;
}
