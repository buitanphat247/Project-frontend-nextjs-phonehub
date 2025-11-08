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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phonehub.vn',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },

  // Experimental features đã được loại bỏ để tránh lỗi serialize
};

export default nextConfig;
