'use client'

import { useState } from 'react'
import { Form, Input, Select, Button, message, Card, Typography, Space } from 'antd'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import FileUploadButton from '@/components/admin/FileUploadButton'

// 动态导入富文本编辑器（避免SSR问题）
const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), { ssr: false })

const { Title } = Typography
const { TextArea } = Input

interface ContentForm {
  type: 'NEWS' | 'CASE_STUDY' | 'SERVICE' | 'PAGE'
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  imageUrl?: string
  tags: string[]
}

export default function NewContentClient() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const router = useRouter()

  const typeOptions = [
    { label: '新闻', value: 'NEWS' },
    { label: '案例研究', value: 'CASE_STUDY' },
    { label: '服务', value: 'SERVICE' },
    { label: '页面', value: 'PAGE' }
  ]

  const statusOptions = [
    { label: '草稿', value: 'DRAFT' },
    { label: '已发布', value: 'PUBLISHED' },
    { label: '已归档', value: 'ARCHIVED' }
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          content,
          tags: values.tags || []
        }),
      })

      if (response.ok) {
        message.success('内容创建成功')
        router.push('/admin/content')
      } else {
        const error = await response.json()
        message.error(error.error || '创建失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    // 简单的slug生成逻辑
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = generateSlug(title)
    form.setFieldsValue({ slug })
  }

  // 保存功能
  const handleSave = () => {
    form.validateFields().then(values => {
      handleSubmit({
        ...values,
        content,
        tags: values.tags || []
      })
    }).catch(errorInfo => {
      message.error('请检查表单信息')
    })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Title level={2}>新建内容</Title>
        <Space>
          <FileUploadButton 
            onUploadSuccess={(url, file) => {
              message.success(`文件 ${file.filename} 上传成功`)
            }}
            accept="image/*"
            buttonText="上传图片"
          />
        </Space>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'DRAFT',
            type: 'NEWS'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input 
                  placeholder="请输入内容标题"
                  onChange={handleTitleChange}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="type"
              label="内容类型"
              rules={[{ required: true, message: '请选择内容类型' }]}
            >
              <Select options={typeOptions} />
            </Form.Item>

            <Form.Item
              name="status"
              label="发布状态"
              rules={[{ required: true, message: '请选择发布状态' }]}
            >
              <Select options={statusOptions} />
            </Form.Item>

            <div className="lg:col-span-2">
              <Form.Item
                name="slug"
                label="URL路径"
                rules={[{ required: true, message: '请输入URL路径' }]}
              >
                <Input placeholder="url-path" />
              </Form.Item>
            </div>

            <div className="lg:col-span-2">
              <Form.Item
                name="excerpt"
                label="摘要"
              >
                <TextArea 
                  rows={3} 
                  placeholder="请输入内容摘要（可选）"
                />
              </Form.Item>
            </div>

            <div className="lg:col-span-2">
              <Form.Item
                name="imageUrl"
                label="封面图片URL"
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </div>

            <div className="lg:col-span-2">
              <Form.Item
                name="tags"
                label="标签"
              >
                <Select
                  mode="tags"
                  placeholder="输入标签并按回车"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <div className="lg:col-span-2">
              <Form.Item
                label="内容正文"
                required
              >
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="请输入内容正文..."
                  height={400}
                  onSave={handleSave}
                />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => router.back()}>
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={!content.trim()}
            >
              创建内容
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}