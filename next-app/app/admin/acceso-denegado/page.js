import Link from "next/link";
import s from '../admin.module.css';
export default function DeniedPage() {
  return <div className={s.authPage}><section className={s.panel}><h1>Acceso no habilitado</h1><p>Esta cuenta no tiene un perfil administrativo activo y verificado.</p><Link href="/admin/login">Volver al ingreso</Link></section></div>;
}
