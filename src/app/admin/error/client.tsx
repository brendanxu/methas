'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, Alert, Button, Typography, Space } from 'antd'
import { 
  WarningIcon, 
  InfoIcon, 
  ErrorIcon 
} from '@/components/icons/LightweightIcons'

const { Title, Text } = Typography

interface ErrorInfo {
  type: string
  message: string
  description: string
  icon: React.ReactElement
  actions: React.ReactElement[]
}

export default function AuthErrorClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    
    const errorMap: Record<string, ErrorInfo> = {
      Configuration: {
        type: 'error',
        message: '系统配置错误',
        description: '认证系统配置存在问题，请联系系统管理员。',
        icon: <ErrorIcon />,
        actions: [
          <Button key="home" onClick={() => router.push('/')}>
            返回首页
          </Button>,
          <Button key="contact" type="primary" onClick={() => router.push('/contact')}>
            联系支持
          </Button>
        ]
      },
      AccessDenied: {
        type: 'warning',
        message: '访问被拒绝',
        description: '您的账户没有访问管理后台的权限。请联系管理员获取相应权限。',
        icon: <WarningIcon />,
        actions: [
          <Button key="login" onClick={() => router.push('/admin/login')}>
            重新登录
          </Button>,
          <Button key="home" type="primary" onClick={() => router.push('/')}>
            返回首页
          </Button>
        ]
      },
      Verification: {
        type: 'info',
        message: '邮箱验证required',
        description: '请先验证您的邮箱地址后再访问管理后台。',
        icon: <InfoIcon />,
        actions: [
          <Button key="resend" type="primary">
            重发验证邮件
          </Button>,
          <Button key="login" onClick={() => router.push('/admin/login')}>
            重新登录
          </Button>
        ]
      },
      Default: {
        type: 'error',
        message: '认证失败',
        description: '登录过程中发生了未知错误，请稍后重试。',
        icon: <ErrorIcon />,
        actions: [
          <Button key="login" type="primary" onClick={() => router.push('/admin/login')}>
            重新登录
          </Button>,
          <Button key="home" onClick={() => router.push('/')}>
            返回首页
          </Button>
        ]
      }
    }

    const info = errorMap[error || 'Default'] || errorMap.Default
    setErrorInfo(info)
  }, [searchParams, router])

  if (!errorInfo) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4 text-red-500">
            {errorInfo.icon}
          </div>
          <Title level={3}>{errorInfo.message}</Title>
          <Text type="secondary">{errorInfo.description}</Text>
        </div>

        <Alert
          message="认证错误"
          description={errorInfo.description}
          type={errorInfo.type as any}
          showIcon
          className="mb-6"
        />

        <Space direction="vertical" className="w-full">
          <div className="flex gap-2 justify-center">
            {errorInfo.actions}
          </div>
          
          <div className="text-center mt-4">
            <Text type="secondary" className="text-sm">
              如果问题持续存在，请联系技术支持
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}