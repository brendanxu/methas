'use client';

import React, { useState, useCallback } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Checkbox,
  Card,
  Space,
  Typography,
  Divider,
  Tag,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  BankOutlined,
  DownloadOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import {  motion  } from '@/lib/mock-framer-motion';
import { useThemeColors } from '@/app/providers';
import {
  DownloadFormData,
  formRules,
  resourceTypeOptions,
  sanitizeFormData,
  validateDownloadForm,
  formSubmissionManager,
  logFormError,
} from '@/lib/form-validation';

const { Title, Text } = Typography;

export interface DownloadFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
  resourceId?: string;
  resourceName?: string;
  resourceType?: string;
  onSubmitSuccess?: (data: DownloadFormData, downloadUrl?: string) => void;
  onSubmitError?: (error: string) => void;
  initialValues?: Partial<DownloadFormData>;
  variant?: 'default' | 'compact' | 'modal';
  showResourceInfo?: boolean;
}

export const DownloadForm: React.FC<DownloadFormProps> = ({
  className = '',
  title = '下载资源',
  subtitle = '请填写以下信息以下载相关资源',
  resourceId,
  resourceName = '资源文件',
  resourceType,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  variant = 'default',
  showResourceInfo = true,
}) => {
  const [form] = Form.useForm<DownloadFormData>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const colors = useThemeColors();

  // 表单提交处理
  const handleSubmit = useCallback(async (values: DownloadFormData) => {
    const formId = `download-form-${resourceId || 'default'}`;
    
    // 防重复提交检查
    if (!formSubmissionManager.canSubmit(formId)) {
      const remaining = Math.ceil(formSubmissionManager.getRemainingCooldown(formId) / 1000);
      message.warning(`请等待 ${remaining} 秒后再次提交`);
      return;
    }

    setLoading(true);

    try {
      // 数据清理
      const sanitizedData: DownloadFormData = {
        firstName: sanitizeFormData.text(values.firstName),
        lastName: sanitizeFormData.text(values.lastName),
        company: sanitizeFormData.text(values.company),
        email: sanitizeFormData.email(values.email),
        resourceType: values.resourceType,
        agreeToMarketing: values.agreeToMarketing,
      };

      // 客户端验证
      const validation = validateDownloadForm(sanitizedData);
      if (!validation.isValid) {
        message.error(validation.errors[0]);
        setLoading(false);
        return;
      }

      // 提交到服务器
      const response = await fetch('/api/forms/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sanitizedData,
          resourceId,
          resourceName,
        }),
      });

      if (!response.ok) {
        throw new Error(`下载请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // 记录提交
      formSubmissionManager.recordSubmission(formId);

      // 成功处理
      setSubmitted(true);
      setDownloadUrl(result.downloadUrl);
      message.success('信息提交成功！您的下载即将开始。');
      
      // 重置表单
      form.resetFields();
      
      // 自动下载
      if (result.downloadUrl) {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = resourceName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // 回调
      onSubmitSuccess?.(sanitizedData, result.downloadUrl);

      // 5秒后重置状态
      setTimeout(() => {
        setSubmitted(false);
        setDownloadUrl(null);
      }, 5000);

    } catch (error) {
      logError('Download form submission error:', error);
      logFormError('download', error, values);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '提交失败，请稍后重试';
      
      message.error(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [form, onSubmitSuccess, onSubmitError, resourceId, resourceName]);

  // 表单验证失败处理
  const handleSubmitFailed = useCallback((errorInfo: unknown) => {
    // Debug log removed for production
    message.error('请检查并完善表单信息');
  }, []);

  // 重新下载处理
  const handleRedownload = useCallback(() => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resourceName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [downloadUrl, resourceName]);

  // 成功状态组件
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-center py-12 ${className}`}
      >
        <div className="text-6xl mb-4">📥</div>
        <Title level={3} className="mb-4">
          下载成功！
        </Title>
        <Text className="text-lg mb-6 block">
          感谢您下载我们的资源。如果下载未自动开始，请点击下方按钮。
        </Text>
        <Space>
          {downloadUrl && (
            <Button 
              type="primary" 
              onClick={handleRedownload}
              icon={<CloudDownloadOutlined />}
              size="large"
            >
              重新下载
            </Button>
          )}
          <Button 
            onClick={() => setSubmitted(false)}
            icon={<FileTextOutlined />}
            size="large"
          >
            下载其他资源
          </Button>
        </Space>
      </motion.div>
    );
  }

  // 布局配置
  const getLayoutProps = () => {
    switch (variant) {
      case 'compact':
        return {
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        };
      case 'modal':
        return {
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        };
      default:
        return {
          labelCol: { xs: 24, sm: 24, md: 8, lg: 6 },
          wrapperCol: { xs: 24, sm: 24, md: 16, lg: 18 },
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card 
        className="shadow-lg border-0" 
        style={{ backgroundColor: colors.card }}
      >
        {/* 资源信息展示 */}
        {showResourceInfo && (
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Space align="start">
              <FileTextOutlined className="text-2xl text-primary mt-1" />
              <div>
                <Title level={4} className="mb-1">
                  {resourceName}
                </Title>
                <Text className="text-muted-foreground">
                  {resourceType && (
                    <Tag color="blue">{resourceTypeOptions.find(r => r.value === resourceType)?.label || resourceType}</Tag>
                  )}
                  即将为您提供下载
                </Text>
              </div>
            </Space>
          </div>
        )}

        {/* 表单标题 */}
        <div className="text-center mb-8">
          <Title level={2} className="mb-4">
            {title}
          </Title>
          <Text className="text-lg text-muted-foreground">
            {subtitle}
          </Text>
        </div>

        <Form
          form={form}
          name="download-form"
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          initialValues={{
            resourceType: resourceType,
            ...initialValues,
          }}
          {...getLayoutProps()}
          size="large"
          scrollToFirstError
        >
          <Row gutter={[24, 0]}>
            {/* 姓名字段 */}
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="姓"
                rules={formRules.name('姓')}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="text-muted-foreground" />}
                  placeholder="请输入您的姓"
                  maxLength={50}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="名"
                rules={formRules.name('名')}
                hasFeedback
              >
                <Input
                  prefix={<UserOutlined className="text-muted-foreground" />}
                  placeholder="请输入您的名"
                  maxLength={50}
                />
              </Form.Item>
            </Col>

            {/* 公司和邮箱 */}
            <Col xs={24} md={12}>
              <Form.Item
                name="company"
                label="公司"
                rules={formRules.company()}
                hasFeedback
              >
                <Input
                  prefix={<BankOutlined className="text-muted-foreground" />}
                  placeholder="请输入公司名称"
                  maxLength={100}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={formRules.email()}
                hasFeedback
              >
                <Input
                  prefix={<MailOutlined className="text-muted-foreground" />}
                  placeholder="请输入邮箱地址"
                  type="email"
                />
              </Form.Item>
            </Col>

            {/* 资源类型选择 */}
            <Col span={24}>
              <Form.Item
                name="resourceType"
                label="下载资源类型"
                rules={formRules.select('请选择要下载的资源类型')}
              >
                <Select
                  placeholder="请选择要下载的资源类型"
                  options={resourceTypeOptions}
                  size="large"
                />
              </Form.Item>
            </Col>

            {/* 营销同意 */}
            <Col span={24}>
              <Divider />
              <Form.Item
                name="agreeToMarketing"
                valuePropName="checked"
              >
                <Checkbox>
                  我同意接收South Pole的相关产品信息和营销内容
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* 提交按钮 */}
          <Form.Item className="mb-0 text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={submitted ? <CheckCircleOutlined /> : (loading ? <LoadingOutlined /> : <DownloadOutlined />)}
              className="px-8 h-12 text-lg font-semibold"
              style={{
                backgroundColor: submitted ? '#52c41a' : colors.primary,
                borderColor: submitted ? '#52c41a' : colors.primary,
              }}
            >
              {submitted ? '下载成功！' : (loading ? '准备下载中...' : '立即下载')}
            </Button>
          </Form.Item>
        </Form>

        {/* 帮助信息 */}
        <div className="mt-6 text-center">
          <Text className="text-sm text-muted-foreground">
            下载问题？请联系我们{' '}
            <a href="mailto:support@southpole.com" className="text-primary hover:text-primary/80">
              support@southpole.com
            </a>
          </Text>
        </div>

        {/* 隐私说明 */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <Text className="text-xs text-muted-foreground block">
            🔒 您的信息将严格保密，仅用于提供相关资源和服务。我们遵循严格的数据保护政策。
          </Text>
        </div>
      </Card>
    </motion.div>
  );
};

export default DownloadForm;