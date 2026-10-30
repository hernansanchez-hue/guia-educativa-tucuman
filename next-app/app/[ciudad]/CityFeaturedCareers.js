"use client";

import {useCallback,useEffect,useMemo,useRef,useState} from "react";
import PublicImage from "../components/PublicImage";
import CityEditorialImage from "./CityEditorialImage";
import useViewportActivity from "../components/useViewportActivity";
import {DesignIcon as Icon,moveTo} from "../components/ApprovedHomeUI";
import {resolveCityBanner} from "../../lib/catalog/city-template.mjs";

function logoFor(city,slide){
 const institution=city.institutions?.find(i=>i.id===slide.institutionId||slide.institution.route===`/${city.slug}/${i.slug}`);
 if(typeof institution?.logo==="string" && /^(https?:\/\/|\/)/.test(institution.logo))return institution.logo;
 if(slide.institution.route?.includes("/universidad-siglo-21"))return "/assets/universidad-siglo-21-logo.png";
 if(slide.institution.route?.includes("/instituto-santa-barbara"))return "/assets/approved-home/santa-logo.png";
 return null;
}
function referencePhoto(slide){
 const name=slide?.title||slide?.name||"";
 return "/assets/approved-home/city-reference/"+(/contador|administraci|econom/i.test(name)?"expo.jpg":/quirúrgic|salud/i.test(name)?"students.jpg":"campus.jpg");
}

export default function CityFeaturedCareers({city,onOpenCareer,onOpenInstitution,dialogOpen=false}){
 const banner=useMemo(()=>resolveCityBanner(city),[city]), slides=banner.slides, total=slides.length;
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[hover,setHover]=useState(false),[focused,setFocused]=useState(false),[reduced,setReduced]=useState(false),[changing,setChanging]=useState(false);
 const progress=useRef(null),elapsed=useRef(0),transition=useRef(null),touch=useRef(null);
 const {ref,active}=useViewportActivity({reducedMotion:true});
 const preview=slides.find(s=>s.id===city.previewSlideId);
 const slide=preview||slides[index%total]||slides[0];
 const playing=active&&!paused&&!hover&&!focused&&!dialogOpen&&!changing&&!reduced&&!preview&&total>1;
 useEffect(()=>{const m=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>setReduced(m.matches);update();m.addEventListener("change",update);return()=>{m.removeEventListener("change",update);clearTimeout(transition.current);};},[]);
 const select=useCallback(next=>{
  elapsed.current=0;if(progress.current)progress.current.style.transform="scaleX(0)";
  clearTimeout(transition.current);
  const target=(next+total)%total;
  if(!total)return;
  if(reduced){setIndex(target);setChanging(false);return;}
  setChanging(true);transition.current=setTimeout(()=>{setIndex(target);setChanging(false);},220);
 },[total,reduced]);
 useEffect(()=>{
  if(!playing)return;
  let frame=0,previous=null;
  function tick(time){if(previous!==null)elapsed.current+=Math.min(time-previous,60);previous=time;if(progress.current)progress.current.style.transform=`scaleX(${Math.min(elapsed.current/6500,1)})`;if(elapsed.current>=6500){select(index+1);return;}frame=requestAnimationFrame(tick);}
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[playing,index,select]);
 if(!slide)return <section className="hero wrap" ref={ref} data-banner-kind="editorial" aria-labelledby="featuredCareersTitle"><div className="hero-copy"><div className="eyebrow gold">GUÍA EDUCATIVA TUCUMÁN</div><h2 id="featuredCareersTitle">{banner.title}</h2><p>{banner.description}</p><button className="gold-button" onClick={()=>moveTo("instituciones")}>{banner.ctaLabel}<Icon/></button></div><div className="hero-photo"><CityEditorialImage src={banner.image} fallbackSrc="/assets/approved-home/city-reference/campus.jpg" alt="Imagen ilustrativa de educación" width={1200} height={800} sizes="(max-width:780px) 100vw,50vw" loading="eager"/></div></section>;
 const title=Array.isArray(city.slides)?slide.title:city.heroTitle||slide.name;
 const description=Array.isArray(city.slides)?slide.description:city.heroDescription||slide.description;
 const image=Array.isArray(city.slides)?slide.image:city.heroImage||slide.image;
 const logo=logoFor(city,slide);
 return <section className={"hero wrap"+(changing?" is-changing":"")} data-banner-kind="commercial" aria-labelledby="featuredCareersTitle" ref={ref}
  onPointerEnter={e=>{if(e.pointerType==="mouse")setHover(true);}} onPointerLeave={()=>setHover(false)}
  onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}
  onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
  onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(total>1&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))select(index+(dx<0?1:-1));touch.current=null;}}>
  <div className="hero-copy"><div className="eyebrow gold">ENCONTRÁ TU PRÓXIMO DESAFÍO</div><div className="sponsored"><span/>Carrera destacada</div><h2 id="featuredCareersTitle">{title}</h2><p>{description}</p>
   <div className="hero-institution"><span className="school-icon"><Icon name="school"/></span><div><small>ESTUDIÁ EN</small><strong>{slide.institution.name}</strong></div></div>
   <button className="gold-button" onClick={()=>onOpenCareer?.(slide.route)}>Conocer la carrera <Icon/></button>
   {total>1&&<div className="slider-controls"><div className="slides" aria-label="Elegir carrera">{slides.map((s,i)=><button key={s.id} className={s===slide?"selected":""} aria-label={"Mostrar "+s.name} aria-pressed={s===slide} onClick={()=>select(i)}/>)}</div><div className="arrows"><button aria-label={paused?"Reanudar carrusel":"Pausar carrusel"} aria-pressed={paused} onClick={()=>setPaused(!paused)}><Icon name={paused?"play":"pause"}/></button><span aria-live="off">{String(slides.indexOf(slide)+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span><button aria-label="Carrera anterior" onClick={()=>select(index-1)}><Icon name="previous"/></button><button aria-label="Siguiente carrera" onClick={()=>select(index+1)}><Icon name="next"/></button></div></div>}
  </div>
  <div className="hero-photo"><CityEditorialImage key={image||slide.id} src={image} fallbackSrc={referencePhoto(slide)} alt={slide.name+": imagen editorial ilustrativa"} width={1200} height={800} sizes="(max-width:780px) 100vw,50vw" loading="eager" style={{animationPlayState:playing?"running":"paused"}}/>
   <div className="photo-caption"><span>MUCHAS POSIBILIDADES.<br/>UN NUEVO COMIENZO.</span><Icon className="photo-arrow"/></div>
   <button className="brand-pair" aria-label={"Conocer "+slide.institution.name} onClick={()=>onOpenInstitution?.(slide.institution.route)}><span className="institution-logo-slot">{logo?<PublicImage src={logo} alt={slide.institution.name} width={130} height={47} sizes="130px"/>:<strong>{slide.institution.name}</strong>}</span><span className="brand-divider"/><PublicImage src="/assets/approved-home/logo.png" alt="Guía Educativa Tucumán" width={115} height={50} sizes="115px"/></button>
  </div>
  {total>1&&<div className="slide-progress" aria-hidden="true"><span ref={progress}/></div>}
 </section>;
}
