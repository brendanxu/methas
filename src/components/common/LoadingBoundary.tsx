'use client';

import React, { ReactNode } from 'react';
import {  motion, AnimatePresence  } from '@/lib/mock-framer-motion';
import { cn } from '@/lib/utils';

interface LoadingBoundaryProps {
  isLoading: boolean;
  error?: Error | null;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  children: ReactNode;
  className?: string;
  retryAction?: () => void;
}

export const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  isLoading,
  error,
  fallback,
  errorFallback,
  children,
  className,
  retryAction,
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex flex-col items-center justify-center py-12", className)}
      >
        {errorFallback || (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              出错了
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              {error.message || '加载内容时发生错误，请稍后重试。'}
            </p>
            {retryAction && (
              <button 
                onClick={retryAction}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                重试
              </button>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {fallback || <DefaultLoadingFallback />}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 默认加载动画
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// 带进度的加载组件
export const ProgressLoadingBoundary: React.FC<LoadingBoundaryProps & {
  progress?: number;
  progressText?: string;
}> = ({ progress, progressText, ...props }) => {
  if (props.isLoading && progress !== undefined) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <div className="w-32 h-32 relative">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="text-primary transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        {progressText && (
          <p className="text-gray-600 dark:text-gray-400">{progressText}</p>
        )}
      </motion.div>
    );
  }

  return <LoadingBoundary {...props} />;
};

export default LoadingBoundary;