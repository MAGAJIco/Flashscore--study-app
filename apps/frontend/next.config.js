/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = withNextIntl({
  reactStrictMode: false,
  poweredByHeader: false,
  
  // Build optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // Error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true,
    formats: ['image/webp'],
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:5000',
        '*.replit.dev',
        '*.replit.app',
        '*.vercel.app',
      ],
    },
    optimizePackageImports: ['@magajico/shared'],
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for shared package resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@magajico/shared': require('path').resolve(__dirname, '../../packages/shared/src'),
    };
    
    // Optimize chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              if (!module.context) return 'npm.unknown';
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match || !match[1]) return 'npm.unknown';
              const packageName = match[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  
  // Output configuration for production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
});

module.exports = nextConfig;