"use client";
import {useRouter,useSearchParams} from 'next/navigation';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {editorFields,getField,setField} from '../../../lib/admin/editor-fields.mjs';
import {editorialCatalog,validateEditorialPayload,catalogRouteMap} from '../../../lib/admin/editorial-model.mjs';
import Link from 'next/link';
import {orientationContent} from '../../data/publicSiteContent';
import {EXTENDED_KINDS,SINGLETON_KINDS} from '../../../lib/admin/extended-editorial.mjs';
import {editorialLinkWarnings} from '../../../lib/admin/editor-links.mjs';
import {canAdmin} from '../../../lib/admin/permissions.mjs';
import {saveEditor,restoreEditorVersion,duplicateEntity,unpublishEntity,archiveEntity} from '../(protected)/editor-actions';
import EditorField from './EditorField';
import LivePreview from './LivePreview';
import Icon from './Icon';
import {statusLabels} from './EntityList';
import s from '../workspace.module.css';
export default function EntityEditor({initial}){
 const router=useRouter(),search=useSearchParams();
 const [loaded,setLoaded]=useState(initial),[values,setValues]=useState({root:initial.root.draft,...initial.shared?{shared:initial.shared.draft}:{}}),[tab,setTab]=useState(Object.hasOwn(editorFields(initial.root.draft._kind),search.get('tab'))?search.get('tab'):Object.keys(editorFields(initial.root.draft._kind))[0]),[active,setActive]=useState(''),[showPreview,setShowPreview]=useState(false),[busy,setBusy]=useState(false),[toast,setToast]=useState('');const confirm=useRef();
 const saved=useMemo(()=>({root:loaded.root.draft,...loaded.shared?{shared:loaded.shared.draft}:{}}),[loaded]);
 const fields=editorFields(values.root._kind);
 const orientation=loaded.entries.find(e=>e.payload?._kind==='orientation')?.payload.data||orientationContent;
 const cityDefaults={orientationVisible:orientation.visible&&orientation.cityIds.includes(values.root.data.id),orientationTitle:orientation.titleBefore+'\n'+orientation.titleAfter,orientationDescription:orientation.description,orientationImage:orientation.image,orientationCtaLabel:orientation.ctaLabel,expoTitle:'Conocé instituciones, descubrí carreras y pensá tu futuro.',expoDescription:'Próximamente · Fecha a confirmar',expoImage:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=84',expoCtaLabel:'Quiero recibir novedades',featuredInstitutionsTitle:'Instituciones Destacadas',allInstitutionsTitle:'Todas las instituciones',commercialTitle:'Tu propuesta educativa puede estar acá.',commercialDescription:'Mostrá tu oferta, conectá con futuros estudiantes y conocé las opciones para publicar o acompañar nuestras expos.',commercialCtaLabel:'Quiero ser parte de GET',commercialHref:'/contacto'};const changed=Object.values(fields).flat().filter(f=>JSON.stringify(getField(values,f.path))!==JSON.stringify(getField(saved,f.path)));
 const dirty=JSON.stringify(values)!==JSON.stringify(saved);
 const catalog=useMemo(()=>editorialCatalog(loaded.entries),[loaded.entries]);
 const linkWarnings=editorialLinkWarnings(catalog,values.root);
 const parts=[{id:loaded.root.id,revision:loaded.root.revision,moduleId:loaded.root.moduleId,key:loaded.root.entityKey,payload:values.root},...loaded.shared?[{id:loaded.shared.id,revision:loaded.shared.revision,moduleId:loaded.shared.moduleId,key:loaded.shared.entityKey,payload:values.shared}]:[]];
 const select=useCallback(path=>{setActive(path);const groups=editorFields(loaded.root.draft._kind);const group=Object.keys(groups).find(g=>groups[g].some(f=>f.path===path||path.startsWith(f.path+'.')));if(group)setTab(group);},[loaded.root.draft._kind]);
 useEffect(()=>{const input=document.getElementById(`field-${active}`);input?.focus({preventScroll:true});},[active,tab]);
 useEffect(()=>{function warn(e){if(dirty){e.preventDefault();e.returnValue='';}}function navigate(e){const link=e.target.closest('a');if(dirty&&link?.href&&new URL(link.href).pathname!==location.pathname&&!window.confirm('Tenés cambios sin guardar. ¿Querés salir?')){e.preventDefault();e.stopPropagation();}}window.addEventListener('beforeunload',warn);document.addEventListener('click',navigate,true);return ()=>{window.removeEventListener('beforeunload',warn);document.removeEventListener('click',navigate,true);};},[dirty]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),6000);return ()=>clearTimeout(timer);},[toast]);
 function restorable(version){try{validateEditorialPayload(version.payload);return true;}catch{return false;}}
 const name=values.shared?.data.name||values.root.data.name||values.root.data.degree||({navigation:'Navegación',footer:'Footer',orientation:'Orientación vocacional'})[values.root._kind]||'Página GET';
 const publicHref=catalogRouteMap(catalog).get(`${values.root._kind==='offering'?'offering':values.root._kind}:${values.root.data.id}`)||({home:'/',about:'/nosotros','events-page':'/eventos','services-page':'/servicios'})[values.root._kind];
 const selectGroup=g=>{setTab(g);if(fields[g]?.length)select(fields[g][0].path);};
 async function save(publish=false){setBusy(true);try{const result=await saveEditor(loaded.root.id,parts.map(({id,revision,payload})=>({id,revision,payload})),publish);if(!result.ok)throw new Error(result.message);setLoaded(result.data);setValues({root:result.data.root.draft,...result.data.shared?{shared:result.data.shared.draft}:{}});setToast(result.data.message);confirm.current?.close();}catch(e){setToast(e.message);}finally{setBusy(false);}}
 function change(path,value){setValues(previous=>{let next=setField(previous,path,value);if(path.startsWith('shared.data.')&&next.root.data.brandOverrides){const key=path.split('.').at(-1);delete next.root.data.brandOverrides[key];}return next;});setActive(path);}
 return <>
