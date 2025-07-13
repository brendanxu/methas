'use client';

import React from 'react';
import { Card, Row, Col, Button, Alert, Badge, Typography } from 'antd';
import { 
  MonitorOutlined, 
  AlertOutlined, 
  DashboardOutlined,
  BugOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function MonitoringDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-4">
            <MonitorOutlined className="mr-3" />
            监控与分析系统演示
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            这是一个完整的网站监控和分析系统演示。系统正在开发中，功能即将上线。
          </Paragraph>
        </div>

        <Card title="系统状态" className="mb-6">
          <Alert
            message="开发中"
            description="监控和分析系统正在开发中，功能即将上线。"
            type="info"
            showIcon
          />
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="📊 Google Analytics 4 集成" className="h-full">
              <ul className="space-y-2">
                <li>• 自动页面浏览追踪</li>
                <li>• 用户交互事件追踪</li>
                <li>• 自定义事件和转化追踪</li>
                <li>• 电商事件支持</li>
                <li>• 用户属性设置</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="⚡ Web Vitals 性能监控" className="h-full">
              <ul className="space-y-2">
                <li>• Core Web Vitals (LCP, INP, CLS)</li>
                <li>• 页面加载性能 (FCP, TTFB)</li>
                <li>• 资源加载监控</li>
                <li>• 长任务检测</li>
                <li>• 内存使用监控</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="🔔 实时告警系统" className="h-full">
              <ul className="space-y-2">
                <li>• 性能阈值告警</li>
                <li>• 错误自动捕获</li>
                <li>• 业务指标监控</li>
                <li>• 安全事件检测</li>
                <li>• 多渠道通知</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="📈 用户行为分析" className="h-full">
              <ul className="space-y-2">
                <li>• 滚动深度追踪</li>
                <li>• 页面停留时间</li>
                <li>• 表单交互分析</li>
                <li>• 文件下载追踪</li>
                <li>• 外链点击统计</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Alert
          className="mt-6"
          message="即将上线"
          description="完整的监控和分析功能正在最后的测试阶段，将在近期上线。"
          type="success"
          showIcon
        />
      </div>
    </div>
  );
}