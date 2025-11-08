import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
    sitemap: 'https://phonehub.vn/sitemap.xml',
  };
}

