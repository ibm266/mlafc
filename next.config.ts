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
      {
        source: '/',
        has: [{ type: 'host', value: 'mlafc.vercel.app' }],
        destination: 'https://www.mumbai-london-af.clinic/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'mlafc.vercel.app' }],
        destination: 'https://www.mumbai-london-af.clinic/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
