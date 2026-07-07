import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/publications',
        destination: '/evidence#publications',
        permanent: true,
      },
      {
        source: '/locations',
        destination: '/#map-heading',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
