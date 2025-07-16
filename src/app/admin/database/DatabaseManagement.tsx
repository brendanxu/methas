'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Typography,
  Progress,
  Tag,
  Alert,
  Tabs,
  List,
  Tooltip,
  Badge,
  message,
  Modal,
  Descriptions
} from 'antd'
import {
  DatabaseOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  LineChartOutlined,
  BugOutlined
} from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    connection: boolean
    responseTime: number
    tableCount: number
    recordCounts: Record<string, number>
    recentActivity: {
      lastUser?: string
      lastContent?: string
      lastFormSubmission?: string
    }
    performance: {
      avgQueryTime: number
      slowQueries: number
    }
  }
  recommendations: string[]
  timestamp: string
}

interface PerformanceStats {
  overview: {
    totalQueries: number
    slowQueries: number
    connectionStatus: string
    lastUpdated: string
  }
  queryStatistics: Array<{
    queryName: string
    executionCount: number
    averageTime: number
    totalTime: number
    lastExecuted: string
  }>
  tableStatistics: Record<string, number>
  performanceMetrics: {
    averageQueryTime: number
    totalQueryTime: number
    mostExecutedQueries: any[]
    slowestQueries: any[]
  }
  recommendations: string[]
}

export default function DatabaseManagement() {
  const { checkSpecificPermission, user } = useAuth()
  const [activeTab, setActiveTab] = useState('health')
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null)
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [benchmarkLoading, setBenchmarkLoading] = useState(false)

  // Permission checks
  const canManageDb = checkSpecificPermission('system:maintenance').granted || user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    if (canManageDb) {
      loadDatabaseHealth()
      loadPerformanceStats()
    }
  }, [canManageDb])

  const loadDatabaseHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/db-health')
      if (response.ok) {
        const data = await response.json()
        setDbHealth(data)
      } else {
        message.error('Failed to load database health')
      }
    } catch (error) {
      message.error('Failed to load database health')
    } finally {
      setLoading(false)
    }
  }

  const loadPerformanceStats = async () => {
    try {
      const response = await fetch('/api/admin/db-performance')
      if (response.ok) {
        const data = await response.json()
        setPerformanceStats(data.data)
      }
    } catch (error) {
      console.error('Failed to load performance stats:', error)
    }
  }

  const runDatabaseOperation = async (action: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/db-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const result = await response.json()
        message.success(result.message)
        await loadDatabaseHealth() // Refresh health data
      } else {
        const error = await response.json()
        message.error(error.error || 'Operation failed')
      }
    } catch (error) {
      message.error('Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const runBenchmark = async () => {
    setBenchmarkLoading(true)
    try {
      const response = await fetch('/api/admin/db-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run-benchmark' })
      })

      if (response.ok) {
        const result = await response.json()
        Modal.info({
          title: 'Benchmark Results',
          width: 700,
          content: (
            <div>
              <Descriptions title="Summary" bordered size="small">
                <Descriptions.Item label="Total Tests" span={3}>
                  {result.data.results.summary.totalTests}
                </Descriptions.Item>
                <Descriptions.Item label="Average Duration" span={3}>
                  {result.data.results.summary.averageDuration.toFixed(2)}ms
                </Descriptions.Item>
                <Descriptions.Item label="Slow Tests" span={3}>
                  {result.data.results.summary.slowTests}
                </Descriptions.Item>
              </Descriptions>
              <Table
                style={{ marginTop: 16 }}
                size="small"
                dataSource={result.data.results.benchmarks}
                columns={[
                  { title: 'Test', dataIndex: 'test', key: 'test' },
                  { 
                    title: 'Duration (ms)', 
                    dataIndex: 'duration', 
                    key: 'duration',
                    render: (val: number) => (
                      <span style={{ color: val > 500 ? 'red' : 'green' }}>
                        {val.toFixed(2)}
                      </span>
                    )
                  },
                  { title: 'Records', dataIndex: 'recordsReturned', key: 'records' }
                ]}
                pagination={false}
              />
            </div>
          )
        })
        await loadPerformanceStats()
      } else {
        message.error('Benchmark failed')
      }
    } catch (error) {
      message.error('Benchmark failed')
    } finally {
      setBenchmarkLoading(false)
    }
  }

  const clearStats = async () => {
    try {
      const response = await fetch('/api/admin/db-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-stats' })
      })

      if (response.ok) {
        message.success('Performance statistics cleared')
        await loadPerformanceStats()
      }
    } catch (error) {
      message.error('Failed to clear statistics')
    }
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />
      case 'degraded':
        return <WarningOutlined style={{ color: '#faad14' }} />
      case 'unhealthy':
        return <BugOutlined style={{ color: '#ff4d4f' }} />
      default:
        return <ClockCircleOutlined />
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#52c41a'
      case 'degraded': return '#faad14'
      case 'unhealthy': return '#ff4d4f'
      default: return '#d9d9d9'
    }
  }

  if (!canManageDb) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Access Denied</Title>
        <Paragraph>You don&apos;t have permission to access database management.</Paragraph>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        <DatabaseOutlined /> Database Management
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined />
              Health Check
            </span>
          } 
          key="health"
        >
          {dbHealth && (
            <>
              {/* Health Overview */}
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Overall Status"
                      value={dbHealth.status.toUpperCase()}
                      prefix={getHealthStatusIcon(dbHealth.status)}
                      valueStyle={{ color: getHealthStatusColor(dbHealth.status) }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Response Time"
                      value={dbHealth.checks.responseTime}
                      suffix="ms"
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Tables"
                      value={dbHealth.checks.tableCount}
                      prefix={<DatabaseOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Avg Query Time"
                      value={dbHealth.checks.performance.avgQueryTime.toFixed(2)}
                      suffix="ms"
                      prefix={<ThunderboltOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Table Statistics */}
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                  <Card title="Table Statistics">
                    <Row gutter={[16, 16]}>
                      {Object.entries(dbHealth.checks.recordCounts).map(([table, count]) => (
                        <Col xs={12} sm={8} lg={4} key={table}>
                          <Statistic
                            title={table.charAt(0).toUpperCase() + table.slice(1)}
                            value={count}
                            valueStyle={{ fontSize: '16px' }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              </Row>

              {/* Recommendations */}
              {dbHealth.recommendations.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                  <Col span={24}>
                    <Alert
                      message="Recommendations"
                      description={
                        <List
                          size="small"
                          dataSource={dbHealth.recommendations}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      }
                      type={dbHealth.status === 'healthy' ? 'info' : 'warning'}
                      showIcon
                    />
                  </Col>
                </Row>
              )}

              {/* Operations */}
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="Database Operations">
                    <Space>
                      <Button 
                        icon={<ToolOutlined />}
                        onClick={() => runDatabaseOperation('vacuum')}
                        loading={loading}
                      >
                        Vacuum Database
                      </Button>
                      <Button 
                        icon={<LineChartOutlined />}
                        onClick={() => runDatabaseOperation('analyze')}
                        loading={loading}
                      >
                        Update Statistics
                      </Button>
                      <Button 
                        icon={<BugOutlined />}
                        onClick={() => runDatabaseOperation('cleanup')}
                        loading={loading}
                      >
                        Cleanup Expired Data
                      </Button>
                      <Button 
                        onClick={loadDatabaseHealth}
                        loading={loading}
                      >
                        Refresh
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined />
              Performance
            </span>
          } 
          key="performance"
        >
          {performanceStats && (
            <>
              {/* Performance Overview */}
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Queries"
                      value={performanceStats.overview.totalQueries}
                      prefix={<DatabaseOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Slow Queries"
                      value={performanceStats.overview.slowQueries}
                      prefix={<WarningOutlined />}
                      valueStyle={{ color: performanceStats.overview.slowQueries > 0 ? '#ff4d4f' : '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Avg Query Time"
                      value={performanceStats.performanceMetrics.averageQueryTime.toFixed(2)}
                      suffix="ms"
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Query Time"
                      value={performanceStats.performanceMetrics.totalQueryTime.toFixed(2)}
                      suffix="ms"
                      prefix={<ThunderboltOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Query Statistics */}
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col xs={24} lg={12}>
                  <Card title="Most Executed Queries">
                    <Table
                      size="small"
                      dataSource={performanceStats.performanceMetrics.mostExecutedQueries}
                      columns={[
                        { title: 'Query', dataIndex: 'queryName', key: 'queryName' },
                        { title: 'Count', dataIndex: 'executionCount', key: 'count' },
                        { 
                          title: 'Avg Time (ms)', 
                          dataIndex: 'averageTime', 
                          key: 'avgTime',
                          render: (val: number) => val.toFixed(2)
                        }
                      ]}
                      pagination={false}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Slowest Queries">
                    <Table
                      size="small"
                      dataSource={performanceStats.performanceMetrics.slowestQueries}
                      columns={[
                        { title: 'Query', dataIndex: 'queryName', key: 'queryName' },
                        { 
                          title: 'Avg Time (ms)', 
                          dataIndex: 'averageTime', 
                          key: 'avgTime',
                          render: (val: number) => (
                            <span style={{ color: val > 500 ? 'red' : 'orange' }}>
                              {val.toFixed(2)}
                            </span>
                          )
                        },
                        { title: 'Count', dataIndex: 'executionCount', key: 'count' }
                      ]}
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Performance Recommendations */}
              {performanceStats.recommendations.length > 0 && (
                <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                  <Col span={24}>
                    <Alert
                      message="Performance Recommendations"
                      description={
                        <List
                          size="small"
                          dataSource={performanceStats.recommendations}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      }
                      type="info"
                      showIcon
                    />
                  </Col>
                </Row>
              )}

              {/* Performance Operations */}
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="Performance Operations">
                    <Space>
                      <Button 
                        type="primary"
                        icon={<ThunderboltOutlined />}
                        onClick={runBenchmark}
                        loading={benchmarkLoading}
                      >
                        Run Benchmark
                      </Button>
                      <Button 
                        onClick={clearStats}
                      >
                        Clear Statistics
                      </Button>
                      <Button 
                        onClick={loadPerformanceStats}
                      >
                        Refresh
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}