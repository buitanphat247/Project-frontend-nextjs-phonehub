# CDN Image Optimization - Tối ưu hóa phân phối hình ảnh

## Tổng quan

Dự án sử dụng **Vercel Image Optimization** (mặc định) để tối ưu hóa và phân phối hình ảnh toàn cầu với tốc độ cao.

## CDN được hỗ trợ

### 1. **Vercel Image Optimization** (Mặc định) ✅

**Ưu điểm:**
- ✅ Tự động tích hợp với Next.js
- ✅ Tự động optimize format (WebP, AVIF)
- ✅ Lazy loading tự động
- ✅ Responsive images tự động
- ✅ Global CDN với edge locations
- ✅ Miễn phí cho Vercel deployments

**Cách sử dụng:**
```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={512}
  height={512}
  quality={90}
  priority={true} // Cho ảnh above-the-fold
/>
```

**Cấu hình trong `next.config.ts`:**
```typescript
images: {
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 31536000, // 1 năm
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  quality: 90,
  unoptimized: false,
}
```

### 2. **Cloudflare Images** (Tùy chọn)

**Khi nào sử dụng:**
- Cần control nhiều hơn về image processing
- Cần analytics chi tiết
- Deploy trên platform khác ngoài Vercel

**Cấu hình:**
1. Tạo Cloudflare Images account
2. Thêm environment variables:
   ```env
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_IMAGES_URL=https://imagedelivery.net/your_account_id
   ```
3. Bật trong `lib/utils/imageCDN.ts`:
   ```typescript
   cloudflare: {
     enabled: true,
     // ...
   }
   ```

### 3. **ImageKit** (Tùy chọn)

**Khi nào sử dụng:**
- Cần real-time image transformation
- Cần watermark, text overlay
- Cần advanced image manipulation

**Cấu hình:**
1. Tạo ImageKit account
2. Thêm environment variables:
   ```env
   IMAGEKIT_URL=https://ik.imagekit.io/your_imagekit_id
   IMAGEKIT_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ```
3. Bật trong `lib/utils/imageCDN.ts`:
   ```typescript
   imagekit: {
     enabled: true,
     // ...
   }
   ```

## Best Practices

### ✅ Sử dụng Next.js Image Component

```tsx
// ✅ Good - Tự động optimize qua Vercel CDN
import Image from 'next/image';

<Image
  src={product.thumbnailImage}
  alt={product.name}
  width={400}
  height={400}
  quality={90}
  loading="lazy"
/>
```

```tsx
// ❌ Bad - Không được optimize
<img src={product.thumbnailImage} alt={product.name} />
```

### ✅ Priority Loading cho Above-the-Fold Images

```tsx
// Logo, hero images
<Image
  src="/logo.png"
  alt="Logo"
  width={512}
  height={512}
  priority={true} // Load ngay lập tức
/>
```

### ✅ Responsive Images

```tsx
<Image
  src="/banner.jpg"
  alt="Banner"
  width={1920}
  height={630}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={90}
/>
```

### ✅ Lazy Loading cho Images Below-the-Fold

```tsx
<Image
  src={product.thumbnailImage}
  alt={product.name}
  width={400}
  height={400}
  loading="lazy" // Mặc định, không cần khai báo
/>
```

## Cấu hình hiện tại

### Vercel Image Optimization
- ✅ **Enabled**: Tự động khi deploy trên Vercel
- ✅ **Formats**: WebP, AVIF
- ✅ **Cache**: 1 năm (31536000 giây)
- ✅ **Quality**: 90 (cân bằng chất lượng/kích thước)
- ✅ **Device Sizes**: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
- ✅ **Image Sizes**: [16, 32, 48, 64, 96, 128, 256, 384]

### Remote Patterns
- ✅ `phonehub.vn` - Domain chính của website

## Migration Guide

### Chuyển từ `<img>` sang `<Image>`

**Trước:**
```tsx
<img
  src={product.thumbnailImage}
  alt={product.name}
  className="w-full h-full object-contain"
/>
```

**Sau:**
```tsx
import Image from 'next/image';

<Image
  src={product.thumbnailImage}
  alt={product.name}
  width={400}
  height={400}
  className="w-full h-full object-contain"
  quality={90}
/>
```

## Performance Benefits

### Vercel Image Optimization:
- 🚀 **Tốc độ**: Edge locations toàn cầu
- 📦 **Kích thước**: Giảm 30-50% với WebP/AVIF
- ⚡ **Lazy Loading**: Chỉ load khi cần
- 🎯 **Responsive**: Tự động chọn size phù hợp
- 💾 **Cache**: CDN cache 1 năm

## Monitoring

### Vercel Analytics
- Xem image optimization stats trong Vercel Dashboard
- Monitor bandwidth usage
- Track image load times

### Browser DevTools
- Network tab: Kiểm tra format (WebP/AVIF)
- Lighthouse: Kiểm tra image optimization score

## Troubleshooting

### Images không được optimize:
1. Kiểm tra `unoptimized: false` trong `next.config.ts`
2. Đảm bảo sử dụng Next.js `Image` component
3. Kiểm tra remote patterns có match domain không

### Images load chậm:
1. Kiểm tra `priority` cho above-the-fold images
2. Sử dụng `loading="lazy"` cho below-the-fold
3. Kiểm tra image sizes có phù hợp không

### External images không load:
1. Thêm domain vào `remotePatterns` trong `next.config.ts`
2. Kiểm tra CORS settings
3. Đảm bảo URL là HTTPS

## Kết quả mong đợi

- ✅ Giảm 30-50% kích thước file ảnh
- ✅ Cải thiện 20-40% thời gian load
- ✅ Tốt hơn Core Web Vitals (LCP, CLS)
- ✅ Tự động responsive cho mọi device
- ✅ Global CDN với edge locations

