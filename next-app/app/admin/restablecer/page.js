import { redirect } from "next/navigation";
import AuthForm from "../AuthForm";
import { resetPasswordAction } from "../actions";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import s from '../admin.module.css';
export default async function ResetPage({ searchParams }) {
  const params = await searchParams;
  const invitation = params?.modo === "invitacion";
  const client = await createSupabaseServerClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user?.email_confirmed_at) redirect(invitation ? "/admin/login" : "/admin/recuperar");
  return <div className={s.authPage}><section className={s.panel}><h1>{invitation ? "Elegí tu contraseña" : "Elegí una contraseña nueva"}</h1><p>Usá al menos 12 caracteres.</p><AuthForm action={resetPasswordAction} mode="reset" /></section></div>;
}
