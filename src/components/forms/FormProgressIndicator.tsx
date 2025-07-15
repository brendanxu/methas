'use client'

import React, { useMemo } from 'react'
import { Progress, Card, Space, Typography, Tooltip, Tag } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons'

const { Text } = Typography

// 字段状态枚举
export type FieldStatus = 'empty' | 'invalid' | 'valid' | 'required'

// 表单字段配置
export interface FormField {
  name: string
  label: string
  required: boolean
  value?: any
  isValid?: boolean
  errorMessage?: string
}

// 进度指示器配置
export interface FormProgressConfig {
  fields: FormField[]
  showFieldDetails?: boolean
  showEstimatedTime?: boolean
  showValidationStatus?: boolean
  estimatedTimePerField?: number // 每个字段预估填写时间（秒）
  compact?: boolean
}

export interface FormProgressIndicatorProps extends FormProgressConfig {
  className?: string
}

export default function FormProgressIndicator({
  fields,
  showFieldDetails = true,
  showEstimatedTime = true,
  showValidationStatus = true,
  estimatedTimePerField = 30,
  compact = false,
  className
}: FormProgressIndicatorProps) {
  
  // 计算进度统计
  const progressStats = useMemo(() => {
    const totalFields = fields.length
    const requiredFields = fields.filter(field => field.required)
    const requiredCount = requiredFields.length
    
    // 计算已填写的字段
    const filledFields = fields.filter(field => {
      if (typeof field.value === 'string') {
        return field.value.trim().length > 0
      }
      return field.value !== undefined && field.value !== null && field.value !== ''
    })
    const filledCount = filledFields.length
    
    // 计算已填写的必填字段
    const filledRequiredFields = requiredFields.filter(field => {
      if (typeof field.value === 'string') {
        return field.value.trim().length > 0
      }
      return field.value !== undefined && field.value !== null && field.value !== ''
    })
    const filledRequiredCount = filledRequiredFields.length
    
    // 计算验证通过的字段
    const validFields = fields.filter(field => field.isValid === true)
    const validCount = validFields.length
    
    // 计算验证失败的字段
    const invalidFields = fields.filter(field => field.isValid === false)
    const invalidCount = invalidFields.length
    
    // 计算总体进度百分比
    const overallProgress = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 0
    
    // 计算必填字段进度百分比
    const requiredProgress = requiredCount > 0 ? Math.round((filledRequiredCount / requiredCount) * 100) : 100
    
    // 计算验证进度百分比
    const validationProgress = filledCount > 0 ? Math.round((validCount / filledCount) * 100) : 0
    
    // 估算剩余时间
    const remainingFields = totalFields - filledCount
    const estimatedMinutes = Math.ceil((remainingFields * estimatedTimePerField) / 60)
    
    // 判断是否可以提交
    const canSubmit = filledRequiredCount === requiredCount && invalidCount === 0
    
    return {
      totalFields,
      requiredCount,
      filledCount,
      filledRequiredCount,
      validCount,
      invalidCount,
      overallProgress,
      requiredProgress,
      validationProgress,
      estimatedMinutes,
      canSubmit,
      remainingFields
    }
  }, [fields, estimatedTimePerField])

  // 获取字段状态
  const getFieldStatus = (field: FormField): FieldStatus => {
    const hasValue = field.value !== undefined && field.value !== null && field.value !== ''
    
    if (!hasValue) {
      return field.required ? 'required' : 'empty'
    }
    
    if (field.isValid === false) {
      return 'invalid'
    }
    
    if (field.isValid === true) {
      return 'valid'
    }
    
    return hasValue ? 'valid' : 'empty'
  }

  // 获取状态图标和颜色
  const getStatusDisplay = (status: FieldStatus) => {
    switch (status) {
      case 'valid':
        return { icon: <CheckCircleOutlined />, color: '#52c41a', text: '已完成' }
      case 'invalid':
        return { icon: <ExclamationCircleOutlined />, color: '#ff4d4f', text: '需修正' }
      case 'required':
        return { icon: <ClockCircleOutlined />, color: '#faad14', text: '必填' }
      case 'empty':
        return { icon: <InfoCircleOutlined />, color: '#d9d9d9', text: '待填写' }
      default:
        return { icon: <InfoCircleOutlined />, color: '#d9d9d9', text: '待填写' }
    }
  }

  // 紧凑模式
  if (compact) {
    return (
      <div className={`form-progress-compact ${className || ''}`}>
        <Space size="small">
          <Progress
            type="circle"
            size={40}
            percent={progressStats.requiredProgress}
            strokeColor={progressStats.canSubmit ? '#52c41a' : '#1890ff'}
            format={() => `${progressStats.filledRequiredCount}/${progressStats.requiredCount}`}
          />
          <div>
            <Text strong>表单完成度</Text>
            <br />
            <Text type="secondary" className="text-xs">
              {progressStats.canSubmit ? '可以提交' : `还需${progressStats.requiredCount - progressStats.filledRequiredCount}个必填项`}
            </Text>
          </div>
        </Space>
      </div>
    )
  }

  return (
    <Card 
      className={`form-progress-indicator ${className || ''}`}
      size="small"
      title={
        <Space>
          <span>表单完成进度</span>
          {progressStats.canSubmit && (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              可以提交
            </Tag>
          )}
        </Space>
      }
    >
      {/* 总体进度 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Text strong>整体进度</Text>
          <Text>{progressStats.filledCount}/{progressStats.totalFields} 个字段</Text>
        </div>
        <Progress 
          percent={progressStats.overallProgress}
          strokeColor="#1890ff"
          showInfo={false}
        />
      </div>

      {/* 必填字段进度 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Text strong>必填项进度</Text>
          <Text>{progressStats.filledRequiredCount}/{progressStats.requiredCount} 个必填项</Text>
        </div>
        <Progress 
          percent={progressStats.requiredProgress}
          strokeColor={progressStats.requiredProgress === 100 ? '#52c41a' : '#faad14'}
          showInfo={false}
        />
      </div>

      {/* 验证状态 */}
      {showValidationStatus && progressStats.filledCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Text strong>验证状态</Text>
            <Space size="small">
              {progressStats.validCount > 0 && (
                <Text type="success">{progressStats.validCount} 个有效</Text>
              )}
              {progressStats.invalidCount > 0 && (
                <Text type="danger">{progressStats.invalidCount} 个错误</Text>
              )}
            </Space>
          </div>
          {progressStats.invalidCount > 0 && (
            <Progress 
              percent={progressStats.validationProgress}
              strokeColor="#52c41a"
              trailColor="#ff4d4f"
              showInfo={false}
            />
          )}
        </div>
      )}

      {/* 预估时间 */}
      {showEstimatedTime && progressStats.remainingFields > 0 && (
        <div className="mb-4">
          <Text type="secondary" className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            预计还需 {progressStats.estimatedMinutes} 分钟完成
          </Text>
        </div>
      )}

      {/* 字段详情 */}
      {showFieldDetails && (
        <div>
          <Text strong className="block mb-2">字段状态</Text>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {fields.map((field, index) => {
              const status = getFieldStatus(field)
              const display = getStatusDisplay(status)
              
              return (
                <div key={field.name || index} className="flex items-center justify-between py-1">
                  <Space size="small">
                    <span style={{ color: display.color }}>
                      {display.icon}
                    </span>
                    <Text className="text-sm">
                      {field.label}
                      {field.required && <Text type="danger"> *</Text>}
                    </Text>
                  </Space>
                  <Space size="small">
                    <Text 
                      type="secondary" 
                      className="text-xs"
                      style={{ color: display.color }}
                    >
                      {display.text}
                    </Text>
                    {status === 'invalid' && field.errorMessage && (
                      <Tooltip title={field.errorMessage}>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      </Tooltip>
                    )}
                  </Space>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}