'use client';

import React from 'react';
import { Typography, Breadcrumb, Card, Form, Switch, Button, Space, message } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then(() => {
      message.success('Settings saved successfully!');
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined />
          Settings
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <Title level={2}>System Settings</Title>
        <Paragraph>
          Configure system-wide settings and preferences.
        </Paragraph>
      </div>

      {/* Settings Form */}
      <Card title="General Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            enableAnalytics: true,
            enableNotifications: true,
            enableMaintenanceMode: false,
            enableDebugMode: false,
          }}
        >
          <Form.Item
            name="enableAnalytics"
            label="Enable Analytics"
            extra="Track website usage and performance metrics"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="enableNotifications"
            label="Enable Notifications"
            extra="Receive system notifications and alerts"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="enableMaintenanceMode"
            label="Maintenance Mode"
            extra="Enable maintenance mode to temporarily disable the website"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="enableDebugMode"
            label="Debug Mode"
            extra="Enable debug mode for development purposes"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSave}>
                Save Settings
              </Button>
              <Button onClick={() => form.resetFields()}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}