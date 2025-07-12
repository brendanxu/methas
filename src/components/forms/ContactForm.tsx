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
  Divider,
  Card,
  Space,
  Typography,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MessageOutlined,
  BankOutlined,
  ContactsOutlined,
  SendOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {  motion  } from '@/lib/mock-framer-motion';
import { useThemeColors } from '@/app/providers';
import {
  ContactFormData,
  formRules,
  countryOptions,
  inquiryTypeOptions,
  sanitizeFormData,
  validateContactForm,
  formSubmissionManager,
  logFormError,
} from '@/lib/form-validation';

const { TextArea } = Input;
const { Title, Text } = Typography;

export interface ContactFormProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  onSubmitSuccess?: (data: ContactFormData) => void;
  onSubmitError?: (error: string) => void;
  initialValues?: Partial<ContactFormData>;
  submitButtonText?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export const ContactForm: React.FC<ContactFormProps> = ({
  className = '',
  title = '联系我们',
  subtitle = '我们很乐意听到您的声音。请填写以下表格，我们会尽快与您联系。',
  showHeader = true,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
  submitButtonText = '发送消息',
  variant = 'default',
}) => {
  const [form] = Form.useForm<ContactFormData>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const colors = useThemeColors();

  // 表单提交处理
  const handleSubmit = useCallback(async (values: ContactFormData) => {
    const formId = 'contact-form';
    
    // 防重复提交检查
    if (!formSubmissionManager.canSubmit(formId)) {
      const remaining = Math.ceil(formSubmissionManager.getRemainingCooldown(formId) / 1000);
      message.warning(`请等待 ${remaining} 秒后再次提交`);
      return;
    }

    setLoading(true);

    try {
      // 数据清理
      const sanitizedData: ContactFormData = {
        firstName: sanitizeFormData.text(values.firstName),
        lastName: sanitizeFormData.text(values.lastName),
        company: sanitizeFormData.text(values.company),
        position: values.position ? sanitizeFormData.text(values.position) : undefined,
        email: sanitizeFormData.email(values.email),
        phone: values.phone ? sanitizeFormData.phone(values.phone) : undefined,
        country: values.country,
        inquiryType: values.inquiryType,
        message: sanitizeFormData.html(values.message),
        agreeToTerms: values.agreeToTerms,
        subscribeNewsletter: values.subscribeNewsletter,
      };

      // 客户端验证
      const validation = validateContactForm(sanitizedData);
      if (!validation.isValid) {
        message.error(validation.errors[0]);
        setLoading(false);
        return;
      }

      // 提交到服务器
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error(`提交失败: ${response.status} ${response.statusText}`);
      }

      await response.json(); // 结果在生产环境中使用

      // 记录提交
      formSubmissionManager.recordSubmission(formId);

      // 成功处理
      setSubmitted(true);
      message.success('感谢您的联系！我们会在24小时内回复您。');
      
      // 重置表单
      form.resetFields();
      
      // 回调
      onSubmitSuccess?.(sanitizedData);

    } catch (error) {
      console.error('Form submission error:', error);
      logFormError('contact', error, values);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '提交失败，请稍后重试';
      
      message.error(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [form, onSubmitSuccess, onSubmitError]);

  // 表单验证失败处理
  const handleSubmitFailed = useCallback((errorInfo: unknown) => {
    console.log('Form validation failed:', errorInfo);
    message.error('请检查并完善表单信息');
  }, []);

  // 布局配置
  const getLayoutProps = useCallback(() => {
    switch (variant) {
      case 'compact':
        return {
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        };
      case 'inline':
        return {
          layout: 'inline' as const,
        };
      default:
        return {
          labelCol: { xs: 24, sm: 24, md: 8, lg: 6 },
          wrapperCol: { xs: 24, sm: 24, md: 16, lg: 18 },
        };
    }
  }, [variant]);

  // 成功状态组件
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-center py-12 ${className}`}
      >
        <div className="text-6xl mb-4">✅</div>
        <Title level={3} className="mb-4">
          消息发送成功！
        </Title>
        <Text className="text-lg mb-6 block">
          感谢您的联系，我们已收到您的消息，会在24小时内回复您。
        </Text>
        <Button 
          type="primary" 
          onClick={() => setSubmitted(false)}
          icon={<MessageOutlined />}
        >
          发送新消息
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="shadow-lg border-0" style={{ backgroundColor: colors.card }}>
        {showHeader && (
          <div className="text-center mb-8">
            <Title level={2} className="mb-4">
              {title}
            </Title>
            <Text className="text-lg text-muted-foreground">
              {subtitle}
            </Text>
          </div>
        )}

        <Form
          form={form}
          name="contact-form"
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          initialValues={initialValues}
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

            {/* 公司和职位 */}
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
                name="position"
                label="职位"
                rules={formRules.position()}
              >
                <Input
                  prefix={<ContactsOutlined className="text-muted-foreground" />}
                  placeholder="请输入您的职位（可选）"
                  maxLength={100}
                />
              </Form.Item>
            </Col>

            {/* 联系方式 */}
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

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={formRules.phone()}
              >
                <Input
                  prefix={<PhoneOutlined className="text-muted-foreground" />}
                  placeholder="请输入电话号码（可选）"
                />
              </Form.Item>
            </Col>

            {/* 地区和咨询类型 */}
            <Col xs={24} md={12}>
              <Form.Item
                name="country"
                label="国家/地区"
                rules={formRules.select('请选择国家/地区')}
              >
                <Select
                  placeholder="请选择国家/地区"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={countryOptions}
                  suffixIcon={<GlobalOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="inquiryType"
                label="咨询类型"
                rules={formRules.select('请选择咨询类型')}
              >
                <Select
                  placeholder="请选择咨询类型"
                  options={inquiryTypeOptions}
                />
              </Form.Item>
            </Col>

            {/* 详细信息 */}
            <Col span={24}>
              <Form.Item
                name="message"
                label="详细信息"
                rules={formRules.message()}
                hasFeedback
              >
                <TextArea
                  placeholder="请详细描述您的需求和问题，我们会为您提供最合适的解决方案..."
                  rows={6}
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </Col>

            {/* 同意条款和订阅 */}
            <Col span={24}>
              <Divider />
              <Space direction="vertical" size="middle" className="w-full">
                <Form.Item
                  name="agreeToTerms"
                  valuePropName="checked"
                  rules={formRules.agreement('请阅读并同意服务条款')}
                >
                  <Checkbox>
                    我已阅读并同意{' '}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      className="text-primary hover:text-primary/80"
                    >
                      服务条款
                    </a>{' '}
                    和{' '}
                    <a 
                      href="/privacy" 
                      target="_blank"
                      className="text-primary hover:text-primary/80"
                    >
                      隐私政策
                    </a>
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name="subscribeNewsletter"
                  valuePropName="checked"
                >
                  <Checkbox>
                    我希望接收South Pole的最新动态和行业洞察
                  </Checkbox>
                </Form.Item>
              </Space>
            </Col>
          </Row>

          {/* 提交按钮 */}
          <Form.Item className="mb-0 text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={loading ? <LoadingOutlined /> : <SendOutlined />}
              className="px-8 h-12 text-lg font-semibold"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              {loading ? '发送中...' : submitButtonText}
            </Button>
          </Form.Item>
        </Form>

        {/* 帮助信息 */}
        <div className="mt-6 text-center">
          <Text className="text-sm text-muted-foreground">
            需要紧急帮助？请致电{' '}
            <a href="tel:+86-400-123-4567" className="text-primary hover:text-primary/80">
              +86-400-123-4567
            </a>{' '}
            或发送邮件至{' '}
            <a href="mailto:contact@southpole.com" className="text-primary hover:text-primary/80">
              contact@southpole.com
            </a>
          </Text>
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactForm;