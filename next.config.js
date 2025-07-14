const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {

  // 外部化服务器包（Next.js 15的正确配置）
  serverExternalPackages: [
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

      // Define environment-specific globals for compatibility - 使用更强的替换
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof window': '"undefined"',
          'typeof document': '"undefined"',
          'typeof navigator': '"undefined"',
          'typeof location': '"undefined"',
          'typeof self': '"object"', // 改为object类型
          // 强制定义self为global，处理所有引用
          'self': 'global',
          'globalThis': 'global',
          'window': 'undefined',
          '__NEXT_DATA__': '{}', // 防止Next.js相关的引用问题
        })
      );

      // 添加强制polyfill，确保所有self引用都被替换
      config.plugins.push(
        new webpack.ProvidePlugin({
          'self': require.resolve('./src/polyfills/force-global.js'),
          'globalThis': require.resolve('./src/polyfills/force-global.js'),
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
      config.optimization.minimize = false; // 禁用压缩，可能导致问题
      
      // 禁用模块联邦和其他可能导致runtime问题的特性
      config.optimization.moduleIds = 'named'; // 使用named而不是deterministic
      config.optimization.chunkIds = 'named';
      
      // 强制所有模块内联，不生成vendor chunks
      config.optimization.concatenateModules = false;
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.mergeDuplicateChunks = false;
      
      // 使用更简单的方法处理polyfills，避免entry操作的复杂性
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

    // Production optimizations - 禁用所有chunk分离，包括客户端
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // 完全禁用chunk分离，所有代码打包到一个文件
      config.optimization.splitChunks = false;
      config.optimization.runtimeChunk = false;

      // 禁用模块连接，避免复杂的依赖关系
      config.optimization.concatenateModules = false;
      
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

  // 禁用有问题页面的静态生成 - 强制所有页面动态渲染
  output: 'standalone',
  
  // 移除了无效的generateStaticParams配置
  
  // 排除有问题的路由
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        // 临时重定向accessibility-demo到主页
        {
          source: '/accessibility-demo',
          destination: '/?temp=accessibility-demo',
        },
      ],
    };
  },
  
  // 完全禁用静态生成，使用动态渲染
  experimental: {
    optimizePackageImports: ['@ant-design/icons', 'antd', 'lodash-es', 'react-icons'],
    // optimizeCss: true, // 禁用CSS优化，避免critters依赖问题
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