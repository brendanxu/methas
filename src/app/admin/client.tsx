'use client'

import { useEffect, useState } from 'react'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { Card, Row, Col, Statistic, Table, Typography, Space, Tag } from 'antd'
import { 
  FileTextOutlined, 
  FormOutlined, 
  UserOutlined,
  EyeOutlined
} from '@ant-design/icons'

const { Title } = Typography

interface DashboardStats {
  totalContent: number
  publishedContent: number
  totalSubmissions: number
  newSubmissions: number
  totalUsers: number
}

interface RecentActivity {
  id: string
  type: 'content' | 'form' | 'user'
  action: string
  details: string
  timestamp: string
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContent: 0,
    publishedContent: 0,
    totalSubmissions: 0,
    newSubmissions: 0,
    totalUsers: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from multiple endpoints
      const [contentRes, formsRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/forms'),
      ])

      if (contentRes.ok && formsRes.ok) {
        const contentData = await contentRes.json()
        const formsData = await formsRes.json()

        setStats({
          totalContent: contentData.pagination?.total || 0,
          publishedContent: contentData.contents?.filter((c: any) => c.status === 'PUBLISHED').length || 0,
          totalSubmissions: formsData.pagination?.total || 0,
          newSubmissions: formsData.submissions?.filter((s: any) => s.status === 'NEW').length || 0,
          totalUsers: 1, // Placeholder - would need users endpoint
        })
      }
    } catch (error) {
      logError('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = {
          content: { color: 'blue', icon: <FileTextOutlined /> },
          form: { color: 'green', icon: <FormOutlined /> },
          user: { color: 'purple', icon: <UserOutlined /> },
        }
        const { color, icon } = config[type as keyof typeof config] || { color: 'default', icon: null }
        return (
          <Tag color={color} icon={icon}>
            {type.toUpperCase()}
          </Tag>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ]

  return (
    <div>
      <Title level={2}>Dashboard Overview</Title>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Content"
              value={stats.totalContent}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Published Content"
              value={stats.publishedContent}
              prefix={<EyeOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Form Submissions"
              value={stats.totalSubmissions}
              prefix={<FormOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Submissions"
              value={stats.newSubmissions}
              prefix={<FormOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Activity" className="w-full">
        <Table
          columns={columns}
          dataSource={recentActivity}
          pagination={{ pageSize: 10 }}
          loading={loading}
          locale={{
            emptyText: 'No recent activity'
          }}
        />
      </Card>
    </div>
  )
}