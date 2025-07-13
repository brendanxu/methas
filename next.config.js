const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {

  // 外部化服务器包（Next.js 15的正确配置）
  serverExternalPackages: [
    'framer-motion',
    'web-vitals',
    '@ant-design/charts',
    'react-intersection-observer',
  ],

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // High-quality webpack optimization with proper SSR handling
  webpack: (config, { dev, isServer, webpack }) => {
    // Server-side specific configurations
    if (isServer) {
      // 注释掉原有的entry配置，使用下面新的简化版本

      // Configure fallbacks for Node.js environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
      };

      // External packages that should not be bundled on server
      const serverExternals = [
        'framer-motion',
        'web-vitals',
        '@ant-design/charts',
        'react-intersection-observer',
      ];

      // 更安全的externals配置
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        // 使用函数形式的externals，更好地控制模块解析
        function({ context, request }, callback) {
          // 检查是否是需要外部化的包
          if (serverExternals.some(pkg => request === pkg || request?.startsWith(pkg + '/'))) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];

      // Define environment-specific globals for compatibility
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof window': '"undefined"',
          'typeof document': '"undefined"',
          'typeof navigator': '"undefined"',
          'typeof location': '"undefined"',
          'typeof self': '"undefined"',
          // 直接定义self为global
          'self': 'global',
        })
      );

      // 添加强制polyfill
      config.plugins.push(
        new webpack.ProvidePlugin({
          'self': ['global'],
        })
      );

      // 增强模块解析安全性
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      // 添加规则来处理可能有问题的模块
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      // 完全禁用服务器端的chunk分离，避免webpack-runtime问题
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;
      
      // 禁用模块联邦和其他可能导致runtime问题的特性
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      
      // 简化入口点配置
      config.entry = async () => {
        const entries = await (typeof config.entry === 'function' ? config.entry() : config.entry);
        // 确保每个入口都是简单的数组形式
        const processedEntries = {};
        for (const [key, value] of Object.entries(entries)) {
          if (Array.isArray(value)) {
            processedEntries[key] = ['./src/polyfills/server.js', ...value];
          } else {
            processedEntries[key] = ['./src/polyfills/server.js', value];
          }
        }
        return processedEntries;
      };
    }

    // Client-side optimizations
    if (!isServer) {
      // Ensure proper global definitions for client
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof window': '"object"',
          'typeof document': '"object"',
          'typeof navigator': '"object"',
          'typeof location': '"object"',
          'typeof self': '"object"',
        })
      );
    }

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

  // 跳过有问题的预渲染页面，避免构建时错误
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // 配置静态生成选项
  trailingSlash: false,
  generateEtags: false,

  // 禁用有问题页面的静态生成
  output: 'standalone',
  
  // 完全禁用静态生成，使用动态渲染
  experimental: {
    optimizePackageImports: ['@ant-design/icons', 'antd', 'lodash-es', 'react-icons'],
    optimizeCss: true,
    staticWorkerRequestDeduping: false,
  },

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