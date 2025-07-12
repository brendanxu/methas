import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    // 允许的图片域名
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'southpole.com',
      'localhost'
    ],
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 预定义的图片尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片断点
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 性能优化
  compress: true,
  
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['antd', 'framer-motion'],
    // 部分预渲染
    ppr: false,
  },
  
  // 构建优化
  output: 'standalone',
  
  // 重定向配置
  async redirects() {
    return [
      // SEO 友好的重定向
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Headers 配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 安全头
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // 缓存头
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
