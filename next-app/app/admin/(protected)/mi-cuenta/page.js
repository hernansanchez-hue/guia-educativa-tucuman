import {requireAdmin} from '../../../../lib/admin/auth';
import Link from 'next/link';
import s from '../../workspace.module.css';
export default async function MyAccount(){const {actor,client}=await requireAdmin();const {data}=await client.auth.getUser();return <section className={s.card}><h1>Mi cuenta</h1><p>{actor.displayName}</p><p>Email: {data.user?.email}</p><p>Rol: {actor.role}</p><Link href='/admin/recuperar'>Actualizar mi contraseña</Link></section>;}
