import Image from 'next/image';

interface SEOImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

/**
 * Component tối ưu SEO cho hình ảnh
 * Sử dụng Next.js Image component với alt text và lazy loading
 */
export function SEOImage({ 
  src, 
  alt, 
  width = 512, 
  height = 512, 
  priority = false,
  className 
}: SEOImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      quality={90}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

/**
 * Component Logo với SEO tối ưu
 */
export function Logo({ className, priority = true }: { className?: string; priority?: boolean }) {
  return (
    <SEOImage
      src="/logo.png"
      alt="Logo PhoneHub - Mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ trực tuyến"
      width={512}
      height={512}
      priority={priority}
      className={className}
    />
  );
}

/**
 * Component Banner với SEO tối ưu
 */
export function Banner({ className, priority = true }: { className?: string; priority?: boolean }) {
  return (
    <SEOImage
      src="/banner.jpg"
      alt="Banner PhoneHub - Khuyến mãi mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường"
      width={1200}
      height={630}
      priority={priority}
      className={className}
    />
  );
}

