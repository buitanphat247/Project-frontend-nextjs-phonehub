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
};

export default nextConfig;
