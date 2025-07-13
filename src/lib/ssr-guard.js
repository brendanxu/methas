/**
 * SSR Guard - Global polyfills for server-side rendering
 * This module ensures that browser-specific globals are available in Node.js environment
 * 
 * @ts-nocheck
 */

// Setup global polyfills only on server-side
if (typeof window === 'undefined') {
  // Polyfill self global
  global.self = global;
  
  // Mock window object
  global.window = {
    location: { pathname: '/' },
    pageYOffset: 0,
    innerHeight: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  
  // Mock document object
  global.document = {
    createElement: () => ({}),
    head: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete',
    documentElement: {
      scrollHeight: 0,
    },
  };
  
  // Mock IntersectionObserver for server
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  
  // Mock requestIdleCallback
  global.requestIdleCallback = (callback) => {
    setTimeout(callback, 0);
  };
  
  // Mock performance API
  global.performance = {
    getEntriesByName: () => [],
    getEntriesByType: () => [],
    mark: () => ({}),
  };
  
  // Mock PerformanceObserver
  global.PerformanceObserver = class PerformanceObserver {
    constructor() {}
    observe() {}
    disconnect() {}
  };
}

export {};