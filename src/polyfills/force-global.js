/**
 * 强制全局polyfills - 必须在所有其他模块之前加载
 * 立即执行并确保self全局变量在任何代码执行前都已定义
 */

// 立即执行polyfill，确保在模块系统加载前就已定义
(function() {
  // 检查是否在Node.js环境
  if (typeof global !== 'undefined' && typeof self === 'undefined') {
    // 使用最简单直接的方式定义self
    global.self = global;
    global.globalThis = global;
    
    // 同时定义为不可枚举属性，避免被覆盖
    try {
      Object.defineProperty(global, 'self', {
        value: global,
        writable: true, // 保持可写，避免某些库的问题
        configurable: true,
        enumerable: false
      });
    } catch (e) {
      // 如果定义失败，至少确保basic assignment有效
      global.self = global;
    }
    
    // 为了确保兼容性，也提供window作为fallback
    if (typeof window === 'undefined') {
      global.window = global;
    }
  }
})();

// 导出global对象
if (typeof global !== 'undefined') {
  module.exports = global;
} else if (typeof globalThis !== 'undefined') {
  module.exports = globalThis;
} else {
  module.exports = {};
}