import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ['growsome.s3.amazonaws.com'], // deprecated
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'growsome.s3.amazonaws.com',
        port: '',
        pathname: '/**', // 기존 domains 설정과 동일하게 모든 경로 허용
      },
      // 필요하다면 다른 패턴 추가
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
  },
};

export default nextConfig;
