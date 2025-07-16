'use client'

import { Card, Space, Button, Typography, Divider } from 'antd'
import { useI18n } from '@/hooks/useI18n'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { I18nLiteProvider } from '@/components/providers/I18nLiteProvider'

const { Title, Paragraph, Text } = Typography

/**
 * 展示新的轻量级国际化系统的示例组件
 */
function I18nExampleContent() {
  const { locale, t, formatDate, formatNumber, formatCurrency, formatRelativeTime } = useI18n()

  // 示例数据
  const currentDate = new Date()
  const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2天前
  const sampleNumber = 1234567.89
  const sampleAmount = 99.99

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      <Card title="轻量级国际化系统示例" extra={<LanguageSwitcher />}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>{t('common.language')}</Title>
            <Paragraph>
              <Text strong>当前语言: </Text>
              <Text code>{locale}</Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary">
                使用右上角的语言切换器来切换语言，所有文本会实时更新。
              </Text>
            </Paragraph>
          </div>

          <Divider />

          <div>
            <Title level={4}>基础翻译</Title>
            <Space direction="vertical">
              <div>
                <Text strong>导航: </Text>
                <Space>
                  <Button type="text">{t('nav.home')}</Button>
                  <Button type="text">{t('nav.about')}</Button>
                  <Button type="text">{t('nav.services')}</Button>
                  <Button type="text">{t('nav.contact')}</Button>
                </Space>
              </div>
              <div>
                <Text strong>常用词汇: </Text>
                <Space wrap>
                  <Button size="small">{t('common.save')}</Button>
                  <Button size="small">{t('common.cancel')}</Button>
                  <Button size="small">{t('common.confirm')}</Button>
                  <Button size="small">{t('common.loading')}</Button>
                  <Button size="small">{t('common.error')}</Button>
                </Space>
              </div>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>日期和时间格式化</Title>
            <Space direction="vertical">
              <div>
                <Text strong>当前日期: </Text>
                <Text>{formatDate(currentDate)}</Text>
              </div>
              <div>
                <Text strong>短日期格式: </Text>
                <Text>{formatDate(currentDate, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</Text>
              </div>
              <div>
                <Text strong>相对时间: </Text>
                <Text>{formatRelativeTime(pastDate)}</Text>
              </div>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>数字和货币格式化</Title>
            <Space direction="vertical">
              <div>
                <Text strong>数字: </Text>
                <Text>{formatNumber(sampleNumber)}</Text>
              </div>
              <div>
                <Text strong>百分比: </Text>
                <Text>{formatNumber(0.1234, { style: 'percent' })}</Text>
              </div>
              <div>
                <Text strong>货币 (USD): </Text>
                <Text>{formatCurrency(sampleAmount, 'USD')}</Text>
              </div>
              <div>
                <Text strong>货币 (CNY): </Text>
                <Text>{formatCurrency(sampleAmount, 'CNY')}</Text>
              </div>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>页面内容示例</Title>
            <Card size="small">
              <Title level={5}>{t('hero.title')}</Title>
              <Paragraph>{t('hero.subtitle')}</Paragraph>
              <Space>
                <Button type="primary">{t('hero.cta')}</Button>
                <Button>{t('hero.learnMore')}</Button>
              </Space>
            </Card>
          </div>

          <Divider />

          <div>
            <Title level={4}>服务展示</Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <Card size="small">
                <Title level={5}>{t('services.carbonFootprint.title')}</Title>
                <Paragraph>{t('services.carbonFootprint.description')}</Paragraph>
              </Card>
              <Card size="small">
                <Title level={5}>{t('services.carbonNeutrality.title')}</Title>
                <Paragraph>{t('services.carbonNeutrality.description')}</Paragraph>
              </Card>
            </div>
          </div>

          <Divider />

          <div>
            <Title level={4}>表单示例</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>{t('contact.form.firstName')}: </Text>
                <Text type="secondary">({t('common.required')})</Text>
              </div>
              <div>
                <Text>{t('contact.form.email')}: </Text>
                <Text type="secondary">({t('common.required')})</Text>
              </div>
              <div>
                <Text>{t('contact.form.phone')}: </Text>
                <Text type="secondary">({t('common.optional')})</Text>
              </div>
              <Button type="primary">{t('contact.form.submit')}</Button>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>系统信息</Title>
            <Space direction="vertical">
              <div>
                <Text strong>支持的语言: </Text>
                <Text>English, 中文</Text>
              </div>
              <div>
                <Text strong>当前语言: </Text>
                <Text>{locale === 'en' ? 'English' : '中文'}</Text>
              </div>
              <div>
                <Text strong>存储方式: </Text>
                <Text>localStorage (客户端持久化)</Text>
              </div>
              <div>
                <Text strong>特点: </Text>
                <Text>轻量级、无SSR影响、即时切换</Text>
              </div>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  )
}

/**
 * 完整的示例组件，包含Provider
 */
export default function I18nExample() {
  return (
    <I18nLiteProvider>
      <I18nExampleContent />
    </I18nLiteProvider>
  )
}