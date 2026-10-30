/** @type {import('next').NextConfig} */
const nextConfig = {
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
