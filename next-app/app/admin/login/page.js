import Link from "next/link";
import AuthForm from "../AuthForm";
import { loginAction } from "../actions";
import { inspectAdminEnvironment } from "../../../lib/admin/environment.mjs";
import Image from 'next/image';
import {ADMIN_BRANDING} from '../../../lib/admin/module-registry.mjs';
import s from '../admin.module.css';

export default function LoginPage() {
  return <div className={s.login}><section className={s.loginStory}><Image className={s.loginLogo} src={ADMIN_BRANDING.logo} width={240} height={95} alt='Guía Educativa Tucumán' priority/><h2>Las oportunidades<br/>empiezan con vos.</h2><p>Un espacio para cuidar el contenido y conectar a las personas con su futuro.</p></section><section className={s.panel}><span>ACCESO DEL EQUIPO</span><h1>Administrador GET</h1><p>Ingresá para continuar con tu trabajo.</p>
    {inspectAdminEnvironment(process.env).configured ? <AuthForm action={loginAction} /> : <p role="alert">Administrador no configurado.</p>}
    <Link href="/admin/recuperar">¿Olvidaste tu contraseña?</Link></section></div>;
}
