/**
 * Lighthouse CI Configuration
 * 
 * Performance monitoring and budget enforcement
 */

module.exports = {
  ci: {
    // Build configuration
    collect: {
      // URLs to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/contact',
        'http://localhost:3000/services/carbon-footprint-assessment',
        'http://localhost:3000/news'
      ],
      // Lighthouse settings
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        // Custom config for performance testing
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
      },
      // Number of runs per URL
      numberOfRuns: 3,
      // Start server automatically
      startServerCommand: 'npm run build && npm start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
    },
    
    // Performance budgets
    assert: {
      // Performance thresholds
      assertions: {
        // Core Web Vitals
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'metrics:first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'metrics:largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'metrics:cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'metrics:total-blocking-time': ['error', { maxNumericValue: 300 }],
        'metrics:speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Bundle size limits
        'metrics:total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'metrics:unused-javascript': ['warn', { maxNumericValue: 200000 }], // 200KB
        'metrics:unused-css-rules': ['warn', { maxNumericValue: 50000 }], // 50KB
        
        // Resource counts
        'resource-summary:script:count': ['warn', { maxNumericValue: 15 }],
        'resource-summary:stylesheet:count': ['warn', { maxNumericValue: 5 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 8 }],
        'resource-summary:image:count': ['warn', { maxNumericValue: 20 }],
        
        // Code splitting effectiveness
        'metrics:first-meaningful-paint': ['error', { maxNumericValue: 2200 }],
        'metrics:interactive': ['error', { maxNumericValue: 3500 }],
        
        // Preload effectiveness
        'uses-rel-preload': 'off', // We handle this with our custom preload strategy
        'preload-lcp-image': ['warn', {}],
        'unused-javascript': ['warn', {}],
      },
    },
    
    // Upload results (configure based on your CI/CD)
    upload: {
      // For GitHub Actions
      target: 'temporary-public-storage',
      // Alternative: upload to own server
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,
    },
    
    // Server configuration (if running own LHCI server)
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite3',
        sqlDatabasePath: './lhci.db',
      },
    },
  },
  
  // Custom performance budgets for different pages
  budgets: [
    {
      // Homepage budget
      path: '/',
      timings: [
        { metric: 'first-contentful-paint', budget: 1800 },
        { metric: 'largest-contentful-paint', budget: 2200 },
        { metric: 'speed-index', budget: 2500 },
        { metric: 'interactive', budget: 3000 },
      ],
      resourceSizes: [
        { resourceType: 'script', budget: 400 }, // 400KB
        { resourceType: 'stylesheet', budget: 100 }, // 100KB
        { resourceType: 'image', budget: 500 }, // 500KB
        { resourceType: 'font', budget: 150 }, // 150KB
        { resourceType: 'total', budget: 1000 }, // 1MB total
      ],
      resourceCounts: [
        { resourceType: 'script', budget: 10 },
        { resourceType: 'stylesheet', budget: 3 },
        { resourceType: 'image', budget: 15 },
        { resourceType: 'font', budget: 6 },
      ],
    },
    {
      // Service pages budget (less strict due to more content)
      path: '/services',
      timings: [
        { metric: 'first-contentful-paint', budget: 2000 },
        { metric: 'largest-contentful-paint', budget: 2500 },
        { metric: 'speed-index', budget: 3000 },
        { metric: 'interactive', budget: 3500 },
      ],
      resourceSizes: [
        { resourceType: 'script', budget: 500 },
        { resourceType: 'stylesheet', budget: 120 },
        { resourceType: 'image', budget: 800 },
        { resourceType: 'total', budget: 1200 },
      ],
    },
    {
      // Case studies budget (image-heavy)
      path: '/case-studies',
      timings: [
        { metric: 'first-contentful-paint', budget: 2200 },
        { metric: 'largest-contentful-paint', budget: 2800 },
        { metric: 'speed-index', budget: 3200 },
      ],
      resourceSizes: [
        { resourceType: 'image', budget: 1200 }, // Higher for case study images
        { resourceType: 'total', budget: 1500 },
      ],
    },
  ],
};