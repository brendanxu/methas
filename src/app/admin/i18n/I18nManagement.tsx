'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Alert,
  Tabs,
  Typography,
  Progress,
  message,
  Modal
} from 'antd'
import {
  TranslationOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BugOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import { 
  generateTranslationReport,
  getTranslationKeys,
  searchTranslations,
  validateTranslations,
  extractTranslationKeysFromText,
  I18nDebugger
} from '@/lib/i18n-utils'
import { SUPPORTED_LOCALES, translations, type Locale } from '@/lib/i18n-lite'
import { useI18n } from '@/hooks/useI18n'

const { Title, Paragraph, Text } = Typography
const { Search, TextArea } = Input
const { TabPane } = Tabs

export default function I18nManagement() {
  const { locale: currentLocale, t } = useI18n()
  const [report, setReport] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en')
  const [extractorText, setExtractorText] = useState('')
  const [extractedKeys, setExtractedKeys] = useState<string[]>([])

  // 加载翻译报告
  useEffect(() => {
    const reportData = generateTranslationReport()
    setReport(reportData)
  }, [])

  // 搜索翻译
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim()) {
      const results = searchTranslations(value, selectedLocale)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  // 提取翻译键
  const handleExtractKeys = () => {
    if (extractorText.trim()) {
      const keys = extractTranslationKeysFromText(extractorText)
      setExtractedKeys(keys)
    } else {
      setExtractedKeys([])
    }
  }

  // 导出翻译
  const exportTranslations = (locale: Locale) => {
    const data = JSON.stringify(translations[locale], null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translations-${locale}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success(`Exported ${locale} translations`)
  }

  // 验证翻译
  const runValidation = () => {
    const validation = validateTranslations()
    if (validation.isValid) {
      message.success('All translations are valid!')
    } else {
      Modal.error({
        title: 'Translation Issues Found',
        content: (
          <div>
            {validation.issues.map((issue, index) => (
              <p key={index}>{issue}</p>
            ))}
          </div>
        ),
        width: 600
      })
    }
  }

  // 表格列定义
  const searchColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: '40%',
      render: (key: string) => <Text code>{key}</Text>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      render: (value: string) => (
        <Text ellipsis={{ tooltip: value }} style={{ maxWidth: '300px' }}>
          {value}
        </Text>
      )
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: '10%',
      render: (score: number) => <Tag color="blue">{score}</Tag>
    }
  ]

  const extractedKeysColumns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (key: string) => <Text code>{key}</Text>
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: any, record: { key: string }) => {
        const hasEn = getNestedValue(translations.en, record.key) !== undefined
        const hasZh = getNestedValue(translations.zh, record.key) !== undefined
        
        if (hasEn && hasZh) {
          return <Tag color="green">Complete</Tag>
        } else if (hasEn || hasZh) {
          return <Tag color="orange">Partial</Tag>
        } else {
          return <Tag color="red">Missing</Tag>
        }
      }
    }
  ]

  // 获取嵌套值的辅助函数
  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  if (!report) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <TranslationOutlined /> I18n Management
        </Title>
        <Paragraph>
          Manage and monitor the internationalization system. Track translation completeness, 
          validate translations, and debug i18n issues.
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Keys"
              value={report.totalKeys}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed"
              value={report.completedKeys}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={report.completionRate}
              suffix="%"
              prefix={<Progress type="circle" percent={report.completionRate} size={20} />}
              valueStyle={{ color: report.completionRate > 95 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Issues"
              value={report.validation.issues.length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: report.validation.issues.length > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 验证警告 */}
      {!report.validation.isValid && (
        <Alert
          message="Translation Issues Detected"
          description={`Found ${report.validation.issues.length} issues that need attention.`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" onClick={runValidation}>
              View Details
            </Button>
          }
        />
      )}

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Translation Status" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>English Keys:</Text>
                    <Text strong>{getTranslationKeys('en').length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Chinese Keys:</Text>
                    <Text strong>{getTranslationKeys('zh').length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Missing in Chinese:</Text>
                    <Text type="danger">{report.missing.keysInEnButNotInZh.length}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Missing in English:</Text>
                    <Text type="danger">{report.missing.keysInZhButNotInEn.length}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Quick Actions" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    block 
                    icon={<BugOutlined />}
                    onClick={runValidation}
                  >
                    Run Validation
                  </Button>
                  <Button 
                    block 
                    icon={<DownloadOutlined />}
                    onClick={() => exportTranslations('en')}
                  >
                    Export English
                  </Button>
                  <Button 
                    block 
                    icon={<DownloadOutlined />}
                    onClick={() => exportTranslations('zh')}
                  >
                    Export Chinese
                  </Button>
                  <Button 
                    block 
                    onClick={() => {
                      I18nDebugger.clearLogs()
                      message.success('Debug logs cleared')
                    }}
                  >
                    Clear Debug Logs
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Search Translations" key="search">
          <Card title="Translation Search">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Search
                  placeholder="Search translations..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="large"
                  onSearch={handleSearch}
                  style={{ flex: 1 }}
                />
                <Button.Group>
                  <Button 
                    type={selectedLocale === 'en' ? 'primary' : 'default'}
                    onClick={() => setSelectedLocale('en')}
                  >
                    EN
                  </Button>
                  <Button 
                    type={selectedLocale === 'zh' ? 'primary' : 'default'}
                    onClick={() => setSelectedLocale('zh')}
                  >
                    中文
                  </Button>
                </Button.Group>
              </div>

              {searchResults.length > 0 && (
                <Table
                  dataSource={searchResults}
                  columns={searchColumns}
                  rowKey="key"
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              )}

              {searchTerm && searchResults.length === 0 && (
                <Alert
                  message="No Results"
                  description={`No translations found for "${searchTerm}" in ${selectedLocale}`}
                  type="info"
                  showIcon
                />
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="Key Extractor" key="extractor">
          <Card title="Translation Key Extractor">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph>
                Paste your React component code below to extract all translation keys used in t() functions.
              </Paragraph>
              
              <TextArea
                rows={10}
                placeholder="Paste your component code here..."
                value={extractorText}
                onChange={(e) => setExtractorText(e.target.value)}
              />
              
              <Button 
                type="primary" 
                onClick={handleExtractKeys}
                disabled={!extractorText.trim()}
              >
                Extract Keys
              </Button>

              {extractedKeys.length > 0 && (
                <div>
                  <Title level={5}>Extracted Keys ({extractedKeys.length})</Title>
                  <Table
                    dataSource={extractedKeys.map(key => ({ key }))}
                    columns={extractedKeysColumns}
                    rowKey="key"
                    pagination={{ pageSize: 20 }}
                    size="small"
                  />
                </div>
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="System Info" key="system">
          <Card title="System Information">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Current Locale: </Text>
                <Tag>{currentLocale}</Tag>
              </div>
              <div>
                <Text strong>Supported Locales: </Text>
                <Space>
                  {SUPPORTED_LOCALES.map(locale => (
                    <Tag key={locale} color={locale === currentLocale ? 'blue' : 'default'}>
                      {locale}
                    </Tag>
                  ))}
                </Space>
              </div>
              <div>
                <Text strong>Storage: </Text>
                <Text>localStorage (client-side persistence)</Text>
              </div>
              <div>
                <Text strong>Features: </Text>
                <Space wrap>
                  <Tag color="green">Lightweight</Tag>
                  <Tag color="green">No SSR Impact</Tag>
                  <Tag color="green">Instant Switching</Tag>
                  <Tag color="green">Type Safe</Tag>
                </Space>
              </div>
              <div>
                <Text strong>Bundle Impact: </Text>
                <Text>~5KB (minified + gzipped)</Text>
              </div>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}