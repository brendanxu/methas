'use client';

import React from 'react';
import { SouthPoleOfficialNav } from '@/components/navigation/SouthPoleOfficialNav';

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 新的South Pole导航栏 */}
      <SouthPoleOfficialNav />
      
      {/* 演示内容 */}
      <main className="py-16" style={{ paddingTop: '100px' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              South Pole Navigation Demo
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              完全按照您的需求规范开发的South Pole导航栏组件
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 功能特性卡片 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  白色背景设计
                </h3>
                <p className="text-gray-600">
                  纯白色背景，现代简洁设计，滚动时添加微妙阴影效果
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  完整下拉菜单
                </h3>
                <p className="text-gray-600">
                  悬停触发的下拉菜单，包含完整的二级三级菜单内容和描述
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  响应式设计
                </h3>
                <p className="text-gray-600">
                  桌面端完整功能，1024px以下转为移动端汉堡菜单
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  流畅动画
                </h3>
                <p className="text-gray-600">
                  平滑的过渡动画、智能的悬停检测、150ms延迟关闭机制
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  完整内容
                </h3>
                <p className="text-gray-600">
                  每个主菜单包含4-5个子菜单，每个子菜单都有标题和描述
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact按钮
                </h3>
                <p className="text-gray-600">
                  橙色CTA按钮，包含箭头图标，hover时有颜色变化效果
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                使用说明
              </h3>
              <p className="text-blue-800">
                1. 悬停主菜单项查看下拉菜单<br/>
                2. 每个菜单都有详细的子菜单和描述<br/>
                3. 移动端点击汉堡菜单查看侧边栏<br/>
                4. 所有组件都支持键盘导航和无障碍功能
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}