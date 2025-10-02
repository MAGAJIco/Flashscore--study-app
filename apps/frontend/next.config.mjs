import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    formats: ["image/webp", "image/avif"],
  },

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

  async rewrites() {
    // For Vercel deployment, use Replit backend
    const backendUrl = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend-name.replit.app'
      : 'http://localhost:3000';

    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  // Vercel-specific configurations
  output: process.env.VERCEL ? 'standalone' : undefined,

  webpack: (config) => {
    // Chunk optimization
    if (config.optimization?.splitChunks) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 20,
          },
        },
      };
    }

    // Aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/app/components"),
      "@hooks": path.resolve(__dirname, "src/app/hooks"),
      "@controllers": path.resolve(__dirname, "src/app/controllers"),
      "@api": path.resolve(__dirname, "src/app/api"),
      "@services": path.resolve(__dirname, "src/app/services"),
      "@styles": path.resolve(__dirname, "src/app/styles"),
      "@config": path.resolve(__dirname, "src/app/config"),
      "@shared/types": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/types"
      ),
      "@shared/utils": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/utils"
      ),
      "@shared/models": path.resolve(
        __dirname,
        "../../packages/shared/src/libs/models"
      ),
    };

    return config;
  },
};

export default nextConfig;