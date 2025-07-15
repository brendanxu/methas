import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    // 允许的图片域名
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'southpole.com',
      'www.southpole.com',
      'cdn.southpole.com',
      'localhost'
    ],
    // 图片格式优化
    formats: ['image/webp', 'image/avif'],
    // 预定义的图片尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片断点
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 图片质量优化
    // quality: 90, // Next.js 15 中已移除此配置
    // 启用图片优化
    unoptimized: false,
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  
  // 实验性功能
  experimental: {
    // 优化包导入 - 减少bundle大小（暂时禁用以解决模块解析问题）
    // optimizePackageImports: [
    //   'antd', 
    //   '@ant-design/icons',
    //   'framer-motion', 
    //   'lodash-es',
    //   'react-i18next',
    //   'dayjs'
    // ],
    // 启用优化CSS导入
    optimizeCss: true,
    // 启用 turbo 模式
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // 构建优化
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  
  // Webpack 配置优化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 生产环境优化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 250000,
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            antd: {
              test: /[\\/]node_modules[\\/]antd[\\/]/,
              name: 'antd',
              chunks: 'all',
              priority: 20,
            },
            antdIcons: {
              test: /[\\/]node_modules[\\/]@ant-design[\\/]icons[\\/]/,
              name: 'antd-icons',
              chunks: 'all',
              priority: 25,
            },
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              chunks: 'all',
              priority: 15,
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
            i18n: {
              test: /[\\/]node_modules[\\/](i18next|react-i18next)[\\/]/,
              name: 'i18n',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-analyzer.html',
        })
      );
    }

    return config;
  },
  
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
        // 静态资源 - 长期缓存
        source: '/(.*)\\.(js|css|woff2|woff|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 图片资源 - 中期缓存
        source: '/(.*)\\.(jpg|jpeg|png|gif|svg|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // HTML 页面 - 短期缓存
        source: '/((?!api).*)',
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // 缓存头
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // API 路由 - 无缓存
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
