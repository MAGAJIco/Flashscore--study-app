const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    '.replit.dev',
    '.replit.app',
    'localhost:5000',
    '0.0.0.0:5000'
  ],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_ML_URL: process.env.NEXT_PUBLIC_ML_URL,
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['*.vercel.app', 'localhost:5000']
    }
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // Error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = withNextIntl(nextConfig);