'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { message } from 'antd'
import dayjs from 'dayjs'

// 基础组件 - 立即加载
import { Card, Button, Space, Alert } from 'antd'
import { ExportIcon, RefreshIcon } from '@/components/icons/LightweightIcons'

// 高级组件 - 懒加载
const Table = dynamic(() => import('antd').then(mod => ({ default: mod.Table })), {
  loading: () => <div className="h-32 animate-pulse bg-gray-100 rounded" />
})

// Modal和Form需要静态方法和hooks，直接导入
import { Modal, Form } from 'antd'

// 表单相关组件直接导入（因为需要hooks和子组件）
import { Select, DatePicker, InputNumber, Input, Switch, Tag } from 'antd'

// 复杂显示组件懒加载
const Descriptions = dynamic(() => import('antd').then(mod => ({ default: mod.Descriptions })))
const Statistic = dynamic(() => import('antd').then(mod => ({ default: mod.Statistic })))
const Row = dynamic(() => import('antd').then(mod => ({ default: mod.Row })))
const Col = dynamic(() => import('antd').then(mod => ({ default: mod.Col })))
const Tooltip = dynamic(() => import('antd').then(mod => ({ default: mod.Tooltip })))
const Badge = dynamic(() => import('antd').then(mod => ({ default: mod.Badge })))
const Progress = dynamic(() => import('antd').then(mod => ({ default: mod.Progress })))
const Divider = dynamic(() => import('antd').then(mod => ({ default: mod.Divider })))
const Checkbox = dynamic(() => import('antd').then(mod => ({ default: mod.Checkbox })))

// 使用轻量级图标替换
import { 
  DownloadIcon, 
  CalendarIcon, 
  DatabaseIcon, 
  SettingsIcon, 
  InfoIcon 
} from '@/components/icons/LightweightIcons'

// 子组件引用
const { Option } = Select
const { RangePicker } = DatePicker

// 数据源选项
const DATA_SOURCE_OPTIONS = [
  { value: 'users', label: '用户数据', icon: '👥' },
  { value: 'content', label: '内容数据', icon: '📝' },
  { value: 'form_submissions', label: '表单提交', icon: '📋' },
  { value: 'files', label: '文件数据', icon: '📁' },
  { value: 'audit_logs', label: '审计日志', icon: '📊' },
  { value: 'newsletter_subscriptions', label: '邮件订阅', icon: '📧' }
]

// 导出格式选项
const EXPORT_FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON', icon: '{}', description: 'JavaScript Object Notation' },
  { value: 'csv', label: 'CSV', icon: '📊', description: 'Comma-Separated Values' },
  { value: 'xlsx', label: 'Excel', icon: '📈', description: 'Microsoft Excel' },
  { value: 'xml', label: 'XML', icon: '<>', description: 'Extensible Markup Language' },
  { value: 'pdf', label: 'PDF', icon: '📄', description: 'Portable Document Format' }
]

// 排序字段选项
const SORT_FIELD_OPTIONS = [
  { value: 'createdAt', label: '创建时间' },
  { value: 'updatedAt', label: '更新时间' },
  { value: 'id', label: 'ID' },
  { value: 'name', label: '名称' },
  { value: 'email', label: '邮箱' },
  { value: 'title', label: '标题' }
]

// 状态颜色映射
const STATUS_COLORS = {
  'success': 'green',
  'processing': 'blue',
  'error': 'red',
  'pending': 'orange'
}

