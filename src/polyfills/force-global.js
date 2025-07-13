/**
 * 强制全局polyfills - 必须在所有其他模块之前加载
 */

// 立即执行polyfill
(function() {
  if (typeof global !== 'undefined') {
    // 强制覆盖所有可能的浏览器全局变量
    global.self = global;
    global.globalThis = global;
    global.window = global;
    
    // 防止任何模块尝试访问这些变量时出错
    Object.defineProperty(global, 'self', {
      value: global,
      writable: false,
      configurable: false
    });
    
    Object.defineProperty(global, 'globalThis', {
      value: global,
      writable: false,
      configurable: false
    });
  }
})();

module.exports = global || {};