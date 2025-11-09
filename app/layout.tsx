import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import { metadata } from "./metadata";
import { createDangerousHTML } from "@/lib/utils/trustedTypes";

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
        <meta name="theme-color" content="#1890ff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="language" content="Vietnamese" />
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Vietnam" />
        <meta httpEquiv="content-language" content="vi-VN" />
        {/* Favicon cho browser tab - sử dụng logo.png từ public/logo.png */}
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="512x512" />
        {/* Apple Touch Icon cho iOS */}
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        {/* Favicon cho các kích thước khác nhau */}
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        {/* Explicit Open Graph meta tags để đảm bảo banner được nhận diện */}
        <meta property="og:image" content={`${baseUrl}/banner.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="PhoneHub - Banner khuyến mãi mua sắm điện thoại, laptop, tablet và phụ kiện công nghệ" />
        {/* Twitter Card */}
        <meta name="twitter:image" content={`${baseUrl}/banner.jpg`} />
        {/* Font Awesome CDN */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Structured Data cho SEO - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createDangerousHTML(JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PhoneHub",
              legalName: "PhoneHub",
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              image: `${baseUrl}/banner.jpg`,
              description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng. Giao hàng nhanh, bảo hành uy tín, giá tốt nhất thị trường.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
                addressLocality: "Vietnam",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["Vietnamese"],
              },
              sameAs: [
                // Thêm các mạng xã hội khi có
                // "https://www.facebook.com/phonehub",
                // "https://twitter.com/phonehub",
                // "https://www.linkedin.com/company/phonehub",
              ],
            }))}
        />
        {/* Structured Data - Store */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createDangerousHTML(JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "PhoneHub",
              description: "Nền tảng mua sắm điện thoại thông minh, laptop, tablet và phụ kiện công nghệ chính hãng",
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              image: `${baseUrl}/banner.jpg`,
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }))}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createDangerousHTML(JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PhoneHub",
              url: baseUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }))}
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
              <Analytics />
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
