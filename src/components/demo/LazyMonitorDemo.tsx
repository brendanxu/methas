/**
 * 懒加载监控系统演示组件
 * 展示按需加载的监控功能
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Space, Tag, Progress, Alert, Typography, Divider } from 'antd'
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { 
  lazyMonitorManager, 
  corePerformanceMonitor, 
  MONITOR_CONFIG,
  updateMonitorConfig
} from '@/lib/monitoring/lazy-monitor'
import { useMonitorStatus, usePerformanceMetrics, ConditionalMonitorWidget } from '@/components/providers/LazyMonitorProvider'

const { Title, Text, Paragraph } = Typography

export default function LazyMonitorDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loadedComponents, setLoadedComponents] = useState<string[]>([])
  const [showWidget, setShowWidget] = useState(false)
  
  const monitorStatus = useMonitorStatus()
  const performanceMetrics = usePerformanceMetrics()

  // 模拟监控组件加载进度
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            setIsRunning(false)
            return 100
          }
          return newProgress
        })
      }, 500)

      return () => clearInterval(interval)
    }
    return undefined
  }, [isRunning])

  // 启动懒加载演示
  const startLazyLoading = async () => {
    setIsRunning(true)
    setLoadProgress(0)
    setLoadedComponents([])

    // 模拟分阶段加载
    const loadingStages = [
      { component: 'performance', delay: 500 },
      { component: 'errors', delay: 1000 },
      { component: 'resources', delay: 1500 },
      { component: 'analytics', delay: 2000 },
      { component: 'widget', delay: 2500 }
    ]

    for (const stage of loadingStages) {
      setTimeout(() => {
        setLoadedComponents(prev => [...prev, stage.component])
      }, stage.delay)
    }
  }

  // 重置演示
  const resetDemo = () => {
    setIsRunning(false)
    setLoadProgress(0)
    setLoadedComponents([])
    setShowWidget(false)
    lazyMonitorManager.reset()
  }

  // 切换监控组件配置
  const toggleComponentConfig = (componentName: string) => {
    const config = MONITOR_CONFIG[componentName]
    if (config) {
      updateMonitorConfig(componentName, { enabled: !config.enabled })
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <Title level={2}>懒加载监控系统演示</Title>
      
      <Alert
        message="性能优化说明"
        description="此演示展示了如何通过懒加载减少初始bundle大小，仅在需要时加载监控组件。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 控制面板 */}
        <Card title="控制面板" size="small">
          <Space>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={startLazyLoading}
              disabled={isRunning}
            >
              开始懒加载演示
            </Button>
            <Button 
              icon={<PauseCircleOutlined />}
              onClick={() => setIsRunning(false)}
              disabled={!isRunning}
            >
              暂停
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={resetDemo}
            >
              重置
            </Button>
            <Button 
              icon={<EyeOutlined />}
              onClick={() => setShowWidget(!showWidget)}
            >
              {showWidget ? '隐藏' : '显示'} 监控组件
            </Button>
          </Space>
        </Card>

        {/* 加载进度 */}
        <Card title="加载进度" size="small">
          <Progress 
            percent={loadProgress}
            status={isRunning ? 'active' : loadProgress === 100 ? 'success' : 'normal'}
            strokeColor={isRunning ? '#1890ff' : '#52c41a'}
          />
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">
              {isRunning ? '正在加载监控组件...' : 
               loadProgress === 100 ? '所有组件加载完成' : '准备开始加载'}
            </Text>
          </div>
        </Card>

        {/* 组件状态 */}
        <Card title="监控组件状态" size="small">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {Object.entries(MONITOR_CONFIG).map(([name, config]) => (
              <div key={name} style={{ 
                padding: '12px', 
                border: '1px solid #f0f0f0', 
                borderRadius: '6px',
                background: loadedComponents.includes(name) ? '#f6ffed' : '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{name}</Text>
                  <Tag color={config.enabled ? 'green' : 'red'}>
                    {config.enabled ? '启用' : '禁用'}
                  </Tag>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">优先级: {config.priority}</Text>
                  <br />
                  <Text type="secondary">
                    状态: {loadedComponents.includes(name) ? '已加载' : '未加载'}
                  </Text>
                </div>
                <Button 
                  size="small" 
                  style={{ marginTop: '8px' }}
                  onClick={() => toggleComponentConfig(name)}
                >
                  {config.enabled ? '禁用' : '启用'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* 实时监控状态 */}
        <Card title="实时监控状态" size="small">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <Text strong>初始化状态:</Text>
              <br />
              <Tag color={monitorStatus.isInitialized ? 'green' : 'orange'}>
                {monitorStatus.isInitialized ? '已初始化' : '未初始化'}
              </Tag>
            </div>
            <div>
              <Text strong>已加载组件:</Text>
              <br />
              <Text>{monitorStatus.loadedComponents.length} / {Object.keys(MONITOR_CONFIG).length}</Text>
            </div>
            <div>
              <Text strong>核心指标:</Text>
              <br />
              <Text>{monitorStatus.coreMetrics} 项</Text>
            </div>
          </div>
        </Card>

        {/* 性能指标 */}
        <Card title="性能指标" size="small">
          {performanceMetrics.size > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Array.from(performanceMetrics.entries()).map(([name, metric]) => (
                <div key={name} style={{ 
                  padding: '12px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '6px' 
                }}>
                  <Text strong>{name.toUpperCase()}</Text>
                  <br />
                  <Text type="secondary">
                    {typeof metric.value === 'number' ? 
                      `${metric.value.toFixed(2)}${name === 'cls' ? '' : 'ms'}` : 
                      'N/A'
                    }
                  </Text>
                  <br />
                  <Tag color={
                    metric.rating === 'good' ? 'green' :
                    metric.rating === 'needs-improvement' ? 'orange' : 'red'
                  }>
                    {metric.rating || 'unknown'}
                  </Tag>
                </div>
              ))}
            </div>
          ) : (
            <Text type="secondary">暂无性能指标数据</Text>
          )}
        </Card>

        {/* 条件性监控组件 */}
        <Card title="条件性监控组件" size="small">
          <Paragraph>
            下面的监控组件仅在满足条件时才会加载：
          </Paragraph>
          <ConditionalMonitorWidget 
            condition={showWidget}
            component="PerformanceWidget"
          />
          {!showWidget && (
            <Text type="secondary">点击&ldquo;显示监控组件&rdquo;按钮来加载性能监控UI</Text>
          )}
        </Card>

        <Divider />

        {/* 技术说明 */}
        <Card title="技术实现说明" size="small">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <Title level={5}>懒加载策略</Title>
              <ul>
                <li>核心监控立即加载</li>
                <li>UI组件按需加载</li>
                <li>资源监控延迟加载</li>
                <li>分析工具条件加载</li>
              </ul>
            </div>
            <div>
              <Title level={5}>性能优化</Title>
              <ul>
                <li>减少初始bundle大小</li>
                <li>提升首屏加载速度</li>
                <li>智能组件调度</li>
                <li>条件性功能激活</li>
              </ul>
            </div>
            <div>
              <Title level={5}>监控特性</Title>
              <ul>
                <li>Web Vitals 监控</li>
                <li>错误边界处理</li>
                <li>资源加载分析</li>
                <li>用户行为追踪</li>
              </ul>
            </div>
          </div>
        </Card>
      </Space>
    </div>
  )
}