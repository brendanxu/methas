'use client';

import React, { useState, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Checkbox,
  Card,
  Space,
  Typography,
  Modal,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  MailOutlined,
  UserOutlined,
  SendOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '@/app/providers';
import {
  NewsletterFormData,
  formRules,
  newsletterPreferences,
  sanitizeFormData,
  validateNewsletterForm,
  formSubmissionManager,
  logFormError,
} from '@/lib/form-validation';

const { Text, Title } = Typography;

export interface NewsletterFormProps {
  className?: string;
  variant?: 'inline' | 'modal' | 'card' | 'footer';
  showPreferences?: boolean;
  onSubmitSuccess?: (data: NewsletterFormData) => void;
  onSubmitError?: (error: string) => void;
  placeholder?: string;
  buttonText?: string;
  title?: string;
  description?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  className = '',
  variant = 'inline',
  showPreferences = false,
  onSubmitSuccess,
  onSubmitError,
  placeholder = '请输入您的邮箱地址',
  buttonText = '订阅',
  title = '订阅我们的资讯',
  description = '获取最新的气候解决方案和行业洞察',
}) => {
  const [form] = Form.useForm<NewsletterFormData>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useThemeColors();

  // 表单提交处理
  const handleSubmit = useCallback(async (values: NewsletterFormData) => {
    const formId = 'newsletter-form';
    
    // 防重复提交检查
    if (!formSubmissionManager.canSubmit(formId)) {
      const remaining = Math.ceil(formSubmissionManager.getRemainingCooldown(formId) / 1000);
      message.warning(`请等待 ${remaining} 秒后再次提交`);
      return;
    }

    setLoading(true);

    try {
      // 数据清理
      const sanitizedData: NewsletterFormData = {
        email: sanitizeFormData.email(values.email),
        firstName: values.firstName ? sanitizeFormData.text(values.firstName) : undefined,
        preferences: values.preferences || [],
      };

      // 客户端验证
      const validation = validateNewsletterForm(sanitizedData);
      if (!validation.isValid) {
        message.error(validation.errors[0]);
        setLoading(false);
        return;
      }

      // 提交到服务器
      const response = await fetch('/api/forms/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error(`订阅失败: ${response.status} ${response.statusText}`);
      }

      await response.json(); // 结果在生产环境中使用

      // 记录提交
      formSubmissionManager.recordSubmission(formId);

      // 成功处理
      setSubmitted(true);
      message.success('订阅成功！感谢您的关注。');
      
      // 重置表单
      form.resetFields();
      
      // 关闭模态框
      if (variant === 'modal') {
        setModalVisible(false);
      }
      
      // 回调
      onSubmitSuccess?.(sanitizedData);

      // 3秒后重置状态
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      logFormError('newsletter', error, values);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '订阅失败，请稍后重试';
      
      message.error(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [form, onSubmitSuccess, onSubmitError, variant]);

  // 内联表单
  const renderInlineForm = () => (
    <Form
      form={form}
      name="newsletter-inline"
      onFinish={handleSubmit}
      layout="inline"
      className={`w-full ${className}`}
    >
      <Form.Item
        name="email"
        rules={formRules.email()}
        className="flex-1"
      >
        <Input
          prefix={<MailOutlined className="text-muted-foreground" />}
          placeholder={placeholder}
          size="large"
          className="rounded-l-lg"
        />
      </Form.Item>
      
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          icon={submitted ? <CheckCircleOutlined /> : (loading ? <LoadingOutlined /> : <SendOutlined />)}
          className="rounded-r-lg px-6"
          style={{
            backgroundColor: submitted ? '#52c41a' : colors.primary,
            borderColor: submitted ? '#52c41a' : colors.primary,
          }}
        >
          {submitted ? '已订阅' : (loading ? '订阅中...' : buttonText)}
        </Button>
      </Form.Item>
    </Form>
  );

  // 卡片表单
  const renderCardForm = () => (
    <Card 
      className={`shadow-lg border-0 ${className}`} 
      style={{ backgroundColor: colors.card }}
    >
      <div className="text-center mb-6">
        <BellOutlined className="text-4xl text-primary mb-4" />
        <Title level={3} className="mb-2">
          {title}
        </Title>
        <Text className="text-muted-foreground">
          {description}
        </Text>
      </div>

      <Form
        form={form}
        name="newsletter-card"
        onFinish={handleSubmit}
        layout="vertical"
      >
        {showPreferences && (
          <Form.Item
            name="firstName"
            label="姓名（可选）"
          >
            <Input
              prefix={<UserOutlined className="text-muted-foreground" />}
              placeholder="请输入您的姓名"
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item
          name="email"
          label="邮箱地址"
          rules={formRules.email()}
        >
          <Input
            prefix={<MailOutlined className="text-muted-foreground" />}
            placeholder={placeholder}
            size="large"
            type="email"
          />
        </Form.Item>

        {showPreferences && (
          <Form.Item
            name="preferences"
            label="订阅偏好"
          >
            <Checkbox.Group>
              <Row gutter={[8, 8]}>
                {newsletterPreferences.map(pref => (
                  <Col xs={24} sm={12} key={pref.value}>
                    <Checkbox value={pref.value}>
                      {pref.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        )}

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={submitted ? <CheckCircleOutlined /> : (loading ? <LoadingOutlined /> : <SendOutlined />)}
            className="w-full"
            style={{
              backgroundColor: submitted ? '#52c41a' : colors.primary,
              borderColor: submitted ? '#52c41a' : colors.primary,
            }}
          >
            {submitted ? '订阅成功！' : (loading ? '订阅中...' : buttonText)}
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-4 text-center">
        <Text className="text-xs text-muted-foreground">
          我们尊重您的隐私，您可以随时取消订阅
        </Text>
      </div>
    </Card>
  );

  // Footer表单
  const renderFooterForm = () => (
    <div className={className}>
      <div className="mb-4">
        <Title level={4} className="text-white mb-2">
          {title}
        </Title>
        <Text className="text-gray-300">
          {description}
        </Text>
      </div>

      <Form
        form={form}
        name="newsletter-footer"
        onFinish={handleSubmit}
      >
        <Space.Compact className="w-full">
          <Form.Item
            name="email"
            rules={formRules.email()}
            className="flex-1"
            style={{ marginBottom: 0 }}
          >
            <Input
              prefix={<MailOutlined className="text-muted-foreground" />}
              placeholder={placeholder}
              size="large"
              className="rounded-l-lg"
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={submitted ? <CheckCircleOutlined /> : (loading ? <LoadingOutlined /> : <SendOutlined />)}
              className="rounded-r-lg"
              style={{
                backgroundColor: submitted ? '#52c41a' : colors.primary,
                borderColor: submitted ? '#52c41a' : colors.primary,
              }}
            >
              {submitted ? '已订阅' : (loading ? '订阅中...' : buttonText)}
            </Button>
          </Form.Item>
        </Space.Compact>
      </Form>

      {showPreferences && (
        <div className="mt-3">
          <Text className="text-xs text-gray-400 block mb-2">订阅内容：</Text>
          <Space wrap>
            {newsletterPreferences.slice(0, 3).map(pref => (
              <Tag key={pref.value} className="text-xs">
                {pref.label}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );

  // 模态框表单
  const renderModalForm = () => (
    <>
      <Button
        type="primary"
        icon={<BellOutlined />}
        onClick={() => setModalVisible(true)}
        className={className}
      >
        订阅资讯
      </Button>

      <Modal
        title={
          <div className="text-center">
            <BellOutlined className="text-2xl text-primary mr-2" />
            {title}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
        centered
      >
        <div className="text-center mb-6">
          <Text className="text-muted-foreground">
            {description}
          </Text>
        </div>

        <Form
          form={form}
          name="newsletter-modal"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            label="姓名（可选）"
          >
            <Input
              prefix={<UserOutlined className="text-muted-foreground" />}
              placeholder="请输入您的姓名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱地址"
            rules={formRules.email()}
          >
            <Input
              prefix={<MailOutlined className="text-muted-foreground" />}
              placeholder={placeholder}
              size="large"
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="preferences"
            label="订阅偏好"
          >
            <Checkbox.Group>
              <Row gutter={[8, 8]}>
                {newsletterPreferences.map(pref => (
                  <Col xs={24} sm={12} key={pref.value}>
                    <Checkbox value={pref.value}>
                      {pref.label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-between">
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={submitted ? <CheckCircleOutlined /> : (loading ? <LoadingOutlined /> : <SendOutlined />)}
                style={{
                  backgroundColor: submitted ? '#52c41a' : colors.primary,
                  borderColor: submitted ? '#52c41a' : colors.primary,
                }}
              >
                {submitted ? '订阅成功！' : (loading ? '订阅中...' : buttonText)}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

  // 根据variant渲染不同形式
  const renderForm = () => {
    switch (variant) {
      case 'modal':
        return renderModalForm();
      case 'card':
        return renderCardForm();
      case 'footer':
        return renderFooterForm();
      default:
        return renderInlineForm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {renderForm()}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsletterForm;