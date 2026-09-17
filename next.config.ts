const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/resume.pdf/projects/ecommerce', destination: '/fa', permanent: true },
      { source: '/services/projects', destination: '/fa', permanent: true },
      { source: '/services/projects/ecommerce', destination: '/fa', permanent: true },
      { source: '/contact/blog', destination: '/fa', permanent: true },
      { source: '/contact/portfolio', destination: '/fa', permanent: true },
      { source: '/portfolio/blog', destination: '/fa', permanent: true },
      { source: '/contact/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/contact/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/portfolio/portfolio', destination: '/fa', permanent: true },
      { source: '/portfolio/projects', destination: '/fa', permanent: true },
      { source: '/portfolio/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/portfolio/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/contact/projects', destination: '/fa', permanent: true },
      { source: '/booking/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/about/projects', destination: '/fa', permanent: true },
      { source: '/booking/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/booking/projects/ecommerce', destination: '/fa', permanent: true },
      { source: '/about/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/about/projects/ecommerce', destination: '/fa', permanent: true },
      { source: '/about/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/booking/projects', destination: '/fa', permanent: true },
      { source: '/fa/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/booking/portfolio', destination: '/fa', permanent: true },
      { source: '/booking/blog', destination: '/fa', permanent: true },
      { source: '/about/blog', destination: '/fa', permanent: true },
      { source: '/services/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/services/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/blog/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/services/portfolio', destination: '/fa', permanent: true },
      { source: '/blog/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/blog/projects/ecommerce', destination: '/fa', permanent: true },
      { source: '/services/blog', destination: '/fa', permanent: true },
      { source: '/blog/projects', destination: '/fa', permanent: true },
      { source: '/resume.pdf/projects/telegram-bot', destination: '/fa', permanent: true },
      { source: '/blog/portfolio', destination: '/fa', permanent: true },
      { source: '/resume.pdf/projects/dashboard', destination: '/fa', permanent: true },
      { source: '/blog/blog', destination: '/fa', permanent: true },
      { source: '/resume.pdf/portfolio', destination: '/fa', permanent: true },
      { source: '/resume.pdf/blog', destination: '/fa', permanent: true },
      { source: '/fa/projects/ecommerce', destination: '/fa', permanent: true },
    ];
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
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