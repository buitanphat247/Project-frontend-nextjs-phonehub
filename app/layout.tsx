import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { Toaster } from 'react-hot-toast';
import { metadata } from "./metadata";

// Helper function để lấy base URL (giống như trong metadata.ts)
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Trong production/deployment, luôn sử dụng phonehub.vn
  if (process.env.NODE_ENV === 'production') {
    return 'https://phonehub.vn';
  }
  const port = process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

const baseUrl = getBaseUrl();

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
        {/* Explicit favicon links - ưu tiên /icon từ app/icon.tsx */}
        {/* Thêm query string để bypass browser cache */}
        <link rel="icon" href="/icon?v=2" type="image/png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon?v=2" sizes="180x180" />
        {/* Explicit Open Graph meta tags để đảm bảo ảnh được nhận diện */}
        <meta property="og:image" content={`${baseUrl}/icon`} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Logo PhoneHub - Mua sắm điện thoại trực tuyến" />
        {/* Twitter Card */}
        <meta name="twitter:image" content={`${baseUrl}/icon`} />
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
              url: baseUrl,
              logo: `${baseUrl}/icon`,
              image: `${baseUrl}/icon`,
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
                target: `${baseUrl}/search?q={search_term_string}`,
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
