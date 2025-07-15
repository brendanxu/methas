'use client'

import React from 'react'
import { Modal, Button, Typography, Space, Divider, Card, Row, Col } from 'antd'
import { 
  CheckCircleOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  ClockCircleOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  BellOutlined,
  ArrowRightOutlined,
  HomeOutlined
} from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text, Paragraph } = Typography

// 成功模态框配置
export interface FormSuccessConfig {
  type: 'contact' | 'newsletter' | 'download' | 'consultation' | 'general'
  title?: string
  message?: string
  submissionId?: string
  userEmail?: string
  downloadUrl?: string
  estimatedResponseTime?: string
  nextSteps?: Array<{
    title: string
    description: string
    action?: {
      text: string
      href?: string
      onClick?: () => void
    }
  }>
  showShareOptions?: boolean
  showContactInfo?: boolean
}

export interface FormSuccessModalProps {
  visible: boolean
  config: FormSuccessConfig
  onClose: () => void
  onNewSubmission?: () => void
}

// 预定义的成功配置
const SUCCESS_CONFIGS: Record<FormSuccessConfig['type'], Partial<FormSuccessConfig>> = {
  contact: {
    title: '感谢您的联系！',
    message: '我们已收到您的咨询，我们的专业团队将在24小时内与您取得联系。',
    estimatedResponseTime: '24小时内',
    showContactInfo: true,
    nextSteps: [
      {
        title: '查看解决方案',
        description: '了解我们的碳中和解决方案和成功案例',
        action: {
          text: '了解更多',
          href: '/solutions'
        }
      },
      {
        title: '下载资料',
        description: '获取我们的行业白皮书和解决方案指南',
        action: {
          text: '下载资料',
          href: '/resources'
        }
      },
      {
        title: '关注动态',
        description: '订阅我们的Newsletter获取最新行业洞察',
        action: {
          text: '立即订阅',
          href: '#newsletter'
        }
      }
    ]
  },
  
  newsletter: {
    title: '订阅成功！',
    message: '感谢您订阅South Pole Newsletter！确认邮件已发送到您的邮箱，请查收并点击确认链接。',
    nextSteps: [
      {
        title: '查看邮箱',
        description: '请检查您的邮箱（包括垃圾邮件文件夹）并点击确认链接',
        action: {
          text: '前往邮箱',
          onClick: () => window.open('mailto:')
        }
      },
      {
        title: '探索内容',
        description: '浏览我们的最新文章和案例研究',
        action: {
          text: '阅读文章',
          href: '/blog'
        }
      },
      {
        title: '关注我们',
        description: '在社交媒体上关注我们获取实时更新',
        action: {
          text: '社交媒体',
          href: '/social'
        }
      }
    ]
  },
  
  download: {
    title: '下载准备就绪！',
    message: '下载链接已发送到您的邮箱，您也可以直接点击下方按钮开始下载。',
    nextSteps: [
      {
        title: '立即下载',
        description: '点击按钮直接下载资料',
        action: {
          text: '开始下载',
          onClick: () => {} // 将在组件中设置
        }
      },
      {
        title: '了解更多',
        description: '探索相关的解决方案和服务',
        action: {
          text: '浏览方案',
          href: '/solutions'
        }
      }
    ]
  },
  
  consultation: {
    title: '咨询申请已提交！',
    message: '感谢您的咨询申请。我们的专业顾问将在1个工作日内与您联系，为您提供个性化的碳中和解决方案。',
    estimatedResponseTime: '1个工作日内',
    showContactInfo: true,
    nextSteps: [
      {
        title: '准备资料',
        description: '为了更好地为您服务，建议您准备相关的业务资料',
        action: {
          text: '查看清单',
          href: '/consultation-checklist'
        }
      },
      {
        title: '了解流程',
        description: '了解我们的咨询服务流程和时间安排',
        action: {
          text: '服务流程',
          href: '/process'
        }
      }
    ]
  },
  
  general: {
    title: '操作成功！',
    message: '您的请求已成功提交。',
    nextSteps: [
      {
        title: '返回首页',
        description: '继续浏览我们的网站',
        action: {
          text: '返回首页',
          href: '/'
        }
      }
    ]
  }
}

