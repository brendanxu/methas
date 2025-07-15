'use client'

import { useEffect, useState } from 'react'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { useSearchParams } from 'next/navigation'
import { Button, Spin, Typography } from '@/lib/antd-optimized'
import Card from 'antd/lib/card'
import Result from 'antd/lib/result'
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  LoadingOutlined,
  MailOutlined 
} from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

type ConfirmationStatus = 'loading' | 'success' | 'error' | 'already-confirmed'

export default function NewsletterConfirmPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('确认令牌无效或缺失')
      return
    }

    confirmSubscription(token)
  }, [token])

  const confirmSubscription = async (confirmationToken: string) => {
    try {
      const response = await fetch(`/api/newsletter?token=${confirmationToken}`, {
        method: 'PUT'
      })

      const result = await response.json()

      if (result.success) {
        if (result.data.message?.includes('already confirmed')) {
          setStatus('already-confirmed')
          setMessage('您的订阅已经确认过了')
        } else {
          setStatus('success')
          setMessage('Newsletter订阅确认成功！')
        }
      } else {
        setStatus('error')
        setMessage(result.error || '确认失败，请稍后重试')
      }
    } catch (error) {
      logError('Confirmation error:', error)
      setStatus('error')
      setMessage('网络错误，请稍后重试')
    }
  }

  const getResultConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />,
          title: '正在确认您的订阅...',
          subTitle: '请稍候，我们正在处理您的请求',
          extra: null
        }

      case 'success':
        return {
          status: 'success' as const,
          icon: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 48 }} />,
          title: '订阅确认成功！',
          subTitle: (
            <div className="space-y-2">
              <Text>感谢您订阅 South Pole Newsletter！</Text>
              <br />
              <Text type="secondary">
                您将开始收到我们的最新资讯、行业洞察和产品更新。
              </Text>
            </div>
          ),
          extra: [
            <Link key="home" href="/">
              <Button type="primary" size="large">
                返回首页
              </Button>
            </Link>,
            <Link key="newsletter" href="/newsletter">
              <Button size="large">
                管理订阅偏好
              </Button>
            </Link>
          ]
        }

      case 'already-confirmed':
        return {
          status: 'info' as const,
          icon: <MailOutlined style={{ color: '#1890ff', fontSize: 48 }} />,
          title: '订阅已确认',
          subTitle: (
            <div className="space-y-2">
              <Text>您的Newsletter订阅之前已经确认过了。</Text>
              <br />
              <Text type="secondary">
                如果您没有收到我们的邮件，请检查您的垃圾邮件文件夹。
              </Text>
            </div>
          ),
          extra: [
            <Link key="home" href="/">
              <Button type="primary" size="large">
                返回首页
              </Button>
            </Link>,
            <Link key="newsletter" href="/newsletter">
              <Button size="large">
                管理订阅偏好
              </Button>
            </Link>
          ]
        }

      case 'error':
        return {
          status: 'error' as const,
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 48 }} />,
          title: '确认失败',
          subTitle: (
            <div className="space-y-2">
              <Text>{message}</Text>
              <br />
              <Text type="secondary">
                确认链接可能已过期或无效。请尝试重新订阅，或联系我们获取帮助。
              </Text>
            </div>
          ),
          extra: [
            <Link key="home" href="/">
              <Button type="primary" size="large">
                返回首页
              </Button>
            </Link>,
            <Button 
              key="retry" 
              size="large"
              onClick={() => window.location.reload()}
            >
              重试
            </Button>
          ]
        }

      default:
        return {
          status: 'error' as const,
          title: '未知错误',
          subTitle: '请刷新页面重试',
          extra: null
        }
    }
  }

  const resultConfig = getResultConfig()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center py-8">
          <Result
            {...resultConfig}
          />
        </div>
        
        {/* 额外信息 */}
        {status === 'success' && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <Title level={5} className="text-blue-800">
              接下来您可以：
            </Title>
            <ul className="text-blue-700 space-y-1">
              <li>• 查看我们的最新博客文章和案例研究</li>
              <li>• 了解最新的气候解决方案和行业动态</li>
              <li>• 关注我们的社交媒体获取实时更新</li>
              <li>• 随时管理您的订阅偏好和频率</li>
            </ul>
          </div>
        )}

        {/* 帮助信息 */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Text type="secondary" className="text-sm">
            如有任何问题，请联系我们：
            <a href="mailto:newsletter@southpole.com" className="text-blue-600 hover:text-blue-800 ml-1">
              newsletter@southpole.com
            </a>
          </Text>
        </div>
      </Card>
    </div>
  )
}