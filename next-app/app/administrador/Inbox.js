"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import './inbox.css';

const statuses={nueva:'Nueva',en_seguimiento:'En seguimiento',contactada:'Contactada',cerrada:'Cerrada'};
const date=value=>new Intl.DateTimeFormat('es-AR',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Argentina/Buenos_Aires'}).format(new Date(value));

function Contact({row,changeStatus}) {
  const [status,setStatus]=useState(row.status),[pending,setPending]=useState(false),[notice,setNotice]=useState('');
  const router=useRouter();
  async function submit(event) {
    event.preventDefault();if(pending)return;
    setPending(true);setNotice('');
    try {
      const result=await changeStatus({id:row.id,status,expectedRevision:row.revision});
      if(!result?.ok)throw Error(result?.message||'No se confirmó el cambio.');
      setNotice('Estado actualizado.');router.refresh();
    } catch(error) {setNotice(error.message||'No se confirmó el cambio.');}
    finally {setPending(false);}
  }
  return <article className="gc-inbox-contact">
    <header><div><h3>{row.institution_name}</h3><p>{row.contact_name}</p></div><span className={'gc-inbox-state gc-inbox-state--'+row.status}>{statuses[row.status]||'Estado no disponible'}</span></header>
    <dl><div><dt>Correo</dt><dd>{row.email}</dd></div><div><dt>Teléfono</dt><dd>{row.phone}</dd></div><div><dt>Plan consultado</dt><dd>{row.plan}</dd></div><div><dt>Recibida</dt><dd>{date(row.created_at)}</dd></div><div><dt>Origen</dt><dd>{row.source_path}</dd></div></dl>
    {row.message ? <p className="gc-inbox-message">{row.message}</p> : <p className="gc-inbox-muted">Sin mensaje adicional.</p>}
    <form onSubmit={submit}><label htmlFor={'status-'+row.id}>Estado<select id={'status-'+row.id} value={status} onChange={event=>setStatus(event.target.value)} disabled={pending}>{Object.entries(statuses).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><button type="submit" disabled={pending||status===row.status}>{pending?'Guardando…':'Guardar estado'}</button></form>
    <p className="gc-inbox-feedback" role="status" aria-live="polite">{notice}</p>
  </article>;
}

export default function Inbox({inbox,changeStatus}) {
  const paging=page=>'/administrador?'+new URLSearchParams({section:'consultas',q:inbox.q||'',status:inbox.status||'',page:String(page)});
  return <section className="gc-panel gc-inbox" aria-labelledby="commercial-inbox-title">
    <div><p className="gc-kicker">CONTACTO GET · PRIVADO</p><h2 id="commercial-inbox-title">Consultas comerciales</h2><p>Mensajes recibidos desde Contacto. No son consultas académicas ni registros de GET Instituciones.</p></div>
    {!inbox?.available ? <p role="status">{inbox?.message||'La bandeja todavía no está habilitada.'}</p> : <>
      <form action="/administrador" method="get" className="gc-inbox-filters"><input type="hidden" name="section" value="consultas"/><label>Buscar<input name="q" type="search" defaultValue={inbox.q||''} maxLength={120} placeholder="Institución, persona o contacto"/></label><label>Estado<select name="status" defaultValue={inbox.status||''}><option value="">Todos</option>{Object.entries(statuses).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><button type="submit">Filtrar</button></form>
      <p className="gc-inbox-muted">{inbox.total} {inbox.total===1?'consulta':'consultas'} · Página {inbox.page}</p>
      <div className="gc-inbox-list">{inbox.rows.length?inbox.rows.map(row=><Contact key={row.id+':'+row.revision} row={row} changeStatus={changeStatus}/>):<p>No hay consultas que coincidan con estos filtros.</p>}</div>
      <nav className="gc-inbox-pages" aria-label="Páginas de consultas">{inbox.page>1?<Link href={paging(inbox.page-1)}>Anterior</Link>:null}{inbox.page*inbox.pageSize<inbox.total?<Link href={paging(inbox.page+1)}>Siguiente</Link>:null}</nav>
    </>}
  </section>;
}
