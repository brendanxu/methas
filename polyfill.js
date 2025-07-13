// Polyfill for server-side rendering compatibility
if (typeof globalThis !== 'undefined') {
  if (!globalThis.self) {
    globalThis.self = globalThis;
  }
  if (!globalThis.window && typeof window === 'undefined') {
    globalThis.window = undefined;
  }
} else if (typeof global !== 'undefined') {
  if (!global.self) {
    global.self = global;
  }
  if (!global.window && typeof window === 'undefined') {
    global.window = undefined;
  }
}