# Cấu hình SEO và Public Folder

## Public Folder Structure

```
public/
├── banner.jpg          # Banner cho Open Graph (1200x630px)
├── logo.png            # Logo website (512x512px)
├── favicon.ico         # Favicon
└── site.webmanifest    # PWA manifest
```

## Cách sử dụng files từ public folder

### 1. Trong Metadata (app/metadata.ts)

Sử dụng relative paths từ base URL (`/`). Next.js sẽ tự động resolve với `metadataBase`:

```typescript
openGraph: {
  images: [
    {
      url: "/banner.jpg", // Tự động resolve thành https://phonehub.vn/banner.jpg
      width: 1200,
      height: 630,
    },
  ],
}
```

### 2. Trong Components

Sử dụng Next.js Image component với relative paths:

```typescript
import Image from 'next/image';

<Image 
  src="/logo.png"  // Từ public/logo.png
  alt="Logo"
  width={512}
  height={512}
/>
```

### 3. Trong HTML/CSS

Sử dụng relative paths:

```html
<img src="/banner.jpg" alt="Banner" />
<link rel="icon" href="/favicon.ico" />
```

## Caching

Next.js mặc định không cache files trong public folder:
- `Cache-Control: public, max-age=0`

Để cache static assets, cấu hình trong `next.config.ts` hoặc sử dụng CDN.

## Files quan trọng

- **robots.txt**: Tạo bằng `app/robots.ts` (Next.js 13+)
- **sitemap.xml**: Tạo bằng `app/sitemap.ts` (Next.js 13+)
- **favicon.ico**: Đặt trong `public/` hoặc `app/`
- **site.webmanifest**: Đặt trong `public/`

## Lưu ý

1. Không đặt file tĩnh trùng tên với file trong `app/` directory
2. Files trong `public/` có thể truy cập trực tiếp từ base URL
3. Sử dụng relative paths (`/filename`) thay vì absolute paths trong code
4. Next.js tự động resolve relative paths với `metadataBase` trong metadata

