'use client';
import Link from 'next/link';
import { useActionState } from 'react';
import { login, recover, reset } from './access';
export default function AuthPanel({ mode = 'login', enabled = true }) {
  const recovery = mode === 'recover',
    change = mode === 'reset',
    isLogin = !recovery && !change;
  const [notice, submit, busy] = useActionState(change ? reset : recovery ? recover : login, '');
  return (
    <main className="gc-door">
      <div className="gc-door-inner">
        <div className="gc-door-mark">
          <small>GET · EQUIPO EDITORIAL</small>
          <h1>
            Centro de
            <br />
            Control<span>.</span>
          </h1>
          <p>Guía Educativa Tucumán</p>
        </div>
        <section className="gc-panel">
          <p className="gc-kicker">ACCESO PRIVADO</p>
          <h2>
            {change
              ? 'Elegí tu contraseña'
              : recovery
                ? 'Recuperar acceso'
                : 'Ingresá al administrador'}
          </h2>
          <p>
            {isLogin
              ? 'Usá tu cuenta autorizada de GET.'
              : change
                ? 'La contraseña se guarda en Supabase Auth.'
                : enabled
                  ? 'Te enviaremos un enlace seguro a tu correo.'
                  : 'El envío de correos está deshabilitado en este entorno. No se envió ningún mensaje.'}
          </p>
          {enabled && (
            <form action={submit}>
              {!change && (
                <label>
                  Correo electrónico
                  <input name="email" type="email" autoComplete="username" required />
                </label>
              )}
              {!recovery && (
                <label>
                  Contraseña
                  <input
                    name="password"
                    type="password"
                    minLength={change ? 12 : 1}
                    maxLength={128}
                    autoComplete={change ? 'new-password' : 'current-password'}
                    required
                  />
                </label>
              )}
              <button disabled={busy}>
                {busy
                  ? 'Un momento…'
                  : change
                    ? 'Guardar contraseña'
                    : recovery
                      ? 'Solicitar enlace'
                      : 'Iniciar sesión'}
              </button>
              <p role="status">{notice}</p>
            </form>
          )}
          <Link href={isLogin ? '/administrador/recuperar' : '/administrador/login'}>
            {isLogin ? 'Olvidé mi contraseña' : 'Volver al ingreso'}
          </Link>
        </section>
      </div>
    </main>
  );
}
