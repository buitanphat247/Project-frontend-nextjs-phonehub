import type { Metadata } from "next";

// Cấu hình SEO, tiêu đề, favicon, v.v.
export const metadata: Metadata = {
  title: {
    default: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    template: "%s | PhoneHub",
  },
  description: "PhoneHub - Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường.",
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
    url: "https://phonehub.vn",
    siteName: "PhoneHub",
    title: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường.",
    images: [
      {
        url: "/banner.jpg", // Sử dụng banner làm Open Graph image
        width: 1200,
        height: 630,
        alt: "PhoneHub - Banner khuyến mãi mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ",
      },
      {
        url: "/logo.png", // Logo làm fallback
        width: 512,
        height: 512,
        alt: "Logo PhoneHub - Mua sắm điện thoại trực tuyến",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng.",
    images: ["/banner.jpg"],
    creator: "@phonehub",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://phonehub.vn",
    languages: {
      'vi-VN': 'https://phonehub.vn',
    },
  },
  category: "E-commerce",
  classification: "Điện thoại, Laptop, Tablet, Công nghệ",
  verification: {
    google: 'your-google-verification-code', // Thay bằng Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  metadataBase: new URL('https://phonehub.vn'),
  applicationName: 'PhoneHub',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

