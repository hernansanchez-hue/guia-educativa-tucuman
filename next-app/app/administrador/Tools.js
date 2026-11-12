'use client';
import Link from 'next/link';
import Image from 'next/image';
import {previewUrl} from './media-options.mjs';
import { useEffect, useRef, useState } from 'react';
import { changeAccess, recoverMember, library, users, upload } from './editor-actions';
export function Library({ readOnly = false, onPick, kind, catalogAssets = [] }) {
  const [assets, setAssets] = useState(null), [message, notice] = useState(''), [busy, wait] = useState(false);
  const [q, search] = useState(''), [source, filter] = useState('all'), [choice, select] = useState('');
  const form = useRef(null);
  useEffect(()=>{
    let active=true;
    library().then(rows=>{if(active)setAssets(rows);}).catch(()=>{if(active)notice('No se pudieron leer los archivos subidos.');});
    return ()=>{active=false;};
  },[]);
  const uploaded=(assets??[]).map(a=>({url:'/media/control/'+a.id,name:a.name,kind:a.mime==='application/pdf'?'pdf':'image',size:a.size,source:'upload'}));
  const options=[...uploaded,...catalogAssets.map(a=>({...a,source:'catalog'}))];
  const matches=options.filter(a=>(!kind||a.kind===kind)&&(source==='all'||a.source===source)&&a.name.toLocaleLowerCase('es').includes(q.trim().toLocaleLowerCase('es')));
  const selected=matches.find(a=>a.url===choice);
  const [limit,more]=useState(24);
  async function add(e){
    e.preventDefault();
    wait(true);notice('');
    try{
      const result=await upload(new FormData(form.current));
      if(!result.ok)throw Error(result.message);
      const rows=await library();
      setAssets(rows);search('');filter('upload');more(24);select('/media/control/'+result.asset.id);
      form.current.reset();notice(onPick?'Archivo subido. Confirmá la selección para usarlo.':'Archivo guardado en la biblioteca.');
    }catch(err){notice(err.message);}
    finally{wait(false);}
  }
  return <section className="gc-library" aria-label="Biblioteca de archivos">
    <div className="gc-library-heading"><p className="gc-kicker">RECURSOS DEL EQUIPO</p><h2>{onPick?(kind==='pdf'?'Elegí un plan de estudios':'Elegí una imagen'):'Archivos e imágenes'}</h2><p>Reutilizá un recurso del catálogo o subí un archivo propio.</p></div>
    {!readOnly&&<form onSubmit={add} method="post" ref={form} className="gc-upload">
      <label>{kind==='pdf'?'Subir PDF':kind==='image'?'Subir imagen':'Subir imagen o PDF'} <small>Hasta 5 MB</small>
        <input type="file" name="file" disabled={assets===null||busy} accept={kind==='pdf'?'application/pdf':kind==='image'?'image/jpeg,image/png,image/webp':'image/jpeg,image/png,image/webp,application/pdf'} required/>
      </label><button type="submit" disabled={assets===null||busy}>{busy?'Subiendo…':'Subir archivo'}</button>
    </form>}
    <div className="gc-library-filter"><label>Buscar archivo<input type="search" placeholder="Nombre del archivo o institución" value={q} onChange={e=>{search(e.target.value);more(24);}}/></label>
    <label>Origen<select value={source} onChange={e=>{filter(e.target.value);more(24);}}><option value="all">Todos los recursos</option><option value="upload">Archivos subidos</option><option value="catalog">En el catálogo</option></select></label></div>
    <p role="status">{message || (assets===null?'Cargando biblioteca…':matches.length+' recursos disponibles')}</p>
    <div className="gc-assets">{matches.slice(0,limit).map(a=>{
      const cover=a.kind==='image'?<Image src={previewUrl(a.url)} unoptimized width={220} height={130} loading="lazy" alt="" referrerPolicy="no-referrer"/>:<span className="gc-file-type" aria-hidden="true">PDF</span>;
      const body=<>{cover}<span className="gc-asset-copy"><strong>{a.name}</strong><small>{a.source==='catalog'?'En el catálogo':Math.max(1,Math.ceil(a.size/1024))+' KB'}</small></span></>;
      return onPick?<button type="button" className="gc-asset" key={a.url} aria-pressed={a.url===choice} onClick={()=>select(a.url)}>{body}</button>:<a className="gc-asset" key={a.url} href={previewUrl(a.url)} target="_blank" rel="noreferrer">{body}</a>;
    })}</div>
    {!matches.length&&assets!==null&&<p>No hay recursos que coincidan con tu búsqueda.</p>}
    {matches.length>limit&&<button className="secondary" type="button" onClick={()=>more(n=>n+24)}>Mostrar más archivos</button>}
    {onPick&&<div className="gc-selection"><span>{selected?.name||'Seleccioná un archivo para continuar.'}{selected&&<small><a href={previewUrl(selected.url)} target="_blank" rel="noreferrer">Abrir vista previa ↗</a></small>}</span><button type="button" disabled={!selected||busy} onClick={()=>onPick(selected.url)}>Usar {kind==='pdf'?'PDF':'imagen'}</button></div>}
  </section>;
}