export default function FormSuccessModal({ 
  visible, 
  config, 
  onClose, 
  onNewSubmission 
}: FormSuccessModalProps) {
  // 合并配置
  const finalConfig = {
    ...SUCCESS_CONFIGS[config.type],
    ...config
  }

  // 处理下载操作
  const handleDownload = () => {
    if (config.downloadUrl) {
      window.open(config.downloadUrl, '_blank')
    }
  }

  // 处理分享操作
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'South Pole - 专业碳中和解决方案',
          text: '我刚刚联系了South Pole，他们的碳中和解决方案很专业！',
          url: window.location.origin
        })
      } catch (error) {
        // Debug log removed for production
      }
    } else {
      // 回退到复制链接
      navigator.clipboard.writeText(window.location.origin)
      // 这里可以显示一个提示消息
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="form-success-modal"
    >
      <div className="text-center py-6">
        {/* 成功图标和标题 */}
        <div className="mb-6">
          <CheckCircleOutlined 
            style={{ 
              fontSize: 64, 
              color: '#52c41a',
              marginBottom: 16
            }} 
          />
          <Title level={2} className="mb-2">
            {finalConfig.title}
          </Title>
          <Paragraph className="text-lg text-gray-600">
            {finalConfig.message}
          </Paragraph>
        </div>

        {/* 提交信息 */}
        {(config.submissionId || config.userEmail || finalConfig.estimatedResponseTime) && (
          <Card className="mb-6 text-left" size="small">
            <Space direction="vertical" className="w-full">
              {config.submissionId && (
                <div className="flex justify-between">
                  <Text strong>提交编号：</Text>
                  <Text code copyable>{config.submissionId}</Text>
                </div>
              )}
              {config.userEmail && (
                <div className="flex justify-between">
                  <Text strong>邮箱地址：</Text>
                  <Text copyable>{config.userEmail}</Text>
                </div>
              )}
              {finalConfig.estimatedResponseTime && (
                <div className="flex justify-between">
                  <Text strong>预计回复时间：</Text>
                  <Text>
                    <ClockCircleOutlined className="mr-1" />
                    {finalConfig.estimatedResponseTime}
                  </Text>
                </div>
              )}
            </Space>
          </Card>
        )}

        {/* 下一步操作 */}
        {finalConfig.nextSteps && finalConfig.nextSteps.length > 0 && (
          <div className="mb-6">
            <Title level={4} className="mb-4">接下来您可以：</Title>
            <Row gutter={[16, 16]}>
              {finalConfig.nextSteps.map((step, index) => (
                <Col span={24} sm={12} md={8} key={index}>
                  <Card 
                    size="small" 
                    hoverable
                    className="h-full"
                    bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="flex-1">
                      <Text strong className="block mb-2">{step.title}</Text>
                      <Text type="secondary" className="text-sm">
                        {step.description}
                      </Text>
                    </div>
                    {step.action && (
                      <div className="mt-3">
                        {step.action.href ? (
                          <Link href={step.action.href}>
                            <Button 
                              type="primary" 
                              size="small" 
                              block
                              icon={<ArrowRightOutlined />}
                            >
                              {step.action.text}
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            type="primary" 
                            size="small" 
                            block
                            icon={<ArrowRightOutlined />}
                            onClick={step.action.onClick || (config.type === 'download' ? handleDownload : undefined)}
                          >
                            {step.action.text}
                          </Button>
                        )}
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* 联系信息 */}
        {finalConfig.showContactInfo && (
          <Card className="mb-6 text-left" title="需要帮助？">
            <Space direction="vertical" className="w-full">
              <div className="flex items-center">
                <PhoneOutlined className="mr-2" />
                <Text>咨询热线：400-123-4567</Text>
              </div>
              <div className="flex items-center">
                <MailOutlined className="mr-2" />
                <Text>邮箱：contact@southpole.com</Text>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                <Text>工作时间：周一至周五 9:00-18:00</Text>
              </div>
            </Space>
          </Card>
        )}

        <Divider />

        {/* 底部操作按钮 */}
        <Space className="w-full" style={{ justifyContent: 'center' }}>
          {finalConfig.showShareOptions && (
            <Button 
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享给朋友
            </Button>
          )}
          
          {onNewSubmission && (
            <Button 
              type="default"
              onClick={onNewSubmission}
            >
              提交新的{config.type === 'contact' ? '咨询' : '申请'}
            </Button>
          )}
          
          <Link href="/">
            <Button 
              type="primary"
              icon={<HomeOutlined />}
            >
              返回首页
            </Button>
          </Link>
          
          <Button onClick={onClose}>
            关闭
          </Button>
        </Space>
      </div>
    </Modal>
  )
}