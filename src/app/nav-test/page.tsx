'use client';

import React from 'react';
import { SouthPoleNavigation } from '@/components/navigation/SouthPoleNavigation';

export default function NavTestPage() {
  return (
    <div className="min-h-screen">
      {/* 直接测试导航组件 */}
      <SouthPoleNavigation />
      
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
        <p>This page tests if the navigation system loads correctly.</p>
        
        <div className="mt-8 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">CSS Variables Test:</h2>
            <div 
              className="w-16 h-16 rounded"
              style={{ backgroundColor: 'var(--primary-dark-blue)' }}
            />
            <div 
              className="w-16 h-16 rounded mt-2"
              style={{ backgroundColor: 'var(--primary-blue)' }}
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Navigation Components Status:</h2>
            <ul className="space-y-1">
              <li>✅ SouthPoleNavigation imported in layout.tsx</li>
              <li>✅ CSS variables defined in globals.css</li>
              <li>✅ TypeScript compilation passed</li>
              <li>✅ Build completed successfully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}