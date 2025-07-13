'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    // 记录全局错误
    console.error('Global Application Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  // 简化的全局错误页面，避免复杂的依赖
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ maxWidth: '32rem', width: '100%', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 'bold', 
              color: '#dc2626',
              marginBottom: '1rem' 
            }}>
              系统错误
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#4b5563',
              marginBottom: '2rem' 
            }}>
              系统遇到了严重错误，请稍后再试或联系客服。
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                重试
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}