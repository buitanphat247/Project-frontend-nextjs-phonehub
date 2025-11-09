import { MetadataRoute } from 'next';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://phonehub.vn';
  }
  return 'https://phonehub.vn'; // Default to production URL for sitemap
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/cart/',
          '/favourite/',
          '/cache-test/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/cart/',
          '/favourite/',
          '/cache-test/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

