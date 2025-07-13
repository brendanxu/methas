'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Spin } from 'antd';

interface BaseChartProps {
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  height?: number;
  className?: string;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  children,
  loading = false,
  error = null,
  title,
  description,
  height = 400,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ height }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}
        style={{ height }}
      >
        <div className="text-red-600 text-center">
          <h3 className="text-lg font-semibold mb-2">数据加载失败</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || description) && (
        <div className="p-6 border-b border-gray-100">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="p-6">
        {loading ? (
          <div 
            className="flex items-center justify-center"
            style={{ height: height - (title || description ? 120 : 48) }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ height: height - (title || description ? 120 : 48) }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};