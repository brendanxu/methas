'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  Statistic, 
  Form, 
  Input, 
  Button as AntButton, 
  Card,
  Collapse,
  Row,
  Col,
  Timeline,
  Tag,
  message
} from 'antd';
import {
  RocketOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  TrophyOutlined,
  SafetyOutlined,
  BulbOutlined,
  BarChartOutlined,
  LineChartOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  StarOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/app/providers';
import type { Service } from './page';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;

interface ServiceDetailPageProps {
  service: Service;
  relatedServices: Service[];
}

// 图标映射
const iconMap: Record<string, React.ComponentType> = {
  RocketOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  SafetyOutlined,
  BulbOutlined,
  BarChartOutlined,
  LineChartOutlined,
  GlobalOutlined
};

// Hero 区域组件
const HeroSection: React.FC<{ service: Service }> = ({ service }) => {
  
  return (
    <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-primary to-secondary overflow-hidden">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src={service.heroImage}
          alt={service.heroImageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* 内容 */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <Tag color="gold" className="text-sm">
                {service.category}
              </Tag>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {service.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {service.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="large"
                className="text-lg px-8 py-4"
                icon={<PhoneOutlined />}
              >
                立即咨询
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary"
                icon={<DownloadOutlined />}
              >
                下载资料
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
    </section>
  );
};

// 服务概述区域组件
const OverviewSection: React.FC<{ overview: Service['overview'] }> = ({ overview }) => {
  const colors = useThemeColors();
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {overview.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {overview.description}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {overview.valuePoints.map((point, index) => {
            const IconComponent = iconMap[point.icon] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
            
            return (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className="h-full hover:shadow-lg transition-shadow border-border"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="p-6">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {IconComponent && (
                        <IconComponent 
                          className="text-2xl" 
                          style={{ color: colors.primary }}
                        />
                      )}
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {point.title}
                    </h3>
                    
                    <p className="text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 详细介绍Tab区域组件
const DetailsSection: React.FC<{ details: Service['details'] }> = ({ details }) => {
  
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Tabs defaultActiveKey="content" size="large" centered>
            {/* 服务内容 */}
            <TabPane tab="服务内容" key="content">
              <div className="py-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                  {details.content.title}
                </h3>
                <div className="space-y-8">
                  {details.content.sections.map((section, index) => (
                    <Card key={index} className="border-border">
                      <h4 className="text-xl font-semibold text-foreground mb-4">
                        {section.subtitle}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {section.content}
                      </p>
                      {section.features && (
                        <Row gutter={[16, 16]}>
                          {section.features.map((feature, idx) => (
                            <Col key={idx} xs={24} sm={12} md={8}>
                              <div className="flex items-center gap-2">
                                <CheckCircleOutlined 
                                  className="text-green-500 flex-shrink-0" 
                                />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            {/* 实施流程 */}
            <TabPane tab="实施流程" key="process">
              <div className="py-8">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                  {details.process.title}
                </h3>
                <Timeline mode="left" className="max-w-4xl mx-auto">
                  {details.process.steps.map((step, index) => (
                    <Timeline.Item
                      key={index}
                      dot={
                        <div 
                          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold"
                        >
                          {step.step}
                        </div>
                      }
                    >
                      <Card className="ml-4 border-border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-semibold text-foreground">
                            {step.title}
                          </h4>
                          {step.duration && (
                            <Tag color="blue" icon={<ClockCircleOutlined />}>
                              {step.duration}
                            </Tag>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </TabPane>
            
            {/* 成功案例 */}
            <TabPane tab="成功案例" key="cases">
              <div className="py-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                  {details.cases.title}
                </h3>
                <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                  {details.cases.description}
                </p>
                <div className="space-y-6">
                  {details.cases.caseStudies.map((caseStudy, index) => (
                    <Card key={index} className="border-border">
                      <Row gutter={[24, 24]}>
                        <Col xs={24} lg={8}>
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-foreground">
                              {caseStudy.client}
                            </h4>
                            <Tag color="green">{caseStudy.industry}</Tag>
                          </div>
                        </Col>
                        <Col xs={24} lg={16}>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-foreground mb-2">挑战</h5>
                              <p className="text-muted-foreground">{caseStudy.challenge}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-foreground mb-2">解决方案</h5>
                              <p className="text-muted-foreground">{caseStudy.solution}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-foreground mb-2">成果</h5>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {caseStudy.results.map((result, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <StarOutlined className="text-yellow-500" />
                                    <span className="text-foreground">{result}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              </div>
            </TabPane>
            
            {/* 常见问题 */}
            <TabPane tab="常见问题" key="faq">
              <div className="py-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
                  {details.faq.title}
                </h3>
                <Collapse ghost>
                  {details.faq.questions.map((faq, index) => (
                    <Panel 
                      header={
                        <span className="text-lg font-medium text-foreground">
                          {faq.question}
                        </span>
                      } 
                      key={index}
                      className="mb-4 bg-card rounded-lg border border-border"
                    >
                      <p className="text-muted-foreground pl-6">
                        {faq.answer}
                      </p>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </TabPane>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

// 数据展示区域组件
const StatisticsSection: React.FC<{ 
  statistics: Service['statistics'];
  certifications: Service['certifications'];
}> = ({ statistics, certifications }) => {
  const colors = useThemeColors();
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* 统计数据 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            {statistics.title}
          </h2>
          
          <Row gutter={[32, 32]} justify="center">
            {statistics.data.map((stat, index) => (
              <Col key={index} xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Statistic
                    value={stat.value}
                    title={stat.label}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    valueStyle={{ 
                      color: colors.primary,
                      fontSize: '2.5rem',
                      fontWeight: 'bold'
                    }}
                    className="text-center"
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
        
        {/* 认证标志 */}
        {certifications.length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              权威认证
            </h3>
            
            <Row gutter={[32, 32]} justify="center">
              {certifications.map((cert, index) => (
                <Col key={index} xs={24} sm={12} md={8}>
                  <Card 
                    className="text-center border-border hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: colors.card }}
                  >
                    <div className="p-4">
                      <div className="w-20 h-20 mx-auto mb-4 relative">
                        <Image
                          src={cert.logo}
                          alt={cert.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.description}
                      </p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// CTA区域组件
const CTASection: React.FC<{ ctaForm: Service['ctaForm'] }> = ({ ctaForm }) => {
  const colors = useThemeColors();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    console.log('提交的表单数据:', values);
    // 模拟表单提交
    setTimeout(() => {
      setLoading(false);
      message.success('提交成功！我们会尽快与您联系。');
      form.resetFields();
    }, 2000);
  };
  
  return (
    <section 
      className="py-20 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ctaForm.title}
          </h2>
          <p className="text-xl text-white/90 mb-12">
            {ctaForm.subtitle}
          </p>
          
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <Card className="border-0 shadow-2xl">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                      >
                        <Input placeholder="您的姓名" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="company"
                        label="公司"
                        rules={[{ required: true, message: '请输入公司名称' }]}
                      >
                        <Input placeholder="公司名称" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效邮箱' }
                        ]}
                      >
                        <Input placeholder="your@email.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="电话"
                        rules={[{ required: true, message: '请输入电话号码' }]}
                      >
                        <Input placeholder="联系电话" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="message"
                    label="需求描述"
                    rules={[{ required: true, message: '请描述您的需求' }]}
                  >
                    <TextArea 
                      rows={4} 
                      placeholder="请详细描述您的需求..." 
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <AntButton
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="w-full"
                      icon={<MailOutlined />}
                    >
                      {loading ? '提交中...' : '立即咨询'}
                    </AntButton>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="space-y-8">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-6">其他联系方式</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <PhoneOutlined className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium">电话咨询</div>
                        <div className="text-white/80">+86 400-123-4567</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <MailOutlined className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium">邮件咨询</div>
                        <div className="text-white/80">contact@southpole.com</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <TeamOutlined className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium">在线会议</div>
                        <div className="text-white/80">预约专家咨询</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
    </section>
  );
};

// 相关服务推荐组件
const RelatedServicesSection: React.FC<{ 
  relatedServices: Service[];
}> = ({ relatedServices }) => {
  const colors = useThemeColors();
  
  if (relatedServices.length === 0) return null;
  
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            相关服务推荐
          </h2>
          <p className="text-xl text-muted-foreground">
            探索更多专业的可持续发展解决方案
          </p>
        </motion.div>
        
        <Row gutter={[32, 32]}>
          {relatedServices.map((service, index) => (
            <Col key={service.id} xs={24} md={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/services/${service.slug}`}>
                  <Card 
                    hoverable
                    className="h-full border-border"
                    style={{ backgroundColor: colors.card }}
                    cover={
                      <div className="relative h-48">
                        <Image
                          src={service.heroImage}
                          alt={service.heroImageAlt}
                          fill
                          className="object-cover"
                        />
                      </div>
                    }
                  >
                    <div className="p-4">
                      <Tag color="blue" className="mb-3">
                        {service.category}
                      </Tag>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {service.description}
                      </p>
                      <div className="flex items-center text-primary hover:text-primary/80 transition-colors">
                        <span className="font-medium">了解详情</span>
                        <ArrowRightOutlined className="ml-2" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

// 主组件
const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ 
  service, 
  relatedServices 
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero 区域 */}
      <HeroSection service={service} />
      
      {/* 服务概述 */}
      <OverviewSection overview={service.overview} />
      
      {/* 详细介绍Tab */}
      <DetailsSection details={service.details} />
      
      {/* 数据展示 */}
      <StatisticsSection 
        statistics={service.statistics}
        certifications={service.certifications}
      />
      
      {/* CTA区域 */}
      <CTASection ctaForm={service.ctaForm} />
      
      {/* 相关服务推荐 */}
      <RelatedServicesSection relatedServices={relatedServices} />
    </div>
  );
};

export default ServiceDetailPage;