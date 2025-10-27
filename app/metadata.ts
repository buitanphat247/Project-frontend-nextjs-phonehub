import type { Metadata } from "next";

// Cấu hình SEO, tiêu đề, favicon, v.v.
export const metadata: Metadata = {
  title: "PhoneHub - Mua sắm điện thoại trực tuyến",
  description: "Nền tảng bán điện thoại thông minh hiện đại và nhanh chóng.",
  keywords: ["PhoneHub", "điện thoại", "smartphone", "mua sắm"],
  authors: [{ name: "Bùi Tấn Phát" }],
  openGraph: {
    title: "PhoneHub",
    description: "Nền tảng bán điện thoại trực tuyến.",
    url: "https://phonehub.vn",
    siteName: "PhoneHub",
    images: [
      {
        url: "/og-image.png", // ảnh preview khi chia sẻ
        width: 1200,
        height: 630,
        alt: "PhoneHub Preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

