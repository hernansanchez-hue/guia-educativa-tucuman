import {securityHeaders} from './lib/security/headers.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers() { return [
    {source: '/:path*', headers: securityHeaders(process.env.NODE_ENV === 'development')},
    {source: '/:path*', has: [{type: 'host', value: '(www\\.)?guiaeducativatuc\\.com\\.ar'}], headers: [{key: 'Strict-Transport-Security', value: 'max-age=31536000'}]},
  ]; },
  redirects() { return [{ source: '/ciudades', destination: '/', statusCode: 301 }]; },
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  outputFileTracingIncludes: {
    '/api/public-inquiries': ['./lib/integration/crm-mapping.json'],
  },
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/photo-*'},
      {protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/disj9fs8m/image/upload/**'},
    ],
  },
};

export default nextConfig;
