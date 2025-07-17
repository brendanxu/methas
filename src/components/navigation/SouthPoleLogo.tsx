'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from '@/lib/modern-animations';

interface SouthPoleLogoProps {
  className?: string;
}

export const SouthPoleLogo: React.FC<SouthPoleLogoProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex items-center ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link 
        href="/"
        className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
        aria-label="South Pole - Climate solutions for a net zero future"
      >
        {/* South Pole Logo Icon */}
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary-dark-blue)' }}
          >
            {/* 抽象的地球/极地图形 */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              className="text-white"
            >
              {/* 地球轮廓 */}
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* 极地图案 */}
              <path
                d="M12 2 L12 22 M2 12 L22 12"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.6"
              />
              {/* 南极点 */}
              <circle
                cx="12"
                cy="18"
                r="2"
                fill="currentColor"
                opacity="0.8"
              />
              {/* 装饰性弧线 */}
              <path
                d="M8 6 Q12 10 16 6"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
        
        {/* 公司名称 */}
        <div className="flex flex-col">
          <span 
            className="text-lg font-normal tracking-tight"
            style={{ 
              color: 'var(--primary-dark-blue)',
              fontWeight: '400'
            }}
          >
            south pole
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default SouthPoleLogo;