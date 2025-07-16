'use client'

import { useState, useEffect } from 'react'
import { 
  Button, 
  Typography, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Tabs, 
  Badge, 
  Descriptions,
  Switch,
  Tooltip,
  Space,
  Tag
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  PlusOutlined,
  KeyOutlined,
  SafetyOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import type { ColumnsType } from 'antd/es/table'
import { UserRole } from '@prisma/client'
import { useAuth } from '@/hooks/useAuth'

// 导入公共组件和工具
import { AdminTable, ActionColumnUtils } from '@/components/admin/common/AdminTable'
import { AdminFilters, FilterConfigs } from '@/components/admin/common/AdminFilters'
import { useAdminTable, AdminTableConfigs, FilterUtils } from '@/hooks/admin/useAdminTable'
import { TagRenderers, ColumnUtils, formatRelativeTime } from '@/lib/admin/admin-utils'

const { Title } = Typography
const { TabPane } = Tabs

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  emailVerified: string | null
  image: string | null
  createdAt: string
  updatedAt: string
  _count: {
    contents: number
  }
}

interface UserPermissionSummary {
  userId: string
  totalPermissions: number
  grantedPermissions: number
  userOverrides: number
  rolePermissions: number
  lastUpdated: string
}

export default function UsersManagementClient() {
  const router = useRouter()
  const { checkSpecificPermission, user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userPermissions, setUserPermissions] = useState<any>(null)
  const [permissionSummaries, setPermissionSummaries] = useState<UserPermissionSummary[]>([])
  const [form] = Form.useForm()

  // Permission checks
  const canManageUsers = checkSpecificPermission('users:write').granted || currentUser?.role === 'SUPER_ADMIN'
  const canManagePermissions = checkSpecificPermission('users:manage_permissions').granted
  const canViewPermissions = checkSpecificPermission('users:read').granted

  // 使用统一的admin table hook
  const {
    data: users,
    loading,
    pagination,
    filters,
    fetchData,
    setFilters,
    updatePagination,
    refresh,
    handleDelete
  } = useAdminTable<User>(AdminTableConfigs.users)

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    updatePagination({ current: page, pageSize })
    fetchData(page)
  }

  // 处理过滤器变化
  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    fetchData(1) // 重置到第一页
  }

  // 查看用户详情
  const handleView = (user: User) => {
    setSelectedUser(user)
    setViewModalVisible(true)
  }

  // 编辑用户
  const handleEdit = (user: User) => {
    setSelectedUser(user)
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setEditModalVisible(true)
  }

  // 查看权限
  const handleViewPermissions = async (user: User) => {
    if (!canViewPermissions) {
      message.error('No permission to view user permissions')
      return
    }

    setSelectedUser(user)
    setPermissionModalVisible(true)
    
    try {
      const response = await fetch(`/api/admin/permissions/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserPermissions(data.data)
      } else {
        message.error('Failed to load user permissions')
      }
    } catch (error) {
      message.error('Failed to load user permissions')
    }
  }

  // 管理权限
  const handleManagePermissions = (user: User) => {
    router.push(`/admin/permissions?userId=${user.id}`)
  }

  // 重置密码
  const handleResetPassword = async (user: User) => {
    if (!canManageUsers) {
      message.error('No permission to reset password')
      return
    }

    Modal.confirm({
      title: 'Reset Password',
      content: `Are you sure you want to reset password for ${user.name}? A temporary password will be generated.`,
      okText: 'Reset',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
            method: 'POST'
          })
          
          if (response.ok) {
            const result = await response.json()
            Modal.info({
              title: 'Password Reset Successfully',
              content: `Temporary password: ${result.data.temporaryPassword}`,
              width: 500
            })
          } else {
            message.error('Failed to reset password')
          }
        } catch (error) {
          message.error('Failed to reset password')
        }
      }
    })
  }

  // 切换用户状态
  const handleToggleUserStatus = async (user: User, enabled: boolean) => {
    if (!canManageUsers) {
      message.error('No permission to change user status')
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })

      if (response.ok) {
        message.success(`User ${enabled ? 'enabled' : 'disabled'} successfully`)
        refresh()
      } else {
        message.error('Failed to update user status')
      }
    } catch (error) {
      message.error('Failed to update user status')
    }
  }

  // 删除用户
  const handleDeleteUser = (user: User) => {
    handleDelete(user.id, user.name, () => {
      // 删除成功后的回调
      message.success('用户删除成功')
    })
  }

  // 创建用户
  const handleCreate = () => {
    form.resetFields()
    setCreateModalVisible(true)
  }

  // 提交创建用户
  const handleCreateSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('用户创建成功')
        setCreateModalVisible(false)
        form.resetFields()
        refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '创建失败')
      }
    } catch (error: any) {
      message.error(error.message || '创建用户失败')
    }
  }

  // 提交编辑用户
  const handleEditSubmit = async (values: any) => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        message.success('用户更新成功')
        setEditModalVisible(false)
        setSelectedUser(null)
        refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || '更新失败')
      }
    } catch (error: any) {
      message.error(error.message || '更新用户失败')
    }
  }

  // 表格列配置
  const columns: ColumnsType<User> = [
    ColumnUtils.idColumn,
    ColumnUtils.nameColumn(),
    ColumnUtils.emailColumn,
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: TagRenderers.userRole
    },
    {
      title: '邮箱验证',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      width: 100,
      render: (verified: string | null) => (
        <Badge 
          status={verified ? 'success' : 'error'} 
          text={verified ? '已验证' : '未验证'} 
        />
      )
    },
    {
      title: '内容数量',
      dataIndex: ['_count', 'contents'],
      key: 'contentCount',
      width: 100,
      sorter: (a, b) => a._count.contents - b._count.contents
    },
    {
      title: '最后活动',
      dataIndex: 'updatedAt',
      key: 'lastActivity',
      width: 120,
      render: formatRelativeTime,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
    },
    ColumnUtils.createdAtColumn,
    ActionColumnUtils.buildActionColumn([
      {
        key: 'view',
        label: '查看',
        icon: <EyeOutlined />,
        onClick: handleView
      },
      {
        key: 'permissions',
        label: '权限',
        icon: <KeyOutlined />,
        onClick: handleViewPermissions,
        disabled: !canViewPermissions
      },
      {
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />,
        onClick: handleEdit,
        disabled: !canManageUsers
      },
      {
        key: 'reset-password',
        label: '重置密码',
        icon: <SafetyOutlined />,
        onClick: handleResetPassword,
        disabled: !canManageUsers
      },
      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleDeleteUser,
        disabled: !canManageUsers
      }
    ])
  ]

  return (
    <div className="p-6">
      <Title level={2}>用户管理</Title>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              用户列表
            </span>
          } 
          key="users"
        >
          {/* 过滤器 */}
          <AdminFilters
            fields={FilterConfigs.users}
            values={filters}
            onChange={handleFiltersChange}
            onReset={() => {
              setFilters({})
              fetchData(1)
            }}
          />

          {/* 数据表格 */}
          <AdminTable
            data={users}
            loading={loading}
            pagination={pagination}
            columns={columns}
            onPageChange={handlePageChange}
            onRefresh={refresh}
            onAdd={canManageUsers ? handleCreate : undefined}
            addButtonText="新建用户"
            rowKey="id"
          />
        </TabPane>
      </Tabs>

      {/* 权限查看模态框 */}
      <Modal
        title={`${selectedUser?.name} - 权限详情`}
        open={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false)
          setUserPermissions(null)
        }}
        footer={[
          <Button key="manage" 
            type="primary" 
            onClick={() => handleManagePermissions(selectedUser!)}
            disabled={!canManagePermissions}
          >
            管理权限
          </Button>,
          <Button key="close" onClick={() => setPermissionModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {userPermissions && (
          <div className="space-y-4">
            <Descriptions bordered size="small">
              <Descriptions.Item label="总权限数" span={1}>
                {userPermissions.summary.totalPermissions}
              </Descriptions.Item>
              <Descriptions.Item label="已授权" span={1}>
                <Badge count={userPermissions.summary.grantedPermissions} 
                       style={{ backgroundColor: '#52c41a' }} />
              </Descriptions.Item>
              <Descriptions.Item label="用户覆盖" span={1}>
                <Badge count={userPermissions.summary.userOverrides} 
                       style={{ backgroundColor: '#faad14' }} />
              </Descriptions.Item>
              <Descriptions.Item label="角色权限" span={3}>
                <Badge count={userPermissions.summary.rolePermissions} 
                       style={{ backgroundColor: '#1890ff' }} />
              </Descriptions.Item>
            </Descriptions>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(userPermissions.permissions.byResource).map(([resource, perms]: [string, any]) => (
                <div key={resource} className="border rounded p-3">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Tag color="blue">{resource}</Tag>
                    <span className="text-sm text-gray-500">
                      ({(perms as any[]).filter(p => p.granted).length}/{(perms as any[]).length})
                    </span>
                  </h4>
                  <div className="space-y-1">
                    {(perms as any[]).map((perm: any) => (
                      <div key={perm.name} className="flex items-center justify-between text-sm">
                        <span>{perm.action}</span>
                        <div className="flex items-center space-x-2">
                          <Badge status={perm.granted ? 'success' : 'error'} />
                          <Tag color={
                            perm.source === 'role' ? 'blue' : 
                            perm.source === 'user' ? 'orange' : 'purple'
                          }>
                            {perm.source}
                          </Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* 创建用户模态框 */}
      <Modal
        title="创建用户"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码', min: 8 }]}
          >
            <Input.Password placeholder="请输入密码（至少8位）" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              <Select.Option value="USER">用户</Select.Option>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="SUPER_ADMIN">超级管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setCreateModalVisible(false)} className="mr-2">
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              创建
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="选择角色">
              <Select.Option value="USER">用户</Select.Option>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="SUPER_ADMIN">超级管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setEditModalVisible(false)} className="mr-2">
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              更新
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看用户详情模态框 */}
      <Modal
        title="用户详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <div className="mt-1 text-sm text-gray-900">{selectedUser.id}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">姓名</label>
                <div className="mt-1 text-sm text-gray-900">{selectedUser.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">邮箱</label>
                <div className="mt-1 text-sm text-gray-900">{selectedUser.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">角色</label>
                <div className="mt-1">{TagRenderers.userRole(selectedUser.role)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">邮箱验证</label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedUser.emailVerified ? '已验证' : '未验证'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">内容数量</label>
                <div className="mt-1 text-sm text-gray-900">{selectedUser._count.contents}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">创建时间</label>
                <div className="mt-1 text-sm text-gray-900">{formatRelativeTime(selectedUser.createdAt)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">更新时间</label>
                <div className="mt-1 text-sm text-gray-900">{formatRelativeTime(selectedUser.updatedAt)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}