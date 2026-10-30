"use client";

import {useEffect, useRef} from 'react';

export function DesignIcon({name='arrow', ...props}) {
  const paths = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    school: <path d="m3 9 9-6 9 6H3ZM5 10v9m5-9v9m4-9v9m5-9v9M3 21h18"/>,
    book: <path d="M12 6v15M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Z"/>,
    cap: <path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v6c4 3 8 3 12 0v-6m4-3v8"/>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    previous: <path d="m10 5-7 7 7 7M3 12h18"/>,
    next: <path d="m14 5 7 7-7 7M3 12h18"/>,
    pause: <path d="M9 5v14M15 5v14"/>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    spark: <path d="M12 1v22M1 12h22M4 4l16 16M4 20 20 4"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name] || paths.arrow}</svg>;
}

export function moveTo(id, focus=false) {
  const element=document.getElementById(id);
  if(!element)return;
  element.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  if(focus)element.focus({preventScroll:true});
}

// Native modal supplies focus containment and Escape; restore the exact trigger.
export function DesignDialog({open,onClose,title,id,children}) {
  const dialog=useRef(null);
  const trigger=useRef(null);
  useEffect(()=>{
    const element=dialog.current;
    if(open && !element.open){trigger.current=document.activeElement;element.showModal();}
    if(!open && element.open)element.close();
    return ()=>{if(element.open)element.close();};
  },[open]);
  function handleKeys(event) {
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();event.currentTarget.close();return;}
    if(event.key!=='Tab')return;
    const controls=[...event.currentTarget.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(element=>element.getClientRects().length);
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
  return <dialog ref={dialog} aria-labelledby={`${id}-title`} onKeyDown={handleKeys} onClose={()=>{onClose();trigger.current?.focus?.();}} onClick={event=>{if(event.target===event.currentTarget){const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close();}}}>
    <button type="button" className="close" aria-label="Cerrar" onClick={()=>dialog.current.close()}>×</button>
    <h2 id={`${id}-title`}>{title}</h2>{children}
  </dialog>;
}
