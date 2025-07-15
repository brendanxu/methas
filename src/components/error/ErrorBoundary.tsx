'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { monitoring } from '@/lib/monitoring/alerts';

// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 生成错误ID
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 记录到监控系统
    monitoring.logError(error, {
      componentStack: errorInfo.componentStack,
      errorId,
      boundary: 'ErrorBoundary',
    });

    // 记录到控制台（开发环境）
    if (process.env.NODE_ENV === 'development') {
      logError('Error caught by boundary:', { error, errorInfo });
    }

    // 发送到外部错误追踪服务
    this.reportToExternalServices(error, errorInfo, errorId);

    // 调用外部错误处理函数
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
      errorId,
    });
  }

  private reportToExternalServices = async (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    try {
      // 发送到Sentry（如果已配置）
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.withScope((scope: any) => {
          scope.setTag('errorBoundary', true);
          scope.setContext('errorInfo', errorInfo);
          scope.setLevel('error');
          scope.setContext('errorId', errorId);
          (window as any).Sentry.captureException(error);
        });
      }

      // 发送到后端API
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (reportingError) {
      logError('Failed to report error:', reportingError);
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.state.errorInfo!);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              页面出现错误
            </h1>
            
            <p className="text-sm text-center text-gray-600 mb-4">
              很抱歉，页面遇到了一些问题。我们已经记录了这个错误，会尽快修复。
            </p>

            {this.state.errorId && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs text-center text-gray-500">
                  错误ID: <span className="font-mono">{this.state.errorId}</span>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                刷新页面
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                返回首页
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-600 mb-2">
                  错误详情（仅开发环境可见）
                </summary>
                <div className="bg-gray-100 rounded p-3">
                  <h4 className="font-semibold text-sm mb-2">错误信息:</h4>
                  <p className="text-xs text-red-600 mb-3">{this.state.error.message}</p>
                  
                  <h4 className="font-semibold text-sm mb-2">堆栈信息:</h4>
                  <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32 border">
                    {this.state.error.stack}
                  </pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4 className="font-semibold text-sm mb-2 mt-3">组件堆栈:</h4>
                      <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32 border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 可重置的错误边界Hook
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    logError('Error handled:', error);
    
    // 发送到监控系统
    monitoring.logError(error, {
      source: 'useErrorHandler',
      componentStack: errorInfo?.componentStack,
    });
  };
};