'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Editor from './Editor';
import {Library,Members} from './Tools';
import ControlIcon from './ControlIcon';
import CreateContent from './CreateContent';
import SearchPicker from './SearchPicker';
import PlacementDialog from './PlacementDialog';
import {activityDetail} from './editor-actions';
import {logout} from './access';
import {norm,href,navigation,cityEditors,venueSections,rememberKey} from './navigation.mjs';
import Inbox from './Inbox';

const subTabs=[['sedes','Todas'],['destacadas','Destacadas'],['sucursales','Sedes'],['seleccion','Carreras destacadas']];
const actions={save:'Guardó un borrador',create:'Creó un borrador',publish:'Publicó cambios',discard:'Descartó un borrador',restore:'Recuperó una versión',member:'Actualizó un acceso',upload:'Subió un archivo'};
const titles={inicio:'Mesa de edición',slider:'Slider de ciudades',sedes:'Instituciones',destacadas:'Instituciones destacadas',sucursales:'Sedes',seleccion:'Carreras destacadas',ofertas:'Carreras',maestras:'Carreras generales',medios:'Biblioteca de medios',borradores:'Borradores',historial:'Actividad',usuarios:'Usuarios',eventos:'Eventos y agenda',servicios:'Servicios',consultas:'Consultas comerciales'};
const summaries={sedes:'Encontrá una ficha, actualizá su contenido o destacala en su ciudad.',sucursales:'Gestioná las sedes de una misma institución sin duplicar su identidad.',seleccion:'Elegí una sede paga para revisar y ordenar sus tarjetas de carrera.',ofertas:'Cada oferta reúne la información de una carrera en una sede.',maestras:'Una carrera general se puede vincular a distintas instituciones.',borradores:'Revisá, completá o publicá los cambios pendientes.'};
const labels={visible:'Visibilidad',placements:'Instituciones destacadas',slides:'Diapositivas',degree:'Título otorgado',duration:'Duración',modality:'Modalidad',description:'Descripción',image:'Imagen',name:'Nombre',campusName:'Nombre de sede',whatsapp:'WhatsApp',phone:'Teléfono',address:'Dirección',type:'Tipo',featuredCareerIds:'Carreras destacadas',gallery:'Galería',studyPlan:'Plan de estudios',seo:'SEO'};
function renderValue(value){
 if(value===null||value===undefined||value==='')return 'Sin dato';if(typeof value==='boolean')return value?'Sí':'No';
 if(Array.isArray(value))return value.length+' elementos';if(typeof value==='object')return Object.entries(value).map(([k,v])=>(labels[k]||k)+': '+renderValue(v)).join(' · ');
 return String(value);
}
const dateText=raw=>new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Tucuman',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(raw));
function Feed({rows}){
 const [detail,show]=useState(null);
 if(!rows.length)return <p className="gc-empty">Todavía no hay actividad editorial registrada.</p>;
 return <ol className="gc-timeline">{rows.map(r=><li key={r.id}><span aria-hidden="true" className="gc-event-dot"/><div><strong>{r.label||actions[r.operation]||'Cambio editorial'}</strong><small>{r.name} · {actions[r.operation]||'Actualizó el contenido'} · {dateText(r.at)}</small>
 {['save','discard','restore','publish'].includes(r.operation)&&<button className="gc-text" onClick={async()=>{try{show({id:r.id,fields:await activityDetail(Number(r.id))});}catch{show({id:r.id,error:'No se pudo leer el detalle.'});}}}>Ver cambios</button>}
 {detail?.id===r.id&&<div className="gc-history-detail">{detail.error||(!detail.fields.length?'Sin diferencias de campos.':detail.fields.map(f=><p key={f.campo}><b>{labels[f.campo]||f.campo}</b><small>Antes: {renderValue(f.antes)}</small><small>Después: {renderValue(f.despues)}</small></p>))}</div>}</div></li>)}</ol>;
}
export default function Workspace(p){
 const {actor,section,model,venues,offers,cities,drafts,history,cityId,cityScope,creation}=p;
 const router=useRouter(),readOnly=actor.role==='LECTOR';
 const [nav,setNav]=useState(false),[term,setTerm]=useState(''),[state,setState]=useState(''),[type,setType]=useState(''),[featured,setFeatured]=useState(''),[page,setPage]=useState(0),[promote,setPromote]=useState(null),[saved,setSaved]=useState(null);
 const venueGroup=venueSections.includes(section),offerGroup=['ofertas','maestras'].includes(section);
 const currentGroup=venueGroup?'sedes':offerGroup?'ofertas':section;
 const context=cities.find(c=>c.id===cityId);
 const cityEdition=cityEditors.includes(section)&&!creation;
 const cityFilterable=!model&&!creation&&['sedes','sucursales','ofertas','seleccion'].includes(section);
 function selectCity(id){
   if(document.querySelector('[data-unsaved="true"]')&&!confirm('¿Cambiar de ciudad sin guardar los cambios?'))return;
   if(id!=='todas')document.cookie=rememberKey+'='+encodeURIComponent(id)+'; Path=/administrador; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
   const city=cities.find(c=>c.id===id);
   router.push(href({section,city:city?.id||cityId,scope:id==='todas'?'todas':null,key:cityEdition?city?.slug:null}));
 }
 const filtered=(section==='ofertas'?offers:venues).filter(r=>(cityScope==='todas'||r.cityId===cityId)&&(!term||norm([r.name,r.city,r.venue,r.type].join(' ')).includes(norm(term)))&&(!state||state===(r.dirty?'BORRADOR':r.visible?'PUBLICADO':'OCULTO'))&&(!type||type===r.type)&&(!featured||r.featured===(featured==='si'))&&(section!=='seleccion'||r.paid));
 const masterList=(p.masters||[]).filter(m=>norm(m.name).includes(norm(term))&&(!state||(state==='BORRADOR'?m.unpublished||m.dirty:state==='PUBLICADO'&&!m.unpublished&&!m.dirty)));
 const items=section==='maestras'?masterList:filtered,perPage=16,pageCount=Math.max(1,Math.ceil(items.length/perPage)),current=Math.min(page,pageCount-1),visible=items.slice(current*perPage,(current+1)*perPage);
 const searchFilter=fn=>e=>{fn(e.target.value);setPage(0);};
 const newLink=(newType,sectionId,label)=>!readOnly&&<Link className="gc-action" href={href({section:sectionId,new:newType,city:cityId})}><ControlIcon name="plus"/>{label}</Link>;
 const listMode=['sedes','sucursales','seleccion','ofertas','maestras'].includes(section)&&!model&&!creation;
 const displayedCity=cityFilterable&&cityScope==='todas'?'todas':cityId;
 const featuredCounts=venues.filter(v=>v.featured&&!v.unpublished).length;
 return <div className="gc-shell">
  <button className="gc-menu" aria-controls="gc-side" aria-expanded={nav} onClick={()=>setNav(!nav)}><ControlIcon name="menu"/> Centro de Control</button>
  <aside id="gc-side" className={'gc-side '+(nav?'gc-open':'')}><header><small>GUÍA EDUCATIVA TUCUMÁN</small><strong>GET<span> / </span>Control</strong></header>
   <nav aria-label="Módulos del Centro">{navigation.filter(([id])=>(id!=='usuarios'||actor.role==='ADMINISTRADOR')&&(id!=='consultas'||['ADMINISTRADOR','EDITOR'].includes(actor.role))).map(([id,name,icon])=><Link key={id} aria-current={currentGroup===id?'page':undefined} href={href({section:id,city:cityId})}><ControlIcon name={icon}/><span>{name}</span>{id==='borradores'&&drafts.length>0&&<small className="gc-count">{drafts.length}</small>}</Link>)}</nav>
   <div className="gc-account"><b>{actor.name}</b><small>{actor.role}</small><form action={logout}><button className="gc-signout">Cerrar sesión →</button></form></div>
  </aside>
  <main className="gc-main"><header className="gc-top"><span>Centro de Control <i>/</i> {navigation.find(([id])=>id===currentGroup)?.[1]}</span><span className="gc-pill"><i/>{p.mode==='local'?'Edición local':'Edición en línea'}</span></header>
  {(!model||cityEdition)&&!creation&&<><p className="gc-kicker">{section==='inicio'?'ESPACIO DE TRABAJO':'CONTENIDO EDITORIAL'}</p><div className="gc-page-title"><div><h1>{titles[section]}</h1>{summaries[section]&&<p className="gc-lead">{summaries[section]}</p>}</div>{section==='eventos'?newLink('evento','eventos','Nuevo evento'):section==='sedes'?newLink('institucion','sedes','Nueva institución'):section==='sucursales'?newLink('sede','sucursales','Nueva sede'):section==='ofertas'?newLink('oferta','ofertas','Nueva oferta académica'):section==='maestras'?newLink('carrera','maestras','Nueva carrera general'):null}</div></>}
   {venueGroup&&!creation&&(!model||cityEdition)&&<nav className="gc-subnav" aria-label="Instituciones">{subTabs.map(([id,name])=><Link key={id} aria-current={id===section?'page':undefined} href={href({section:id,city:cityId})}>{name}</Link>)}</nav>}
   {offerGroup&&!model&&!creation&&<nav className="gc-subnav" aria-label="Carreras">{[['ofertas','Ofertas por sede'],['maestras','Carreras generales']].map(([id,name])=><Link key={id} aria-current={id===section?'page':undefined} href={href({section:id,city:cityId})}>{name}</Link>)}</nav>}
   {(cityEdition||cityFilterable)&&<div className="gc-city-context"><SearchPicker compact label="Ciudad" items={[...(cityFilterable?[{id:'todas',name:'Todas las ciudades'}]:[]),...cities]} value={displayedCity} onSelect={selectCity}/></div>}
   {creation?<CreateContent {...p}/>:model?<Editor key={model.key} {...p} readOnly={readOnly}/>:null}
   {!model&&!creation&&section==='inicio'&&<>
    <section className="gc-start"><div><p className="gc-kicker">EDICIÓN TERRITORIAL</p><h2>Trabajá en {context?.name||'tu ciudad'}.</h2><p>Actualizá las propuestas que primero encuentran los estudiantes.</p></div><div className="gc-start-links"><Link href={href({section:'slider',city:cityId})}>Editar slider <ControlIcon/></Link><Link href={href({section:'destacadas',city:cityId})}>Ver instituciones destacadas <ControlIcon/></Link></div></section>
    <section aria-label="El catálogo en cifras" className="gc-stat-line">{[['Ciudades',cities.length,'slider'],['Sedes',venues.filter(v=>!v.unpublished).length,'sedes'],['Instituciones destacadas',featuredCounts,'destacadas'],['Carreras generales',p.careerCount,'maestras'],['Ofertas destacadas',offers.filter(o=>o.featured&&!o.unpublished).length,'seleccion']].map(([label,n,section])=><Link key={label} href={href({section,city:cityId})}><strong>{n}</strong><span>{label}</span></Link>)}</section>
    <div className="gc-desk"><section className="gc-panel"><p className="gc-kicker">COLA EDITORIAL</p><div className="gc-line-heading"><h2>Borradores</h2><b>{drafts.length}</b></div>{drafts.length?drafts.slice(0,4).map(d=><Link className="gc-file-row" key={d.key} href={href({section:'borradores',key:d.key})}><span>{d.name}</span><ControlIcon/></Link>):<p className="gc-empty">No hay cambios pendientes de publicación.</p>}<Link className="gc-inline-link" href={href({section:'borradores'})}>Ver todos los borradores →</Link></section><section className="gc-panel"><p className="gc-kicker">EQUIPO GET</p><h2>Última actividad</h2><Feed rows={history.slice(0,4)}/></section></div>
   </>}
   {listMode&&<section className="gc-panel gc-list-panel"><div className="gc-list-tools"><label className="gc-search-field"><ControlIcon name="search"/><input type="search" aria-label="Buscar por nombre" placeholder="Buscar por nombre…" value={term} onChange={searchFilter(setTerm)}/></label><label>Estado<select value={state} onChange={searchFilter(setState)}><option value="">Todos</option>{(section==='maestras'?['BORRADOR','PUBLICADO']:['BORRADOR','PUBLICADO','OCULTO']).map(s=><option key={s}>{s}</option>)}</select></label>{section!=='maestras'&&<label>Destaque<select value={featured} onChange={searchFilter(setFeatured)}><option value="">Todos</option><option value="si">Destacadas</option><option value="no">No destacadas</option></select></label>}{venueGroup&&<label>Tipo<select value={type} onChange={searchFilter(setType)}><option value="">Todos</option>{[...new Set(venues.map(v=>v.type).filter(Boolean))].sort().map(t=><option key={t}>{t}</option>)}</select></label>}</div>
   {saved&&<p role="status" className="gc-notice">Destaque guardado en el borrador de {saved.name}. <Link href={href({section:'destacadas',key:saved.slug})}>Revisar y publicar →</Link></p>}
   <p aria-live="polite" className="gc-result-count">{items.length} {items.length===1?'resultado':'resultados'}</p><div className="gc-scroll"><table><thead><tr><th>{section==='maestras'?'Carrera general':section==='ofertas'?'Oferta académica':'Institución / sede'}</th>{section!=='maestras'&&<th>Ciudad</th>}<th>Estado</th><th>Acciones</th></tr></thead><tbody>{visible.map(r=>{
    const status=r.unpublished||r.dirty?'BORRADOR':r.visible===false?'OCULTO':'PUBLICADO';
    return <tr key={r.id}><td><b>{r.name}</b><small>{section==='sucursales'?p.brands.find(b=>b.id===r.brandId)?.name:r.venue||r.plan}{r.modality?' · '+r.modality:''}</small></td>{section!=='maestras'&&<td>{r.city}</td>}<td><span className={'gc-state '+status.toLowerCase()}>{status}</span>{r.featured&&<small>★ Destacada</small>}</td><td><div className="gc-row-links"><Link className="gc-edit-link" href={href({section,key:r.key,tab:section==='seleccion'?'Destacadas':null})}>{readOnly?'Ver':section==='ofertas'?'Editar página':'Editar'}</Link>{r.visible&&!r.unpublished&&r.url&&<a href={r.url} target="_blank" rel="noreferrer">Ficha ↗</a>}{venueGroup&&<Link href={href({section:'sedes',key:r.key,tab:'Carreras'})}>Carreras</Link>}{venueGroup&&!readOnly&&r.visible&&!r.unpublished&&(r.featured?<Link href={href({section:'destacadas',city:r.cityId,pick:r.id})}>Revisar destaque</Link>:<button className="gc-text" onClick={()=>{setSaved(null);setPromote(r);}}>Convertir en destacada</button>)}</div></td></tr>;
   })}</tbody></table></div>{!items.length&&<p className="gc-empty">No hay resultados con estos filtros.</p>}
   {items.length>perPage&&<div className="gc-pagination"><button className="secondary" disabled={!current} onClick={()=>setPage(current-1)}>Anterior</button><span>{current+1} / {pageCount}</span><button className="secondary" disabled={current+1>=pageCount} onClick={()=>setPage(current+1)}>Siguiente</button></div>}</section>}
   {!model&&!creation&&section==='borradores'&&<section className="gc-panel">{drafts.length?drafts.map(d=><Link className="gc-file-row" key={d.key} href={href({section,key:d.key})}><span>{d.name}</span><ControlIcon/></Link>):<p>No hay borradores pendientes de publicación.</p>}</section>}
   {!model&&!creation&&section==='historial'&&<section className="gc-panel"><Feed rows={history}/></section>}
   {!model&&!creation&&section==='medios'&&<Library readOnly={readOnly} catalogAssets={p.catalogAssets}/>}
   {!model&&!creation&&section==='usuarios'&&actor.role==='ADMINISTRADOR'&&<Members actor={actor} allowMail={p.allowMail&&p.mode==='supabase'}/>}
   {!model&&!creation&&section==='consultas'&&['ADMINISTRADOR','EDITOR'].includes(actor.role)&&<Inbox inbox={p.inbox} changeStatus={p.changeInboxStatus}/>}
   {!model&&!creation&&['eventos','servicios'].includes(section)&&<section className="gc-panel gc-list-panel">
    <div className="gc-list-tools"><label>Buscar<input type="search" value={term} onChange={searchFilter(setTerm)} placeholder="Buscar por nombre…"/></label><label>Estado<select value={state} onChange={searchFilter(setState)}><option value="">Todos</option><option value="BORRADOR">Borrador</option><option value="PUBLICADO">Publicado</option><option value="OCULTO">Oculto</option></select></label></div>
    {section==='eventos'&&<p className="gc-help">Publicar una ficha no confirma un evento. La agenda exige estado confirmado, fecha válida y lugar real; las demostraciones permanecen fuera de la agenda y del sitemap.</p>}
    <div className="gc-scroll"><table><thead><tr><th>Contenido</th><th>Estado editorial</th><th>Acciones</th></tr></thead><tbody>{(p.editorial||[]).filter(e=>(section==='eventos'?e.kind.startsWith('event'):e.kind.startsWith('service'))&&norm(e.name).includes(norm(term))&&(!state||state===(e.dirty||e.unpublished?'BORRADOR':e.visible?'PUBLICADO':'OCULTO'))).map(e=><tr key={e.key}><td><b>{e.name}</b><small>{e.city}{e.status?' · '+e.status:''}{e.kind.endsWith('-page')?'Página general':''}</small></td><td>{e.dirty||e.unpublished?'BORRADOR':e.visible?'PUBLICADO':'OCULTO'}</td><td><Link className="gc-edit-link" href={href({section,key:e.key})}>{readOnly?'Ver':'Editar'}</Link>{!e.unpublished&&e.visible&&<a href={e.url} target="_blank" rel="noreferrer"> Ver página ↗</a>}</td></tr>)}</tbody></table></div>
    {!(p.editorial||[]).some(e=>(section==='eventos'?e.kind.startsWith('event'):e.kind.startsWith('service'))&&norm(e.name).includes(norm(term))&&(!state||state===(e.dirty||e.unpublished?'BORRADOR':e.visible?'PUBLICADO':'OCULTO')))&&<p className="gc-empty">No hay resultados con estos filtros.</p>}
   </section>}
   {promote&&<PlacementDialog row={promote} venues={venues} cities={cities} onClose={()=>setPromote(null)} onSaved={c=>{setPromote(null);setSaved(c);router.refresh();}}/>}
  </main></div>;
}
