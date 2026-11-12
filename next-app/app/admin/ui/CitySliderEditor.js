'use client';
/* eslint-disable @next/next/no-img-element */
import {useState} from 'react';
import {seedCitySlides} from '../../../lib/admin/city-slider.mjs';
import {cityPageFromCatalog} from '../../../lib/admin/editorial-model.mjs';
import MediaPicker from './MediaPicker';
import s from '../workspace.module.css';

export default function CitySliderEditor({value,onChange,root,catalog,onFocus}) {
  const city=cityPageFromCatalog(catalog,root.data.slug)||{...root.data,institutions:[]};
  const slides=value??seedCitySlides(city),[opened,setOpened]=useState(-1);
  function update(index,changes){onChange(slides.map((slide,i)=>i===index?{...slide,...changes}:slide));onFocus(`root.data.slides.${index}`);}
  function move(index,direction){const next=[...slides],target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];onChange(next);setOpened(target);}
  function add(){onChange([...slides,{id:crypto.randomUUID(),title:'',description:'',image:'',href:'',ctaLabel:'Ver carrera',institutionCtaLabel:'Conocer más',institutionId:'',careerId:'',active:true}]);setOpened(slides.length);}
  const text=(slide,index,key,label,multiline=false)=><label className={s.field}>{label}{multiline?<textarea value={slide[key]||''} onChange={e=>update(index,{[key]:e.target.value})}/>:<input value={slide[key]||''} onChange={e=>update(index,{[key]:e.target.value})}/>}</label>;
  return <div id='field-root.data.slides'><p className={s.muted}>{slides.length} diapositivas · Se muestran en este orden. Guardar un borrador no cambia la página pública.</p><div className={s.slideList}>{slides.map((slide,index)=>{
    const institution=city.institutions.find(i=>i.id===slide.institutionId);
    return <article className={s.slideCard} key={slide.id}>
      <div className={s.slideSummary}>{slide.image?<img src={slide.image.replace('/media/cms/','/admin/media/')} alt=''/>:<div className={s.slidePlaceholder}>Imagen</div>}<div><small>Diapositiva {index+1} · {slide.active?'Visible':'Oculta'}</small><h3>{slide.title||'Nueva diapositiva'}</h3><p>{institution?.name||'Seleccioná una institución'}</p><button type='button' className={s.secondary} aria-expanded={opened===index} onClick={()=>{setOpened(opened===index?-1:index);onFocus(`root.data.slides.${index}`);}}>Editar diapositiva</button></div></div>
      <div className={s.slideActions}><button type='button' disabled={index===0} aria-label={`Subir diapositiva ${index+1}`} onClick={()=>move(index,-1)}>↑</button><button type='button' disabled={index===slides.length-1} aria-label={`Bajar diapositiva ${index+1}`} onClick={()=>move(index,1)}>↓</button><button type='button' onClick={()=>{onChange([...slides.slice(0,index+1),{...slide,id:crypto.randomUUID()},...slides.slice(index+1)]);setOpened(index+1);}}>Duplicar</button><button type='button' onClick={()=>update(index,{active:!slide.active})}>{slide.active?'Ocultar':'Mostrar'}</button><button type='button' onClick={()=>{if(window.confirm('¿Eliminar esta diapositiva del borrador?')){onChange(slides.filter((_,i)=>i!==index));setOpened(-1);}}}>Eliminar</button></div>
      {opened===index?<div className={s.slideFields}>
        <label className={s.field}>Institución<select value={slide.institutionId} onChange={e=>update(index,{institutionId:e.target.value,careerId:''})}><option value=''>Seleccioná una institución</option>{city.institutions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label>
        <label className={s.field}>Carrera o capacitación relacionada<select value={slide.careerId||''} onChange={e=>{const career=institution?.careers.find(c=>c.id===e.target.value);if(!career)return update(index,{careerId:''});const selected=seedCitySlides({...city,heroTitle:'',heroDescription:'',heroImage:'',institutions:[{...institution,careers:[career]}]})[0];update(index,{...selected,id:slide.id,active:slide.active});}}><option value=''>Elegí una propuesta o completá el contenido</option>{institution?.careers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        {text(slide,index,'title','Título')}{text(slide,index,'description','Subtítulo',true)}
        <div className={s.field}><label>Imagen de portada</label><MediaPicker label='Elegir o subir imagen' filter='image' onSelect={image=>update(index,{image})}/><details><summary>Usar enlace de imagen</summary><input aria-label='Enlace de imagen' value={slide.image} onChange={e=>update(index,{image:e.target.value})}/></details></div>
        {text(slide,index,'ctaLabel','Texto del botón')}{text(slide,index,'href','Destino del botón')}{text(slide,index,'institutionCtaLabel','Botón de la institución')}
      </div>:null}
    </article>;
  })}</div><button type='button' className={s.primary} disabled={slides.length>=30} onClick={add}>+ Agregar diapositiva</button></div>;
}
