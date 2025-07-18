'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/modern-animations';
export default function AnimationTestPage() {
  const [showBasicAnimations, setShowBasicAnimations] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">动画系统测试页面</h1>
        
        {/* 基础动画测试 */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">基础动画测试</h2>
          <button
            onClick={() => setShowBasicAnimations(!showBasicAnimations)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            {showBasicAnimations ? '隐藏' : '显示'} 基础动画
          </button>
          
          <AnimatePresence>
            {showBasicAnimations && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-100 p-4 rounded"
                >
                  淡入上移动画 (opacity + y)
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-blue-100 p-4 rounded"
                >
                  缩放动画 (opacity + scale)
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-purple-100 p-4 rounded"
                >
                  左右移动动画 (opacity + x)
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 导航栏测试 */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">导航栏测试</h2>
          <p className="text-gray-600">
            导航栏的下拉菜单功能已集成到主导航组件中。<br/>
            请前往首页或其他页面查看导航栏的下拉菜单功能。
          </p>
        </div>

        {/* 悬停动画测试 */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">悬停动画测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-red-100 p-4 rounded cursor-pointer text-center"
            >
              悬停缩放 + 上移
            </motion.div>
            
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="bg-yellow-100 p-4 rounded cursor-pointer text-center"
            >
              悬停旋转 + 缩放
            </motion.div>
            
            <motion.div
              whileHover={{ boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.2 }}
              className="bg-pink-100 p-4 rounded cursor-pointer text-center"
            >
              悬停阴影效果
            </motion.div>
          </div>
        </div>

        {/* 交错动画测试 */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">交错动画测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="bg-indigo-100 p-4 rounded text-center"
              >
                项目 {item}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}