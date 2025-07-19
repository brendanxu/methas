'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  domNodes: number;
  jsHeapSize: number;
  loadTime: number;
  connectionType: string;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    domNodes: 0,
    jsHeapSize: 0,
    loadTime: 0,
    connectionType: 'unknown'
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // 获取性能指标
        const metrics: PerformanceMetrics = {
          fps,
          memory: 0,
          domNodes: document.getElementsByTagName('*').length,
          jsHeapSize: 0,
          loadTime: 0,
          connectionType: 'unknown'
        };

        // 获取内存使用情况（如果可用）
        if ('memory' in performance) {
          const memoryInfo = (performance as any).memory;
          metrics.memory = Math.round(memoryInfo.usedJSHeapSize / 1048576); // MB
          metrics.jsHeapSize = Math.round(memoryInfo.totalJSHeapSize / 1048576); // MB
        }

        // 获取页面加载时间
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navTiming) {
          metrics.loadTime = Math.round(navTiming.loadEventEnd - navTiming.fetchStart);
        }

        // 获取网络连接类型
        if ('connection' in navigator) {
          const conn = (navigator as any).connection;
          metrics.connectionType = conn.effectiveType || 'unknown';
        }

        setMetrics(metrics);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    // 键盘快捷键
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-500';
    if (memory < 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg font-mono text-xs backdrop-blur-sm z-[9999]"
      style={{ minWidth: '220px' }}
    >
      <div className="mb-2 text-gray-400 text-center">Performance Monitor</div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getFPSColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        {metrics.memory > 0 && (
          <>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className={getMemoryColor(metrics.memory)}>{metrics.memory} MB</span>
            </div>
            <div className="flex justify-between">
              <span>Heap Size:</span>
              <span>{metrics.jsHeapSize} MB</span>
            </div>
          </>
        )}
        
        <div className="flex justify-between">
          <span>DOM Nodes:</span>
          <span className={metrics.domNodes > 1500 ? 'text-yellow-500' : 'text-green-500'}>
            {metrics.domNodes}
          </span>
        </div>
        
        {metrics.loadTime > 0 && (
          <div className="flex justify-between">
            <span>Load Time:</span>
            <span className={metrics.loadTime > 3000 ? 'text-yellow-500' : 'text-green-500'}>
              {metrics.loadTime}ms
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Network:</span>
          <span className="text-gray-400">{metrics.connectionType}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700 text-center text-gray-500">
        Ctrl+Shift+P to toggle
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;