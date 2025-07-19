const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@ant-design/icons', 'antd', 'lodash-es', 'framer-motion'],
    scrollRestoration: true,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Modularize imports for better tree shaking
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
    'framer-motion': {
      transform: 'framer-motion',
      preventFullImport: false, // Allow full import for motion
    }
  },

  // Image optimization
  images: {
    // Allowed domains for external images
    domains: [
      'images.unsplash.com',
      'cdn.southpole.com',
      'assets.southpole.com',
    ],
    
    // Modern image formats (ordered by preference)
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Custom loader for optimized images
    loader: 'default',
    
    // Disable static image optimization in favor of our custom system
    unoptimized: false,
    
    // Remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.southpole.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Security headers
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

  // Redirects for better SEO
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