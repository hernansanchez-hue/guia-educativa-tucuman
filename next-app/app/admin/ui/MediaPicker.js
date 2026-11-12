"use client";
import {useRef,useState} from 'react';
import MediaLibrary from './MediaLibrary';
import s from '../workspace.module.css';
export default function MediaPicker({onSelect,label='Elegir recurso',filter='',onFocus}){
 const dialog=useRef(),[opened,setOpened]=useState(false);
 return <><button type='button' className={s.secondary} onClick={()=>{onFocus?.();setOpened(true);dialog.current.showModal();}}>{label}</button><dialog ref={dialog} className={s.mediaDialog} aria-label='Biblioteca multimedia'><header><h2>Biblioteca multimedia</h2><button type='button' className={s.secondary} onClick={()=>dialog.current.close()}>Cerrar</button></header>{opened?<MediaLibrary filter={filter} onSelect={url=>{onSelect(url);dialog.current.close();}}/>:null}</dialog></>;
}
