import Link from "next/link";
import AuthForm from "../AuthForm";
import { recoverAction } from "../actions";
import s from '../admin.module.css';
export default function RecoveryPage() {
  return <div className={s.authPage}><section className={s.panel}><h1>Recuperar contraseña</h1><p>Te enviaremos un enlace para elegir una contraseña nueva.</p><AuthForm action={recoverAction} mode="recover" /><Link href="/admin/login">Volver al ingreso</Link></section></div>;
}
