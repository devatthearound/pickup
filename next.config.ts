import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'growsome.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  pageExtensions: ['tsx', 'ts'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig; 