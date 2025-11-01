import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tối ưu package imports để giảm bundle size và compile time
  experimental: {
    optimizePackageImports: ['antd', 'swiper', '@ant-design/icons'],
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
};

export default nextConfig;
