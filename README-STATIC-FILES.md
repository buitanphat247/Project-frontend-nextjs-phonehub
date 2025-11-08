# Cấu hình Static Files trong Next.js

## Next.js tự động serve static files

Trong Next.js, bạn **KHÔNG CẦN** package bên ngoài như `@nestjs/serve-static`. Next.js tự động serve static files từ thư mục `public/`.

## Cấu trúc thư mục

```
project-root/
├── public/              # Static files folder
│   ├── logo.png        # Truy cập tại /logo.png
│   ├── banner.jpg      # Truy cập tại /banner.jpg
│   ├── favicon.ico     # Truy cập tại /favicon.ico
│   └── site.webmanifest # Truy cập tại /site.webmanifest
└── app/                # App Router
    ├── icon.tsx        # Dynamic icon → /icon
    └── apple-icon.tsx  # Apple icon → /apple-icon
```

## Cách sử dụng

### 1. Đặt files trong `public/` folder

Bất kỳ file nào trong `public/` sẽ được serve tại base URL:

- `public/logo.png` → `http://localhost:3000/logo.png`
- `public/banner.jpg` → `http://localhost:3000/banner.jpg`
- `public/favicon.ico` → `http://localhost:3000/favicon.ico`

### 2. Reference trong code

```typescript
// Trong components
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={512} height={512} />

// Trong HTML
<img src="/banner.jpg" alt="Banner" />

// Trong CSS
background-image: url('/banner.jpg');

// Trong metadata
icons: {
  icon: [{ url: "/logo.png" }]
}
```

### 3. Dynamic Icons (Next.js 13+)

- `app/icon.tsx` → tự động serve tại `/icon`
- `app/apple-icon.tsx` → tự động serve tại `/apple-icon`
- `app/favicon.ico` → tự động serve tại `/favicon.ico`

## Lưu ý

1. **Không cần package bên ngoài**: Next.js đã tích hợp sẵn
2. **Không cần cấu hình**: Chỉ cần đặt files trong `public/`
3. **Path bắt đầu từ `/`**: Sử dụng `/filename` không phải `/public/filename`
4. **Cache**: Next.js mặc định không cache files trong `public/` (max-age=0)

## So sánh với NestJS

- **NestJS**: Cần `@nestjs/serve-static` để serve static files
- **Next.js**: Tự động serve từ `public/` folder, không cần package

## Kết luận

Bạn **KHÔNG CẦN** cài đặt `@nestjs/serve-static` cho Next.js project. Chỉ cần đặt files trong `public/` folder và reference chúng với path bắt đầu từ `/`.

