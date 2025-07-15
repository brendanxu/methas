'use client'

import { useEffect, useState } from 'react'
import { Table, Button, Tag, Space, Modal, message, Input, Typography, Image, Select } from 'antd'
import { 
  DeleteOutlined, 
  EyeOutlined,
  DownloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { Search } = Input

interface FileRecord {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  mimeType: string
  uploadedBy: string | null
  createdAt: string
}

export default function FileManagement() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    type: undefined as string | undefined,
    search: ''
  })

  const fetchFiles = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type })
      })

      const response = await fetch(`/api/upload?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files)
        setPagination(prev => ({
          ...prev,
          current: page,
          total: data.pagination.total
        }))
      } else {
        message.error('获取文件列表失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [filters.category, filters.type])

  const handleDelete = (file: FileRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文件 "${file.originalName}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/upload/${file.id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            message.success('删除成功')
            fetchFiles(pagination.current)
          } else {
            const error = await response.json()
            message.error(error.error || '删除失败')
          }
        } catch (error) {
          message.error('网络错误，请稍后重试')
        }
      }
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeTag = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Tag color="green">图片</Tag>
    } else if (mimeType.includes('pdf')) {
      return <Tag color="red">PDF</Tag>
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <Tag color="blue">文档</Tag>
    } else {
      return <Tag color="default">其他</Tag>
    }
  }

  const getCategoryTag = (url: string) => {
    if (url.includes('/avatar/')) {
      return <Tag color="purple">头像</Tag>
    } else if (url.includes('/content/')) {
      return <Tag color="orange">内容</Tag>
    } else {
      return <Tag color="default">通用</Tag>
    }
  }

  const isImage = (mimeType: string) => mimeType.startsWith('image/')

  const columns: ColumnsType<FileRecord> = [
    {
      title: '预览',
      key: 'preview',
      width: 80,
      render: (_, record) => (
        isImage(record.mimeType) ? (
          <Image
            src={record.url}
            alt={record.originalName}
            width={60}
            height={60}
            className="object-cover rounded"
            fallback="/images/placeholder.png"
          />
        ) : (
          <div className="w-[60px] h-[60px] bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">
              {record.mimeType.split('/')[1]?.toUpperCase()}
            </span>
          </div>
        )
      ),
    },
    {
      title: '文件信息',
      key: 'fileInfo',
      render: (_, record) => (
        <div>
          <div className="font-medium truncate max-w-[200px]">
            {record.originalName}
          </div>
          <div className="text-gray-500 text-sm">
            {record.filename}
          </div>
          <div className="flex gap-2 mt-1">
            {getFileTypeTag(record.mimeType)}
            {getCategoryTag(record.url)}
          </div>
        </div>
      ),
    },
    {
      title: '文件大小',
      key: 'size',
      width: 100,
      render: (_, record) => formatFileSize(record.size),
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setPreviewFile(record)
              setPreviewVisible(true)
            }}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => {
              const link = document.createElement('a')
              link.href = record.url
              link.download = record.originalName
              link.click()
            }}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const categoryOptions = [
    { label: '全部分类', value: undefined },
    { label: '头像', value: 'avatar' },
    { label: '内容', value: 'content' },
    { label: '通用', value: 'general' }
  ]

  const typeOptions = [
    { label: '全部类型', value: undefined },
    { label: '图片', value: 'image' },
    { label: '文档', value: 'application' }
  ]

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>文件管理</Title>
      </div>

      <div className="mb-4 flex gap-4">
        <Select
          style={{ width: 120 }}
          placeholder="选择分类"
          value={filters.category}
          onChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          options={categoryOptions}
        />
        <Select
          style={{ width: 120 }}
          placeholder="选择类型"
          value={filters.type}
          onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          options={typeOptions}
        />
        <Search
          placeholder="搜索文件名..."
          style={{ width: 300 }}
          onSearch={(value) => {
            setFilters(prev => ({ ...prev, search: value }))
            // 搜索功能需要在API中实现
          }}
          enterButton={<SearchOutlined />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={files}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({ ...prev, pageSize }))
            fetchFiles(page)
          },
        }}
      />

      {/* 文件预览弹窗 */}
      <Modal
        title="文件预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => {
            if (previewFile) {
              const link = document.createElement('a')
              link.href = previewFile.url
              link.download = previewFile.originalName
              link.click()
            }
          }}>
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {previewFile && (
          <div>
            <div className="mb-4">
              <p><strong>文件名:</strong> {previewFile.originalName}</p>
              <p><strong>大小:</strong> {formatFileSize(previewFile.size)}</p>
              <p><strong>类型:</strong> {previewFile.mimeType}</p>
              <p><strong>上传时间:</strong> {new Date(previewFile.createdAt).toLocaleString('zh-CN')}</p>
            </div>
            
            {isImage(previewFile.mimeType) ? (
              <div className="text-center">
                <Image
                  src={previewFile.url}
                  alt={previewFile.originalName}
                  className="max-w-full"
                  fallback="/images/placeholder.png"
                />
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded">
                <p className="text-gray-500">
                  此文件类型不支持预览，请下载查看
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}