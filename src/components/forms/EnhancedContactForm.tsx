'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Form, Input, Select, Button, Card, Space, Row, Col } from 'antd'
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  BankOutlined,
  MessageOutlined,
  SendOutlined
} from '@ant-design/icons'
import { useFormFeedback } from '@/hooks/useFormFeedback'
import FormSuccessModal, { FormSuccessConfig } from './FormSuccessModal'
import FormProgressIndicator, { FormField } from './FormProgressIndicator'

const { TextArea } = Input
const { Option } = Select

// 表单数据接口
export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  industry?: string
  budget?: string
  timeline?: string
  subscribeNewsletter?: boolean
}

// 表单配置选项
export interface ContactFormOptions {
  showProgress?: boolean
  showSuccessModal?: boolean
  compactProgress?: boolean
  onSubmitSuccess?: (data: ContactFormData, submissionId?: string) => void
  onSubmitError?: (error: any) => void
}

interface EnhancedContactFormProps extends ContactFormOptions {
  className?: string
  title?: string
  description?: string
}

export default function EnhancedContactForm({
  className,
  title = "联系我们",
  description = "请填写以下信息，我们将在24小时内与您联系",
  showProgress = true,
  showSuccessModal = true,
  compactProgress = false,
  onSubmitSuccess,
  onSubmitError
}: EnhancedContactFormProps) {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState<Partial<ContactFormData>>({})
  const [submissionId, setSubmissionId] = useState<string>()
  const [showSuccess, setShowSuccess] = useState(false)

  // 使用表单反馈Hook
  const feedback = useFormFeedback({
    successMessageType: 'contact',
    showGlobalMessage: !showSuccessModal, // 如果显示模态框就不显示全局消息
    customErrorHandler: (error) => {
      // 自定义错误处理
      if (error?.status === 429) {
        return '提交过于频繁，请稍后再试'
      }
      if (error?.message?.includes('network')) {
        return '网络连接异常，请检查网络后重试'
      }
      return undefined
    }
  })

  // 行业选项
  const industryOptions = [
    { value: 'technology', label: '科技' },
    { value: 'finance', label: '金融' },
    { value: 'manufacturing', label: '制造业' },
    { value: 'energy', label: '能源' },
    { value: 'retail', label: '零售' },
    { value: 'healthcare', label: '医疗健康' },
    { value: 'construction', label: '建筑业' },
    { value: 'transportation', label: '交通运输' },
    { value: 'other', label: '其他' }
  ]

  // 预算选项
  const budgetOptions = [
    { value: 'under-10k', label: '10万以下' },
    { value: '10k-50k', label: '10-50万' },
    { value: '50k-100k', label: '50-100万' },
    { value: '100k-500k', label: '100-500万' },
    { value: 'over-500k', label: '500万以上' },
    { value: 'to-be-determined', label: '待定' }
  ]

  // 时间线选项
  const timelineOptions = [
    { value: 'urgent', label: '1个月内' },
    { value: 'short-term', label: '1-3个月' },
    { value: 'medium-term', label: '3-6个月' },
    { value: 'long-term', label: '6个月以上' },
    { value: 'planning', label: '仅咨询了解' }
  ]

  // 定义表单字段配置
  const formFields: FormField[] = [
    {
      name: 'name',
      label: '姓名',
      required: true,
      value: formData.name,
      isValid: formData.name ? formData.name.length >= 2 : undefined
    },
    {
      name: 'email',
      label: '邮箱',
      required: true,
      value: formData.email,
      isValid: formData.email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : undefined
    },
    {
      name: 'company',
      label: '公司名称',
      required: false,
      value: formData.company
    },
    {
      name: 'phone',
      label: '电话',
      required: false,
      value: formData.phone,
      isValid: formData.phone ? /^1[3-9]\d{9}$/.test(formData.phone) : undefined
    },
    {
      name: 'subject',
      label: '咨询主题',
      required: true,
      value: formData.subject,
      isValid: formData.subject ? formData.subject.length >= 5 : undefined
    },
    {
      name: 'message',
      label: '详细描述',
      required: true,
      value: formData.message,
      isValid: formData.message ? formData.message.length >= 20 : undefined
    },
    {
      name: 'industry',
      label: '行业',
      required: false,
      value: formData.industry
    },
    {
      name: 'budget',
      label: '预算范围',
      required: false,
      value: formData.budget
    },
    {
      name: 'timeline',
      label: '期望时间',
      required: false,
      value: formData.timeline
    }
  ]

  // 监听表单值变化
  const handleFormChange = useCallback(() => {
    const values = form.getFieldsValue()
    setFormData(values)
  }, [form])

  // 表单提交处理
  const handleSubmit = async (values: ContactFormData) => {
    feedback.setSubmitting(10) // 开始提交，设置初始进度

    try {
      // 模拟进度更新
      feedback.updateProgress(30)

      // 提交到API
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CONTACT',
          data: values
        })
      })

      feedback.updateProgress(70)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '提交失败')
      }

      const result = await response.json()
      feedback.updateProgress(100)

      // 设置提交ID
      setSubmissionId(result.submissionId || result.id)

      // 处理成功
      if (showSuccessModal) {
        feedback.setSuccess()
        setShowSuccess(true)
      } else {
        feedback.setSuccess('提交成功！我们将在24小时内与您联系')
      }

      // 重置表单
      form.resetFields()
      setFormData({})

      // 回调
      onSubmitSuccess?.(values, result.submissionId || result.id)

    } catch (error) {
      logError('Contact form submission error:', error)
      feedback.setError(error)
      onSubmitError?.(error)
    }
  }

  // 处理表单验证失败
  const handleValidationError = (errorInfo: any) => {
    feedback.setError('请检查表单信息是否填写正确')
  }

  // 成功模态框配置
  const successConfig: FormSuccessConfig = {
    type: 'contact',
    submissionId,
    userEmail: formData.email,
    showContactInfo: true,
    showShareOptions: true
  }

  return (
    <div className={className}>
      <Card
        title={title}
        className="max-w-4xl mx-auto"
        extra={
          showProgress && (
            <FormProgressIndicator
              fields={formFields}
              compact={compactProgress}
              showEstimatedTime={!compactProgress}
              showFieldDetails={!compactProgress}
            />
          )
        }
      >
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={handleValidationError}
          onValuesChange={handleFormChange}
          disabled={feedback.isLoading}
        >
          <Row gutter={[16, 0]}>
            {/* 基本信息 */}
            <Col span={24}>
              <h3 className="text-lg font-semibold mb-4">基本信息</h3>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[
                  { required: true, message: '请输入您的姓名' },
                  { min: 2, message: '姓名至少需要2个字符' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入您的姓名"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your@email.com"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="company"
                label="公司名称"
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="请输入公司名称"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号码"
                  size="large"
                />
              </Form.Item>
            </Col>

            {/* 咨询详情 */}
            <Col span={24}>
              <h3 className="text-lg font-semibold mb-4 mt-6">咨询详情</h3>
            </Col>

            <Col span={24}>
              <Form.Item
                name="subject"
                label="咨询主题"
                rules={[
                  { required: true, message: '请输入咨询主题' },
                  { min: 5, message: '主题至少需要5个字符' }
                ]}
              >
                <Input
                  placeholder="请简要描述您的咨询主题"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="message"
                label="详细描述"
                rules={[
                  { required: true, message: '请详细描述您的需求' },
                  { min: 20, message: '描述至少需要20个字符' }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述您的需求、项目背景、期望的解决方案等..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>

            {/* 项目信息 */}
            <Col span={24}>
              <h3 className="text-lg font-semibold mb-4 mt-6">项目信息（可选）</h3>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="industry"
                label="所属行业"
              >
                <Select
                  placeholder="请选择行业"
                  size="large"
                  allowClear
                >
                  {industryOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="budget"
                label="预算范围"
              >
                <Select
                  placeholder="请选择预算范围"
                  size="large"
                  allowClear
                >
                  {budgetOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="timeline"
                label="期望时间"
              >
                <Select
                  placeholder="请选择期望时间"
                  size="large"
                  allowClear
                >
                  {timelineOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* 提交按钮 */}
            <Col span={24}>
              <div className="mt-6 text-center">
                <Space direction="vertical" size="large" className="w-full">
                  {feedback.hasError && (
                    <div className="text-red-500 text-sm">
                      {feedback.message}
                      {feedback.canRetry && (
                        <span className="ml-2">
                          (还可重试 {feedback.maxRetryAttempts - feedback.submitAttempts} 次)
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={feedback.isLoading}
                    disabled={!feedback.canSubmit}
                    icon={<SendOutlined />}
                    className="px-8"
                  >
                    {feedback.isLoading ? feedback.getStatusText() : '提交咨询'}
                  </Button>

                  <p className="text-gray-500 text-sm">
                    我们承诺保护您的隐私信息，提交后我们将在24小时内与您联系
                  </p>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 成功提交模态框 */}
      {showSuccessModal && (
        <FormSuccessModal
          visible={showSuccess}
          config={successConfig}
          onClose={() => setShowSuccess(false)}
          onNewSubmission={() => {
            setShowSuccess(false)
            feedback.reset()
          }}
        />
      )}
    </div>
  )
}