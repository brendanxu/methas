'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button, Table, Tag, Space, Modal, message, Select, Input, Typography } from 'antd'
import { PlusIcon, EditIcon, DeleteIcon, EyeIcon } from '@/components/icons/LightweightIcons'
import { useRouter } from 'next/navigation'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { Search } = Input

interface Content {
  id: string
  type: 'NEWS' | 'CASE_STUDY' | 'SERVICE' | 'PAGE'
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    email: string
  }
  tags?: string
}

export default function ContentManagementClient() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [filters, setFilters] = useState({
    type: undefined as string | undefined,
    status: undefined as string | undefined,
    search: ''
  })
  const router = useRouter()

  const fetchContents = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/admin/content?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setContents(data.contents)
        setPagination(prev => ({
          ...prev,
          current: page,
          total: data.pagination.total
        }))
      } else {
        message.error('获取内容列表失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize, filters.type, filters.status, filters.search])

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  const handleDelete = (id: string, title: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除内容"${title}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/content/${id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            message.success('删除成功')
            fetchContents(pagination.current)
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
    { label: '新闻', value: 'NEWS' },
    { label: '案例研究', value: 'CASE_STUDY' },
    { label: '服务', value: 'SERVICE' },
    { label: '页面', value: 'PAGE' }
  ]

  const statusOptions = [
    { label: '全部状态', value: undefined },
    { label: '草稿', value: 'DRAFT' },
    { label: '已发布', value: 'PUBLISHED' },
    { label: '已归档', value: 'ARCHIVED' }
  ]

  const getTypeTag = (type: string) => {
    const config = {
      NEWS: { color: 'blue', text: '新闻' },
      CASE_STUDY: { color: 'green', text: '案例研究' },
      SERVICE: { color: 'orange', text: '服务' },
      PAGE: { color: 'purple', text: '页面' }
    }
    const { color, text } = config[type as keyof typeof config] || { color: 'default', text: type }
    return <Tag color={color}>{text}</Tag>
  }

  const getStatusTag = (status: string) => {
    const config = {
      DRAFT: { color: 'default', text: '草稿' },
      PUBLISHED: { color: 'success', text: '已发布' },
      ARCHIVED: { color: 'warning', text: '已归档' }
    }
    const { color, text } = config[status as keyof typeof config] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }

  const columns: ColumnsType<Content> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
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
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (author) => author.name,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeIcon />}
            onClick={() => router.push(`/admin/content/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditIcon />}
            onClick={() => router.push(`/admin/content/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteIcon />}
            onClick={() => handleDelete(record.id, record.title)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>内容管理</Title>
        <Button
          type="primary"
          icon={<PlusIcon />}
          onClick={() => router.push('/admin/content/new')}
        >
          新建内容
        </Button>
      </div>

      <div className="mb-4 flex gap-4 flex-wrap">
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
        <Search
          placeholder="搜索标题..."
          style={{ width: 240 }}
          onSearch={(value) => {
            setFilters(prev => ({ ...prev, search: value }))
            setPagination(prev => ({ ...prev, current: 1 }))
          }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={contents}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({ ...prev, pageSize }))
            fetchContents(page)
          },
        }}
      />
    </div>
  )
}