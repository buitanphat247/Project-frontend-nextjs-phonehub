/**
 * Image CDN Utilities
 * Hỗ trợ tối ưu hóa và phân phối hình ảnh qua CDN
 */

// CDN Configuration
export const CDN_CONFIG = {
  // Vercel Image Optimization (tự động khi deploy trên Vercel)
  vercel: {
    enabled: true,
    baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://phonehub.vn',
  },
  
  // Cloudflare Images (nếu cần sử dụng)
  cloudflare: {
    enabled: false,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    baseUrl: process.env.CLOUDFLARE_IMAGES_URL || '',
  },
  
  // ImageKit (nếu cần sử dụng)
  imagekit: {
    enabled: false,
    baseUrl: process.env.IMAGEKIT_URL || '',
    endpoint: process.env.IMAGEKIT_ENDPOINT || '',
  },
};

/**
 * Tối ưu hóa URL ảnh với Next.js Image Optimization
 * Next.js tự động xử lý khi sử dụng component Image
 */
export function getOptimizedImageUrl(
  src: string,
  width?: number,
  quality: number = 90
): string {
  // Nếu là relative path, trả về nguyên bản (Next.js sẽ tự xử lý)
  if (src.startsWith('/')) {
    return src;
  }
  
  // Nếu đã là full URL, trả về nguyên bản
  // Next.js Image component sẽ tự động optimize qua Vercel CDN
  return src;
}

/**
 * Tạo URL ảnh với Cloudflare Images CDN
 */
export function getCloudflareImageUrl(
  src: string,
  width?: number,
  quality: number = 90
): string {
  if (!CDN_CONFIG.cloudflare.enabled || !CDN_CONFIG.cloudflare.baseUrl) {
    return src;
  }
  
  const params = new URLSearchParams();
  if (width) params.set('width', width.toString());
  params.set('quality', quality.toString());
  
  return `${CDN_CONFIG.cloudflare.baseUrl}/${src}?${params.toString()}`;
}

/**
 * Tạo URL ảnh với ImageKit CDN
 */
export function getImageKitUrl(
  src: string,
  width?: number,
  quality: number = 90
): string {
  if (!CDN_CONFIG.imagekit.enabled || !CDN_CONFIG.imagekit.baseUrl) {
    return src;
  }
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  params.set('q', quality.toString());
  
  return `${CDN_CONFIG.imagekit.baseUrl}/${src}?${params.toString()}`;
}

/**
 * Lấy URL ảnh tối ưu dựa trên CDN được cấu hình
 */
export function getCDNImageUrl(
  src: string,
  width?: number,
  quality: number = 90
): string {
  // Ưu tiên Vercel Image Optimization (tự động với Next.js Image)
  if (CDN_CONFIG.vercel.enabled) {
    return getOptimizedImageUrl(src, width, quality);
  }
  
  // Fallback sang Cloudflare
  if (CDN_CONFIG.cloudflare.enabled) {
    return getCloudflareImageUrl(src, width, quality);
  }
  
  // Fallback sang ImageKit
  if (CDN_CONFIG.imagekit.enabled) {
    return getImageKitUrl(src, width, quality);
  }
  
  // Trả về URL gốc nếu không có CDN nào được bật
  return src;
}

/**
 * Kiểm tra xem URL có phải là external image không
 */
export function isExternalImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/**
 * Lấy domain từ URL ảnh
 */
export function getImageDomain(src: string): string | null {
  try {
    if (isExternalImage(src)) {
      const url = new URL(src);
      return url.hostname;
    }
    return null;
  } catch {
    return null;
  }
}

