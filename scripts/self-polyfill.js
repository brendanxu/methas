/**
 * Self polyfill for server-side rendering
 * This module provides a polyfill for the 'self' global object when running in Node.js
 */

// Check if we're in a server environment
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
}

// Export the global object as self
module.exports = typeof self !== 'undefined' ? self : global;