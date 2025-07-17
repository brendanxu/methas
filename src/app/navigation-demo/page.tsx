'use client';

import React from 'react';
import { SouthPoleNavigation } from '@/components/navigation/SouthPoleNavigation';

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 新的South Pole导航栏 */}
      <SouthPoleNavigation />
      
      {/* 演示内容 */}
      <main className="py-16">
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
                  完整的品牌设计
                </h3>
                <p className="text-gray-600">
                  完全符合South Pole品牌色彩和设计语言，包括深蓝色Logo、正确的字体和间距
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  智能MegaMenu
                </h3>
                <p className="text-gray-600">
                  悬停触发的全宽度下拉菜单，左侧子菜单列表，右侧内容展示区
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
                  交互体验
                </h3>
                <p className="text-gray-600">
                  平滑的过渡动画、智能的悬停检测、200ms延迟关闭机制
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  搜索功能
                </h3>
                <p className="text-gray-600">
                  点击搜索图标展开全屏搜索框，支持ESC键关闭
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact按钮
                </h3>
                <p className="text-gray-600">
                  胶囊形蓝色按钮，白色箭头图标，hover时有动画效果
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                使用说明
              </h3>
              <p className="text-blue-800">
                1. 悬停主菜单项查看MegaMenu<br/>
                2. 点击搜索图标打开搜索框<br/>
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