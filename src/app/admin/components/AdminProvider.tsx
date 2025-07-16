'use client'

import { ConfigProvider, Layout, Menu } from 'antd'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  FormOutlined,
  UserOutlined,
  FolderOutlined,
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  TranslationOutlined
} from '@ant-design/icons'
import { signOut } from 'next-auth/react'

const { Header, Sider, Content } = Layout

interface AdminProviderProps {
  children: React.ReactNode
  session: Session
}

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/admin/content',
    icon: <FileTextOutlined />,
    label: 'Content Management',
  },
  {
    key: '/admin/forms',
    icon: <FormOutlined />,
    label: 'Form Submissions',
  },
  {
    key: '/admin/emails',
    icon: <MailOutlined />,
    label: 'Email Management',
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: 'User Management',
  },
  {
    key: '/admin/files',
    icon: <FolderOutlined />,
    label: 'File Management',
  },
  {
    key: '/admin/newsletter',
    icon: <MailOutlined />,
    label: 'Newsletter Management',
  },
  {
    key: '/admin/rate-limits',
    icon: <ThunderboltOutlined />,
    label: 'Rate Limits',
  },
  {
    key: '/admin/i18n',
    icon: <TranslationOutlined />,
    label: 'I18n Management',
  },
  {
    key: '/admin/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
]

export default function AdminProvider({ children, session }: AdminProviderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      signOut({ callbackUrl: '/' })
    } else {
      router.push(key)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#002145',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} theme="dark">
          <div className="flex items-center justify-center h-16 text-white font-bold text-lg">
            South Pole Admin
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <Menu
              theme="dark"
              mode="inline"
              items={[
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  danger: true,
                },
              ]}
              onClick={handleMenuClick}
            />
          </div>
        </Sider>
        <Layout>
          <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
            <h1 className="text-lg font-semibold m-0">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span>Welcome, {session.user.name}</span>
              <span className="text-sm text-gray-500">({session.user.role})</span>
            </div>
          </Header>
          <Content className="p-6 bg-gray-50">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}