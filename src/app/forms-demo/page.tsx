'use client';

import dynamic from 'next/dynamic';

// Create a client component for the forms demo content
const FormsDemoContent = dynamic(() => Promise.resolve(function FormsDemoContent() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">表单系统演示</h1>
          <p className="text-lg text-gray-600">
            测试所有表单组件的功能，包括联系表单、Newsletter订阅和资源下载表单。
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-blue-800 font-semibold">开发中</h2>
          <p className="text-blue-700">表单系统正在开发中，完整功能即将上线。</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">📝 联系表单</h3>
            <ul className="space-y-2">
              <li>• 多字段验证</li>
              <li>• 实时错误提示</li>
              <li>• 数据清理和安全检查</li>
              <li>• 邮件通知集成</li>
              <li>• 反垃圾邮件保护</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">📧 Newsletter订阅</h3>
            <ul className="space-y-2">
              <li>• 多种展示样式</li>
              <li>• 偏好设置管理</li>
              <li>• 双重确认验证</li>
              <li>• 邮件营销集成</li>
              <li>• 退订管理</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4">📥 资源下载</h3>
            <ul className="space-y-2">
              <li>• 门控内容管理</li>
              <li>• 用户信息收集</li>
              <li>• 下载跟踪分析</li>
              <li>• 多种文件格式</li>
              <li>• 权限控制</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <h2 className="text-green-800 font-semibold">即将上线</h2>
          <p className="text-green-700">完整的表单系统正在最后的测试阶段，将在近期上线。</p>
        </div>
      </div>
    </div>
  );
}), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function FormsDemo() {
  return <FormsDemoContent />;
}