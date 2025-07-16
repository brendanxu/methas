'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Select, 
  Input, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  message,
  Drawer,
  Descriptions,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd'
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

interface FormSubmission {
  id: string
  type: string
  status: string
  summary: {
    name: string
    email: string
    company?: string
    subject: string
    phone?: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
  clientInfo?: {
    ip: string
    userAgent: string
    referer?: string
  }
}

interface FormSubmissionDetail extends FormSubmission {
  data: any
  analysis: {
    isSpam: boolean
    hasPhone: boolean
    hasCompany: boolean
    messageLength: number
    source: string
    country: string
  }
}

export default function FormSubmissionsPage() {
  const [loading, setLoading] = useState(false)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<any>({})
  
  // 过滤和分页状态
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '',
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  
  // 弹窗状态
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionDetail | null>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  
  // 表单实例
  const [editForm] = Form.useForm()

  // 加载数据
  const loadSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString())
      })
      
      const response = await fetch(`/api/admin/forms/submissions?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setSubmissions(result.data.submissions)
        setTotal(result.data.pagination.total)
        setStats(result.data.stats)
      } else {
        message.error(result.error || 'Failed to load submissions')
      }
    } catch (error) {
      message.error('Failed to load submissions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // 加载提交详情
  const loadSubmissionDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/forms/submissions/${id}`)
      const result = await response.json()
      
      if (result.success) {
        setSelectedSubmission(result.data)
        setDetailVisible(true)
      } else {
        message.error(result.error || 'Failed to load submission detail')
      }
    } catch (error) {
      message.error('Failed to load submission detail')
      console.error(error)
    }
  }

  // 更新提交状态
  const updateSubmission = async (values: any) => {
    if (!selectedSubmission) return
    
    try {
      const response = await fetch(`/api/admin/forms/submissions/${selectedSubmission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      
      const result = await response.json()
      
      if (result.success) {
        message.success('Submission updated successfully')
        setEditVisible(false)
        setDetailVisible(false)
        loadSubmissions()
      } else {
        message.error(result.error || 'Failed to update submission')
      }
    } catch (error) {
      message.error('Failed to update submission')
      console.error(error)
    }
  }

  // 删除提交
  const deleteSubmission = async (id: string) => {
    Modal.confirm({
      title: 'Delete Submission',
      content: 'Are you sure you want to delete this form submission? This action cannot be undone.',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/forms/submissions/${id}`, {
            method: 'DELETE'
          })
          
          const result = await response.json()
          
          if (result.success) {
            message.success('Submission deleted successfully')
            loadSubmissions()
          } else {
            message.error(result.error || 'Failed to delete submission')
          }
        } catch (error) {
          message.error('Failed to delete submission')
          console.error(error)
        }
      }
    })
  }

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  // 状态颜色映射
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'blue',
      PROCESSED: 'orange',
      REPLIED: 'green',
      ARCHIVED: 'default',
      EMAIL_FAILED: 'red'
    }
    return colors[status] || 'default'
  }

  // 类型映射
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CONTACT: 'Contact Form',
      CONSULTATION: 'Consultation',
      NEWSLETTER: 'Newsletter'
    }
    return labels[type] || type
  }

  // 表格列定义
  const columns: ColumnsType<FormSubmission> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color="blue">{getTypeLabel(type)}</Tag>
      ),
      filters: [
        { text: 'Contact Form', value: 'CONTACT' },
        { text: 'Consultation', value: 'CONSULTATION' },
        { text: 'Newsletter', value: 'NEWSLETTER' }
      ]
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: 'New', value: 'NEW' },
        { text: 'Processed', value: 'PROCESSED' },
        { text: 'Replied', value: 'REPLIED' },
        { text: 'Archived', value: 'ARCHIVED' },
        { text: 'Email Failed', value: 'EMAIL_FAILED' }
      ]
    },
    {
      title: 'Contact Info',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.summary.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <MailOutlined /> {record.summary.email}
          </div>
          {record.summary.phone && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <PhoneOutlined /> {record.summary.phone}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Company',
      dataIndex: ['summary', 'company'],
      key: 'company',
      width: 150,
      render: (company: string) => company || '-'
    },
    {
      title: 'Subject',
      dataIndex: ['summary', 'subject'],
      key: 'subject',
      ellipsis: true,
      render: (subject: string) => (
        <Tooltip title={subject}>
          {subject}
        </Tooltip>
      )
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>
          {dayjs(date).fromNow()}
        </Tooltip>
      ),
      sorter: true
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => loadSubmissionDetail(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit Status">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedSubmission(record as FormSubmissionDetail)
                editForm.setFieldsValue({
                  status: record.status,
                  notes: record.notes
                })
                setEditVisible(true)
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteSubmission(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Submissions"
              value={total}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New Submissions"
              value={stats.byStatus?.NEW || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Processed"
              value={stats.byStatus?.PROCESSED || 0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Replied"
              value={stats.byStatus?.REPLIED || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Form Submissions" extra={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadSubmissions()}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      }>
        {/* 过滤器 */}
        <Space style={{ marginBottom: '16px' }} wrap>
          <Input.Search
            placeholder="Search by name, email, company..."
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => setFilters(prev => ({ ...prev, search: value, page: 1 }))}
          />
          <Select
            placeholder="Filter by type"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters(prev => ({ ...prev, type: value || '', page: 1 }))}
          >
            <Option value="CONTACT">Contact Form</Option>
            <Option value="CONSULTATION">Consultation</Option>
            <Option value="NEWSLETTER">Newsletter</Option>
          </Select>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value || '', page: 1 }))}
          >
            <Option value="NEW">New</Option>
            <Option value="PROCESSED">Processed</Option>
            <Option value="REPLIED">Replied</Option>
            <Option value="ARCHIVED">Archived</Option>
            <Option value="EMAIL_FAILED">Email Failed</Option>
          </Select>
        </Space>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} submissions`,
            onChange: (page, pageSize) => 
              setFilters(prev => ({ ...prev, page, limit: pageSize || 20 }))
          }}
          onChange={(pagination, tableFilters, sorter: any) => {
            setFilters(prev => ({
              ...prev,
              sortBy: sorter.field || 'createdAt',
              sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
            }))
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="Submission Details"
        placement="right"
        size="large"
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                if (selectedSubmission) {
                  editForm.setFieldsValue({
                    status: selectedSubmission.status,
                    notes: selectedSubmission.notes
                  })
                  setEditVisible(true)
                }
              }}
            >
              Edit Status
            </Button>
          </Space>
        }
      >
        {selectedSubmission && (
          <div>
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="Type">
                <Tag color="blue">{getTypeLabel(selectedSubmission.type)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedSubmission.status)}>
                  {selectedSubmission.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted">
                {dayjs(selectedSubmission.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {dayjs(selectedSubmission.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Contact Details" bordered column={1} style={{ marginTop: '24px' }}>
              <Descriptions.Item label="Name">
                {selectedSubmission.summary.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedSubmission.summary.email}
              </Descriptions.Item>
              {selectedSubmission.summary.phone && (
                <Descriptions.Item label="Phone">
                  {selectedSubmission.summary.phone}
                </Descriptions.Item>
              )}
              {selectedSubmission.summary.company && (
                <Descriptions.Item label="Company">
                  {selectedSubmission.summary.company}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Subject">
                {selectedSubmission.summary.subject}
              </Descriptions.Item>
            </Descriptions>

            {selectedSubmission.data.message && (
              <Card title="Message" style={{ marginTop: '24px' }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedSubmission.data.message}
                </div>
              </Card>
            )}

            {selectedSubmission.analysis && (
              <Descriptions title="Analysis" bordered column={2} style={{ marginTop: '24px' }}>
                <Descriptions.Item label="Spam Check">
                  <Badge 
                    status={selectedSubmission.analysis.isSpam ? 'error' : 'success'}
                    text={selectedSubmission.analysis.isSpam ? 'Flagged as Spam' : 'Clean'}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Message Length">
                  {selectedSubmission.analysis.messageLength} characters
                </Descriptions.Item>
                <Descriptions.Item label="Source">
                  {selectedSubmission.analysis.source}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {selectedSubmission.analysis.country}
                </Descriptions.Item>
              </Descriptions>
            )}

            {selectedSubmission.clientInfo && (
              <Descriptions title="Technical Details" bordered column={1} style={{ marginTop: '24px' }}>
                <Descriptions.Item label="IP Address">
                  {selectedSubmission.clientInfo.ip}
                </Descriptions.Item>
                <Descriptions.Item label="User Agent">
                  <div style={{ wordBreak: 'break-all' }}>
                    {selectedSubmission.clientInfo.userAgent}
                  </div>
                </Descriptions.Item>
                {selectedSubmission.clientInfo.referer && (
                  <Descriptions.Item label="Referer">
                    <a href={selectedSubmission.clientInfo.referer} target="_blank" rel="noopener noreferrer">
                      {selectedSubmission.clientInfo.referer}
                    </a>
                  </Descriptions.Item>
                )}
              </Descriptions>
            )}

            {selectedSubmission.notes && (
              <Card title="Notes" style={{ marginTop: '24px' }}>
                {selectedSubmission.notes}
              </Card>
            )}
          </div>
        )}
      </Drawer>

      {/* 编辑状态弹窗 */}
      <Modal
        title="Update Submission Status"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={() => editForm.submit()}
        confirmLoading={loading}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={updateSubmission}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="NEW">New</Option>
              <Option value="PROCESSED">Processed</Option>
              <Option value="REPLIED">Replied</Option>
              <Option value="ARCHIVED">Archived</Option>
              <Option value="EMAIL_FAILED">Email Failed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea
              rows={4}
              placeholder="Add notes about this submission..."
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}