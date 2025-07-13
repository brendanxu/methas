'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Alert, Badge, Tabs, Typography, Statistic } from 'antd';
import { 
  MonitorOutlined, 
  AlertOutlined, 
  DashboardOutlined,
  BugOutlined,
  RocketOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PerformanceMonitor } from '@/components/analytics/PerformanceMonitor';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useAnalytics, useScrollTracker, useTimeOnPageTracker } from '@/hooks/useAnalytics';
import { monitoring, initMonitoring } from '@/lib/monitoring/alerts';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

export default function MonitoringDemoPage() {
  const [alerts, setAlerts] = useState(monitoring.getAlerts());
  const [stats, setStats] = useState(monitoring.getStats());
  const [isMonitoringInitialized, setIsMonitoringInitialized] = useState(false);
  
  const analytics = useAnalytics();
  const scrollProgress = useScrollTracker([25, 50, 75, 100]);
  useTimeOnPageTracker();

  useEffect(() => {
    // 初始化监控系统
    const monitoringInstance = initMonitoring();
    setIsMonitoringInitialized(true);

    // 订阅告警
    const unsubscribe = monitoringInstance.subscribe((alert) => {
      setAlerts(monitoringInstance.getAlerts());
      setStats(monitoringInstance.getStats());
    });

    // 页面访问追踪
    analytics.trackEvent({
      action: 'page_view',
      category: 'Demo',
      label: 'monitoring_demo',
    });

    return () => {
      unsubscribe();
    };
  }, [analytics]);

  // 测试函数
  const triggerPerformanceAlert = () => {
    monitoring.checkPerformance('LCP', 4500); // 触发LCP告警
    analytics.trackClick('trigger_performance_alert', 'button');
  };

  const triggerErrorAlert = () => {
    const testError = new Error('这是一个测试错误');
    monitoring.logError(testError, { 
      source: 'demo_page',
      action: 'manual_trigger' 
    });
    analytics.trackClick('trigger_error_alert', 'button');
  };

  const triggerThresholdAlert = () => {
    monitoring.checkThreshold('用户转化率', 0.3, 2.0, 5.0); // 低于最小阈值
    analytics.trackClick('trigger_threshold_alert', 'button');
  };

  const triggerSecurityAlert = () => {
    monitoring.securityAlert('XSS尝试', {
      payload: '<script>alert("test")</script>',
      source: 'user_input',
    });
    analytics.trackClick('trigger_security_alert', 'button');
  };

  const simulateSlowOperation = async () => {
    analytics.trackClick('simulate_slow_operation', 'button');
    
    // 模拟慢操作
    const startTime = performance.now();
    await new Promise(resolve => setTimeout(resolve, 3000));
    const endTime = performance.now();
    
    const duration = endTime - startTime;
    monitoring.checkPerformance('custom_operation', duration);
    
    analytics.trackEvent({
      action: 'slow_operation_completed',
      category: 'Performance',
      value: Math.round(duration),
    });
  };

  const downloadTestFile = () => {
    analytics.trackFileDownload('test-report.pdf', '/files/test-report.pdf', 1024000);
    
    // 模拟下载
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,这是一个测试文件内容';
    link.download = 'test-report.txt';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Analytics和性能监控组件 */}
      <GoogleAnalytics />
      <PerformanceMonitor enableDetailedLogging={true} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面头部 */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-4">
            <MonitorOutlined className="mr-3" />
            监控与分析系统演示
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            这是一个完整的网站监控和分析系统演示，包括性能监控、错误追踪、用户行为分析和实时告警功能。
            所有的事件和指标都会被实时收集和分析。
          </Paragraph>
          
          <div className="flex justify-center space-x-4 mt-4">
            <Badge count={stats.unresolved} offset={[10, 0]}>
              <Card className="text-center">
                <Statistic title="未解决告警" value={stats.unresolved} />
              </Card>
            </Badge>
            
            <Card className="text-center">
              <Statistic title="今日告警" value={stats.today} />
            </Card>
            
            <Card className="text-center">
              <Statistic title="滚动进度" value={Math.max(...Array.from(scrollProgress))} suffix="%" />
            </Card>
          </div>
        </div>

        <Tabs defaultActiveKey="monitoring" className="bg-white rounded-lg shadow-sm">
          <TabPane 
            tab={
              <span>
                <AlertOutlined />
                实时监控
              </span>
            } 
            key="monitoring"
          >
            <div className="p-6">
              {/* 监控状态 */}
              <Alert
                message="监控系统状态"
                description={
                  isMonitoringInitialized 
                    ? "✅ 监控系统已启动，正在实时收集性能数据和错误信息"
                    : "⏳ 监控系统正在初始化..."
                }
                type={isMonitoringInitialized ? "success" : "info"}
                showIcon
                className="mb-6"
              />

              {/* 测试按钮 */}
              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="primary" 
                    danger 
                    block 
                    icon={<RocketOutlined />}
                    onClick={triggerPerformanceAlert}
                  >
                    触发性能告警
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="primary" 
                    danger 
                    block 
                    icon={<BugOutlined />}
                    onClick={triggerErrorAlert}
                  >
                    触发错误告警
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="primary" 
                    danger 
                    block 
                    icon={<AlertOutlined />}
                    onClick={triggerThresholdAlert}
                  >
                    触发阈值告警
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="primary" 
                    danger 
                    block 
                    icon={<SafetyOutlined />}
                    onClick={triggerSecurityAlert}
                  >
                    触发安全告警
                  </Button>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12}>
                  <Button 
                    type="default" 
                    block 
                    loading={false}
                    onClick={simulateSlowOperation}
                  >
                    模拟慢操作 (3秒)
                  </Button>
                </Col>
                <Col xs={24} sm={12}>
                  <Button 
                    type="default" 
                    block 
                    onClick={downloadTestFile}
                  >
                    下载测试文件
                  </Button>
                </Col>
              </Row>

              {/* 实时告警列表 */}
              <Card title="实时告警" extra={<Badge count={alerts.length} />}>
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    暂无告警信息
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(-10).reverse().map((alert) => (
                      <Alert
                        key={alert.id}
                        message={
                          <div className="flex justify-between items-center">
                            <Text strong>{alert.message}</Text>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                color={
                                  alert.severity === 'critical' ? 'red' :
                                  alert.severity === 'high' ? 'orange' :
                                  alert.severity === 'medium' ? 'yellow' : 'blue'
                                }
                                text={alert.severity.toUpperCase()}
                              />
                              <Text type="secondary" className="text-xs">
                                {alert.timestamp.toLocaleTimeString()}
                              </Text>
                            </div>
                          </div>
                        }
                        type={
                          alert.severity === 'critical' || alert.severity === 'high' 
                            ? 'error' 
                            : alert.severity === 'medium'
                            ? 'warning'
                            : 'info'
                        }
                        showIcon
                      />
                    ))}
                  </div>
                )}
              </Card>

              {/* 统计信息 */}
              <Row gutter={[16, 16]} className="mt-6">
                <Col xs={12} md={6}>
                  <Card>
                    <Statistic 
                      title="总告警数" 
                      value={stats.total} 
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card>
                    <Statistic 
                      title="最近1小时" 
                      value={stats.lastHour} 
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card>
                    <Statistic 
                      title="严重告警" 
                      value={stats.bySeverity.critical + stats.bySeverity.high} 
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card>
                    <Statistic 
                      title="性能告警" 
                      value={stats.byType.performance} 
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <DashboardOutlined />
                分析仪表板
              </span>
            } 
            key="dashboard"
          >
            <AnalyticsDashboard />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MonitorOutlined />
                系统说明
              </span>
            } 
            key="documentation"
          >
            <div className="p-6">
              <Title level={2}>系统功能说明</Title>
              
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
                message="实时数据收集"
                description="此页面的所有交互都会被实时收集并发送到分析系统。您可以通过浏览器开发者工具的Network标签查看数据传输情况。"
                type="info"
                showIcon
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}