<div className={s.pageHeading}>
<div>
<span className={s.eyebrow}>EDITANDO · {({city:'CIUDAD',institution:'INSTITUCIÓN',offering:'CARRERA',home:'HOME',event:'EVENTO',service:'SERVICIO','events-page':'EVENTOS','services-page':'SERVICIOS','training-offering':'CAPACITACIÓN',about:'NOSOTROS',orientation:'ORIENTACIÓN',navigation:'MENÚS',footer:'FOOTER'})[values.root._kind]}</span>
<h1>{name}</h1>
<p>{values.root.data.cityId?catalog.cities.find(c=>c.id===values.root.data.cityId)?.name:catalog.institutions.find(i=>i.id===values.root.data.institutionId)?.name||'Contenido de GET'} · <span className={s.badge}>{statusLabels[loaded.root.state]}</span>
</p>
</div>{publicHref?<a href={publicHref} target='_blank' rel='noopener noreferrer' className={s.secondary}>Ver página pública ↗</a>:null}<button className={`${s.secondary} ${s.previewToggle}`} onClick={()=>setShowPreview(v=>!v)}>
<Icon name='eye'/>{showPreview?'Editar':'Vista previa'}</button>
</div>
<div className={`${s.editorGrid} ${showPreview?s.mobilePreview:''}`}>
<section className={`${s.card} ${s.editorCard}`}>
<nav className={s.sectionNav} aria-label='Secciones del editor'>{Object.keys(fields).filter(g=>!['Más opciones','Diseño','Historial'].includes(g)).map((g,index)=>
<button key={g} aria-label={g} type='button' className={tab===g?s.activeTab:''} aria-current={tab===g?'true':undefined} onClick={()=>selectGroup(g)}>
<small>{String(index+1).padStart(2,'0')}</small>
<span>{g}{g==='Slider principal'?<small>Editar diapositivas</small>:null}</span>
</button>)}<details>
<summary>Más opciones</summary>{Object.keys(fields).filter(g=>['Más opciones','Diseño','Historial'].includes(g)).map(g=>
<button type='button' key={g} onClick={()=>selectGroup(g)}>{g}</button>)}</details>
</nav>
<div className={s.fieldGroup}>
<h2>{tab}</h2>{values.root._kind==='city'&&tab==='Orientación vocacional'?<p className={s.muted}>Textos propios de esta ciudad. <Link href='/admin/orientacion-vocacional'>Editar imagen y contenido compartido →</Link>
</p>:null}{values.root._kind==='institution'&&tab==='Carreras'?<div className={s.relatedList}>
<Link className={s.secondary} href={`/admin/carreras/nuevo?institucion=${values.root.data.id}`}>+ Agregar carrera</Link>{(loaded.relatedDocuments||[]).map(row=>
<div key={row.id} className={s.relatedRow}><Link href={`/admin/carreras/${row.id}`}>{catalog.careers.find(c=>c.id===row.draft.data.careerId)?.name||row.draft.data.degree}<span>Editar →</span></Link>{canAdmin(loaded.actor,'archive')?<details className={s.actionsMenu}><summary aria-label='Más acciones de la carrera'>⋯</summary><div><button disabled={busy||dirty} onClick={async()=>{if(!window.confirm('¿Desasociar esta carrera de la institución? La oferta dejará de mostrarse. Su historial se conserva.'))return;setBusy(true);try{await archiveEntity(row.id);setLoaded(previous=>({...previous,relatedDocuments:previous.relatedDocuments.filter(item=>item.id!==row.id)}));setToast('Oferta archivada. La carrera general se conserva.');router.refresh();}catch(e){setToast(e.message);}finally{setBusy(false);}}}>Desasociar oferta</button></div></details>:null}</div>)}</div>:null}{values.root._kind==='footer'&&tab==='Información'?<p className={s.muted}>Cambiar el logo también afecta al administrador y al navbar si utiliza este mismo recurso. La Home mantiene su identidad propia.</p>:null}{values.root._kind==='orientation'?<p className={s.muted}>Solo contenido: inscripción y datos de menores pendientes de revisión legal.</p>:null}{values.root._kind==='navigation'?<p className={s.muted}>Navbar flotante compartido. La Home con mapa no tiene este menú; los logos contextuales conservan su destino.</p>:null}{values.root._kind==='home'&&tab==='Identidad y video'?<p className={s.muted}>Actualizá la identidad y el video de Home. Revisá el resultado antes de publicar.</p>:null}{tab==='Información'&&loaded.shared?<p className={s.muted}>El nombre y la descripción se comparten con otras sedes u ofertas de esta institución o carrera.</p>:null}{linkWarnings.length?<div role='status'>
<strong>Revisá los destinos antes de publicar</strong>{linkWarnings.map(message=>
<p className={s.muted} key={message}>{message}</p>)}</div>:null}{tab==='Más opciones'&&loaded.root.publishedVersion?<p className={s.muted}>Cambiar esta dirección puede afectar enlaces y posicionamiento. Al publicar se conservará un enlace desde la dirección anterior.</p>:null}{tab==='Diseño'?<>
<p className={s.muted}>Modo: {Object.keys(values.root.design||{}).length?'Personalizado':'Global / diseño aprobado'}. Los valores personalizados tienen prioridad.</p>
<button className={s.secondary} type='button' onClick={()=>setValues(p=>{const n=structuredClone(p);delete n.root.design;return n;})}>Restablecer todos los valores globales</button>
</>:null}{(fields[tab]||[]).map(f=>
<EditorField key={f.path} field={f} value={getField(values,f.path)??(f.path==='root.data.phone'?values.root.data.whatsapp:values.root._kind==='city'?cityDefaults[f.path.split('.').at(-1)]:undefined)} onChange={v=>change(f.path,v)} onFocus={select} root={values.root} catalog={catalog} changed={changed.some(c=>c.path===f.path)}/>)}{tab==='Más opciones'&&!SINGLETON_KINDS.includes(values.root._kind)&&values.root._kind!=='home'?<>
<button className={s.secondary} disabled={busy||dirty} onClick={async()=>{setBusy(true);try{const result=await duplicateEntity(loaded.root.id);router.push(`/admin/${location.pathname.split('/')[2]}/${result.document.id}`);}catch(e){setToast(e.message);setBusy(false);}}}>Duplicar como borrador</button>{canAdmin(loaded.actor,'publish')&&loaded.root.publishedVersion?<button className={s.textButton} disabled={busy||dirty} onClick={async()=>{if(!window.confirm('¿Retirar esta página del sitio público? El borrador se conservará.'))return;setBusy(true);try{const data=await unpublishEntity(loaded.root.id);setLoaded(data);setValues({root:data.root.draft,...data.shared?{shared:data.shared.draft}:{}});setToast('Contenido retirado. El borrador se conserva.');}catch(e){setToast(e.message);}finally{setBusy(false);}}}>Retirar publicación</button>:null}</>:null}{tab==='SEO'?<div className={s.googlePreview}>
<small>guiaeducativatuc.com.ar{values.root._kind==='home'?'/':''}</small>
<small>Vista aproximada de cómo aparece la página en Google.</small>
<strong>{values.root.seo?.title||name}</strong>
<p>{values.root.seo?.description||values.shared?.data.description||'Descripción de la página'}</p>
</div>:null}{tab==='Historial'?<>
<p className={s.muted}>Última edición: {new Date(loaded.root.updatedAt).toLocaleString('es-AR')}</p>{loaded.root.versions.map(v=>
<div key={v.version} className={s.historyItem}>
<strong>Versión {v.version}</strong>
<time>{new Date(v.publishedAt).toLocaleString('es-AR')} · {v.publishedBy===loaded.actor.id?loaded.actor.displayName:v.publishedBy?'Equipo GET':'Importación inicial'}</time>{canAdmin(loaded.actor,'restore')?<button className={s.textButton} disabled={busy||!restorable(v)} title={!restorable(v)?'Esta versión antigua se conserva como referencia y no se puede recuperar desde este editor.':undefined} onClick={async()=>{if(!window.confirm('¿Restaurar '+name+' · versión '+v.version+' como borrador? El historial se conservará.'))return;setBusy(true);try{const result=await restoreEditorVersion(loaded.root.id,v.version,loaded.root.revision);setLoaded(p=>({...p,root:result.document}));setValues(p=>({...p,root:result.document.draft}));setToast('Versión restaurada como borrador.');}catch{setToast('No se pudo restaurar la versión.');}finally{setBusy(false);}}}>Restaurar como borrador</button>:null}</div>)}</>:null}</div>
</section>
<LivePreview id={loaded.root.id} parts={parts} activeField={active} onSelect={select} full={showPreview} src={values.root._kind==='home'?'/admin/vista-previa/home':EXTENDED_KINDS[values.root._kind]?`/admin/vista-previa/modulos/${loaded.root.id}`:undefined}/>
</div>
<footer className={s.publishBar}>
<small aria-live='polite'>{busy?'Guardando…':dirty?'Cambios sin publicar':(loaded.root.state==='pending_changes'?'Borrador con cambios sin publicar':'Sin cambios')}{active?<span> · Editando {Object.values(fields).flat().find(f=>f.path===active||active.startsWith(f.path+'.'))?.label}</span>:null}</small>
<div>
<button className={s.secondary} disabled={busy||!dirty} onClick={()=>{setValues(structuredClone(saved));setToast('Cambios descartados.');}}>Descartar cambios</button>
<button className={s.secondary} disabled={busy||!dirty} onClick={()=>save(false)}>
<Icon name='save' size={15}/>Guardar borrador</button>{canAdmin(loaded.actor,'publish')?<button className={s.primary} disabled={busy} onClick={()=>confirm.current.showModal()}>Publicar cambios <Icon name='arrow' size={15}/>
</button>:null}</div>
</footer>
<dialog ref={confirm} className={s.dialog} aria-labelledby='publishTitle'>
<h2 id='publishTitle'>¿Publicar estos cambios?</h2>
<p>Vas a publicar <strong>{name}</strong>.</p>
<ul>{changed.length?changed.map(f=>
<li key={f.path}>{f.label}</li>):<li>La versión del borrador guardado.</li>}</ul>{linkWarnings.length?<p>Advertencia: hay destinos que no figuran en el catálogo público. Revisalos antes de confirmar.</p>:null}{loaded.shared?<p>Los datos comunes también se actualizarán donde se utilizan.</p>:null}<footer>
<button className={s.secondary} disabled={busy} onClick={()=>confirm.current.close()}>Cancelar</button>
<button className={s.primary} disabled={busy} onClick={()=>save(true)}>{busy?'Publicando…':'Publicar'}</button>
</footer>
</dialog>
{toast?<div role='status' className={s.toast}>{toast}</div>:null}</>;
}
