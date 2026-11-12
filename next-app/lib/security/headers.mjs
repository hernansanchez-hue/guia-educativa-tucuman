// Static-compatible CSP: Next's inline bootstrap is required by ISR. No eval in production.
// Nonce-only CSP would force every public page to SSR and is not enabled silently here.
export function contentSecurityPolicy(development = false) {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com" + (development ? " 'unsafe-eval'" : ''),
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://zomoblpgurchkxvkkutj.supabase.co wss://zomoblpgurchkxvkkutj.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com" + (development ? ' ws://localhost:* ws://127.0.0.1:*' : ''),
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'self'", "worker-src 'self' blob:",
  ].join('; ');
}

export function securityHeaders(development = false) {
  return [
    {key: 'Content-Security-Policy', value: contentSecurityPolicy(development)},
    {key: 'X-Content-Type-Options', value: 'nosniff'},
    {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
    {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'},
  ];
}
