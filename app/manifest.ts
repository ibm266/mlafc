import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: 'ML AFC',
    description: site.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#1A1A18',
    icons: [
      {
        src: '/brand/logo-mark.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
    ],
  };
}
