'use client';

/**
 * Optimized Ant Design Imports
 * 
 * Tree-shakeable imports and dynamic loading for Ant Design components
 */

import React from 'react';

// ===== Core Components (Direct exports) =====
// Import from main antd package for better compatibility
import {
  Button,
  Input, 
  Space, 
  Divider,
  Typography,
  Row,
  Col,
  Layout,
  Tag,
  Badge,
  Avatar,
  Statistic,
  Radio,
  Checkbox,
  Skeleton,
  Spin,
  message,
  notification
} from 'antd';

// Re-export components
export {
  Button,
  Input, 
  Space, 
  Divider,
  Typography,
  Row,
  Col,
  Layout,
  Tag,
  Badge,
  Avatar,
  Statistic,
  Radio,
  Checkbox,
  Skeleton,
  Spin,
  message,
  notification
};

// ===== Icons (Import and re-export) =====
import {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  LoadingOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  RightOutlined,
  LeftOutlined,
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  UploadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

export {
  SearchOutlined,
  MenuOutlined,
  CloseOutlined,
  LoadingOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  RightOutlined,
  LeftOutlined,
  UpOutlined,
  DownOutlined,
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  StarOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  UploadOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined
};

// ===== Theme Configuration =====
export const antdThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    wireframe: false
  }
};

export default {
  antdThemeConfig
};