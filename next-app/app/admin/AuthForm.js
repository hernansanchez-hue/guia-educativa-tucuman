"use client";
import { useActionState } from "react";
import styles from "./admin.module.css";

export default function AuthForm({ action, mode = "login" }) {
  const [state, formAction, pending] = useActionState(action, { message: "" });
  return <form action={formAction} className={styles.form}>
    {mode !== "reset" && <><label htmlFor="email">Email</label><input autoComplete="email" id="email" name="email" type="email" maxLength={254} required /></>}
    {mode !== "recover" && <><label htmlFor="password">{mode === "reset" ? "Nueva contraseña" : "Contraseña"}</label><input autoComplete={mode === "reset" ? "new-password" : "current-password"} id="password" name="password" type="password" minLength={mode === "reset" ? 12 : 1} maxLength={128} required /></>}
    <button disabled={pending} type="submit">{pending ? "Procesando…" : mode === "recover" ? "Enviar enlace de recuperación" : mode === "reset" ? "Guardar contraseña" : "Ingresar"}</button>
    <span aria-live="polite" className={styles.message}>{state.message}</span>
  </form>;
}
