'use client';

import React from 'react';
import { Button, Result, Typography, Space, Card, Collapse } from 'antd';
import { 
  HomeOutlined, 
  ReloadOutlined, 
  BugOutlined,
  CustomerServiceOutlined,
  SafetyOutlined 
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface UserFriendlyErrorProps {
  error?: Error;
  errorId?: string;
  type?: 'network' | 'server' | 'client' | 'permission' | 'notFound' | 'generic';
  showDetails?: boolean;
  onRetry?: () => void;
  onReport?: () => void;
}

// 错误类型到用户友好信息的映射
const errorMessages = {
  network: {
    title: '网络连接问题',
    description: '无法连接到服务器，请检查您的网络连接后重试。',
    icon: '🌐',
    suggestions: [
      '检查网络连接是否正常',
      '尝试刷新页面',
      '稍后再试',
    ],
  },
  server: {
    title: '服务器暂时不可用',
    description: '服务器正在维护或遇到临时问题，我们正在努力修复。',
    icon: '🔧',
    suggestions: [
      '请稍后重试',
      '如果问题持续，请联系技术支持',
    ],
  },
  client: {
    title: '页面加载错误',
    description: '页面在加载过程中遇到了问题。',
    icon: '⚠️',
    suggestions: [
      '尝试刷新页面',
      '清除浏览器缓存',
      '尝试使用其他浏览器',
    ],
  },
  permission: {
    title: '访问权限不足',
    description: '您没有权限访问此内容。',
    icon: '🔒',
    suggestions: [
      '请检查您的登录状态',
      '联系管理员获取权限',
      '返回到安全页面',
    ],
  },
  notFound: {
    title: '页面未找到',
    description: '您访问的页面不存在或已被移除。',
    icon: '🔍',
    suggestions: [
      '检查网址是否正确',
      '使用导航菜单重新访问',
      '返回首页',
    ],
  },
  generic: {
    title: '出现了一些问题',
    description: '很抱歉，我们遇到了一个意外错误。',
    icon: '😔',
    suggestions: [
      '尝试刷新页面',
      '稍后再试',
      '如果问题持续，请联系我们',
    ],
  },
};

export const UserFriendlyError: React.FC<UserFriendlyErrorProps> = ({
  error,
  errorId,
  type = 'generic',
  showDetails = false,
  onRetry,
  onReport,
}) => {
  const errorInfo = errorMessages[type];

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleReload();
    }
  };

  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      // 默认报告行为
      const subject = encodeURIComponent(`错误报告: ${errorInfo.title}`);
      const body = encodeURIComponent(
        `错误类型: ${type}\n` +
        `错误ID: ${errorId || '未知'}\n` +
        `页面URL: ${window.location.href}\n` +
        `时间: ${new Date().toLocaleString()}\n` +
        `用户代理: ${navigator.userAgent}\n` +
        `\n请描述您遇到的问题：\n`
      );
      window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
    }
  };

  const getStatusFromType = (errorType: string) => {
    switch (errorType) {
      case 'network':
      case 'server':
        return '500';
      case 'permission':
        return '403';
      case 'notFound':
        return '404';
      default:
        return 'error';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full">
        <Result
          status={getStatusFromType(type)}
          title={
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{errorInfo.icon}</span>
              <span>{errorInfo.title}</span>
            </div>
          }
          subTitle={
            <div className="space-y-4">
              <Paragraph className="text-gray-600 text-base">
                {errorInfo.description}
              </Paragraph>

              {/* 建议解决方案 */}
              <Card size="small" className="text-left">
                <Text strong className="text-blue-600">💡 建议解决方案：</Text>
                <ul className="mt-2 ml-4 space-y-1">
                  {errorInfo.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* 错误ID */}
              {errorId && (
                <Card size="small" className="text-left">
                  <Text type="secondary" className="text-xs">
                    错误ID: <Text code>{errorId}</Text>
                  </Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    报告问题时请提供此ID
                  </Text>
                </Card>
              )}
            </div>
          }
          extra={
            <Space direction="vertical" size="middle" className="w-full">
              {/* 主要操作按钮 */}
              <Space wrap className="justify-center">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={handleRetry}
                  size="large"
                >
                  重试
                </Button>
                
                <Button 
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                  size="large"
                >
                  返回首页
                </Button>
              </Space>

              {/* 次要操作按钮 */}
              <Space wrap className="justify-center">
                <Button 
                  type="link" 
                  icon={<BugOutlined />}
                  onClick={handleReport}
                  size="small"
                >
                  报告问题
                </Button>
                
                <Button 
                  type="link" 
                  icon={<CustomerServiceOutlined />}
                  onClick={() => window.open('/help', '_blank')}
                  size="small"
                >
                  获取帮助
                </Button>
              </Space>
            </Space>
          }
        />

        {/* 开发环境错误详情 */}
        {(showDetails || process.env.NODE_ENV === 'development') && error && (
          <Card className="mt-6" size="small">
            <Collapse size="small" ghost>
              <Panel 
                header={
                  <span>
                    <SafetyOutlined className="mr-2" />
                    错误详情（技术信息）
                  </span>
                } 
                key="1"
              >
                <div className="space-y-3">
                  <div>
                    <Text strong className="text-red-600">错误信息：</Text>
                    <div className="mt-1 p-2 bg-red-50 rounded text-sm">
                      {error.message}
                    </div>
                  </div>
                  
                  {error.stack && (
                    <div>
                      <Text strong className="text-red-600">堆栈跟踪：</Text>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-48 border">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  <div>
                    <Text strong className="text-blue-600">环境信息：</Text>
                    <div className="mt-1 p-2 bg-blue-50 rounded text-xs">
                      <div><strong>URL:</strong> {window.location.href}</div>
                      <div><strong>时间:</strong> {new Date().toLocaleString()}</div>
                      <div><strong>用户代理:</strong> {navigator.userAgent}</div>
                      <div><strong>视口:</strong> {window.innerWidth}x{window.innerHeight}</div>
                    </div>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </Card>
        )}
      </div>
    </div>
  );
};

// 特定错误类型的便捷组件
export const NetworkError: React.FC<Omit<UserFriendlyErrorProps, 'type'>> = (props) => (
  <UserFriendlyError {...props} type="network" />
);

export const ServerError: React.FC<Omit<UserFriendlyErrorProps, 'type'>> = (props) => (
  <UserFriendlyError {...props} type="server" />
);

export const ClientError: React.FC<Omit<UserFriendlyErrorProps, 'type'>> = (props) => (
  <UserFriendlyError {...props} type="client" />
);

export const PermissionError: React.FC<Omit<UserFriendlyErrorProps, 'type'>> = (props) => (
  <UserFriendlyError {...props} type="permission" />
);

export const NotFoundError: React.FC<Omit<UserFriendlyErrorProps, 'type'>> = (props) => (
  <UserFriendlyError {...props} type="notFound" />
);

// 错误类型检测工具
export const detectErrorType = (error: Error): UserFriendlyErrorProps['type'] => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network';
  }
  
  if (message.includes('server') || message.includes('internal') || message.includes('500')) {
    return 'server';
  }
  
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('403')) {
    return 'permission';
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return 'notFound';
  }
  
  return 'generic';
};