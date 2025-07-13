const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@ant-design/icons', 'antd', 'lodash-es', 'react-icons'],
    optimizeCss: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
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
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: 'antd',
            priority: 15,
            chunks: 'all',
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 15,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            enforce: true,
          },
        },
      };

      // Module concatenation for smaller bundles
      config.optimization.concatenateModules = true;
      
      // Remove unused code
      config.optimization.innerGraph = true;
    }

    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Bundle analysis in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      );
    }

    return config;
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
    'react-icons': {
      transform: 'react-icons/{{member}}',
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