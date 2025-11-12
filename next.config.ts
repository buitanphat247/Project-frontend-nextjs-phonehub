import type { NextConfig } from "next";

// Bundle Analyzer - Dynamic require để tránh lỗi TypeScript
let withBundleAnalyzer: any = null;
if (process.env.ANALYZE === 'true') {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
}

const nextConfig: NextConfig = {
  // Tắt X-Powered-By header để bảo mật
  poweredByHeader: false,
  
  // Tạm tắt React Strict Mode để tránh xung đột package
  reactStrictMode: false,
  
  // Bật compression
  compress: true,

  // Cấu hình SWC compiler để loại bỏ console trong production
  // Next.js 16 sử dụng SWC minifier mặc định
  compiler: {
    // Loại bỏ console.* trong production build
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['warn'], // Giữ lại console.warn để hiển thị cảnh báo
    } : false,
  },

  // Cấu hình images với CDN và cache tối ưu
  images: {
    // Vercel Image Optimization (tự động khi deploy trên Vercel)
    // Sử dụng WebP format để giảm kích thước file
    formats: ['image/webp', 'image/avif'],
    
    // Cache ảnh 1 năm (31536000 giây)
    minimumCacheTTL: 31536000,
    
    // Device sizes cho responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes cho các breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cho phép tối ưu hóa ảnh (Vercel CDN tự động xử lý)
    // Note: quality được set trong Image component, không phải trong config
    unoptimized: false,
    
    // Cấu hình remote patterns cho external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phonehub.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
      // Có thể thêm các CDN khác ở đây
      // {
      //   protocol: 'https',
      //   hostname: '**.cloudflare.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: '**.imagekit.io',
      //   pathname: '/**',
      // },
    ],
    
    // Content Security Policy cho images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Tối ưu webpack cho tree shaking (SWC minifier đã là mặc định trong Next.js 16)
  webpack: (config) => {
    // Đảm bảo tree shaking hoạt động tốt
    // Next.js 16 đã tự động xử lý React resolution, không cần alias
    config.optimization = {
      ...config.optimization,
      usedExports: true, // Đánh dấu exports được sử dụng
      // Không set sideEffects: false global vì sẽ tree-shake cả React context
      // sideEffects được xử lý trong package.json
    };

    return config;
  },

  // Tối ưu experimental features
  experimental: {
    optimizePackageImports: [
      '@ant-design/icons', // Tree shake Ant Design icons
      'antd', // Tree shake Ant Design components
      'framer-motion', // Tree shake Framer Motion
    ],
  },
};

// Export với bundle analyzer nếu ANALYZE=true
export default withBundleAnalyzer 
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
