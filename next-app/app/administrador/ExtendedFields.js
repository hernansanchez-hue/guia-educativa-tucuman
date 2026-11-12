'use client';
import {MediaControl} from './MediaControl';

const get=(value,path)=>path.reduce((v,k)=>v?.[k],value);
function update(value,path,next){
  if(!path.length)return next;
  const result=structuredClone(value||{});
  let target=result;
  path.slice(0,-1).forEach(key=>{target=target[key]??={};});
  target[path.at(-1)]=next;
  return result;
}
function Input({field,value,onChange,pick,model}){
  const type=field.type||'text',label=field.label;
  if(type==='image'||type==='gallery')return <MediaControl field={type==='gallery'?'gallery':'image'} label={label} value={value} onChange={onChange} onChoose={pick}/>;
  if(type==='checkbox')return <label className="gc-check"><input type="checkbox" checked={field.path.endsWith('visible')?value!==false:!!value} onChange={e=>onChange(e.target.checked)}/>{label}</label>;
  if(type==='all-institution-checks')return <fieldset><legend>{label}</legend>{model.institutionOptions.map(item=><label className="gc-check" key={item.id}><input type="checkbox" checked={(value||[]).includes(item.id)} onChange={e=>onChange(e.target.checked?[...(value||[]),item.id]:(value||[]).filter(id=>id!==item.id))}/>{item.name}</label>)}</fieldset>;
  if(type==='select'||field.path==='root.data.city'){
    const options=field.path==='root.data.city'?model.cities.map(c=>[c.name,c.name]):field.options;
    return <label>{label}<select value={value||''} onChange={e=>onChange(e.target.value)}><option value="">Seleccionar…</option>{options.map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></label>;
  }
  if(type==='collection'){
    const rows=value||[];
    return <fieldset><legend>{label}</legend>{rows.map((item,i)=><div className="gc-item" key={i}>{field.itemFields.map(child=><Input key={child.path} field={child} value={get(item,child.path.split('.'))} onChange={next=>onChange(rows.map((row,n)=>n===i?update(row,child.path.split('.'),next):row))} pick={pick} model={model}/>)}<button type="button" className="secondary" onClick={()=>onChange(rows.filter((_,n)=>n!==i))}>Retirar</button></div>)}<button type="button" className="secondary" onClick={()=>onChange([...rows,{...(field.path==='root.data.plans'?{id:'plan-'+crypto.randomUUID()}:{}),...Object.fromEntries(field.itemFields.map(f=>[f.path,f.type==='text-list'?[]:f.type==='checkbox'?true:'']))}])}>Agregar</button></fieldset>;
  }
  if(type==='textarea'||type==='text-list')return <label>{label}{type==='text-list'?' (uno por línea)':''}<textarea rows={4} value={type==='text-list'?(value||[]).join('\n'):value||''} onChange={e=>onChange(type==='text-list'?e.target.value.split('\n').filter(Boolean):e.target.value)}/></label>;
  return <label>{label}<input type={['number','date','url'].includes(type)?type:'text'} value={value??''} onChange={e=>onChange(type==='number'?Number(e.target.value):e.target.value)}/></label>;
}
export default function ExtendedFields({definitions,values,set,pick,model}){
  return definitions.map(field=>{
    const path=field.path.startsWith('root.seo.')?['seo',...field.path.slice(9).split('.')]:field.path.slice(10).split('.');
    const [top,...nested]=path;
    return <Input key={field.path} field={field} model={model} value={get(values,path)} onChange={next=>set(top,update(values[top],nested,next))} pick={pick}/>;
  });
}
