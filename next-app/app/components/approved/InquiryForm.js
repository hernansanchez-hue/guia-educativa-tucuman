"use client";
import {useRef,useState} from 'react';
import Link from 'next/link';
import {submitPublicInquiry} from '../../../lib/public-leads';
import {INQUIRY_PRIVACY_VERSION} from '../../../lib/privacy/inquiry-consent.mjs';
import {allowsCareerInquiry} from '../../../lib/catalog/profile-presentation.mjs';
import {Icon} from './DesignShared';
export default function InquiryForm({institution,career,offering,topic='Información general',onTopic=()=>{}}){
 const [status,setStatus]=useState(''),[busy,setBusy]=useState(false);const submitting=useRef(false);
 if (!career || !allowsCareerInquiry(institution,offering?.id)) return null;
 async function submit(event){event.preventDefault();if(submitting.current)return;const form=event.currentTarget;if(!form.reportValidity())return;submitting.current=true;setBusy(true);setStatus('');const d=new FormData(form);const payload={institutionId:institution.id,offeringId:offering.id,name:String(d.get('name')||'').trim(),phone:String(d.get('phone')||'').trim(),email:String(d.get('email')||'').trim(),privacyConsent:d.get('consent')==='on',privacyVersion:INQUIRY_PRIVACY_VERSION,query:[`Tema: ${topic}`,String(d.get('query')||'').trim()].filter(Boolean).join('\n')};
 try{await submitPublicInquiry(payload);setStatus('Tu consulta fue recibida correctamente.');form.reset();}catch{setStatus('La recepción no fue confirmada. Los datos siguen en el formulario para reintentar; no se guardó una copia en este navegador.');}finally{setBusy(false);submitting.current=false;}}
 return <form className="career-form" onSubmit={submit}>
 <div className="form-header"><span className="form-step">01</span><div><h3>Contanos qué te interesa.</h3><p>Consulta sobre {career.name}</p></div></div>
 <div className="topic-chips" role="group" aria-label="Tema de tu consulta">{['Información general','Aranceles','Modalidad','Equivalencias','Ingreso'].map(t=><button type="button" key={t} aria-pressed={topic===t} onClick={()=>onTopic(t)}>{t}</button>)}</div>
 <div className="form-fields"><label>Nombre y apellido <span>*</span><input name="name" autoComplete="name" required minLength="3" maxLength="100" placeholder="Tu nombre completo"/></label><label>Celular / WhatsApp <span>*</span><input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9 ()-]{8,22}" maxLength="22" placeholder="Código de área + número"/></label><label className="full">Correo electrónico <span>*</span><input name="email" type="email" autoComplete="email" required maxLength="150" placeholder="nombre@correo.com"/></label><label className="full">Tu consulta <small>(opcional)</small><textarea name="query" rows="3" maxLength="1500" placeholder="Contanos qué te gustaría saber…"/></label></div>
 <label className="consent"><input type="checkbox" name="consent" required/><span>Autorizo a GET a gestionar esta consulta y enviar mis datos a {institution.name} mediante GET Instituciones para recibir una respuesta, según la <Link href="/privacidad" target="_blank" rel="noopener noreferrer">Política de Privacidad</Link>. No incluye publicidad ajena a mi consulta.</span></label>
 <button className="button navy submit-button" disabled={busy} type="submit">{busy?'Enviando…':'Enviar consulta'}<Icon/></button><p role="status" aria-live="polite">{status}</p></form>;
}
