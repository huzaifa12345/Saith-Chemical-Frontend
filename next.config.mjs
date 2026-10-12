import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Classic App Router SSR (Express-backed API).
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.saithchemicals.com' },
      { protocol: 'https', hostname: 'saithchemicals.com' },
      { protocol: 'https', hostname: 'saith-chemical-e-com.vercel.app' },
    ],
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
