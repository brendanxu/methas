'use client';

/**
 * Optimized Ant Design Imports
 * 
 * Tree-shakeable imports and dynamic loading for Ant Design components
 */

import React from 'react';

// ===== Core Components (Direct exports) =====
// Re-export commonly used lightweight components
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
} from 'antd';

// ===== Icons (Re-export commonly used ones) =====
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
} from '@ant-design/icons';

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