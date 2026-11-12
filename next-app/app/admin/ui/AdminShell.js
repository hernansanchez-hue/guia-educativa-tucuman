"use client";
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ADMIN_MODULES,ADMIN_BRANDING} from '../../../lib/admin/module-registry.mjs';
import {logoutAction} from '../actions';
import Icon from './Icon';
import {usePublicEditorial} from '../../components/PublicEditorialContext';
import {workspaceNavigation} from '../../../lib/admin/workspace-navigation.mjs';
import s from '../workspace.module.css';
const routes={design:'diseno',seo:'seo',users:'usuarios',history:'historial',settings:'configuracion',home:'home',cities:'ciudades',institutions:'instituciones',careers:'carreras',events:'eventos',services:'servicios',trainings:'capacitaciones',about:'nosotros',orientation:'orientacion-vocacional',banners:'banners',media:'multimedia',navigation:'menus',footer:'footer'};
export default function AdminShell({actor,children}){
 const footer=usePublicEditorial('footer');
 const pathname=usePathname();const [collapsed,setCollapsed]=useState(false);const drawer=useRef(null);
 useEffect(()=>{drawer.current?.close();},[pathname]);
 const label=ADMIN_MODULES.find(m=>pathname.startsWith(`/admin/${routes[m.id]||'--'}`))?.label||(pathname.startsWith('/admin/ajustes')?'Ajustes avanzados':'Panel');
 const navigation= <><Link href='/admin' className={s.brand}><img src={footer.logo||ADMIN_BRANDING.logo} alt='Guía Educativa Tucumán'/></Link><div className={s.nav}>{workspaceNavigation(actor).map(group=><div key={group.label}><p>{group.label}</p>{group.links.map(([label,route,icon])=><Link key={route} title={label} className={(route?pathname.startsWith(`/admin/${route}`):pathname==='/admin')?s.active:''} href={route?`/admin/${route}`:'/admin'}><Icon name={icon}/><span>{label}</span></Link>)}</div>)}</div><button aria-label={collapsed?'Expandir menú':'Contraer menú'} className={s.collapseButton} onClick={()=>setCollapsed(!collapsed)}><Icon name='menu'/><span>{collapsed?'Expandir menú':'Contraer menú'}</span></button></>;
 return <div className={`${s.workspace} ${collapsed?s.collapsed:''}`}><aside className={s.sidebar} aria-label='Navegación administrativa'>{navigation}</aside><dialog ref={drawer} className={s.drawer}><button aria-label='Cerrar menú' onClick={()=>drawer.current.close()}><Icon name='close'/></button>{navigation}</dialog><div className={s.main}><header className={s.topbar}><button className={s.menuToggle} aria-label='Abrir menú' onClick={()=>drawer.current.showModal()}><Icon name='menu'/></button><div><span className={s.breadcrumb}>GET / Administrador / {label}</span><strong>{label}</strong></div><Link href='/admin/buscar' className={s.textButton} aria-label='Buscar contenido en el administrador'>Buscar</Link><details className={s.userMenu}><summary><span className={s.avatar}>{actor.displayName?.slice(0,1)}</span><span>{actor.displayName}<small>{actor.role}</small></span><Icon name='chevron'/></summary><div><Link href='/admin/mi-cuenta'>Mi cuenta</Link><form action={logoutAction}><button type='submit'><Icon name='logout'/>Cerrar sesión</button></form></div></details></header><div className={s.content}>{children}</div></div></div>;
}
