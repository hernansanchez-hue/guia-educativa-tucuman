"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";
import styles from "../admin.module.css";

const AUTH_TYPES = new Set(["invite", "recovery"]);

function safeValue(params, name) {
  const value = params.get(name);
  return value && value.length < 4096 ? value : null;
}

export default function AuthCallbackClient({ config }) {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function completeAuth() {
      const current = new URL(window.location.href);
      const query = current.searchParams;
      const fragment = new URLSearchParams(current.hash.startsWith("#") ? current.hash.slice(1) : current.hash);
      const type = safeValue(fragment, "type") || safeValue(query, "type");
      const accessToken = safeValue(fragment, "access_token");
      const refreshToken = safeValue(fragment, "refresh_token");
      const code = safeValue(query, "code");
      const tokenHash = safeValue(query, "token_hash");

      // Remove credentials from browser history before any network request or navigation.
      window.history.replaceState({}, "", "/admin/callback");

      const client = createSupabaseBrowserClient(config);
      let result = null;
      if (accessToken && refreshToken) {
        result = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      } else if (code) {
        result = await client.auth.exchangeCodeForSession(code);
      } else if (tokenHash && AUTH_TYPES.has(type)) {
        result = await client.auth.verifyOtp({ token_hash: tokenHash, type });
      }

      if (!result || result.error || !result.data?.session) {
        setFailed(true);
        return;
      }

      router.replace(type === "invite" ? "/admin/restablecer?modo=invitacion" : "/admin/restablecer");
      router.refresh();
    }

    completeAuth().catch(() => setFailed(true));
  }, [config, router]);

  return <div className={styles.authPage}><section className={styles.panel}>
    {failed ? <><h1>El enlace no es válido</h1><p>La invitación venció o ya fue utilizada.</p><Link href="/admin/login">Volver al ingreso</Link></> : <><h1>Validando invitación</h1><p>Estamos preparando el acceso seguro.</p></>}
  </section></div>;
}
