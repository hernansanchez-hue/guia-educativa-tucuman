/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/public-inquiries': ['./lib/integration/crm-mapping.json'],
  },
};

export default nextConfig;
