// Keep unknown/editorial providers on their original URL. Only these public
// sources are allowed through the Next image optimizer (see next.config.mjs).
export function canOptimizePublicImage(src) {
  if (typeof src !== 'string' || /\.svg(?:\?|$)/i.test(src)) return false;
  if (src.startsWith('/assets/')) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && !url.port && (
      url.hostname === 'images.unsplash.com' && /^\/photo-[\w-]+$/.test(url.pathname)
      || url.hostname === 'res.cloudinary.com' && url.pathname.startsWith('/disj9fs8m/image/upload/')
    );
  } catch {
    return false;
  }
}
