'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  message, 
  Modal, 
  Alert,
  Typography,
  Divider,
  Badge
} from 'antd'
import {
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  RedoOutlined,
  WarningOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

interface QueueStats {
  pending: number
  processing: number
  sent: number
  failed: number
  total: number
}

export default function EmailQueueManagement() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<QueueStats>({
    pending: 0,
    processing: 0,
    sent: 0,
    failed: 0,
    total: 0
  })

  // 加载队列统计
  const loadQueueStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/emails/queue')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data.stats)
      } else {
        message.error(result.error || 'Failed to load queue stats')
      }
    } catch (error) {
      message.error('Failed to load queue stats')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 执行队列操作
  const performQueueAction = async (action: string, confirmMessage?: string) => {
    const executeAction = async () => {
      try {
        const response = await fetch('/api/admin/emails/queue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        })
        
        const result = await response.json()
        
        if (result.success) {
          message.success(result.data.message)
          loadQueueStats() // 刷新统计
        } else {
          message.error(result.error || 'Action failed')
        }
      } catch (error) {
        message.error('Action failed')
        console.error(error)
      }
    }

    if (confirmMessage) {
      Modal.confirm({
        title: 'Confirm Action',
        content: confirmMessage,
        onOk: executeAction
      })
    } else {
      executeAction()
    }
  }

  useEffect(() => {
    loadQueueStats()
    // 自动刷新统计
    const interval = setInterval(loadQueueStats, 30000) // 30秒刷新一次
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'blue',
      processing: 'orange',
      sent: 'green',
      failed: 'red'
    }
    return colors[status] || 'default'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <ClockCircleOutlined />,
      processing: <ReloadOutlined spin />,
      sent: <CheckCircleOutlined />,
      failed: <ExclamationCircleOutlined />
    }
    return icons[status] || <MailOutlined />
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <MailOutlined /> Email Queue Management
        </Title>
        <Paragraph>
          Monitor and manage the email queue system. All outgoing emails are processed through this queue 
          to ensure reliable delivery with automatic retry mechanisms.
        </Paragraph>
      </div>

      {/* 队列统计 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={getStatusIcon('pending')}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary">Emails waiting to be sent</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Processing"
              value={stats.processing}
              prefix={getStatusIcon('processing')}
              valueStyle={{ color: '#fa8c16' }}
            />
            <Text type="secondary">Currently being sent</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sent"
              value={stats.sent}
              prefix={getStatusIcon('sent')}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary">Successfully delivered</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Failed"
              value={stats.failed}
              prefix={getStatusIcon('failed')}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary">Failed after all retries</Text>
          </Card>
        </Col>
      </Row>

      {/* 警告信息 */}
      {stats.failed > 0 && (
        <Alert
          message="Failed Emails Detected"
          description={`${stats.failed} emails have failed to send after all retry attempts. Consider investigating the issue or requeuing them.`}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px' }}
          action={
            <Button 
              size="small" 
              type="primary" 
              ghost
              onClick={() => performQueueAction('requeue_failed', 
                'Are you sure you want to requeue all failed emails? This will reset their retry count.'
              )}
            >
              Requeue Failed
            </Button>
          }
        />
      )}

      {/* 控制面板 */}
      <Card title="Queue Controls" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => loadQueueStats()}
            loading={loading}
          >
            Refresh Stats
          </Button>

          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => performQueueAction('process')}
          >
            Process Queue Now
          </Button>

          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => performQueueAction('start_processor')}
          >
            Start Auto Processor
          </Button>

          <Button
            icon={<PauseCircleOutlined />}
            onClick={() => performQueueAction('stop_processor')}
          >
            Stop Auto Processor
          </Button>

          <Divider type="vertical" />

          <Button
            icon={<RedoOutlined />}
            onClick={() => performQueueAction('requeue_failed',
              'Are you sure you want to requeue all failed emails? This will reset their retry count and attempt to send them again.'
            )}
            disabled={stats.failed === 0}
          >
            Requeue Failed ({stats.failed})
          </Button>

          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => performQueueAction('cleanup',
              'Are you sure you want to clean up old email records? This will permanently delete email logs older than 30 days.'
            )}
          >
            Cleanup Old Records
          </Button>
        </Space>
      </Card>

      {/* 队列状态概览 */}
      <Card title="Queue Overview">
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Queue Health">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Total Emails:</Text>
                  <Badge count={stats.total} showZero color="blue" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Success Rate:</Text>
                  <Text strong style={{ color: stats.total > 0 ? '#52c41a' : '#999' }}>
                    {stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0}%
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Failure Rate:</Text>
                  <Text strong style={{ color: stats.failed > 0 ? '#ff4d4f' : '#52c41a' }}>
                    {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}%
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="System Status">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Queue Status:</Text>
                  <Badge 
                    status={stats.processing > 0 ? 'processing' : 'default'} 
                    text={stats.processing > 0 ? 'Active' : 'Idle'} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Pending Work:</Text>
                  <Badge count={stats.pending} showZero color="orange" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Last Updated:</Text>
                  <Text type="secondary">{new Date().toLocaleTimeString()}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Alert
          message="Email Queue Information"
          description={
            <div>
              <p><strong>Automatic Processing:</strong> The email queue automatically processes pending emails every minute.</p>
              <p><strong>Retry Logic:</strong> Failed emails are automatically retried up to 3 times with exponential backoff (1min, 5min, 30min).</p>
              <p><strong>Priority Handling:</strong> High-priority emails (like contact form notifications) are processed immediately.</p>
              <p><strong>Monitoring:</strong> All email activity is logged for debugging and audit purposes.</p>
            </div>
          }
          type="info"
          showIcon
        />
      </Card>
    </div>
  )
}