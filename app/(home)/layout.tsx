import { Inter } from "next/font/google";
import "../../app/globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/Footer";
import { metadata } from "../metadata";

// Cấu hình font
const inter = Inter({ subsets: ["latin"] });

// Export metadata
export { metadata };

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
