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
        url: "https://cdn.tgdd.vn/Files/2016/05/12/827516/banner-thegioididong-so1online.jpg", // Banner từ Thegioididong cho SEO
        width: 1200,
        height: 630,
        alt: "PhoneHub - Banner khuyến mãi mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ",
        type: "image/jpeg",
      },
      {
        url: `${baseUrl}/logo.png`, // Logo phụ từ public/logo.png
        width: 512,
        height: 512,
        alt: "Logo PhoneHub - Mua sắm điện thoại trực tuyến",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneHub - Mua sắm điện thoại, laptop, tablet trực tuyến",
    description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng.",
    images: ["https://cdn.tgdd.vn/Files/2016/05/12/827516/banner-thegioididong-so1online.jpg"], // Banner từ Thegioididong cho SEO
    creator: "@phonehub",
  },
  icons: {
    icon: "/logo.png", // Logo từ public/logo.png
    shortcut: "/logo.png",
    apple: "/logo.png", // Sử dụng logo.png cho Apple touch icon
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
  other: {
    "geo.region": "VN",
    "geo.placename": "Vietnam",
    "geo.position": "10.8231;106.6297",
    "ICBM": "10.8231, 106.6297",
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
