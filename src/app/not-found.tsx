// 极简化的404页面，避免复杂依赖导致的webpack-runtime问题
export const metadata = {
  title: '页面未找到 | South Pole',
  description: '抱歉，您访问的页面不存在。',
};

export default function NotFound() {
  return (
    <html>
      <head>
        <title>页面未找到 | South Pole</title>
        <meta name="description" content="抱歉，您访问的页面不存在。" />
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
            .error-code {
              font-size: 6rem;
              font-weight: bold;
              color: #d1d5db;
              margin-bottom: 1rem;
            }
            .error-title {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 1rem;
            }
            .error-description {
              color: #6b7280;
              margin-bottom: 2rem;
              line-height: 1.5;
            }
            .home-button {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              background-color: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 0.5rem;
              transition: background-color 0.2s;
            }
            .home-button:hover {
              background-color: #1d4ed8;
            }
            .contact-info {
              margin-top: 2rem;
              font-size: 0.875rem;
              color: #6b7280;
            }
            .contact-link {
              color: #2563eb;
              text-decoration: none;
            }
            .contact-link:hover {
              text-decoration: underline;
            }
          `
        }} />
      </head>
      <body>
        <div className="container">
          <div className="content">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">页面未找到</h2>
            <p className="error-description">
              抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
            </p>
            <a href="/" className="home-button">
              返回首页
            </a>
            
            <div className="contact-info">
              <p>如果您认为这是一个错误，请联系我们的客服团队。</p>
              <p style={{ marginTop: '0.5rem' }}>
                邮箱：
                <a href="mailto:contact@southpole.com" className="contact-link">
                  contact@southpole.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}