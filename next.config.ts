const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // سایر دامنه‌های خارجی که ممکن است URL تصویر باشند
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    root: path.join(__dirname),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
