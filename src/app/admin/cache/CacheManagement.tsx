'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Typography,
  Progress,
  Tag,
  Alert,
  message,
  Modal,
  Table,
  Tooltip,
  Badge,
  Select,
  Input
} from 'antd'
import {
  ThunderboltOutlined,
  ClearOutlined,
  ReloadOutlined,
  FireOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

interface CacheStats {
  stats: {
    hits: number
    misses: number
    sets: number
    deletes: number
    hitRate: number
    hitRatePercentage: string
    size: number
  }
  tags: string[]
  configuration: {
    provider: string
    cleanupInterval: string
    defaultTTL: string
  }
  lastUpdated: string
}

export default function CacheManagement() {
  const { checkSpecificPermission, user } = useAuth()
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [operationLoading, setOperationLoading] = useState<string | null>(null)

  // Permission checks
  const canManageCache = checkSpecificPermission('system:maintenance').granted || user?.role === 'SUPER_ADMIN'

  useEffect(() => {
    if (canManageCache) {
      loadCacheStats()
      // 自动刷新缓存统计
      const interval = setInterval(loadCacheStats, 30000) // 每30秒刷新
      return () => clearInterval(interval)
    }
    return undefined
  }, [canManageCache])

  const loadCacheStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cache')
      if (response.ok) {
        const data = await response.json()
        setCacheStats(data.data)
      } else {
        message.error('Failed to load cache statistics')
      }
    } catch (error) {
      message.error('Failed to load cache statistics')
    } finally {
      setLoading(false)
    }
  }

  const performCacheOperation = async (action: string, options: any = {}) => {
    setOperationLoading(action)
    try {
      const response = await fetch('/api/admin/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...options })
      })

      if (response.ok) {
        const result = await response.json()
        message.success(result.data.message)
        await loadCacheStats() // Refresh stats
      } else {
        const error = await response.json()
        message.error(error.error || 'Operation failed')
      }
    } catch (error) {
      message.error('Operation failed')
    } finally {
      setOperationLoading(null)
    }
  }

  const confirmClearAll = () => {
    Modal.confirm({
      title: 'Clear All Cache',
      content: 'Are you sure you want to clear all cached data? This action cannot be undone.',
      okText: 'Clear All',
      okType: 'danger',
      onOk: () => performCacheOperation('clear-all')
    })
  }

  const confirmClearByTags = (tags: string[]) => {
    Modal.confirm({
      title: 'Clear Cache by Tags',
      content: `Are you sure you want to clear cache for: ${tags.join(', ')}?`,
      okText: 'Clear',
      okType: 'danger',
      onOk: () => performCacheOperation('clear-by-tags', { tags })
    })
  }

  const getHealthStatus = (hitRate: number) => {
    if (hitRate >= 0.8) return { status: 'success', text: 'Excellent' }
    if (hitRate >= 0.6) return { status: 'processing', text: 'Good' }
    if (hitRate >= 0.4) return { status: 'warning', text: 'Fair' }
    return { status: 'error', text: 'Poor' }
  }

  const cacheOperations = [
    {
      key: 'warmup',
      title: 'Warmup Cache',
      description: 'Preload frequently accessed data',
      icon: <FireOutlined />,
      color: 'blue',
      action: () => performCacheOperation('warmup')
    },
    {
      key: 'invalidate-users',
      title: 'Clear User Cache',
      description: 'Clear all user-related cached data',
      icon: <ClearOutlined />,
      color: 'orange',
      action: () => confirmClearByTags(['users'])
    },
    {
      key: 'invalidate-content',
      title: 'Clear Content Cache',
      description: 'Clear all content-related cached data',
      icon: <ClearOutlined />,
      color: 'purple',
      action: () => confirmClearByTags(['content'])
    },
    {
      key: 'invalidate-permissions',
      title: 'Clear Permission Cache',
      description: 'Clear all permission-related cached data',
      icon: <ClearOutlined />,
      color: 'red',
      action: () => confirmClearByTags(['permissions'])
    }
  ]

  if (!canManageCache) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Access Denied</Title>
        <Paragraph>You don&apos;t have permission to access cache management.</Paragraph>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        <ThunderboltOutlined /> Cache Management
      </Title>

      {cacheStats && (
        <>
          {/* Cache Overview */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Hit Rate"
                  value={cacheStats.stats.hitRatePercentage}
                  suffix="%"
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ 
                    color: getHealthStatus(cacheStats.stats.hitRate).status === 'success' ? '#52c41a' : 
                           getHealthStatus(cacheStats.stats.hitRate).status === 'warning' ? '#faad14' : '#ff4d4f' 
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <Badge 
                    status={getHealthStatus(cacheStats.stats.hitRate).status as any} 
                    text={getHealthStatus(cacheStats.stats.hitRate).text} 
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Cache Size"
                  value={cacheStats.stats.size}
                  suffix="items"
                  prefix={<InfoCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Hits"
                  value={cacheStats.stats.hits}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Misses"
                  value={cacheStats.stats.misses}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Performance Metrics */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col xs={24} lg={12}>
              <Card title="Cache Performance">
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Hit Rate</Text>
                  <Progress 
                    percent={Number(cacheStats.stats.hitRatePercentage)} 
                    status={getHealthStatus(cacheStats.stats.hitRate).status as any}
                    strokeColor={
                      cacheStats.stats.hitRate >= 0.8 ? '#52c41a' :
                      cacheStats.stats.hitRate >= 0.6 ? '#1890ff' :
                      cacheStats.stats.hitRate >= 0.4 ? '#faad14' : '#ff4d4f'
                    }
                  />
                </div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Sets" value={cacheStats.stats.sets} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Deletes" value={cacheStats.stats.deletes} />
                  </Col>
                </Row>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="Configuration">
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Provider: </Text>
                  <Tag color="blue">{cacheStats.configuration.provider}</Tag>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Cleanup Interval: </Text>
                  <Tag>{cacheStats.configuration.cleanupInterval}</Tag>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Default TTL: </Text>
                  <Tag>{cacheStats.configuration.defaultTTL}</Tag>
                </div>
                <div>
                  <Text strong>Last Updated: </Text>
                  <Text type="secondary">{new Date(cacheStats.lastUpdated).toLocaleString()}</Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Cache Tags */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card title="Available Cache Tags">
                <Space wrap>
                  {cacheStats.tags.map(tag => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Cache Operations */}
          <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <Card title="Cache Operations">
                <Row gutter={[16, 16]}>
                  {cacheOperations.map(op => (
                    <Col xs={24} sm={12} lg={6} key={op.key}>
                      <Card 
                        size="small"
                        actions={[
                          <Button 
                            key="action"
                            type="primary" 
                            size="small"
                            icon={op.icon}
                            loading={operationLoading === op.key}
                            onClick={op.action}
                            style={{ backgroundColor: `var(--ant-color-${op.color})` }}
                          >
                            Execute
                          </Button>
                        ]}
                      >
                        <Card.Meta
                          title={op.title}
                          description={op.description}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Recommendations */}
          {cacheStats.stats.hitRate < 0.6 && (
            <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Alert
                  message="Cache Performance Recommendations"
                  description={
                    <ul>
                      <li>Consider increasing cache TTL for frequently accessed data</li>
                      <li>Review cache invalidation strategies to reduce unnecessary cache clears</li>
                      <li>Monitor application patterns to identify cacheable operations</li>
                      {cacheStats.stats.hitRate < 0.4 && <li><strong>Critical:</strong> Cache hit rate is very low. Review caching implementation.</li>}
                    </ul>
                  }
                  type={cacheStats.stats.hitRate < 0.4 ? 'error' : 'warning'}
                  showIcon
                />
              </Col>
            </Row>
          )}

          {/* Manual Operations */}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Manual Cache Operations">
                <Space>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={loadCacheStats}
                    loading={loading}
                  >
                    Refresh Stats
                  </Button>
                  <Button 
                    icon={<FireOutlined />}
                    onClick={() => performCacheOperation('warmup')}
                    loading={operationLoading === 'warmup'}
                  >
                    Warmup Cache
                  </Button>
                  <Button 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={confirmClearAll}
                    loading={operationLoading === 'clear-all'}
                  >
                    Clear All Cache
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}