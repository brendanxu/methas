/**
 * 简化的Next.js配置
 * 移除过度复杂的配置，保留核心功能
 */

// 条件化导入Bundle Analyzer
let withBundleAnalyzer;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (error) {
  withBundleAnalyzer = (config) => config;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基本配置
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // 外部化服务器包
  serverExternalPackages: [
    'web-vitals',
    '@ant-design/charts',
    'react-intersection-observer',
  ],

  // 简化的webpack配置
  webpack: (config, { dev, isServer }) => {
    // 服务器端简化配置
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
      };
    }

    // SVG支持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 20,
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: 'antd',
            chunks: 'all',
            priority: 30,
          },
        },
      };
    }

    return config;
  },

  // 模块化导入优化
  modularizeImports: {
    'antd': {
      transform: 'antd/es/{{member}}',
      preventFullImport: true,
    },
    '@ant-design/icons': {
      transform: '@ant-design/icons/es/icons/{{member}}',
      preventFullImport: true,
    },
    'lodash-es': {
      transform: 'lodash-es/{{member}}',
      preventFullImport: true,
    },
  },

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'images.unsplash.com',
      'cdn.southpole.com',
      'assets.southpole.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.southpole.com',
        pathname: '/**',
      },
    ],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['@ant-design/icons', 'antd', 'lodash-es'],
  },

  // 安全头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ];
  },

  // 基本重定向
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);