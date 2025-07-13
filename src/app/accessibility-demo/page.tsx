import Link from 'next/link';

// 强制动态渲染，避免预渲染问题
export const dynamic = 'force-dynamic';

// 简化的重定向页面，避免预渲染问题
export default function AccessibilityDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center px-4">
        <h1 className="text-4xl font-bold mb-4">可访问性演示</h1>
        <p className="text-lg text-gray-600 mb-8">
          可访问性功能正在开发中，即将上线。
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}