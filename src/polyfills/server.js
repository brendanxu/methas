/**
 * Server-side polyfills for global variables
 * This must be loaded before any other modules that might access browser globals
 */

// 强制polyfill所有可能的全局对象引用
if (typeof global !== 'undefined') {
  // 确保self总是指向global
  global.self = global;
  global.globalThis = global;
  
  // 如果这些变量被意外访问，至少不会抛出错误
  if (typeof window === 'undefined') {
    global.window = global;
  }
}

// Additional browser API polyfills
if (typeof global !== 'undefined') {
  if (typeof window === 'undefined') {
    global.window = global;
  }
  
  if (typeof document === 'undefined') {
    global.document = {
      createElement: () => ({}),
      head: { appendChild: () => {} },
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      readyState: 'complete',
      documentElement: { scrollHeight: 0 },
    };
  }
  
  if (typeof navigator === 'undefined') {
    global.navigator = {
      userAgent: 'Node.js',
    };
  }
  
  if (typeof location === 'undefined') {
    global.location = {
      pathname: '/',
      search: '',
      hash: '',
      href: 'http://localhost:3000/',
    };
  }
  
  if (typeof IntersectionObserver === 'undefined') {
    global.IntersectionObserver = function() {
      return {
        observe: () => {},
        unobserve: () => {},
        disconnect: () => {},
      };
    };
  }
  
  if (typeof requestIdleCallback === 'undefined') {
    global.requestIdleCallback = (callback) => {
      setTimeout(callback, 0);
    };
  }
  
  if (typeof performance === 'undefined') {
    global.performance = {
      getEntriesByName: () => [],
      getEntriesByType: () => [],
      mark: () => ({}),
    };
  }
}