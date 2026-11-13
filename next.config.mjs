import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Classic App Router SSR (Express-backed API).
  trailingSlash: false,
  // Let middleware do one-hop /category/1/ → /category/slug (avoid 308 then 301)
  skipTrailingSlashRedirect: true,
  // Full-document 404 so we control a single robots meta (no duplicate noindex)
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.saithchemicals.com' },
      { protocol: 'https', hostname: 'saithchemicals.com' },
      { protocol: 'https', hostname: 'saith-chemical-e-com.vercel.app' },
    ],
  },
  async redirects() {
    return [
      // Apex → www (single 301 hop). Also set Primary Domain = www in Vercel.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'saithchemicals.com' }],
        destination: 'https://www.saithchemicals.com/:path*',
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: __dirname,
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
