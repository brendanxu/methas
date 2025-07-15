'use client'

import { useState } from 'react'
import { Button, Typography, Modal, Form, Input, Select, message } from 'antd'
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import type { ColumnsType } from 'antd/es/table'

// 导入公共组件和工具
import { AdminTable, ActionColumnUtils } from '@/components/admin/common/AdminTable'
import { AdminFilters, FilterConfigs } from '@/components/admin/common/AdminFilters'
import { useAdminTable, AdminTableConfigs, FilterUtils } from '@/hooks/admin/useAdminTable'
import { TagRenderers, ColumnUtils, formatRelativeTime } from '@/lib/admin/admin-utils'

const { Title } = Typography

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

export default function UsersManagementClient() {
  const router = useRouter()
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [form] = Form.useForm()

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
      render: (verified: string | null) => verified ? '已验证' : '未验证'
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
        key: 'edit',
        label: '编辑',
        icon: <EditOutlined />,
        onClick: handleEdit
      },
      {
        key: 'delete',
        label: '删除',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: handleDeleteUser
      }
    ])
  ]

  return (
    <div className="p-6">
      <Title level={2}>用户管理</Title>
      
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
        onAdd={handleCreate}
        addButtonText="新建用户"
        rowKey="id"
      />

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