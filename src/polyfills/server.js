/**
 * Server-side polyfills for global variables
 * This must be loaded before any other modules that might access browser globals
 */

// Polyfill 'self' global variable for server-side rendering
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
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