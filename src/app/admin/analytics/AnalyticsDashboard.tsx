'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Select,
  DatePicker,
  Space,
  Divider,
  Alert,
  Spin,
  Button,
  Table,
  Tag,
  Tooltip,
  Badge
} from 'antd'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  MobileOutlined,
  DesktopOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// 分析数据接口定义
interface AnalyticsData {
  overview: {
    totalUsers: number
    totalContent: number
    totalPageViews: number
    avgSessionDuration: number
    bounceRate: number
    conversionRate: number
  }
  traffic: {
    daily: Array<{ date: string; visitors: number; pageViews: number }>
    sources: Array<{ source: string; visitors: number; percentage: number }>
    devices: Array<{ device: string; sessions: number; percentage: number }>
  }
  content: {
    topPages: Array<{ path: string; views: number; avgTime: number }>
    topContent: Array<{ title: string; views: number; type: string }>
  }
  performance: {
    loadTime: number
    coreWebVitals: {
      lcp: number  // Largest Contentful Paint
      fid: number  // First Input Delay
      cls: number  // Cumulative Layout Shift
    }
    errorRate: number
  }
  realtime: {
    activeUsers: number
    currentPageViews: number
    topActivePages: Array<{ path: string; users: number }>
  }
}

export default function AnalyticsDashboard() {
  const { checkSpecificPermission, user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ])
  const [refreshing, setRefreshing] = useState(false)

  // 权限检查
  const canViewAnalytics = checkSpecificPermission('analytics:view').granted || 
                          ['ADMIN', 'SUPER_ADMIN'].includes(user?.role || '')

  const loadAnalyticsData = useCallback(async () => {
    setLoading(true)
    try {
      // 调用真实API获取分析数据
      const params = new URLSearchParams({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD')
      })
      
      const response = await fetch(`/api/admin/analytics?${params}`)
      if (response.ok) {
        const result = await response.json()
        const apiData = result.data
        
        // 使用来自 AnalyticsService 的统一数据格式
        const transformedData: AnalyticsData = {
          overview: apiData.overview,
          traffic: apiData.traffic,
          content: apiData.content,
          performance: apiData.performance,
          realtime: apiData.realtime
        }
        
        setAnalyticsData(transformedData)
      } else {
        throw new Error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      // 如果API失败，使用模拟数据
      const fallbackData: AnalyticsData = {
        overview: {
          totalUsers: 0,
          totalContent: 0,
          totalPageViews: 0,
          avgSessionDuration: 0,
          bounceRate: 0,
          conversionRate: 0
        },
        traffic: { daily: [], sources: [], devices: [] },
        content: { topPages: [], topContent: [] },
        performance: {
          loadTime: 0,
          coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
          errorRate: 0
        },
        realtime: {
          activeUsers: 0,
          currentPageViews: 0,
          topActivePages: []
        }
      }
      setAnalyticsData(fallbackData)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    if (canViewAnalytics) {
      loadAnalyticsData()
      // 设置自动刷新 - 每5分钟刷新一次
      const interval = setInterval(loadAnalyticsData, 300000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [canViewAnalytics, loadAnalyticsData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
  }

  const getWebVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    }
    
    const threshold = thresholds[metric as keyof typeof thresholds]
    if (value <= threshold.good) return { status: 'success', text: 'Good' }
    if (value <= threshold.poor) return { status: 'warning', text: 'Needs Improvement' }
    return { status: 'error', text: 'Poor' }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${secs}s`
  }

  const topPagesColumns = [
    {
      title: 'Page',
      dataIndex: 'path',
      key: 'path',
      render: (path: string) => <Text code>{path}</Text>
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString()
    },
    {
      title: 'Avg. Time',
      dataIndex: 'avgTime',
      key: 'avgTime',
      render: (time: number) => formatDuration(time)
    }
  ]

  const topContentColumns = [
    {
      title: 'Content',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <Tooltip title={title}>
          <Text ellipsis style={{ maxWidth: 200 }}>{title}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          NEWS: 'blue',
          CASE_STUDY: 'green',
          SERVICE: 'purple',
          PAGE: 'orange'
        }
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>
      }
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => views.toLocaleString()
    }
  ]

  if (!canViewAnalytics) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Access Denied</Title>
        <Text>You don&apos;t have permission to view analytics.</Text>
      </div>
    )
  }

  if (loading && !analyticsData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Loading analytics dashboard...</Text>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <BarChartOutlined /> Analytics Dashboard
        </Title>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="YYYY-MM-DD"
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {analyticsData && (
        <>
          {/* Real-time Overview */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card>
                <Title level={4}>Real-time Overview</Title>
                <Row gutter={16}>
                  <Col xs={12} sm={8} lg={4}>
                    <Statistic
                      title="Active Users"
                      value={analyticsData.realtime.activeUsers}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={12} sm={8} lg={4}>
                    <Statistic
                      title="Current Page Views"
                      value={analyticsData.realtime.currentPageViews}
                      prefix={<EyeOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col xs={24} sm={8} lg={16}>
                    <div>
                      <Text strong>Top Active Pages:</Text>
                      <div style={{ marginTop: '8px' }}>
                        {analyticsData.realtime.topActivePages.map((page, index) => (
                          <Tag key={index} style={{ margin: '2px' }}>
                            {page.path}: {page.users} users
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Key Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={analyticsData.overview.totalUsers}
                  prefix={<UserOutlined />}
                  suffix={<Badge status="processing" />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Content"
                  value={analyticsData.overview.totalContent}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Page Views"
                  value={analyticsData.overview.totalPageViews}
                  prefix={<EyeOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Avg. Session Duration"
                  value={formatDuration(analyticsData.overview.avgSessionDuration)}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Performance Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} lg={12}>
              <Card title="Core Web Vitals">
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>LCP (Largest Contentful Paint)</Text>
                    <Badge 
                      status={getWebVitalStatus('lcp', analyticsData.performance.coreWebVitals.lcp).status as any}
                      text={getWebVitalStatus('lcp', analyticsData.performance.coreWebVitals.lcp).text}
                    />
                  </div>
                  <Text>{analyticsData.performance.coreWebVitals.lcp}s</Text>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>FID (First Input Delay)</Text>
                    <Badge 
                      status={getWebVitalStatus('fid', analyticsData.performance.coreWebVitals.fid).status as any}
                      text={getWebVitalStatus('fid', analyticsData.performance.coreWebVitals.fid).text}
                    />
                  </div>
                  <Text>{analyticsData.performance.coreWebVitals.fid}ms</Text>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>CLS (Cumulative Layout Shift)</Text>
                    <Badge 
                      status={getWebVitalStatus('cls', analyticsData.performance.coreWebVitals.cls).status as any}
                      text={getWebVitalStatus('cls', analyticsData.performance.coreWebVitals.cls).text}
                    />
                  </div>
                  <Text>{analyticsData.performance.coreWebVitals.cls}</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Site Performance">
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Load Time"
                      value={analyticsData.performance.loadTime}
                      suffix="s"
                      precision={1}
                      valueStyle={{ 
                        color: analyticsData.performance.loadTime < 2 ? '#52c41a' : 
                               analyticsData.performance.loadTime < 4 ? '#faad14' : '#ff4d4f' 
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Error Rate"
                      value={analyticsData.performance.errorRate * 100}
                      suffix="%"
                      precision={3}
                      valueStyle={{ 
                        color: analyticsData.performance.errorRate < 0.01 ? '#52c41a' : '#ff4d4f' 
                      }}
                    />
                  </Col>
                </Row>
                
                <Divider />
                
                <div>
                  <Text strong>Bounce Rate: </Text>
                  <Progress 
                    percent={analyticsData.overview.bounceRate * 100} 
                    size="small" 
                    status={analyticsData.overview.bounceRate < 0.4 ? 'success' : 'exception'}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                  />
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <Text strong>Conversion Rate: </Text>
                  <Progress 
                    percent={analyticsData.overview.conversionRate * 100} 
                    size="small" 
                    status="success"
                    strokeColor="#52c41a"
                    format={(percent) => `${percent?.toFixed(2)}%`}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Traffic Sources */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} lg={12}>
              <Card title="Traffic Sources">
                {analyticsData.traffic.sources.map((source, index) => (
                  <div key={index} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <Text>{source.source}</Text>
                      <Text strong>{source.visitors.toLocaleString()} ({source.percentage}%)</Text>
                    </div>
                    <Progress 
                      percent={source.percentage} 
                      showInfo={false} 
                      strokeColor={`hsl(${index * 60}, 70%, 50%)`}
                    />
                  </div>
                ))}
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Device Distribution">
                {analyticsData.traffic.devices.map((device, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {(device.device === 'Desktop' || device.device === 'desktop') && <DesktopOutlined style={{ marginRight: '8px' }} />}
                        {(device.device === 'Mobile' || device.device === 'mobile') && <MobileOutlined style={{ marginRight: '8px' }} />}
                        {(device.device === 'Tablet' || device.device === 'tablet') && <GlobalOutlined style={{ marginRight: '8px' }} />}
                        <Text>{device.device}</Text>
                      </div>
                      <Text strong>{device.sessions.toLocaleString()} ({device.percentage}%)</Text>
                    </div>
                    <Progress 
                      percent={device.percentage} 
                      showInfo={false}
                      strokeColor={(device.device === 'Desktop' || device.device === 'desktop') ? '#1890ff' : 
                                 (device.device === 'Mobile' || device.device === 'mobile') ? '#52c41a' : '#faad14'}
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          {/* Content Performance */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Top Pages">
                <Table 
                  columns={topPagesColumns} 
                  dataSource={analyticsData.content.topPages}
                  pagination={false}
                  size="small"
                  rowKey="path"
                />
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Top Content">
                <Table 
                  columns={topContentColumns} 
                  dataSource={analyticsData.content.topContent}
                  pagination={false}
                  size="small"
                  rowKey="title"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}