'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Tag, Space, Modal, message, Input, Typography, Image, Select } from 'antd'
import { 
  DeleteIcon, 
  EyeIcon,
  DownloadIcon,
  SearchIcon
} from '@/components/icons/LightweightIcons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { Search } = Input

interface FileRecord {
  id: string
  filename: string
  storedFilename: string
  url: string
  size: number
  mimeType: string
  type: 'IMAGE' | 'DOCUMENT'
  uploadedByUser: {
    id: string
    name: string
    email: string
  } | null
  createdAt: string
}

export default function FileManagementClient() {
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
    type: undefined as string | undefined,
    search: ''
  })

  const fetchFiles = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/admin/upload?${params}`)
      
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
  }, [pagination.pageSize, filters.type, filters.search])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDelete = (file: FileRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除文件 "${file.filename}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/upload/${file.id}`, {
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

  const getFileTypeTag = (type: string) => {
    if (type === 'IMAGE') {
      return <Tag color="green">图片</Tag>
    } else if (type === 'DOCUMENT') {
      return <Tag color="blue">文档</Tag>
    } else {
      return <Tag color="default">其他</Tag>
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
            alt={record.filename}
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
            {record.filename}
          </div>
          <div className="text-gray-500 text-sm">
            {record.storedFilename}
          </div>
          <div className="flex gap-2 mt-1">
            {getFileTypeTag(record.type)}
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
            icon={<EyeIcon />}
            onClick={() => {
              setPreviewFile(record)
              setPreviewVisible(true)
            }}
          >
            预览
          </Button>
          <Button
            type="link"
            icon={<DownloadIcon />}
            onClick={() => {
              const link = document.createElement('a')
              link.href = record.url
              link.download = record.filename
              link.click()
            }}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteIcon />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const typeOptions = [
    { label: '全部类型', value: undefined },
    { label: '图片', value: 'IMAGE' },
    { label: '文档', value: 'DOCUMENT' }
  ]

  return (
    <div>
      <div className="mb-6">
        <Title level={2}>文件管理</Title>
      </div>

      <div className="mb-4 flex gap-4">
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
            setPagination(prev => ({ ...prev, current: 1 }))
          }}
          enterButton={<SearchIcon />}
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
          <Button key="download" icon={<DownloadIcon />} onClick={() => {
            if (previewFile) {
              const link = document.createElement('a')
              link.href = previewFile.url
              link.download = previewFile.filename
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
              <p><strong>文件名:</strong> {previewFile.filename}</p>
              <p><strong>大小:</strong> {formatFileSize(previewFile.size)}</p>
              <p><strong>类型:</strong> {previewFile.mimeType}</p>
              <p><strong>上传时间:</strong> {new Date(previewFile.createdAt).toLocaleString('zh-CN')}</p>
            </div>
            
            {isImage(previewFile.mimeType) ? (
              <div className="text-center">
                <Image
                  src={previewFile.url}
                  alt={previewFile.filename}
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