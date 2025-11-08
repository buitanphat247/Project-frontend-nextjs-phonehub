import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { Toaster } from 'react-hot-toast';
import { metadata } from "./metadata";

// Cấu hình font - tắt preload để tránh lỗi download trong Docker
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
});

// Export metadata
export { metadata };

// Root Layout chính - phải có <html> và <body>
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        {/* Logo cho SEO */}
        <link rel="logo" href="/logo.png" type="image/png" />
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Structured Data cho SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "PhoneHub",
              description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng",
              url: "https://phonehub.vn",
              logo: "https://phonehub.vn/logo.png",
              image: "https://phonehub.vn/banner.jpg",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
              sameAs: [
                // Thêm các mạng xã hội nếu có
              ],
              potentialAction: {
                "@type": "SearchAction",
                target: "https://phonehub.vn/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider>
            <App>
              {children}
              <Toaster 
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                  },
                  success: {
                    duration: 1000,
                    iconTheme: {
                      primary: '#52c41a',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 1000,
                    iconTheme: {
                      primary: '#ff4d4f',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