export default function ExportsPageClient() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [form] = Form.useForm()

  // 加载数据
  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/exports')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        message.error('加载导出数据失败')
      }
    } catch (error) {
      message.error('加载导出数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 创建导出
  const handleExport = async (values: any) => {
    setExporting(true)
    try {
      // 处理日期范围
      if (values.dateRange) {
        values.dateRange = {
          start: values.dateRange[0]?.toISOString(),
          end: values.dateRange[1]?.toISOString(),
          field: values.dateField || 'createdAt'
        }
      }

      // 处理字段选择
      if (values.selectedFields && Array.isArray(values.selectedFields) && values.selectedFields.length > 0) {
        values.fields = values.selectedFields
      }
      delete values.selectedFields
      delete values.dateField

      const response = await fetch('/api/admin/exports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        const result = await response.json()
        message.success('数据导出成功')
        setExportModalVisible(false)
        form.resetFields()
        loadData()
        
        // 显示导出结果
        Modal.success({
          title: '导出成功',
          content: (
            <div>
              <p>文件名: {result.data.result.filename}</p>
              <p>记录数: {result.data.result.recordCount}</p>
              <p>文件大小: {(result.data.result.size / 1024).toFixed(2)} KB</p>
              <Button 
                type="primary" 
                icon={<DownloadIcon />}
                onClick={() => window.open(result.data.result.downloadUrl, '_blank')}
                className="mt-2"
              >
                下载文件
              </Button>
            </div>
          )
        })
      } else {
        const error = await response.json()
        message.error(error.error || '导出失败')
      }
    } catch (error) {
      message.error('导出失败')
    } finally {
      setExporting(false)
    }
  }

  // 下载文件
  const handleDownload = (filename: string) => {
    window.open(`/api/admin/exports/download/${filename}`, '_blank')
  }

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      key: 'filename',
      width: 250,
      render: (_: any, record: any) => {
        const filename = record.details?.filename
        const format = record.details?.format
        const formatOption = EXPORT_FORMAT_OPTIONS.find(f => f.value === format)
        return (
          <div className="flex items-center">
            <span className="mr-2">{formatOption?.icon}</span>
            <code className="text-xs">{filename}</code>
          </div>
        )
      }
    },
    {
      title: '数据源',
      dataIndex: 'resource',
      key: 'resource',
      width: 120,
      render: (resource: string) => {
        const sourceOption = DATA_SOURCE_OPTIONS.find(s => s.value === resource)
        return (
          <Tag>
            <span className="mr-1">{sourceOption?.icon}</span>
            {sourceOption?.label || resource}
          </Tag>
        )
      }
    },
    {
      title: '格式',
      key: 'format',
      width: 100,
      render: (_: any, record: any) => {
        const format = record.details?.format
        const formatOption = EXPORT_FORMAT_OPTIONS.find(f => f.value === format)
        return (
          <Tag color="blue">
            <span className="mr-1">{formatOption?.icon}</span>
            {formatOption?.label}
          </Tag>
        )
      }
    },
    {
      title: '记录数',
      key: 'recordCount',
      width: 100,
      render: (_: any, record: any) => (
        <strong>{record.details?.recordCount?.toLocaleString() || '-'}</strong>
      )
    },
    {
      title: '文件大小',
      key: 'fileSize',
      width: 100,
      render: (_: any, record: any) => {
        const size = record.details?.fileSize
        if (!size) return '-'
        return size > 1024 * 1024 
          ? `${(size / 1024 / 1024).toFixed(2)} MB`
          : `${(size / 1024).toFixed(2)} KB`
      }
    },
    {
      title: '导出人',
      key: 'user',
      width: 120,
      render: (_: any, record: any) => (
        <div>
          <div className="text-sm font-medium">{record.user?.name}</div>
          <div className="text-xs text-gray-500">{record.user?.email}</div>
        </div>
      )
    },
    {
      title: '导出时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => (
        <div>
          <div className="text-sm">{dayjs(date).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">{dayjs(date).format('HH:mm:ss')}</div>
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: any) => {
        // 检查是否过期（24小时）
        const isExpired = dayjs().diff(dayjs(record.createdAt), 'hours') > 24
        return (
          <Badge 
            status={isExpired ? 'default' : 'success'} 
            text={isExpired ? '已过期' : '有效'} 
          />
        )
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => {
        const filename = record.details?.filename
        const isExpired = dayjs().diff(dayjs(record.createdAt), 'hours') > 24
        
        return (
          <Space size="small">
            <Tooltip title={isExpired ? '文件已过期' : '下载文件'}>
              <Button 
                type="text" 
                size="small" 
                icon={<DownloadIcon />}
                disabled={isExpired || !filename}
                onClick={() => handleDownload(filename)}
              />
            </Tooltip>
          </Space>
        )
      }
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <ExportIcon className="mr-2" />
            数据导出
          </h1>
          <Space>
            <Button icon={<RefreshIcon />} onClick={loadData} loading={loading}>
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<ExportIcon />} 
              onClick={() => setExportModalVisible(true)}
            >
              新建导出
            </Button>
          </Space>
        </div>

        {/* 统计信息 */}
        {data?.stats && (
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card>
                <Statistic
                  title="总导出数"
                  value={data.stats.totalExports}
                  prefix={<DatabaseIcon />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div>
                  <div className="text-gray-500 text-sm mb-1">数据源统计</div>
                  <div>
                    {data.stats.sourceStats?.map((stat: any) => {
                      const sourceOption = DATA_SOURCE_OPTIONS.find(s => s.value === stat.source)
                      return (
                        <Tag key={stat.source} className="mb-1">
                          <span className="mr-1">{sourceOption?.icon}</span>
                          {sourceOption?.label}: {stat.count}
                        </Tag>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div>
                  <div className="text-gray-500 text-sm mb-1">格式统计</div>
                  <div>
                    {data.stats.formatStats?.map((stat: any) => {
                      const formatOption = EXPORT_FORMAT_OPTIONS.find(f => f.value === stat.format)
                      return (
                        <Tag key={stat.format} color="blue" className="mb-1">
                          <span className="mr-1">{formatOption?.icon}</span>
                          {formatOption?.label}: {stat.count}
                        </Tag>
                      )
                    })}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="最近30天"
                  value={data.stats.sourceStats?.reduce((sum: number, stat: any) => sum + stat.count, 0) || 0}
                  prefix={<CalendarIcon />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <Alert
          message="数据导出说明"
          description="导出的文件将在 24 小时后自动过期。请及时下载所需文件。对于敏感信息，系统会自动进行脱敏处理。"
          type="info"
          showIcon
          className="mb-4"
        />
      </div>

      {/* 导出历史表格 */}
      <Card title="导出历史">
        <Table
          dataSource={data?.exports || []}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...data?.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 导出配置模态框 */}
      <Modal
        title="创建数据导出"
        open={exportModalVisible}
        onCancel={() => {
          setExportModalVisible(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={800}
        confirmLoading={exporting}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleExport}
          layout="vertical"
          initialValues={{
            format: 'json',
            limit: 10000,
            sortOrder: 'desc',
            includeRelations: false,
            compression: false
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="source"
                label="数据源"
                rules={[{ required: true, message: '请选择数据源' }]}
              >
                <Select placeholder="选择要导出的数据源">
                  {DATA_SOURCE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="format"
                label="导出格式"
                rules={[{ required: true, message: '请选择导出格式' }]}
              >
                <Select placeholder="选择文件格式">
                  {EXPORT_FORMAT_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">筛选条件</Divider>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="dateRange"
                label="日期范围"
              >
                <RangePicker 
                  showTime
                  placeholder={['开始日期', '结束日期']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateField"
                label="日期字段"
              >
                <Select placeholder="选择日期字段" allowClear>
                  <Option value="createdAt">创建时间</Option>
                  <Option value="updatedAt">更新时间</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="limit"
                label="记录限制"
              >
                <InputNumber
                  min={1}
                  max={100000}
                  style={{ width: '100%' }}
                  placeholder="最大记录数"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sortBy"
                label="排序字段"
              >
                <Select placeholder="选择排序字段" allowClear>
                  {SORT_FIELD_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sortOrder"
                label="排序方向"
              >
                <Select>
                  <Option value="desc">降序</Option>
                  <Option value="asc">升序</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="selectedFields"
            label="导出字段"
            tooltip="留空则导出所有字段"
          >
            <Select
              mode="multiple"
              placeholder="选择要导出的字段（可选）"
              allowClear
            >
              <Option value="id">ID</Option>
              <Option value="name">名称</Option>
              <Option value="email">邮箱</Option>
              <Option value="title">标题</Option>
              <Option value="content">内容</Option>
              <Option value="status">状态</Option>
              <Option value="createdAt">创建时间</Option>
              <Option value="updatedAt">更新时间</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">高级选项</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="includeRelations"
                valuePropName="checked"
              >
                <Checkbox>
                  包含关联数据
                  <Tooltip title="如用户数据包含相关内容和日志">
                    <InfoIcon className="ml-1" />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="compression"
                valuePropName="checked"
              >
                <Checkbox>
                  压缩文件
                  <Tooltip title="对大文件进行压缩以减少下载时间">
                    <InfoIcon className="ml-1" />
                  </Tooltip>
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="password"
                label="文件密码"
              >
                <Input.Password 
                  placeholder="可选，用于保护敏感数据"
                  autoComplete="new-password"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}