import type { Metadata } from "next";

// Helper function để lấy base URL dựa trên environment
// Trong development: sử dụng localhost
// Trong production/deployment: luôn sử dụng phonehub.vn
function getBaseUrl(): string {
  // Nếu có NEXT_PUBLIC_SITE_URL, sử dụng nó (ưu tiên cao nhất)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Trong production/deployment, luôn sử dụng phonehub.vn
  if (process.env.NODE_ENV === 'production') {
    return 'https://phonehub.vn';
  }
  
  // Trong development, sử dụng localhost:3000 (hoặc port từ env)
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}`;
}

const baseUrl = getBaseUrl();

// Cấu hình SEO, tiêu đề, favicon, v.v.
export const metadata: Metadata = {
  title: {
    default: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    template: "%s | PhoneHub",
  },
  description:
    "PhoneHub - Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường.",
  keywords: [
    "PhoneHub",
    "điện thoại",
    "smartphone",
    "laptop",
    "tablet",
    "iPad",
    "đồng hồ thông minh",
    "mua sắm điện thoại",
    "điện thoại giá rẻ",
    "điện thoại chính hãng",
    "bán điện thoại online",
    "công nghệ",
    "thiết bị di động",
  ],
  authors: [{ name: "Bùi Tấn Phát" }],
  creator: "PhoneHub",
  publisher: "PhoneHub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: baseUrl,
    siteName: "PhoneHub",
    title: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    description:
      "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường.",
    images: [
      {
        url: `${baseUrl}/icon`, // Từ app/icon.tsx - dynamic icon
        width: 512,
        height: 512,
        alt: "Logo PhoneHub - Mua sắm điện thoại trực tuyến",
        type: "image/png",
      },
      {
        url: `${baseUrl}/banner.jpg`, // Banner từ public/banner.jpg
        width: 1200,
        height: 630,
        alt: "PhoneHub - Banner khuyến mãi mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng.",
    images: [`${baseUrl}/icon`], // Từ app/icon.tsx - dynamic icon
    creator: "@phonehub",
  },
  icons: {
    icon: "/icon", // Từ app/icon.tsx - Next.js tự động serve tại /icon
    shortcut: "/icon",
    apple: "/apple-icon", // Từ app/apple-icon.tsx
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: baseUrl,
    languages: {
      "vi-VN": baseUrl,
    },
  },
  category: "E-commerce",
  classification: "Điện thoại, Laptop, Tablet, Công nghệ",
  verification: {
    google: "your-google-verification-code", // Thay bằng Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  metadataBase: new URL(baseUrl),
  applicationName: "PhoneHub",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
