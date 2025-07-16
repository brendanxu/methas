'use client'

import React, { useState } from 'react'
import { Button, Upload, message, Modal, Typography } from 'antd'
import Image from 'next/image'
import { UploadIcon } from '@/components/icons/LightweightIcons'
import type { UploadProps } from 'antd/es/upload'

const { Text } = Typography

interface FileUploadButtonProps {
  onUploadSuccess?: (url: string, file: any) => void
  accept?: string
  maxSize?: number // in MB
  buttonText?: string
  disabled?: boolean
}

export default function FileUploadButton({
  onUploadSuccess,
  accept = 'image/*',
  maxSize = 10,
  buttonText = '上传文件',
  disabled = false
}: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const customUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options
    setUploading(true)

    try {
      // File size validation
      if (file instanceof File && file.size > maxSize * 1024 * 1024) {
        throw new Error(`文件大小不能超过 ${maxSize}MB`)
      }

      const formData = new FormData()
      formData.append('file', file as File)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '上传失败')
      }

      const result = await response.json()
      
      message.success('文件上传成功')
      
      if (onUploadSuccess) {
        onUploadSuccess(result.url, result.file)
      }
      
      onSuccess?.(result)
    } catch (error: any) {
      message.error(error.message || '上传失败')
      onError?.(error)
    } finally {
      setUploading(false)
    }
  }

  const beforeUpload = (file: File) => {
    // File type validation
    if (accept !== '*' && !file.type.match(accept.replace(/\*/g, '.*'))) {
      message.error('文件类型不符合要求')
      return false
    }

    // File size validation
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小不能超过 ${maxSize}MB`)
      return false
    }

    return true
  }

  return (
    <>
      <Upload
        customRequest={customUpload}
        beforeUpload={beforeUpload}
        showUploadList={false}
        accept={accept}
        disabled={disabled || uploading}
      >
        <Button
          icon={<UploadIcon />}
          loading={uploading}
          disabled={disabled}
        >
          {uploading ? '上传中...' : buttonText}
        </Button>
      </Upload>

      <Modal
        title="文件预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
      >
        {previewUrl && (
          <Image 
            src={previewUrl} 
            alt="预览" 
            width={500} 
            height={300} 
            style={{ width: '100%', height: 'auto' }} 
          />
        )}
      </Modal>
    </>
  )
}