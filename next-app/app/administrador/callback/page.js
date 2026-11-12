'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { accept } from '../access';
export default function Callback() {
  const started = useRef(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const url = new URL(location.href),
      params = new URLSearchParams(url.hash.slice(1));
    const input = Object.fromEntries(
      ['code', 'token_hash', 'type', 'access_token', 'refresh_token'].map((k) => [
        k,
        params.get(k) || url.searchParams.get(k),
      ]),
    );
    history.replaceState(null, '', '/administrador/callback');
    accept(input)
      .then((ok) => (ok ? location.replace('/administrador/restablecer') : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);
  return (
    <main className="gc-door">
      <p role="status">
        {failed ? 'El enlace no es válido o ya venció.' : 'Verificando el enlace seguro…'}{' '}
        {failed && <Link href="/administrador/recuperar">Solicitar recuperación</Link>}
      </p>
    </main>
  );
}
