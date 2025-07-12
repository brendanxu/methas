'use client';

import React, { useState } from 'react';
import { Tabs, Card, Space, Typography, Button, message, Divider } from 'antd';
import { ContactForm } from '@/components/forms/ContactForm';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { DownloadForm } from '@/components/forms/DownloadForm';
import {
  ContactsOutlined,
  MailOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function FormsDemo() {
  const [activeTab, setActiveTab] = useState('contact');
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  // 测试数据
  const testContactData = {
    firstName: '张',
    lastName: '三',
    company: 'Test Company',
    position: '测试工程师',
    email: 'test@example.com',
    phone: '+86 138-1234-5678',
    country: 'CN',
    inquiryType: 'carbon-footprint',
    message: '这是一个测试消息，用于验证联系表单的功能。',
    agreeToTerms: true,
    subscribeNewsletter: true,
  };

  const testNewsletterData = {
    email: 'newsletter@example.com',
    firstName: '李',
    preferences: ['climate-news', 'industry-insights'],
  };

  const testDownloadData = {
    firstName: '王',
    lastName: '五',
    company: 'Download Test Corp',
    email: 'download@example.com',
    resourceType: 'whitepaper',
    agreeToMarketing: true,
  };

  // 自动填充表单
  const fillContactForm = () => {
    // 这里需要通过ref或其他方式来填充表单
    message.info('请手动填写表单进行测试');
  };

  const handleFormSuccess = (formType: string, data: unknown) => {
    console.log(`${formType} 表单提交成功:`, data);
    setTestResults(prev => ({ ...prev, [formType]: true }));
    message.success(`${formType} 表单测试成功！`);
  };

  const handleFormError = (formType: string, error: string) => {
    console.error(`${formType} 表单提交失败:`, error);
    setTestResults(prev => ({ ...prev, [formType]: false }));
    message.error(`${formType} 表单测试失败: ${error}`);
  };

  const testApiEndpoint = async (endpoint: string, data: unknown) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        message.success(`${endpoint} API 测试成功`);
        return true;
      } else {
        message.error(`${endpoint} API 测试失败: ${result.error}`);
        return false;
      }
    } catch (error) {
      message.error(`${endpoint} API 测试失败: ${error}`);
      return false;
    }
  };

  const runAllTests = async () => {
    message.info('开始运行所有API测试...');
    
    const results = await Promise.all([
      testApiEndpoint('/api/forms/contact', testContactData),
      testApiEndpoint('/api/forms/newsletter', testNewsletterData),
      testApiEndpoint('/api/forms/download', testDownloadData),
    ]);

    const passedTests = results.filter(Boolean).length;
    const totalTests = results.length;

    if (passedTests === totalTests) {
      message.success(`所有测试通过！(${passedTests}/${totalTests})`);
    } else {
      message.warning(`部分测试失败 (${passedTests}/${totalTests})`);
    }
  };

  const TabContent = {
    contact: (
      <Card title="联系表单测试" extra={
        <Button
          type="dashed"
          icon={<ExperimentOutlined />}
          onClick={fillContactForm}
        >
          填充测试数据
        </Button>
      }>
        <Paragraph>
          测试联系表单的所有功能，包括字段验证、数据清理、安全检查等。
        </Paragraph>
        <ContactForm
          onSubmitSuccess={(data) => handleFormSuccess('contact', data)}
          onSubmitError={(error) => handleFormError('contact', error)}
        />
      </Card>
    ),

    newsletter: (
      <Card title="Newsletter订阅测试">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={4}>内联样式</Title>
            <NewsletterForm
              variant="inline"
              onSubmitSuccess={(data) => handleFormSuccess('newsletter-inline', data)}
              onSubmitError={(error) => handleFormError('newsletter-inline', error)}
            />
          </div>

          <Divider />

          <div>
            <Title level={4}>卡片样式</Title>
            <NewsletterForm
              variant="card"
              showPreferences={true}
              onSubmitSuccess={(data) => handleFormSuccess('newsletter-card', data)}
              onSubmitError={(error) => handleFormError('newsletter-card', error)}
            />
          </div>

          <Divider />

          <div>
            <Title level={4}>模态框样式</Title>
            <NewsletterForm
              variant="modal"
              onSubmitSuccess={(data) => handleFormSuccess('newsletter-modal', data)}
              onSubmitError={(error) => handleFormError('newsletter-modal', error)}
            />
          </div>

          <Divider />

          <div>
            <Title level={4}>Footer样式</Title>
            <div className="bg-gray-800 p-6 rounded-lg">
              <NewsletterForm
                variant="footer"
                showPreferences={true}
                onSubmitSuccess={(data) => handleFormSuccess('newsletter-footer', data)}
                onSubmitError={(error) => handleFormError('newsletter-footer', error)}
              />
            </div>
          </div>
        </Space>
      </Card>
    ),

    download: (
      <Card title="资源下载表单测试">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={4}>默认样式</Title>
            <DownloadForm
              resourceId="carbon-footprint-guide"
              resourceName="碳足迹评估指南"
              resourceType="guide"
              onSubmitSuccess={(data, downloadUrl) => {
                handleFormSuccess('download', { data, downloadUrl });
              }}
              onSubmitError={(error) => handleFormError('download', error)}
            />
          </div>

          <Divider />

          <div>
            <Title level={4}>紧凑样式</Title>
            <DownloadForm
              variant="compact"
              resourceId="esg-reporting-template"
              resourceName="ESG报告模板"
              resourceType="template"
              title="下载ESG模板"
              subtitle="获取标准ESG报告模板"
              onSubmitSuccess={(data, downloadUrl) => {
                handleFormSuccess('download-compact', { data, downloadUrl });
              }}
              onSubmitError={(error) => handleFormError('download-compact', error)}
            />
          </div>
        </Space>
      </Card>
    ),

    api: (
      <Card title="API接口测试">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={4}>API端点健康检查</Title>
            <Space wrap>
              <Button 
                onClick={() => testApiEndpoint('/api/forms/contact', testContactData)}
                icon={<ContactsOutlined />}
              >
                测试联系表单API
              </Button>
              <Button 
                onClick={() => testApiEndpoint('/api/forms/newsletter', testNewsletterData)}
                icon={<MailOutlined />}
              >
                测试Newsletter API
              </Button>
              <Button 
                onClick={() => testApiEndpoint('/api/forms/download', testDownloadData)}
                icon={<DownloadOutlined />}
              >
                测试下载API
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>批量测试</Title>
            <Button 
              type="primary" 
              size="large"
              onClick={runAllTests}
              icon={<ExperimentOutlined />}
            >
              运行所有API测试
            </Button>
          </div>

          <Divider />

          <div>
            <Title level={4}>测试结果</Title>
            <Space direction="vertical">
              {Object.entries(testResults).map(([formType, success]) => (
                <div key={formType} className="flex items-center space-x-2">
                  <CheckCircleOutlined 
                    className={success ? 'text-green-500' : 'text-red-500'} 
                  />
                  <Text className={success ? 'text-green-600' : 'text-red-600'}>
                    {formType}: {success ? '成功' : '失败'}
                  </Text>
                </div>
              ))}
              {Object.keys(testResults).length === 0 && (
                <Text type="secondary">暂无测试结果</Text>
              )}
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>测试数据</Title>
            <Text code>联系表单测试数据:</Text>
            <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(testContactData, null, 2)}
            </pre>
            
            <Text code>Newsletter测试数据:</Text>
            <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(testNewsletterData, null, 2)}
            </pre>
            
            <Text code>下载表单测试数据:</Text>
            <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(testDownloadData, null, 2)}
            </pre>
          </div>
        </Space>
      </Card>
    ),
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Title level={1}>表单系统演示</Title>
          <Paragraph className="text-lg text-muted-foreground">
            测试所有表单组件的功能，包括联系表单、Newsletter订阅和资源下载表单。
          </Paragraph>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          tabPosition="top"
        >
          <TabPane 
            tab={
              <span>
                <ContactsOutlined />
                联系表单
              </span>
            } 
            key="contact"
          >
            {TabContent.contact}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <MailOutlined />
                Newsletter订阅
              </span>
            } 
            key="newsletter"
          >
            {TabContent.newsletter}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <DownloadOutlined />
                资源下载
              </span>
            } 
            key="download"
          >
            {TabContent.download}
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ExperimentOutlined />
                API测试
              </span>
            } 
            key="api"
          >
            {TabContent.api}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}