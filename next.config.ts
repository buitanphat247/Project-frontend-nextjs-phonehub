import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tắt X-Powered-By header để bảo mật
  poweredByHeader: false,
  
  // Bật React Strict Mode
  reactStrictMode: true,
  
  // Bật compression
  compress: true,

  // Cấu hình images với cache tối ưu
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000, // cache ảnh 1 năm
  },

  // Tối ưu package imports và experimental features
  experimental: {
    optimizePackageImports: ['antd', 'swiper', '@ant-design/icons'],
    workerThreads: true,
    optimizeCss: true,
  },

  // Webpack config để tăng tốc rebuild trong dev mode
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Tối ưu watch options cho rebuild nhanh hơn
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },

  // Cache headers cho static assets và API routes
  async headers() {
    return [
      // Static assets cache - immutable (1 năm)
      // JavaScript files
      {
        source: '/:path*.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS files
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // SVG files
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JPG files
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JPEG files
      {
        source: '/:path*.jpeg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // PNG files
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // WebP files
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // ICO files
      {
        source: '/:path*.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // GIF files
      {
        source: '/:path*.gif',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      // General pages cache (fallback, áp dụng sau static assets)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

};

export default nextConfig;