export function Members({ actor, allowMail }) {
  const [rows, setRows] = useState([]),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [edit, setEdit] = useState(null),
    [invite, setInvite] = useState(false);
  useEffect(() => {
    users()
      .then(setRows)
      .catch(() => setMessage('No se pudo cargar el listado de accesos.'));
  }, []);
  async function save(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (!confirm('¿Confirmás este cambio de acceso?')) return;
    setBusy(true);
    try {
      const r = await changeAccess({ ...data, active: data.active === 'on', invite });
      if (!r.ok) throw Error(r.message);
      setRows(await users());
      setEdit(null);
      setMessage('Acceso actualizado.');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="gc-panel">
      <h2>Accesos del equipo</h2>
      <p>No hay registro público. Los permisos se comprueban nuevamente en el servidor.</p>
      {rows.map((r) => (
        <div className="gc-row" key={r.id}>
          <span>
            <strong>{r.name}</strong>
            <small>
              {r.role} · {r.active ? 'Activo' : 'Desactivado'}
            </small>
          </span>
          {allowMail && r.active && (
            <button
              className="secondary"
              disabled={busy}
              onClick={async () => {
                if (!confirm('¿Enviar un correo de recuperación a este miembro?')) return;
                setBusy(true);
                try {
                  const res = await recoverMember(r.id);
                  setMessage(res.message);
                } catch {
                  setMessage('No se pudo solicitar la recuperación.');
                } finally {
                  setBusy(false);
                }
              }}
            >
              Enviar recuperación
            </button>
          )}
          {r.id !== actor.id && (
            <button
              className="secondary"
              onClick={() => {
                setEdit(r);
                setInvite(false);
              }}
            >
              Modificar
            </button>
          )}
        </div>
      ))}
      <div className="gc-tools">
        <button
          onClick={() => {
            setEdit({ role: 'EDITOR', active: true });
            setInvite(false);
          }}
        >
          Vincular identidad verificada
        </button>
        {allowMail && (
          <button
            onClick={() => {
              setEdit({ role: 'EDITOR', active: true });
              setInvite(true);
            }}
          >
            Invitar por email
          </button>
        )}
      </div>
      {!allowMail && <small>El envío de invitaciones está deshabilitado en este entorno.</small>}
      {edit && (
        <form key={edit.id || String(invite)} onSubmit={save}>
          <label>
            {invite ? 'Correo para la invitación' : 'UUID de Supabase Auth'}
            <input
              name={invite ? 'email' : 'id'}
              type={invite ? 'email' : 'text'}
              defaultValue={edit.id || ''}
              readOnly={!!edit.id}
              required
            />
          </label>
          <label>
            Nombre
            <input name="name" defaultValue={edit.name || ''} maxLength={160} required />
          </label>
          <label>
            Rol
            <select name="role" defaultValue={edit.role}>
              {['LECTOR', 'EDITOR', 'ADMINISTRADOR'].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>
            <input type="checkbox" name="active" defaultChecked={!!edit.active} /> Acceso activo
          </label>
          <div className="gc-tools">
            <button disabled={busy}>Confirmar acceso</button>
            <button type="button" className="secondary" onClick={() => setEdit(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
      <p role="status">{message}</p>
      <Link href="/administrador/recuperar">Recuperar mi contraseña</Link>
    </section>
  );
}
