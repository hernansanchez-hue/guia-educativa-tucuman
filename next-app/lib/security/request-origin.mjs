const loopback = hostname => ['localhost', '127.0.0.1', '[::1]'].includes(hostname);

// A reverse proxy may expose an internal request URL. Trust only the configured
// public origin, never client-controlled Host or X-Forwarded-* values.
export function hasTrustedPublicOrigin(request, env = process.env) {
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return false;
  try {
    if (env.GET_CONTROL_ORIGIN) {
      const configured = new URL(env.GET_CONTROL_ORIGIN);
      if (configured.username || configured.password || configured.pathname !== '/'
        || configured.search || configured.hash
        || (configured.protocol !== 'https:' && !(env.NODE_ENV !== 'production'
          && configured.protocol === 'http:' && loopback(configured.hostname)))) return false;
      if (origin === configured.origin) return true;
    }
    const target = new URL(request.url);
    const localBuild = loopback(target.hostname) && env.NETLIFY !== 'true';
    return origin === target.origin && (env.NODE_ENV !== 'production' || localBuild);
  } catch { return false; }
}
