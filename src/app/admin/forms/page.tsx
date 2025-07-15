'use client'

import { useEffect, useState } from 'react'
import { Table, Tag, Space, Button, Modal, message, Select, Typography, Card } from 'antd'
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography

interface FormSubmission {
  id: string
  type: 'CONTACT' | 'CONSULTATION' | 'NEWSLETTER'
  data: any
  status: 'NEW' | 'PROCESSED' | 'REPLIED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export default function FormManagement() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    status: undefined as string | undefined
  })

  const fetchSubmissions = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status })
      })

      const response = await fetch(`/api/forms?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
        setPagination(prev => ({
          ...prev,
          current: page,
          total: data.pagination.total
        }))
      } else {
        message.error('获取表单提交失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [filters.type, filters.status])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        message.success('状态更新成功')
        fetchSubmissions(pagination.current)
      } else {
        message.error('状态更新失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    }
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个表单提交吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/forms/${id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            message.success('删除成功')
            fetchSubmissions(pagination.current)
          } else {
            message.error('删除失败')
          }
        } catch (error) {
          message.error('网络错误，请稍后重试')
        }
      }
    })
  }

  const typeOptions = [
    { label: '全部类型', value: undefined },
    { label: '联系表单', value: 'CONTACT' },
    { label: '咨询表单', value: 'CONSULTATION' },
    { label: '订阅表单', value: 'NEWSLETTER' }
  ]

  const statusOptions = [
    { label: '全部状态', value: undefined },
    { label: '新提交', value: 'NEW' },
    { label: '已处理', value: 'PROCESSED' },
    { label: '已回复', value: 'REPLIED' },
    { label: '已归档', value: 'ARCHIVED' }
  ]

  const getTypeTag = (type: string) => {
    const config = {
      CONTACT: { color: 'blue', text: '联系表单' },
      CONSULTATION: { color: 'green', text: '咨询表单' },
      NEWSLETTER: { color: 'orange', text: '订阅表单' }
    }
    const { color, text } = config[type as keyof typeof config] || { color: 'default', text: type }
    return <Tag color={color}>{text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const config = {
      NEW: { color: 'red', text: '新提交' },
      PROCESSED: { color: 'blue', text: '已处理' },
      REPLIED: { color: 'green', text: '已回复' },
      ARCHIVED: { color: 'default', text: '已归档' }
    }
    const { color, text } = config[status as keyof typeof config] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }

  const renderFormData = (submission: FormSubmission) => {
    const { data, type } = submission
    
    switch (type) {
      case 'CONTACT':
        return (
          <div>
            <p><strong>姓名:</strong> {data.name}</p>
            <p><strong>邮箱:</strong> {data.email}</p>
            {data.company && <p><strong>公司:</strong> {data.company}</p>}
            {data.phone && <p><strong>电话:</strong> {data.phone}</p>}
            {data.subject && <p><strong>主题:</strong> {data.subject}</p>}
            <p><strong>消息:</strong></p>
            <div className="bg-gray-50 p-3 rounded mt-2">
              {data.message}
            </div>
          </div>
        )
      
      case 'CONSULTATION':
        return (
          <div>
            <p><strong>姓名:</strong> {data.name}</p>
            <p><strong>邮箱:</strong> {data.email}</p>
            <p><strong>公司:</strong> {data.company}</p>
            {data.industry && <p><strong>行业:</strong> {data.industry}</p>}
            {data.projectType && <p><strong>项目类型:</strong> {data.projectType}</p>}
            {data.budget && <p><strong>预算:</strong> {data.budget}</p>}
            {data.timeline && <p><strong>时间线:</strong> {data.timeline}</p>}
            <p><strong>项目描述:</strong></p>
            <div className="bg-gray-50 p-3 rounded mt-2">
              {data.description}
            </div>
          </div>
        )
      
      case 'NEWSLETTER':
        return (
          <div>
            <p><strong>邮箱:</strong> {data.email}</p>
            {data.preferences && (
              <p><strong>偏好:</strong> {data.preferences.join(', ')}</p>
            )}
          </div>
        )
      
      default:
        return <pre>{JSON.stringify(data, null, 2)}</pre>
    }
  }

  const columns: ColumnsType<FormSubmission> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => getTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '联系信息',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.data.name || record.data.email}</div>
          {record.data.company && (
            <div className="text-gray-500 text-sm">{record.data.company}</div>
          )}
        </div>
      ),
    },
    {
      title: '内容摘要',
      key: 'summary',
      ellipsis: true,
      render: (_, record) => {
        const { data, type } = record
        if (type === 'CONTACT') {
          return data.subject || data.message?.substring(0, 50) + '...'
        } else if (type === 'CONSULTATION') {
          return data.description?.substring(0, 50) + '...'
        } else if (type === 'NEWSLETTER') {
          return `订阅偏好: ${data.preferences?.join(', ') || '全部'}`
        }
        return '-'
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedSubmission(record)
              setDetailModalVisible(true)
            }}
          >
            查看
          </Button>
          <Select
            size="small"
            value={record.status}
            style={{ width: 80 }}
            onChange={(value) => handleStatusUpdate(record.id, value)}
          >
            <Select.Option value="NEW">新提交</Select.Option>
            <Select.Option value="PROCESSED">已处理</Select.Option>
            <Select.Option value="REPLIED">已回复</Select.Option>
            <Select.Option value="ARCHIVED">已归档</Select.Option>
          </Select>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>表单提交管理</Title>
      </div>

      <div className="mb-4 flex gap-4">
        <Select
          style={{ width: 120 }}
          placeholder="选择类型"
          value={filters.type}
          onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          options={typeOptions}
        />
        <Select
          style={{ width: 120 }}
          placeholder="选择状态"
          value={filters.status}
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
          options={statusOptions}
        />
      </div>

      <Table
        columns={columns}
        dataSource={submissions}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({ ...prev, pageSize }))
            fetchSubmissions(page)
          },
        }}
      />

      <Modal
        title="表单提交详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedSubmission && (
          <Card>
            <div className="mb-4">
              <Space>
                {getTypeTag(selectedSubmission.type)}
                {getStatusTag(selectedSubmission.status)}
              </Space>
            </div>
            <div className="mb-4">
              <p><strong>提交时间:</strong> {new Date(selectedSubmission.createdAt).toLocaleString('zh-CN')}</p>
              <p><strong>更新时间:</strong> {new Date(selectedSubmission.updatedAt).toLocaleString('zh-CN')}</p>
            </div>
            <div className="mb-4">
              <Title level={5}>表单内容:</Title>
              {renderFormData(selectedSubmission)}
            </div>
          </Card>
        )}
      </Modal>
    </div>
  )
}