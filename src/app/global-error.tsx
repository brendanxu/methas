'use client';

import React from 'react';
import { Button as AntButton, Result } from 'antd';

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

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <Result
              status="500"
              title="系统错误"
              subTitle="系统遇到了严重错误，请稍后再试或联系客服。"
              extra={[
                <AntButton key="retry" type="primary" onClick={reset}>
                  重试
                </AntButton>,
                <AntButton key="home" onClick={() => window.location.href = '/'}>
                  返回首页
                </AntButton>,
                <AntButton key="contact" onClick={() => window.location.href = '/contact'}>
                  联系客服
                </AntButton>
              ]}
            />
          </div>
        </div>
      </body>
    </html>
  );
}