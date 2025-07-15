'use client'

import { useEffect, useState } from 'react'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Button,
  Modal,
  message,
  Tooltip,
  Badge
} from 'antd'
import { 
  MailOutlined, 
  UserOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  PercentageOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

interface NewsletterStats {
  total: number
  confirmed: number
  pending: number
  unsubscribed: number
  conversionRate: string
}

interface NewsletterSubscription {
  id: string
  email: string
  firstName?: string
  status: 'NEW' | 'PROCESSED' | 'ARCHIVED'
  confirmedAt?: string
  createdAt: string
}

interface NewsletterData {
  statistics: NewsletterStats
  recentSubscriptions: NewsletterSubscription[]
}

export default function NewsletterManagement() {
  const [data, setData] = useState<NewsletterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<NewsletterSubscription | null>(null)

  const fetchNewsletterData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/newsletter')
      
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        message.error('获取Newsletter数据失败')
      }
    } catch (error) {
      logError('Newsletter data fetch error:', error)
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsletterData()
  }, [])

  const handleViewDetail = (subscription: NewsletterSubscription) => {
    setSelectedSubscription(subscription)
    setDetailVisible(true)
  }

  const getStatusTag = (status: string, confirmedAt?: string) => {
    if (status === 'ARCHIVED') {
      return <Tag color="red">已取消订阅</Tag>
    } else if (status === 'PROCESSED' && confirmedAt) {
      return <Tag color="green">已确认</Tag>
    } else if (status === 'NEW') {
      return <Tag color="orange">待确认</Tag>
    }
    return <Tag color="default">未知状态</Tag>
  }

  const columns: ColumnsType<NewsletterSubscription> = [
    {
      title: '邮箱地址',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <MailOutlined />
          <Text copyable>{email}</Text>
        </Space>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (name) => name ? (
        <Space>
          <UserOutlined />
          <Text>{name}</Text>
        </Space>
      ) : <Text type="secondary">未提供</Text>,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => getStatusTag(record.status, record.confirmedAt),
    },
    {
      title: '订阅时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '确认时间',
      dataIndex: 'confirmedAt',
      key: 'confirmedAt',
      render: (date) => date 
        ? new Date(date).toLocaleString('zh-CN')
        : <Text type="secondary">未确认</Text>,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            >
              详情
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="p-6">
        <Title level={2}>Newsletter管理</Title>
        <div className="flex justify-center items-center h-64">
          <Text>加载中...</Text>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Title level={2}>Newsletter管理</Title>
        <div className="flex justify-center items-center h-64">
          <Text type="secondary">暂无数据</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Newsletter管理</Title>
        <Text type="secondary">管理网站Newsletter订阅和分析统计</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总订阅数"
              value={data.statistics.total}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已确认订阅"
              value={data.statistics.confirmed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待确认"
              value={data.statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="确认率"
              value={parseFloat(data.statistics.conversionRate)}
              precision={1}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ 
                color: parseFloat(data.statistics.conversionRate) > 50 ? '#52c41a' : '#faad14' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 最近订阅表格 */}
      <Card 
        title={
          <Space>
            <Badge count={data.recentSubscriptions.length} showZero>
              <Title level={4} style={{ margin: 0 }}>最近订阅</Title>
            </Badge>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            onClick={fetchNewsletterData}
            loading={loading}
          >
            刷新数据
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data.recentSubscriptions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="订阅详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedSubscription && (
          <div className="space-y-4">
            <div>
              <Text strong>邮箱地址：</Text>
              <Text copyable>{selectedSubscription.email}</Text>
            </div>
            
            <div>
              <Text strong>姓名：</Text>
              <Text>{selectedSubscription.firstName || '未提供'}</Text>
            </div>
            
            <div>
              <Text strong>订阅状态：</Text>
              {getStatusTag(selectedSubscription.status, selectedSubscription.confirmedAt)}
            </div>
            
            <div>
              <Text strong>订阅时间：</Text>
              <Text>{new Date(selectedSubscription.createdAt).toLocaleString('zh-CN')}</Text>
            </div>
            
            {selectedSubscription.confirmedAt && (
              <div>
                <Text strong>确认时间：</Text>
                <Text>{new Date(selectedSubscription.confirmedAt).toLocaleString('zh-CN')}</Text>
              </div>
            )}
            
            <div>
              <Text strong>订阅ID：</Text>
              <Text code copyable>{selectedSubscription.id}</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}