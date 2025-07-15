'use client'

import { useState } from 'react'
import { Upload, Button, message, Image, Progress } from 'antd'
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'

interface FileUploadProps {
  value?: string
  onChange?: (url: string | null) => void
  category?: 'general' | 'avatar' | 'content'
  accept?: string
  maxSize?: number // MB
  showPreview?: boolean
  className?: string
}

export default function FileUpload({
  value,
  onChange,
  category = 'general',
  accept = 'image/*',
  maxSize = 5,
  showPreview = true,
  className
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category)
      
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const result = await response.json()
        onChange?.(result.file.url)
        message.success('文件上传成功')
      } else {
        const error = await response.json()
        message.error(error.error || '上传失败')
      }
    } catch (error) {
      logError('Upload error:', error)
      message.error('上传失败，请稍后重试')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemove = () => {
    onChange?.(null)
  }

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // 验证文件大小
      const isLtMaxSize = file.size / 1024 / 1024 < maxSize
      if (!isLtMaxSize) {
        message.error(`文件大小不能超过 ${maxSize}MB`)
        return false
      }

      handleUpload(file)
      return false // 阻止默认上传
    },
    showUploadList: false,
    accept,
  }

  const isImage = value && (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.gif') || value.includes('.webp'))

  return (
    <div className={className}>
      {!value ? (
        <Upload {...uploadProps}>
          <Button 
            icon={<UploadOutlined />} 
            loading={uploading}
            className="w-full"
          >
            {uploading ? '上传中...' : '选择文件'}
          </Button>
        </Upload>
      ) : (
        <div className="space-y-3">
          {showPreview && isImage ? (
            <div className="relative inline-block">
              <Image
                src={value}
                alt="Uploaded file"
                width={200}
                height={200}
                className="object-cover rounded-lg"
                fallback="/images/placeholder.png"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <EyeOutlined />
              <span className="flex-1 truncate">{value.split('/').pop()}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
                size="small"
              >
                重新上传
              </Button>
            </Upload>
            <Button 
              icon={<DeleteOutlined />} 
              onClick={handleRemove}
              size="small"
              danger
            >
              删除
            </Button>
          </div>
        </div>
      )}

      {uploading && progress > 0 && (
        <div className="mt-2">
          <Progress 
            percent={progress} 
            size="small" 
            status={progress === 100 ? 'success' : 'active'}
          />
        </div>
      )}
    </div>
  )
}