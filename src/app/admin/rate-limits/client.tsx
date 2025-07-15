'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch, 
  message, 
  Tag, 
  Descriptions,
  Statistic,
  Row,
  Col,
  Alert,
  Tooltip,
  Badge
} from 'antd'
import { 
  ReloadOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SettingOutlined,
  DashboardOutlined
} from '@ant-design/icons'

const { Option } = Select

// 限流策略选项
const STRATEGY_OPTIONS = [
  { value: 'fixed_window', label: '固定窗口' },
  { value: 'sliding_window', label: '滑动窗口' },
  { value: 'token_bucket', label: '令牌桶' },
  { value: 'leaky_bucket', label: '漏桶' }
]

// 限流层级选项
const TIER_OPTIONS = [
  { value: 'global', label: '全局' },
  { value: 'ip', label: 'IP地址' },
  { value: 'user', label: '用户' },
  { value: 'api_key', label: 'API密钥' },
  { value: 'endpoint', label: '端点' }
]

// 策略颜色映射
const STRATEGY_COLORS = {
  'fixed_window': 'blue',
  'sliding_window': 'green',
  'token_bucket': 'orange',
  'leaky_bucket': 'purple'
}

// 层级颜色映射
const TIER_COLORS = {
  'global': 'red',
  'ip': 'blue',
  'user': 'green',
  'api_key': 'orange',
  'endpoint': 'purple'
}

