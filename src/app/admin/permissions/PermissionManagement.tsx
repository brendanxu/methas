'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Modal, 
  Form, 
  Select, 
  Input, 
  DatePicker, 
  message,
  Tabs,
  Descriptions,
  Badge,
  Tooltip,
  Switch
} from 'antd'
import { UserRole } from '@prisma/client'
import { useAuth } from '@/hooks/useAuth'
// No need for additional layout - admin layout is handled at route level

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: string
}

interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

interface UserPermissionDetail {
  user: User
  permissions: {
    effective: Array<{
      id: string
      name: string
      description?: string
      resource: string
      action: string
      granted: boolean
      source: 'role' | 'user' | 'system'
      reason?: string
      expiresAt?: string | null
    }>
    byResource: Record<string, any[]>
    userSpecific: any[]
    roleDefault: any[]
  }
  summary: {
    totalPermissions: number
    grantedPermissions: number
    userOverrides: number
    rolePermissions: number
  }
}

interface PermissionData {
  permissions: Permission[]
  rolePermissions: Record<string, Permission[]>
  resources: string[]
}

export default function PermissionManagement() {
  const { checkSpecificPermission, user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [permissionData, setPermissionData] = useState<PermissionData | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserPermissionDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'grant' | 'revoke'>('grant')
  const [form] = Form.useForm()

  // Check permissions
  const canManagePermissions = checkSpecificPermission('users:manage_permissions').granted
  const canViewUsers = checkSpecificPermission('users:read').granted

  useEffect(() => {
    if (canViewUsers) {
      loadUsers()
      loadPermissions()
    }
  }, [canViewUsers])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data.users)
      }
    } catch (error) {
      message.error('Failed to load users')
    }
  }

  const loadPermissions = async () => {
    try {
      const response = await fetch('/api/admin/permissions')
      if (response.ok) {
        const data = await response.json()
        setPermissionData(data.data)
      }
    } catch (error) {
      message.error('Failed to load permissions')
    }
  }

  const loadUserPermissions = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/permissions/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedUser(data.data)
      }
    } catch (error) {
      message.error('Failed to load user permissions')
    } finally {
      setLoading(false)
    }
  }

  const handleGrantPermission = async (values: any) => {
    try {
      const response = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser?.user.id,
          permissionName: values.permission,
          reason: values.reason,
          expiresAt: values.expiresAt?.toISOString()
        })
      })

      if (response.ok) {
        message.success('Permission granted successfully')
        setModalVisible(false)
        form.resetFields()
        if (selectedUser) {
          loadUserPermissions(selectedUser.user.id)
        }
      } else {
        const error = await response.json()
        message.error(error.message || 'Failed to grant permission')
      }
    } catch (error) {
      message.error('Failed to grant permission')
    }
  }

  const handleRevokePermission = async (values: any) => {
    try {
      const response = await fetch('/api/admin/permissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser?.user.id,
          permissionName: values.permission,
          reason: values.reason
        })
      })

      if (response.ok) {
        message.success('Permission revoked successfully')
        setModalVisible(false)
        form.resetFields()
        if (selectedUser) {
          loadUserPermissions(selectedUser.user.id)
        }
      } else {
        const error = await response.json()
        message.error(error.message || 'Failed to revoke permission')
      }
    } catch (error) {
      message.error('Failed to revoke permission')
    }
  }

  const openModal = (type: 'grant' | 'revoke') => {
    setModalType(type)
    setModalVisible(true)
  }

  const userColumns = [
    {
      title: 'User',
      key: 'user',
      render: (record: User) => (
        <div>
          <div><strong>{record.name || record.email}</strong></div>
          <div><Text type="secondary">{record.email}</Text></div>
        </div>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag color={role === 'SUPER_ADMIN' ? 'red' : role === 'ADMIN' ? 'blue' : 'default'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: User) => (
        <Button 
          size="small" 
          onClick={() => loadUserPermissions(record.id)}
          disabled={!canViewUsers}
        >
          View Permissions
        </Button>
      )
    }
  ]

  const permissionColumns = [
    {
      title: 'Permission',
      key: 'permission',
      render: (record: any) => (
        <div>
          <div><strong>{record.name}</strong></div>
          {record.description && <Text type="secondary">{record.description}</Text>}
        </div>
      )
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource: string) => <Tag>{resource}</Tag>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => <Tag color="blue">{action}</Tag>
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: any) => (
        <Badge 
          status={record.granted ? 'success' : 'error'} 
          text={record.granted ? 'Granted' : 'Denied'} 
        />
      )
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string, record: any) => (
        <Tooltip title={record.reason}>
          <Tag color={source === 'role' ? 'default' : source === 'user' ? 'orange' : 'purple'}>
            {source.toUpperCase()}
          </Tag>
        </Tooltip>
      )
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string | null) => 
        date ? new Date(date).toLocaleDateString() : <Text type="secondary">Never</Text>
    }
  ]

  if (!canViewUsers) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Access Denied</Title>
        <Paragraph>You don&apos;t have permission to view user permissions.</Paragraph>
      </div>
    )
  }

  return (
      <div style={{ padding: '20px' }}>
        <Title level={2}>Permission Management</Title>
        
        <Tabs defaultActiveKey="users">
          <TabPane tab="Users" key="users">
            <Card>
              <Table
                columns={userColumns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                loading={loading}
              />
            </Card>
          </TabPane>

          <TabPane tab="Permission System" key="system">
            <Card title="Available Permissions">
              {permissionData && (
                <div>
                  <Paragraph>
                    Total permissions: <strong>{permissionData.permissions.length}</strong>
                  </Paragraph>
                  <Paragraph>
                    Resources: {permissionData.resources.map(resource => 
                      <Tag key={resource}>{resource}</Tag>
                    )}
                  </Paragraph>
                  
                  <Table
                    columns={[
                      { title: 'Name', dataIndex: 'name', key: 'name' },
                      { title: 'Description', dataIndex: 'description', key: 'description' },
                      { title: 'Resource', dataIndex: 'resource', key: 'resource', render: (text: string) => <Tag>{text}</Tag> },
                      { title: 'Action', dataIndex: 'action', key: 'action', render: (text: string) => <Tag color="blue">{text}</Tag> }
                    ]}
                    dataSource={permissionData.permissions}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                    size="small"
                  />
                </div>
              )}
            </Card>
          </TabPane>
        </Tabs>

        {selectedUser && (
          <Card 
            title={`Permissions for ${selectedUser.user.name || selectedUser.user.email}`}
            style={{ marginTop: '20px' }}
            extra={
              canManagePermissions && (
                <Space>
                  <Button onClick={() => openModal('grant')}>Grant Permission</Button>
                  <Button onClick={() => openModal('revoke')}>Revoke Permission</Button>
                </Space>
              )
            }
          >
            <Descriptions bordered size="small" style={{ marginBottom: '20px' }}>
              <Descriptions.Item label="Email">{selectedUser.user.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={selectedUser.user.role === 'SUPER_ADMIN' ? 'red' : 
                           selectedUser.user.role === 'ADMIN' ? 'blue' : 'default'}>
                  {selectedUser.user.role}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Permissions">{selectedUser.summary.totalPermissions}</Descriptions.Item>
              <Descriptions.Item label="Granted">{selectedUser.summary.grantedPermissions}</Descriptions.Item>
              <Descriptions.Item label="User Overrides">{selectedUser.summary.userOverrides}</Descriptions.Item>
              <Descriptions.Item label="Role Permissions">{selectedUser.summary.rolePermissions}</Descriptions.Item>
            </Descriptions>

            <Table
              columns={permissionColumns}
              dataSource={selectedUser.permissions.effective}
              rowKey="name"
              pagination={{ pageSize: 20 }}
              size="small"
            />
          </Card>
        )}

        <Modal
          title={modalType === 'grant' ? 'Grant Permission' : 'Revoke Permission'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={modalType === 'grant' ? handleGrantPermission : handleRevokePermission}
          >
            <Form.Item
              name="permission"
              label="Permission"
              rules={[{ required: true, message: 'Please select a permission' }]}
            >
              <Select placeholder="Select permission">
                {permissionData?.permissions.map(perm => (
                  <Select.Option key={perm.name} value={perm.name}>
                    {perm.name} ({perm.resource}:{perm.action})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="reason" label="Reason">
              <TextArea placeholder="Optional reason for this action" />
            </Form.Item>

            {modalType === 'grant' && (
              <Form.Item name="expiresAt" label="Expires At">
                <DatePicker showTime placeholder="Optional expiration date" style={{ width: '100%' }} />
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {modalType === 'grant' ? 'Grant' : 'Revoke'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  )
}