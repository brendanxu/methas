'use client';

import React from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Button } from 'antd';
import { 
  DashboardOutlined, 
  SettingOutlined, 
  UserOutlined, 
  LogoutOutlined,
  BgColorsOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/content',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/content">Content Management</Link>,
    },
    {
      key: '/admin/files',
      icon: <FolderOpenOutlined />,
      label: <Link href="/admin/files">File Management</Link>,
    },
    {
      key: '/admin/theme-system',
      icon: <BgColorsOutlined />,
      label: <Link href="/admin/theme-system">Theme System</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="flex items-center justify-center p-4 border-b border-border">
          <Title level={4} style={{ margin: 0, color: '#002145' }}>
            {collapsed ? 'SP' : 'South Pole Admin'}
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded">
              <Avatar size="small" icon={<UserOutlined />} />
              <span>Admin</span>
            </div>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}