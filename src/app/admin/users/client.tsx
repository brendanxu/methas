'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Tag, Space, Modal, message, Input, Typography, Tooltip, Form, Select, Avatar } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  KeyOutlined,
  SearchOutlined,
  UserOutlined,
  MailOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import FileUpload from '@/components/ui/FileUpload'

const { Title } = Typography
const { Search } = Input

interface User {
  id: string
  name: string | null
  email: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  emailVerified: Date | null
  image: string | null
  createdAt: string
  updatedAt: string
  _count: {
    contents: number
  }
}

export default function UserManagementClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })
  const [filters, setFilters] = useState({
    role: undefined as string | undefined,
    search: ''
  })

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...(filters.role && { role: filters.role }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/users?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(prev => ({
          ...prev,
          current: page,
          total: data.pagination.total
        }))
      } else {
        message.error('获取用户列表失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [pagination.pageSize, filters.role, filters.search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    fetchUsers(1)
  }

  const handleCreateUser = async (values: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('用户创建成功')
        setCreateModalVisible(false)
        form.resetFields()
        fetchUsers(pagination.current)
      } else {
        const error = await response.json()
        message.error(error.error || '创建失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    }
  }

  const handleUpdateUser = async (values: any) => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        message.success('用户更新成功')
        setEditModalVisible(false)
        editForm.resetFields()
        fetchUsers(pagination.current)
      } else {
        const error = await response.json()
        message.error(error.error || '更新失败')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
    }
  }

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${user.name || user.email}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            message.success('删除成功')
            fetchUsers(pagination.current)
          } else {
            const error = await response.json()
            message.error(error.error || '删除失败')
          }
        } catch (error) {
          message.error('网络错误，请稍后重试')
        }
      }
    })
  }

  const getRoleTag = (role: string) => {
    const config = {
      USER: { color: 'default', text: '普通用户' },
      ADMIN: { color: 'blue', text: '管理员' },
      SUPER_ADMIN: { color: 'purple', text: '超级管理员' }
    }
    const { color, text } = config[role as keyof typeof config] || { color: 'default', text: role }
    return <Tag color={color}>{text}</Tag>
  }

  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      key: 'userInfo',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={48}
            src={record.image}
            icon={<UserOutlined />}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{record.name || '未设置姓名'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <MailOutlined />
              <span>{record.email}</span>
              {record.emailVerified && (
                <Tag color="green" className="ml-2">已验证</Tag>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => getRoleTag(role),
    },
    {
      title: '内容数量',
      key: 'contentCount',
      width: 100,
      render: (_, record) => (
        <Tooltip title="该用户创建的内容数量">
          <span>{record._count.contents}</span>
        </Tooltip>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record)
              editForm.setFieldsValue({
                name: record.name,
                email: record.email,
                role: record.role,
                image: record.image,
              })
              setEditModalVisible(true)
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => {
              setSelectedUser(record)
              editForm.resetFields()
              editForm.setFieldsValue({ password: '' })
              setEditModalVisible(true)
            }}
          >
            重置密码
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const roleOptions = [
    { label: '全部角色', value: undefined },
    { label: '普通用户', value: 'USER' },
    { label: '管理员', value: 'ADMIN' },
    { label: '超级管理员', value: 'SUPER_ADMIN' }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>用户管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          新建用户
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Select
          style={{ width: 150 }}
          placeholder="选择角色"
          value={filters.role}
          onChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
          options={roleOptions}
        />
        <Search
          placeholder="搜索用户名或邮箱..."
          style={{ width: 300 }}
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
        />
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPagination(prev => ({ ...prev, pageSize }))
            fetchUsers(page)
          },
        }}
      />

      {/* 创建用户弹窗 */}
      <Modal
        title="新建用户"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入用户姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少8个字符' }
            ]}
          >
            <Input.Password placeholder="至少8个字符" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
            initialValue="USER"
          >
            <Select>
              <Select.Option value="USER">普通用户</Select.Option>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="SUPER_ADMIN">超级管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => setCreateModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          editForm.resetFields()
          setSelectedUser(null)
        }}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateUser}
        >
          <Form.Item
            name="image"
            label="头像"
          >
            <FileUpload
              category="avatar"
              accept="image/*"
              maxSize={2}
              showPreview={true}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="姓名"
          >
            <Input placeholder="请输入用户姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { min: 8, message: '密码至少8个字符' }
            ]}
          >
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
          >
            <Select>
              <Select.Option value="USER">普通用户</Select.Option>
              <Select.Option value="ADMIN">管理员</Select.Option>
              <Select.Option value="SUPER_ADMIN">超级管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setEditModalVisible(false)
                editForm.resetFields()
                setSelectedUser(null)
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                更新
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}