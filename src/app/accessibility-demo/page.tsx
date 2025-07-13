'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Button, Alert, Badge, Tabs, Typography, Switch, Progress, Collapse } from 'antd';
import { 
  EyeOutlined, 
  SoundOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BugOutlined,
  FormOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { screenReader } from '@/lib/accessibility/screen-reader';
import { keyboardNavigation } from '@/lib/accessibility/keyboard-navigation';
import { focusManager } from '@/lib/accessibility/focus-management';
import { wcagChecker, type AccessibilityReport } from '@/lib/accessibility/wcag-checker';
import AccessibleForm from '@/components/accessibility/AccessibleForm';
import { useAnalytics } from '@/hooks/useAnalytics';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

export default function AccessibilityDemoPage() {
  const [accessibilityReport, setAccessibilityReport] = useState<AccessibilityReport | null>(null);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [keyboardOnlyMode, setKeyboardOnlyMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const demoFormRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    // 页面加载时进行可访问性检查
    performAccessibilityCheck();
    
    // 初始化可访问性功能
    initializeAccessibilityFeatures();
    
    // 页面访问追踪
    analytics.trackEvent({
      action: 'page_view',
      category: 'Accessibility',
      label: 'accessibility_demo',
    });

    // 页面标题宣布
    screenReader.announcePageLoad('可访问性功能演示', '这个页面展示了网站的无障碍功能和检查工具');

    return () => {
      // 清理
      keyboardNavigation.disableTabTrap();
    };
  }, [analytics]);

  // 初始化可访问性功能
  const initializeAccessibilityFeatures = () => {
    // 设置焦点指示器
    focusManager.setupFocusIndicator();
    
    // 创建跳过链接
    focusManager.createSkipLinks();
    
    // 启用键盘导航
    keyboardNavigation.enableTabTrap();
  };

  // 执行可访问性检查
  const performAccessibilityCheck = async () => {
    setIsScanning(true);
    
    try {
      const report = await wcagChecker.checkAccessibility();
      setAccessibilityReport(report);
      
      // 宣布检查结果
      screenReader.announce(
        `可访问性检查完成，发现 ${report.summary.totalIssues} 个问题，得分 ${report.summary.score} 分`,
        { priority: 'polite' }
      );
    } catch (error) {
      console.error('Accessibility check failed:', error);
      screenReader.announce('可访问性检查失败', { priority: 'assertive' });
    } finally {
      setIsScanning(false);
    }
  };

  // 切换高对比度模式
  const toggleHighContrast = (enabled: boolean) => {
    setIsHighContrast(enabled);
    
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    screenReader.announce(
      enabled ? '高对比度模式已启用' : '高对比度模式已禁用',
      { priority: 'polite' }
    );
    
    analytics.trackEvent({
      action: enabled ? 'enable_high_contrast' : 'disable_high_contrast',
      category: 'Accessibility',
      label: 'high_contrast_mode',
    });
  };

  // 切换大字体模式
  const toggleLargeText = (enabled: boolean) => {
    setIsLargeText(enabled);
    
    if (enabled) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    
    screenReader.announce(
      enabled ? '大字体模式已启用' : '大字体模式已禁用',
      { priority: 'polite' }
    );
    
    analytics.trackEvent({
      action: enabled ? 'enable_large_text' : 'disable_large_text',
      category: 'Accessibility',
      label: 'large_text_mode',
    });
  };

  // 切换减少动画模式
  const toggleReducedMotion = (enabled: boolean) => {
    setIsReducedMotion(enabled);
    
    if (enabled) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    screenReader.announce(
      enabled ? '减少动画模式已启用' : '减少动画模式已禁用',
      { priority: 'polite' }
    );
    
    analytics.trackEvent({
      action: enabled ? 'enable_reduced_motion' : 'disable_reduced_motion',
      category: 'Accessibility',
      label: 'reduced_motion_mode',
    });
  };

  // 切换屏幕阅读器模式
  const toggleScreenReaderMode = (enabled: boolean) => {
    setScreenReaderMode(enabled);
    
    if (enabled) {
      document.body.classList.add('screen-reader-mode');
      // 启用更详细的屏幕阅读器反馈
      screenReader.announce('屏幕阅读器优化模式已启用，将提供更详细的导航信息', { priority: 'assertive' });
    } else {
      document.body.classList.remove('screen-reader-mode');
      screenReader.announce('屏幕阅读器优化模式已禁用', { priority: 'polite' });
    }
    
    analytics.trackEvent({
      action: enabled ? 'enable_screen_reader_mode' : 'disable_screen_reader_mode',
      category: 'Accessibility',
      label: 'screen_reader_mode',
    });
  };

  // 切换纯键盘模式
  const toggleKeyboardOnlyMode = (enabled: boolean) => {
    setKeyboardOnlyMode(enabled);
    
    if (enabled) {
      document.body.classList.add('keyboard-only-mode');
      // 隐藏鼠标指针
      document.body.style.cursor = 'none';
      screenReader.announce('纯键盘导航模式已启用，鼠标功能已禁用', { priority: 'assertive' });
    } else {
      document.body.classList.remove('keyboard-only-mode');
      document.body.style.cursor = '';
      screenReader.announce('纯键盘导航模式已禁用', { priority: 'polite' });
    }
    
    analytics.trackEvent({
      action: enabled ? 'enable_keyboard_only_mode' : 'disable_keyboard_only_mode',
      category: 'Accessibility',
      label: 'keyboard_only_mode',
    });
  };

  // 演示屏幕阅读器功能
  const demoScreenReader = () => {
    const messages = [
      '这是屏幕阅读器演示',
      '当前页面是可访问性功能演示页面',
      '页面包含多个交互式元素和表单控件',
      '所有内容都可以通过键盘导航访问',
    ];
    
    messages.forEach((message, index) => {
      setTimeout(() => {
        screenReader.announce(message, { priority: 'polite', delay: 100 });
      }, index * 2000);
    });
    
    analytics.trackClick('demo_screen_reader', 'button');
  };

  // 演示键盘导航
  const demoKeyboardNavigation = () => {
    screenReader.announce('键盘导航演示开始，请使用Tab键在元素间导航，使用方向键在组内导航', { priority: 'assertive' });
    
    // 聚焦到第一个演示元素
    const firstDemo = document.querySelector('[data-demo-element]') as HTMLElement;
    if (firstDemo) {
      focusManager.smartFocus(firstDemo);
    }
    
    analytics.trackClick('demo_keyboard_navigation', 'button');
  };

  // 演示表单验证
  const handleDemoFormSubmit = (data: Record<string, any>) => {
    console.log('Form submitted:', data);
    screenReader.announceFormSuccess('演示表单提交成功！');
    
    analytics.trackEvent({
      action: 'demo_form_submit',
      category: 'Accessibility',
      label: 'accessible_form',
    });
  };

  // 获取问题严重程度的颜色
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#fa8c16';
      case 'info': return '#1890ff';
      default: return '#52c41a';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto p-6">
          <Title level={1} id="main-title">
            <SettingOutlined className="mr-3" />
            可访问性功能演示
          </Title>
          <Paragraph className="text-lg text-gray-600">
            这个页面展示了网站的无障碍功能，包括屏幕阅读器支持、键盘导航、高对比度模式等。
            所有功能都遵循WCAG 2.1 AA级标准。
          </Paragraph>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultActiveKey="settings" className="bg-white rounded-lg shadow-sm">
          {/* 无障碍设置 */}
          <TabPane 
            tab={
              <span>
                <EyeOutlined />
                无障碍设置
              </span>
            } 
            key="settings"
          >
            <div className="p-6 space-y-6">
              <Alert
                message="个性化设置"
                description="根据您的需求调整页面显示和交互方式，这些设置将帮助改善您的浏览体验。"
                type="info"
                showIcon
                className="mb-6"
              />

              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Card title="视觉设置" className="h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong>高对比度模式</Text>
                          <div className="text-sm text-gray-600">增强文字和背景的对比度</div>
                        </div>
                        <Switch 
                          checked={isHighContrast}
                          onChange={toggleHighContrast}
                          aria-label="切换高对比度模式"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong>大字体模式</Text>
                          <div className="text-sm text-gray-600">增大文字显示尺寸</div>
                        </div>
                        <Switch 
                          checked={isLargeText}
                          onChange={toggleLargeText}
                          aria-label="切换大字体模式"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong>减少动画</Text>
                          <div className="text-sm text-gray-600">减少页面动画和过渡效果</div>
                        </div>
                        <Switch 
                          checked={isReducedMotion}
                          onChange={toggleReducedMotion}
                          aria-label="切换减少动画模式"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card title="交互设置" className="h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong>屏幕阅读器优化</Text>
                          <div className="text-sm text-gray-600">提供更详细的导航信息</div>
                        </div>
                        <Switch 
                          checked={screenReaderMode}
                          onChange={toggleScreenReaderMode}
                          aria-label="切换屏幕阅读器优化模式"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong>纯键盘导航</Text>
                          <div className="text-sm text-gray-600">禁用鼠标，仅使用键盘操作</div>
                        </div>
                        <Switch 
                          checked={keyboardOnlyMode}
                          onChange={toggleKeyboardOnlyMode}
                          aria-label="切换纯键盘导航模式"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              {/* 演示按钮 */}
              <Card title="功能演示">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      type="primary" 
                      block 
                      icon={<SoundOutlined />}
                      onClick={demoScreenReader}
                      data-demo-element
                    >
                      演示屏幕阅读器
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      type="primary" 
                      block 
                      icon={<SettingOutlined />}
                      onClick={demoKeyboardNavigation}
                      data-demo-element
                    >
                      演示键盘导航
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      type="primary" 
                      block 
                      icon={<BugOutlined />}
                      onClick={performAccessibilityCheck}
                      loading={isScanning}
                      data-demo-element
                    >
                      重新扫描页面
                    </Button>
                  </Col>
                </Row>
              </Card>
            </div>
          </TabPane>

          {/* 可访问性检查 */}
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                可访问性检查
                {accessibilityReport && (
                  <Badge 
                    count={accessibilityReport.summary.totalIssues} 
                    offset={[10, 0]}
                    style={{ backgroundColor: getSeverityColor('error') }}
                  />
                )}
              </span>
            } 
            key="checker"
          >
            <div className="p-6">
              {accessibilityReport ? (
                <div className="space-y-6">
                  {/* 总览 */}
                  <Row gutter={[16, 16]}>
                    <Col xs={12} md={6}>
                      <Card className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {accessibilityReport.summary.score}
                        </div>
                        <div className="text-sm text-gray-600">可访问性得分</div>
                        <Progress 
                          percent={accessibilityReport.summary.score} 
                          size="small" 
                          status={accessibilityReport.summary.score >= 80 ? 'success' : 'exception'}
                          showInfo={false}
                        />
                      </Card>
                    </Col>
                    <Col xs={12} md={6}>
                      <Card className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {accessibilityReport.summary.errors}
                        </div>
                        <div className="text-sm text-gray-600">错误</div>
                      </Card>
                    </Col>
                    <Col xs={12} md={6}>
                      <Card className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {accessibilityReport.summary.warnings}
                        </div>
                        <div className="text-sm text-gray-600">警告</div>
                      </Card>
                    </Col>
                    <Col xs={12} md={6}>
                      <Card className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {accessibilityReport.summary.infos}
                        </div>
                        <div className="text-sm text-gray-600">信息</div>
                      </Card>
                    </Col>
                  </Row>

                  {/* 问题详情 */}
                  {accessibilityReport.issues.length > 0 && (
                    <Card title="问题详情">
                      <Collapse>
                        {accessibilityReport.issues.map((issue, index) => (
                          <Panel 
                            key={index}
                            header={
                              <div className="flex items-center justify-between w-full">
                                <span className="flex items-center">
                                  {issue.severity === 'error' && <ExclamationCircleOutlined className="text-red-500 mr-2" />}
                                  {issue.severity === 'warning' && <ExclamationCircleOutlined className="text-orange-500 mr-2" />}
                                  {issue.severity === 'info' && <InfoCircleOutlined className="text-blue-500 mr-2" />}
                                  {issue.message}
                                </span>
                                <Badge 
                                  color={getSeverityColor(issue.severity)}
                                  text={issue.severity.toUpperCase()}
                                />
                              </div>
                            }
                          >
                            <div className="space-y-3">
                              <div>
                                <Text strong>规则ID:</Text> {issue.ruleId}
                              </div>
                              {issue.suggestion && (
                                <div>
                                  <Text strong>建议:</Text> {issue.suggestion}
                                </div>
                              )}
                              {issue.wcagReference && (
                                <div>
                                  <Text strong>WCAG参考:</Text> {issue.wcagReference}
                                </div>
                              )}
                              <div>
                                <Text strong>元素:</Text> 
                                <code className="ml-2 px-2 py-1 bg-gray-100 rounded">
                                  {issue.element.tagName.toLowerCase()}
                                  {issue.element.id && `#${issue.element.id}`}
                                  {issue.element.className && `.${issue.element.className.split(' ').join('.')}`}
                                </code>
                              </div>
                            </div>
                          </Panel>
                        ))}
                      </Collapse>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<CheckCircleOutlined />}
                    onClick={performAccessibilityCheck}
                    loading={isScanning}
                  >
                    开始可访问性检查
                  </Button>
                </div>
              )}
            </div>
          </TabPane>

          {/* 表单演示 */}
          <TabPane 
            tab={
              <span>
                <FormOutlined />
                无障碍表单
              </span>
            } 
            key="form"
          >
            <div className="p-6" ref={demoFormRef}>
              <AccessibleForm
                title="用户注册表单"
                description="这是一个完全无障碍的表单示例，支持屏幕阅读器、键盘导航和错误提示。"
                fields={[
                  {
                    name: 'username',
                    label: '用户名',
                    type: 'text',
                    required: true,
                    placeholder: '请输入用户名',
                    description: '用户名必须是3-20个字符',
                    validation: {
                      required: true,
                      minLength: 3,
                      maxLength: 20,
                      message: '用户名必须是3-20个字符',
                    },
                    autoComplete: 'username',
                  },
                  {
                    name: 'email',
                    label: '邮箱地址',
                    type: 'email',
                    required: true,
                    placeholder: '请输入邮箱地址',
                    description: '我们将向此邮箱发送验证信息',
                    validation: {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '请输入有效的邮箱地址',
                    },
                    autoComplete: 'email',
                  },
                  {
                    name: 'password',
                    label: '密码',
                    type: 'password',
                    required: true,
                    placeholder: '请输入密码',
                    description: '密码至少8个字符，包含字母和数字',
                    validation: {
                      required: true,
                      minLength: 8,
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
                      message: '密码至少8个字符，包含字母和数字',
                    },
                    autoComplete: 'new-password',
                  },
                  {
                    name: 'gender',
                    label: '性别',
                    type: 'radio',
                    options: [
                      { value: 'male', label: '男' },
                      { value: 'female', label: '女' },
                      { value: 'other', label: '其他' },
                    ],
                  },
                  {
                    name: 'interests',
                    label: '兴趣爱好',
                    type: 'select',
                    description: '选择您的主要兴趣',
                    options: [
                      { value: 'technology', label: '科技' },
                      { value: 'sports', label: '体育' },
                      { value: 'music', label: '音乐' },
                      { value: 'reading', label: '阅读' },
                      { value: 'travel', label: '旅行' },
                    ],
                  },
                  {
                    name: 'bio',
                    label: '个人简介',
                    type: 'textarea',
                    placeholder: '请简单介绍一下自己',
                    description: '可选，最多200个字符',
                    validation: {
                      maxLength: 200,
                      message: '个人简介不能超过200个字符',
                    },
                  },
                  {
                    name: 'newsletter',
                    label: '订阅新闻通讯',
                    type: 'checkbox',
                    description: '接收产品更新和行业新闻',
                  },
                  {
                    name: 'terms',
                    label: '我同意服务条款和隐私政策',
                    type: 'checkbox',
                    required: true,
                    validation: {
                      custom: (value) => value ? null : '必须同意服务条款才能注册',
                    },
                  },
                ]}
                onSubmit={handleDemoFormSubmit}
                submitText="注册账户"
                showProgress={true}
                validateOnBlur={true}
              />
            </div>
          </TabPane>

          {/* 使用指南 */}
          <TabPane 
            tab={
              <span>
                <InfoCircleOutlined />
                使用指南
              </span>
            } 
            key="guide"
          >
            <div className="p-6 space-y-6">
              <Card title="键盘快捷键">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd>
                        <span>下一个元素</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd>
                        <span>上一个元素</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>
                        <span>激活按钮/链接</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd>
                        <span>选择复选框</span>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">↑ ↓</kbd>
                        <span>单选按钮/下拉选择</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>
                        <span>关闭对话框</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">Home</kbd>
                        <span>第一个元素</span>
                      </div>
                      <div className="flex justify-between">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">End</kbd>
                        <span>最后一个元素</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card title="WCAG 2.1 合规性">
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
                      <Title level={4}>感知性</Title>
                      <ul className="text-left text-sm space-y-1">
                        <li>• 图片替代文本</li>
                        <li>• 颜色对比度</li>
                        <li>• 文字缩放</li>
                        <li>• 音频控制</li>
                      </ul>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
                      <Title level={4}>可操作性</Title>
                      <ul className="text-left text-sm space-y-1">
                        <li>• 键盘访问</li>
                        <li>• 焦点指示器</li>
                        <li>• 跳过导航</li>
                        <li>• 页面标题</li>
                      </ul>
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="text-center">
                      <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
                      <Title level={4}>可理解性</Title>
                      <ul className="text-left text-sm space-y-1">
                        <li>• 页面语言</li>
                        <li>• 错误识别</li>
                        <li>• 表单标签</li>
                        <li>• 一致导航</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Alert
                message="技术支持"
                description="如果您在使用过程中遇到任何无障碍问题，请联系我们的技术支持团队，我们将尽快为您解决。"
                type="info"
                showIcon
                action={
                  <Button size="small" ghost>
                    联系支持
                  </Button>
                }
              />
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* 添加无障碍相关的CSS */}
      <style jsx global>{`
        /* 高对比度模式 */
        .high-contrast {
          filter: contrast(200%) saturate(0%);
        }
        
        .high-contrast button {
          border: 2px solid #000 !important;
        }

        /* 大字体模式 */
        .large-text {
          font-size: 120% !important;
        }
        
        .large-text * {
          line-height: 1.6 !important;
        }

        /* 减少动画模式 */
        .reduced-motion *,
        .reduced-motion *::before,
        .reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        /* 屏幕阅读器模式 */
        .screen-reader-mode .sr-only {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: 4px 8px !important;
          margin: 2px !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
          background: #f0f0f0 !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          color: #666 !important;
        }

        /* 纯键盘模式 */
        .keyboard-only-mode {
          cursor: none !important;
        }
        
        .keyboard-only-mode * {
          cursor: none !important;
        }
        
        .keyboard-only-mode *:focus {
          outline: 3px solid #005fcc !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 5px rgba(0, 95, 204, 0.2) !important;
        }

        /* 增强的焦点指示器 */
        :focus-visible {
          outline: 2px solid #005fcc !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.1) !important;
        }

        /* 跳过链接样式 */
        .skip-link:focus {
          position: absolute;
          top: 0;
          left: 0;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          z-index: 100000;
          text-decoration: none;
          border-radius: 0 0 8px 0;
        }
      `}</style>
    </div>
  );
}