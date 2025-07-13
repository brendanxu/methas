'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Button, Alert, Badge, Typography, Switch } from 'antd';
import { 
  EyeOutlined, 
  SoundOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  FormOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function AccessibilityDemoPage() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-4">
            <EyeOutlined className="mr-3" />
            可访问性（Accessibility）演示
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            这是一个完整的Web可访问性（WCAG 2.1 AA标准）演示页面，展示如何构建对所有用户友好的网站界面。
            可访问性功能正在开发中，即将上线。
          </Paragraph>
        </div>

        {/* 快速设置面板 */}
        <Card title="快速可访问性设置" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className="flex items-center justify-between">
                <Text>高对比度模式</Text>
                <Switch 
                  checked={isHighContrast}
                  onChange={setIsHighContrast}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<SettingOutlined />}
                />
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="flex items-center justify-between">
                <Text>大字体模式</Text>
                <Switch 
                  checked={isLargeText}
                  onChange={setIsLargeText}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<SettingOutlined />}
                />
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="flex items-center justify-between">
                <Text>减少动画</Text>
                <Switch 
                  checked={isReducedMotion}
                  onChange={setIsReducedMotion}
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren={<SettingOutlined />}
                />
              </div>
            </Col>
          </Row>
        </Card>

        <Alert
          message="开发中"
          description="可访问性系统正在开发中，完整功能即将上线。"
          type="info"
          showIcon
          className="mb-6"
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="🎯 键盘导航支持" className="h-full">
              <ul className="space-y-2">
                <li>• Tab键焦点管理</li>
                <li>• 方向键菜单导航</li>
                <li>• Enter/Space激活元素</li>
                <li>• Escape键关闭对话框</li>
                <li>• 焦点陷阱和循环</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="🔊 屏幕阅读器支持" className="h-full">
              <ul className="space-y-2">
                <li>• ARIA标签和角色</li>
                <li>• 语义化HTML结构</li>
                <li>• 实时通知区域</li>
                <li>• 表单验证反馈</li>
                <li>• 多语言内容支持</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="🎨 视觉可访问性" className="h-full">
              <ul className="space-y-2">
                <li>• WCAG AA颜色对比度</li>
                <li>• 自定义颜色主题</li>
                <li>• 可调节字体大小</li>
                <li>• 焦点可见性指示器</li>
                <li>• 减少动画选项</li>
              </ul>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card title="✅ 合规性检查" className="h-full">
              <ul className="space-y-2">
                <li>• WCAG 2.1 AA标准检查</li>
                <li>• 自动化测试工具</li>
                <li>• 可访问性报告生成</li>
                <li>• 实时问题检测</li>
                <li>• 修复建议提供</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Alert
          className="mt-6"
          message="即将上线"
          description="完整的可访问性功能正在最后的测试阶段，将在近期上线。"
          type="success"
          showIcon
        />
      </div>
    </div>
  );
}