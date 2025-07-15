'use client'

import React from 'react'
import { Card, Row, Col, Input, Select, Button, Space, Form } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

// 过滤器字段配置
export interface FilterFieldConfig {
  key: string
  type: 'search' | 'select' | 'input'
  label: string
  placeholder?: string
  options?: { label: string; value: any }[]
  allowClear?: boolean
  style?: React.CSSProperties
  span?: number  // 栅格占用列数，默认6
}

// 过滤器组件属性
export interface AdminFiltersProps {
  fields: FilterFieldConfig[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  onReset?: () => void
  onSearch?: () => void
  loading?: boolean
  title?: string
  collapsed?: boolean
  showResetButton?: boolean
  showSearchButton?: boolean
}

export function AdminFilters({
  fields,
  values,
  onChange,
  onReset,
  onSearch,
  loading = false,
  title,
  collapsed = false,
  showResetButton = true,
  showSearchButton = false
}: AdminFiltersProps) {
  const [form] = Form.useForm()

  // 处理单个字段变化
  const handleFieldChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value }
    onChange(newValues)
  }

  // 重置所有过滤器
  const handleReset = () => {
    form.resetFields()
    const resetValues = fields.reduce((acc, field) => {
      acc[field.key] = undefined
      return acc
    }, {} as Record<string, any>)
    onChange(resetValues)
    onReset?.()
  }

  // 渲染不同类型的过滤器字段
  const renderField = (field: FilterFieldConfig) => {
    const { key, type, label, placeholder, options, allowClear = true, style } = field
    const value = values[key]

    switch (type) {
      case 'search':
        return (
          <Search
            placeholder={placeholder || `搜索${label}`}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            onSearch={onSearch}
            style={style}
            allowClear={allowClear}
            enterButton={<SearchOutlined />}
          />
        )

      case 'select':
        return (
          <Select
            placeholder={placeholder || `选择${label}`}
            value={value}
            onChange={(val) => handleFieldChange(key, val)}
            style={style}
            allowClear={allowClear}
          >
            {options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        )

      case 'input':
        return (
          <Input
            placeholder={placeholder || `输入${label}`}
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            style={style}
            allowClear={allowClear}
          />
        )

      default:
        return null
    }
  }

  if (collapsed) {
    return null
  }

  return (
    <Card 
      title={title} 
      size="small" 
      className="mb-4"
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {fields.map(field => (
            <Col 
              key={field.key} 
              span={field.span || 6}
              className="mb-4"
            >
              <Form.Item
                label={field.label}
                name={field.key}
                className="mb-0"
              >
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
          
          {/* 操作按钮 */}
          <Col span={24}>
            <Space className="mb-4">
              {showSearchButton && (
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                  loading={loading}
                >
                  搜索
                </Button>
              )}
              
              {showResetButton && (
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  重置
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

// 常用过滤器配置预设
export const FilterConfigs = {
  // 用户管理过滤器
  users: [
    {
      key: 'search',
      type: 'search' as const,
      label: '搜索',
      placeholder: '搜索用户名或邮箱',
      span: 8
    },
    {
      key: 'role',
      type: 'select' as const,
      label: '角色',
      placeholder: '选择角色',
      span: 4,
      options: [
        { label: '用户', value: 'USER' },
        { label: '管理员', value: 'ADMIN' },
        { label: '超级管理员', value: 'SUPER_ADMIN' }
      ]
    }
  ],

  // 内容管理过滤器
  contents: [
    {
      key: 'search',
      type: 'search' as const,
      label: '搜索',
      placeholder: '搜索标题或内容',
      span: 8
    },
    {
      key: 'type',
      type: 'select' as const,
      label: '类型',
      span: 4,
      options: [
        { label: '新闻', value: 'NEWS' },
        { label: '案例研究', value: 'CASE_STUDY' },
        { label: '服务', value: 'SERVICE' },
        { label: '页面', value: 'PAGE' }
      ]
    },
    {
      key: 'status',
      type: 'select' as const,
      label: '状态',
      span: 4,
      options: [
        { label: '草稿', value: 'DRAFT' },
        { label: '已发布', value: 'PUBLISHED' },
        { label: '已归档', value: 'ARCHIVED' }
      ]
    }
  ],

  // 表单管理过滤器
  forms: [
    {
      key: 'type',
      type: 'select' as const,
      label: '表单类型',
      span: 4,
      options: [
        { label: '联系表单', value: 'CONTACT' },
        { label: '咨询表单', value: 'CONSULTATION' },
        { label: '邮件订阅', value: 'NEWSLETTER' }
      ]
    },
    {
      key: 'status',
      type: 'select' as const,
      label: '处理状态',
      span: 4,
      options: [
        { label: '新提交', value: 'NEW' },
        { label: '已处理', value: 'PROCESSED' },
        { label: '已回复', value: 'REPLIED' },
        { label: '已归档', value: 'ARCHIVED' }
      ]
    }
  ],

  // 文件管理过滤器
  files: [
    {
      key: 'search',
      type: 'search' as const,
      label: '搜索',
      placeholder: '搜索文件名',
      span: 8
    },
    {
      key: 'category',
      type: 'select' as const,
      label: '分类',
      span: 4,
      options: [
        { label: '图片', value: 'IMAGE' },
        { label: '文档', value: 'DOCUMENT' }
      ]
    },
    {
      key: 'type',
      type: 'select' as const,
      label: '文件类型',
      span: 4,
      options: [
        { label: 'avatar', value: 'avatar' },
        { label: 'content', value: 'content' },
        { label: 'document', value: 'document' }
      ]
    }
  ]
}