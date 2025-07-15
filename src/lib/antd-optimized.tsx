'use client';

/**
 * Optimized Ant Design Imports
 * 
 * Tree-shakeable imports and dynamic loading for Ant Design components
 */

import React from 'react';

// ===== Core Components (Direct exports) =====
// Import from main antd package for better compatibility
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import Space from 'antd/lib/space';
import Divider from 'antd/lib/divider';
import Typography from 'antd/lib/typography';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Layout from 'antd/lib/layout';
import Tag from 'antd/lib/tag';
import Badge from 'antd/lib/badge';
import Avatar from 'antd/lib/avatar';
import Statistic from 'antd/lib/statistic';
import Radio from 'antd/lib/radio';
import Checkbox from 'antd/lib/checkbox';
import Skeleton from 'antd/lib/skeleton';
import Spin from 'antd/lib/spin';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';

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

const antdOptimizedConfig = {
  antdThemeConfig
};

export default antdOptimizedConfig;