export default function RateLimitsPageClient() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [editingConfig, setEditingConfig] = useState<any>(null)
  const [selectedConfig, setSelectedConfig] = useState<any>(null)
  const [form] = Form.useForm()

  // 加载数据
  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/rate-limits')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      } else {
        message.error('加载限流配置失败')
      }
    } catch (error) {
      message.error('加载限流配置失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 查看状态
  const viewStatus = async (config: any) => {
    try {
      const response = await fetch(`/api/admin/rate-limits/status?configKey=${config.key}`)
      if (response.ok) {
        const result = await response.json()
        setSelectedConfig({
          ...config,
          statusData: result.data
        })
        setStatusModalVisible(true)
      } else {
        message.error('获取状态失败')
      }
    } catch (error) {
      message.error('获取状态失败')
    }
  }

  // 重置限流
  const resetRateLimit = async (configKey: string) => {
    try {
      const response = await fetch(`/api/admin/rate-limits/status?configKey=${configKey}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        message.success('限流已重置')
        loadData()
      } else {
        message.error('重置失败')
      }
    } catch (error) {
      message.error('重置失败')
    }
  }

  // 保存配置
  const handleSave = async (values: any) => {
    try {
      const response = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('配置保存成功')
        setModalVisible(false)
        setEditingConfig(null)
        form.resetFields()
        loadData()
      } else {
        const error = await response.json()
        message.error(error.error || '保存失败')
      }
    } catch (error) {
      message.error('保存失败')
    }
  }

  // 删除配置
  const handleDelete = async (configKey: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个限流配置吗？此操作不可撤销。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/rate-limits?key=${configKey}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            message.success('配置已删除')
            loadData()
          } else {
            message.error('删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  // 编辑配置
  const handleEdit = (config: any) => {
    setEditingConfig(config)
    form.setFieldsValue(config)
    setModalVisible(true)
  }

  // 新增配置
  const handleAdd = () => {
    setEditingConfig(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 表格列定义
  const columns = [
    {
      title: '配置键',
      dataIndex: 'key',
      key: 'key',
      width: 200,
      render: (text: string) => <code>{text}</code>
    },
    {
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
      width: 120,
      render: (strategy: string) => (
        <Tag color={(STRATEGY_COLORS as any)[strategy] || 'default'}>
          {STRATEGY_OPTIONS.find(s => s.value === strategy)?.label || strategy}
        </Tag>
      )
    },
    {
      title: '层级',
      dataIndex: 'tier',
      key: 'tier',
      width: 100,
      render: (tier: string) => (
        <Tag color={(TIER_COLORS as any)[tier] || 'default'}>
          {TIER_OPTIONS.find(t => t.value === tier)?.label || tier}
        </Tag>
      )
    },
    {
      title: '限制',
      dataIndex: 'limit',
      key: 'limit',
      width: 80,
      render: (limit: number) => <strong>{limit}</strong>
    },
    {
      title: '窗口(秒)',
      dataIndex: 'window',
      key: 'window',
      width: 100,
      render: (window: number) => {
        if (window >= 3600) {
          return `${window / 3600}h`
        } else if (window >= 60) {
          return `${window / 60}m`
        }
        return `${window}s`
      }
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean) => (
        <Badge 
          status={enabled ? 'success' : 'default'} 
          text={enabled ? '启用' : '禁用'} 
        />
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          {text || '-'}
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看状态">
            <Button 
              type="text" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewStatus(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="重置">
            <Button 
              type="text" 
              size="small" 
              icon={<ReloadOutlined />}
              onClick={() => resetRateLimit(record.key)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <SettingOutlined className="mr-2" />
            限流管理
          </h1>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
              刷新
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增配置
            </Button>
          </Space>
        </div>

        {/* 统计信息 */}
        {data?.stats && (
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card>
                <Statistic
                  title="总配置数"
                  value={data.stats.totalConfigs}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="启用配置"
                  value={data.stats.enabledConfigs}
                  prefix={<SettingOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="缓存大小"
                  value={data.stats.cacheSize}
                  prefix={<DashboardOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div>
                  <div className="text-gray-500 text-sm mb-1">策略类型</div>
                  <div>
                    {data.stats.strategies?.map((strategy: string) => (
                      <Tag 
                        key={strategy} 
                        color={STRATEGY_COLORS[strategy as keyof typeof STRATEGY_COLORS]}
                      >
                        {STRATEGY_OPTIONS.find(s => s.value === strategy)?.label}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        <Alert
          message="限流配置说明"
          description="通过不同的限流策略和层级组合，可以实现精细化的API访问控制。修改配置后会立即生效。"
          type="info"
          showIcon
          className="mb-4"
        />
      </div>

      {/* 配置表格 */}
      <Card>
        <Table
          dataSource={data?.configs || []}
          columns={columns}
          rowKey="key"
          loading={loading}
          pagination={{
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 配置编辑模态框 */}
      <Modal
        title={editingConfig ? '编辑限流配置' : '新增限流配置'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingConfig(null)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
          initialValues={{
            enabled: true,
            strategy: 'fixed_window',
            tier: 'ip'
          }}
        >
          <Form.Item
            name="key"
            label="配置键"
            rules={[{ required: true, message: '请输入配置键' }]}
          >
            <Input 
              placeholder="例如: api.user.login" 
              disabled={!!editingConfig}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="strategy"
                label="限流策略"
                rules={[{ required: true, message: '请选择限流策略' }]}
              >
                <Select placeholder="选择策略">
                  {STRATEGY_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tier"
                label="限流层级"
                rules={[{ required: true, message: '请选择限流层级' }]}
              >
                <Select placeholder="选择层级">
                  {TIER_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="limit"
                label="请求限制"
                rules={[{ required: true, message: '请输入请求限制' }]}
              >
                <InputNumber
                  min={1}
                  placeholder="例如: 100"
                  style={{ width: '100%' }}
                  addonAfter="次"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="window"
                label="时间窗口"
                rules={[{ required: true, message: '请输入时间窗口' }]}
              >
                <InputNumber
                  min={1}
                  placeholder="例如: 3600"
                  style={{ width: '100%' }}
                  addonAfter="秒"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const strategy = getFieldValue('strategy')
              return strategy === 'token_bucket' ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="burst"
                      label="突发限制"
                      rules={[{ required: true, message: '令牌桶策略需要突发限制' }]}
                    >
                      <InputNumber
                        min={1}
                        placeholder="例如: 20"
                        style={{ width: '100%' }}
                        addonAfter="次"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="refillRate"
                      label="补充速率"
                      rules={[{ required: true, message: '令牌桶策略需要补充速率' }]}
                    >
                      <InputNumber
                        min={0.1}
                        step={0.1}
                        placeholder="例如: 10"
                        style={{ width: '100%' }}
                        addonAfter="次/时"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null
            }}
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea
              rows={3}
              placeholder="配置说明..."
            />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="启用" 
              unCheckedChildren="禁用" 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 状态查看模态框 */}
      <Modal
        title="限流状态详情"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedConfig && (
          <div>
            <Descriptions title="配置信息" bordered size="small" column={2}>
              <Descriptions.Item label="配置键">
                <code>{selectedConfig.key}</code>
              </Descriptions.Item>
              <Descriptions.Item label="策略">
                <Tag color={(STRATEGY_COLORS as any)[selectedConfig.strategy] || 'default'}>
                  {STRATEGY_OPTIONS.find(s => s.value === selectedConfig.strategy)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="层级">
                <Tag color={(TIER_COLORS as any)[selectedConfig.tier] || 'default'}>
                  {TIER_OPTIONS.find(t => t.value === selectedConfig.tier)?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="限制">
                {selectedConfig.limit} 次 / {selectedConfig.window} 秒
              </Descriptions.Item>
            </Descriptions>

            {selectedConfig.statusData?.status && (
              <div className="mt-4">
                <h4>当前状态</h4>
                <Descriptions bordered size="small" column={2}>
                  {Object.entries(selectedConfig.statusData.status).map(([key, value]: [string, any]) => (
                    <Descriptions.Item key={key} label={key}>
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}