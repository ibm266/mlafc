import type { MetadataRoute } from 'next';

const BASE = 'https://www.mumbailondonaf.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/evidence', '/conditions', '/journey', '/locations', '/testimonials', '/book'].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
