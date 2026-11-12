'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {norm} from './navigation.mjs';
import ControlIcon from './ControlIcon';
import useInteractive from './useInteractive';
export default function SearchPicker({label,items,value,onSelect,placeholder='Elegir…',compact=false,disabled=false}) {
  const dlg=useRef(null),input=useRef(null),button=useRef(null),id=useId(), [query,search]=useState(''), [open,setOpen]=useState(false);
  const interactive=useInteractive(),selection=items.find(item=>item.id===value);
  const matches=items.filter(item=>norm(item.name+' '+(item.detail||'')).includes(norm(query)));
  useEffect(()=>{
    if(!open)return;
    const dialog=dlg.current;
    dialog.showModal();input.current?.focus();
    return ()=>{if(dialog.open)dialog.close();};
  },[open]);
  function close(){setOpen(false);button.current?.focus();}
  return <div className={'gc-pick'+(compact?' gc-pick-compact':'')}>
    <button ref={button} type="button" className="gc-pick-trigger" disabled={!interactive||disabled} aria-haspopup="dialog" aria-expanded={open} aria-label={label+': '+(selection?.name||placeholder)} onClick={()=>{search('');setOpen(true);}}>
      {compact&&<ControlIcon name="pin"/>}<span><small>{label}</small><strong>{selection?.name||placeholder}</strong></span><ControlIcon name="chevron"/>
    </button>
    <dialog ref={dlg} className="gc-choice-dialog" aria-labelledby={id} onCancel={close} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <section><div className="gc-choice-head"><h2 id={id}>{label}</h2><button type="button" className="gc-close" aria-label="Cerrar selector" onClick={close}>×</button></div>
      <label className="gc-search-field"><ControlIcon name="search"/><input type="search" aria-label={'Buscar: '+label} placeholder="Escribí para buscar…" ref={input} value={query} onChange={e=>search(e.target.value)}/></label>
      <small className="gc-result-count" role="status">{matches.length} {matches.length===1?'opción':'opciones'}</small>
      <ul className="gc-picker-rows">{matches.map(item=><li key={item.id}><button type="button" aria-pressed={item.id===value} onClick={()=>{close();onSelect(item.id);}}><span>{item.name}{item.detail&&<small>{item.detail}</small>}</span>{item.id===value&&<b aria-hidden="true">✓</b>}</button></li>)}</ul>
      {!matches.length&&<p>No hay coincidencias. Probá con otro nombre.</p>}</section>
    </dialog>
  </div>;
}
