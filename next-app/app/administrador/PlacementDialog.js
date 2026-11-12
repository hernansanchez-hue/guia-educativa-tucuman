'use client';
import {useEffect,useRef,useState} from 'react';
import {changeContent,openEditor} from './editor-actions';
export default function PlacementDialog({row,venues,cities,onClose,onSaved}){
  const dlg=useRef(null);
  const members=venues.filter(v=>v.brandId===row.brandId&&v.visible&&!v.unpublished);
  const [selected,choose]=useState(row.id),[pos,setPos]=useState(1),[m,setModel]=useState(null),[busy,wait]=useState(false),[message,tell]=useState('');
  const venue=members.find(v=>v.id===selected),city=cities.find(c=>c.id===venue?.cityId);
  useEffect(()=>{const d=dlg.current;d.showModal();return ()=>d.close();},[]);
  useEffect(()=>{
    let current=true;
    if(city)openEditor(city.slug).then(model=>{if(current){setModel(model);const at=(model.values.placements||[]).findIndex(p=>p.id===selected);setPos(at<0?(model.values.placements?.length||0)+1:at+1);}}).catch(()=>{if(current)tell('No se pudieron cargar los destacados. Cerrá y volvé a intentar.');});
    return ()=>{current=false;};
  },[city,selected]);
  const rows=m?.values.placements||[],order=rows.filter(p=>p.id!==selected),old=rows.find(p=>p.id===selected);
  async function save(e){
    e.preventDefault();if(!m||!venue||busy)return;wait(true);tell('');
    try{
      const next=order.slice();next.splice(pos-1,0,{...old,id:selected,active:true});
      const res=await changeContent({op:'save',key:m.key,revision:m.revision,patch:{...m.patch,placements:next}});
      if(!res.ok)throw Error(res.message);onSaved(city,m.title);
    }catch(err){tell(err.message||'No se pudo guardar.');}finally{wait(false);}
  }
  return <dialog ref={dlg} className="gc-choice-dialog" aria-labelledby="gc-place-title" onCancel={e=>{if(busy)e.preventDefault();else onClose();}}>
    <section><div className="gc-choice-head"><h2 id="gc-place-title">Destacar institución</h2><button type="button" aria-label="Cerrar" className="gc-close" disabled={busy} onClick={onClose}>×</button></div>
    <p>{row.name}</p><form onSubmit={save}><label>Ciudad y sede<select value={selected} disabled={busy} onChange={e=>{setModel(null);tell('');choose(e.target.value);}}>{members.map(v=><option key={v.id} value={v.id}>{v.city} · {v.name}</option>)}</select></label>
    <label>Posición en destacados<select value={pos} disabled={!m||busy} onChange={e=>setPos(Number(e.target.value))}>{Array.from({length:order.length+1},(_,i)=><option key={i} value={i+1}>{i+1}{i===0?' · Primera posición':''}</option>)}</select></label>
    <p className="gc-help">Se usará la ficha existente de esa sede. El plan comercial no cambia. El público verá el destaque solo después de publicarlo.</p>
    <div className="gc-tools"><button type="submit" disabled={!m||busy}>{busy?'Guardando…':'Confirmar y guardar borrador'}</button><button className="secondary" disabled={busy} type="button" onClick={onClose}>Cancelar</button></div>
    <p role="status">{message||(!m?'Cargando posiciones…':'')}</p></form></section>
  </dialog>;
}
