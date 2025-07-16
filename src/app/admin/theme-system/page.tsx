'use client';

import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import { HomeOutlined, BgColorsOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { ThemeShowcase } from '@/components/sections/ThemeShowcase';

const { Title, Paragraph } = Typography;

export default function ThemeSystemPage() {
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
          <BgColorsOutlined />
          Theme System
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="mb-6">
        <Title level={2}>Theme System Management</Title>
        <Paragraph>
          Manage and preview the South Pole design system, including brand colors, typography, 
          components, and theme consistency between Tailwind CSS and Ant Design.
        </Paragraph>
      </div>

      {/* Theme Showcase Component */}
      <div className="bg-gray-50 rounded-lg p-1">
        <ThemeShowcase className="!bg-transparent" />
      </div>
    </div>
  );
}