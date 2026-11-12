import Link from 'next/link';
import {advancedLinks} from '../../../lib/admin/workspace-navigation.mjs';
import s from '../workspace.module.css';
export default function SettingsHub({actor}){
 return <><div className={s.pageHeading}><div><span className={s.eyebrow}>AJUSTES AVANZADOS</span><h1>Ajustes del sitio</h1><p>Opciones compartidas por las páginas de GET.</p></div></div><div className={s.settingsGrid}>{advancedLinks(actor).map(link=><Link className={s.taskCard} key={link.route} href={`/admin/${link.route}`}><div><h2>{link.label}</h2><p>{link.description}</p></div><span aria-hidden='true'>→</span></Link>)}</div></>;
}
