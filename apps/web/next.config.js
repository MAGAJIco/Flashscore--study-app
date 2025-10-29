const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  allowedDevOrigins: [
    process.env.REPLIT_DEV_DOMAIN,
    '127.0.0.1',
    'localhost',
  ].filter(Boolean).map(origin => {
    if (origin && !origin.includes('://')) {
      return `https://${origin}`;
    }
    return origin;
  }),
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = withNextIntl(nextConfig);
