"use client";
import {useState} from 'react';
import Markup from './about-markup';
import {DesignShell,tabKeys} from './DesignShared';
import {stages} from './reference-fragments';
import './about.css';
export default function ApprovedAbout(){const [step,setStep]=useState('0');return <DesignShell kind="about"><div onClick={e=>{const b=e.target.closest('[data-step]');if(b)setStep(b.dataset.step);}} onKeyDown={tabKeys}><Markup state={{step}} slots={{journeyPanel:<div dangerouslySetInnerHTML={{__html:stages[Number(step)]}}/>}}/></div></DesignShell>;}
