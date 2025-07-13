'use client';

// 极简化的全局错误页面，避免webpack-runtime问题
// 强制动态渲染，避免预渲染问题
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 只在有window对象时记录错误
  if (typeof window !== 'undefined') {
    console.error('Global Error:', error.message);
  }

  return (
    <html>
      <head>
        <title>系统错误 | South Pole</title>
        <meta name="robots" content="noindex" />
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #f9fafb;
              color: #111827;
            }
            .container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1rem;
            }
            .content {
              max-width: 32rem;
              width: 100%;
              text-align: center;
            }
            .error-title {
              font-size: 2.25rem;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 1rem;
            }
            .error-description {
              font-size: 1.125rem;
              color: #4b5563;
              margin-bottom: 2rem;
              line-height: 1.5;
            }
            .button-group {
              display: flex;
              gap: 1rem;
              justify-content: center;
            }
            .button {
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              border: none;
              cursor: pointer;
              font-size: 1rem;
              text-decoration: none;
              display: inline-block;
              transition: opacity 0.2s;
            }
            .button:hover {
              opacity: 0.9;
            }
            .button-primary {
              background-color: #2563eb;
              color: white;
            }
            .button-secondary {
              background-color: #6b7280;
              color: white;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1 className="error-title">系统错误</h1>
            <p className="error-description">
              系统遇到了严重错误，请稍后再试或联系客服。
            </p>
            <div className="button-group">
              <button
                className="button button-primary"
                onClick={reset}
              >
                重试
              </button>
              <button
                className="button button-secondary"
                onClick={() => window.location.href = '/'}
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