'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {startMfa,confirmMfa,cancelMfa,removeMfa} from './mfa-actions';
import {logout} from './access';
import './mfa.css';

export default function MfaPanel({challenge=false,factors=[]}) {
  const router=useRouter();
  const [setup,setSetup]=useState(null),[selected,setSelected]=useState(factors.find(f=>f.type==='totp')?.id||''),[code,setCode]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[removing,setRemoving]=useState(false);
  async function run(action) {
    if(busy)return;setBusy(true);setNotice('');
    try{await action();}catch{setNotice('No se pudo completar la operación. Recargá la página y verificá tu sesión.');}
    finally{setBusy(false);}
  }
  function resultError(r){if(!r?.ok){setNotice(r?.message||'No se pudo completar la operación.');return true;}return false;}
  async function submit(event){
    event.preventDefault();
    await run(async()=>{
      const r=await (removing?removeMfa:confirmMfa)({id:setup?.id||selected,code});
      setCode('');if(resultError(r))return;
      setSetup(null);setRemoving(false);
      if(removing){setNotice('Autenticador desvinculado.');router.refresh();}
      else {router.replace('/administrador/seguridad');router.refresh();}
    });
  }
  const totp=factors.filter(f=>f.type==='totp');
  return <main className="gc-door"><div className="gc-door-inner">
    <div className="gc-door-mark"><small>GET · EQUIPO EDITORIAL</small><h1>Centro de<br/>Control<span>.</span></h1><p>Guía Educativa Tucumán</p></div>
    <section className="gc-panel gc-mfa" aria-labelledby="mfa-title"><p className="gc-kicker">SEGURIDAD DE TU CUENTA</p>
      <h2 id="mfa-title">{challenge?'Verificá tu segundo factor':'Verificación en dos pasos'}</h2>
      <p>{challenge?'Ingresá el código actual de tu aplicación autenticadora para continuar.':factors.length?'Tu cuenta tiene un segundo factor verificado. Se exige al acceder al Centro de Control.':'Todavía no activaste el segundo factor. Tu acceso actual no cambia hasta que lo configures y confirmes.'}</p>
      {!challenge&&!setup&&<button disabled={busy} onClick={()=>run(async()=>{const r=await startMfa();if(!resultError(r)){setSetup(r);setRemoving(false);setCode('');}})}>Vincular un autenticador</button>}
      {setup&&<div><p>Escaneá este QR con tu aplicación autenticadora. No lo compartas ni lo envíes por chat.</p>
        {/* Supabase's private QR must never pass through an image proxy/cache. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gc-mfa-qr" src={setup.qr.startsWith('data:image/')?setup.qr:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(setup.qr)} width="220" height="220" alt="QR privado para vincular tu autenticador"/>
        <details><summary>Configurar manualmente</summary><p className="gc-mfa-secret">{setup.secret}</p></details>
      </div>}
      {(challenge||setup||removing)&&<form onSubmit={submit}>
        {!setup&&totp.length>0&&<label>Autenticador<select value={selected} onChange={e=>setSelected(e.target.value)}>{totp.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select></label>}
        {(setup||totp.length>0)?<><label>Código de seis dígitos<input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} name="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required/></label><button disabled={busy}>{busy?'Verificando…':removing?'Confirmar desvinculación':setup?'Confirmar y activar':'Verificar y continuar'}</button></>:<p>No hay un autenticador TOTP disponible. Solicitá asistencia al responsable de GET; no se puede omitir la verificación.</p>}
      </form>}
      {setup&&<button className="secondary" disabled={busy} onClick={()=>run(async()=>{if(!resultError(await cancelMfa({id:setup.id}))){setSetup(null);setCode('');}})}>Cancelar configuración</button>}
      {!challenge&&!setup&&!removing&&totp.length>0&&<button className="secondary" disabled={busy} onClick={()=>{setSelected(totp[0].id);setRemoving(true);setCode('');}}>Desvincular un autenticador con su código</button>}
      {removing&&<button className="secondary" disabled={busy} onClick={()=>{setRemoving(false);setCode('');}}>Cancelar</button>}
      <p role="status" aria-live="polite">{notice}</p>
      <details><summary>¿Perdiste el dispositivo?</summary><p>Usá otro autenticador previamente verificado, si lo tenés. Si no, contactá al responsable por un canal conocido. Se debe verificar tu identidad y restablecer el factor desde Supabase, revocando las sesiones anteriores. Recuperar la contraseña no elimina el segundo factor. GET no ofrece códigos de emergencia ni enlaces para omitirlo.</p></details>
      {!challenge&&<Link href="/administrador">Volver al Centro de Control</Link>}
      <form action={logout}><button className="secondary">Cerrar sesión</button></form>
    </section>
  </div></main>;
}
