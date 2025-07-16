'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  BgColorsOutlined,
  SettingOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6">
        <Title level={2}>Admin Dashboard</Title>
        <Paragraph>
          Welcome to the South Pole Admin Panel. Manage your website content, theme system, and settings.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Content Pages"
              value={46}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Theme Components"
              value={25}
              prefix={<BgColorsOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="System Status"
              value="Online"
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" className="h-full">
            <Space direction="vertical" size="middle" className="w-full">
              <Link href="/admin/theme-system">
                <Button 
                  type="primary" 
                  icon={<BgColorsOutlined />}
                  block
                  className="flex items-center justify-between"
                >
                  <span>Theme System</span>
                  <ArrowRightOutlined />
                </Button>
              </Link>
              
              <Link href="/admin/settings">
                <Button 
                  icon={<SettingOutlined />}
                  block
                  className="flex items-center justify-between"
                >
                  <span>System Settings</span>
                  <ArrowRightOutlined />
                </Button>
              </Link>
              
              <Link href="/">
                <Button 
                  type="link"
                  block
                  className="flex items-center justify-between"
                >
                  <span>Back to Website</span>
                  <ArrowRightOutlined />
                </Button>
              </Link>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" className="h-full">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Theme system accessed</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Content updated</span>
                <span className="text-gray-500">1 day ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span>User registered</span>
                <span className="text-gray-500">2 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Settings modified</span>
                <span className="text-gray-500">3 days ago</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}