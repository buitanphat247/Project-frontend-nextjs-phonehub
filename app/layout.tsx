import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/Footer";

// Cấu hình font
const inter = Inter({ subsets: ["latin"] });

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

// Component Layout chính
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* Nếu bạn cần thêm script hoặc meta thủ công */}
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider>
            <Header />
            <main >{children}</main>
            <Footer />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
