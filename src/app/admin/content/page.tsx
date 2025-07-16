'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Popconfirm, 
  message, 
  Modal,
  Form,
  Typography,
  Card,
  DatePicker,
  Row,
  Col,
  Breadcrumb,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ExportOutlined,
  ImportOutlined,
  EyeOutlined,
  HomeOutlined,
  FileTextOutlined,
  FilterOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { Content, ContentQueryParams } from '@/lib/database';
import { motion } from '@/lib/modern-animations';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ContentTableProps {
  data: Content[];
  loading: boolean;
  total: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onEdit: (record: Content) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
  data,
  loading,
  total,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text: string, record: Content) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            /{record.slug}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'News', value: 'news' },
        { text: 'Service', value: 'service' },
        { text: 'Case Study', value: 'case-study' },
        { text: 'Success Story', value: 'success-story' },
        { text: 'Page', value: 'page' },
      ],
      render: (type: string) => {
        const colors = {
          news: 'blue',
          service: 'green',
          'case-study': 'purple',
          'success-story': 'orange',
          page: 'default'
        };
        return <Tag color={colors[type as keyof typeof colors]}>{type}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Published', value: 'published' },
        { text: 'Archived', value: 'archived' },
      ],
      render: (status: string, record: Content) => (
        <Select
          value={status}
          size="small"
          onChange={(value) => onStatusChange(record.id, value)}
          style={{ width: 100 }}
        >
          <Option value="draft">
            <Tag color="orange">Draft</Tag>
          </Option>
          <Option value="published">
            <Tag color="green">Published</Tag>
          </Option>
          <Option value="archived">
            <Tag color="red">Archived</Tag>
          </Option>
        </Select>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Content) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/preview/${record.id}`, '_blank')}
            title="Preview"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure to delete this content?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      onChange={onTableChange}
      rowKey="id"
      size="small"
    />
  );
};

export default function ContentManagementPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<ContentQueryParams>({
    page: 1,
    limit: 10,
    sort: 'updatedAt',
    order: 'desc'
  });
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch contents
  const fetchContents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/content?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setContents(data.data);
        setTotal(data.pagination.total);
      } else {
        message.error(data.error || 'Failed to fetch contents');
      }
    } catch (error) {
      message.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [filters]);

  // Handle table changes
  const handleTableChange = (pagination: any, tableFilters: any, sorter: any) => {
    const newFilters = {
      ...filters,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    if (sorter.field) {
      newFilters.sort = sorter.field;
      newFilters.order = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    if (tableFilters.type) {
      newFilters.type = tableFilters.type[0];
    }

    if (tableFilters.status) {
      newFilters.status = tableFilters.status[0];
    }

    setFilters(newFilters);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setFilters({
      ...filters,
      search: value,
      page: 1
    });
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('Status updated successfully');
        fetchContents();
      } else {
        message.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      message.error('Network error');
    }
  };

  // Handle edit
  const handleEdit = (record: Content) => {
    setEditingContent(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      type: record.type,
      status: record.status,
      excerpt: record.excerpt,
      tags: record.tags,
      category: record.category,
      seoTitle: record.seoTitle,
      seoDescription: record.seoDescription,
    });
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('Content deleted successfully');
        fetchContents();
      } else {
        message.error(data.error || 'Failed to delete content');
      }
    } catch (error) {
      message.error('Network error');
    }
  };

  // Handle form submit
  const handleSubmit = async (values: any) => {
    try {
      const url = editingContent 
        ? `/api/admin/content/${editingContent.id}`
        : '/api/admin/content';
      
      const method = editingContent ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Content ${editingContent ? 'updated' : 'created'} successfully`);
        setIsModalVisible(false);
        setEditingContent(null);
        form.resetFields();
        fetchContents();
      } else {
        message.error(data.error || 'Failed to save content');
      }
    } catch (error) {
      message.error('Network error');
    }
  };

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
          <FileTextOutlined />
          Content Management
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <motion.div 
        className="mb-6"
        initial="hidden"
        animate="fadeIn"
        transition={{ duration: 0.6 }}
      >
        <Title level={2}>Content Management</Title>
        <Text type="secondary">
          Manage all website content including news, services, case studies, and pages.
        </Text>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial="hiddenLeft"
        animate="slideLeft"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mb-4">
          <Row gutter={16} align="middle">
            <Col flex={1}>
              <Search
                placeholder="Search content..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
            </Col>
            <Col>
              <Select
                placeholder="Filter by type"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setFilters({ ...filters, type: value, page: 1 })}
              >
                <Option value="news">News</Option>
                <Option value="service">Service</Option>
                <Option value="case-study">Case Study</Option>
                <Option value="success-story">Success Story</Option>
                <Option value="page">Page</Option>
              </Select>
            </Col>
            <Col>
              <Select
                placeholder="Filter by status"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
              >
                <Option value="draft">Draft</Option>
                <Option value="published">Published</Option>
                <Option value="archived">Archived</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingContent(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                >
                  New Content
                </Button>
                <Button icon={<ImportOutlined />}>
                  Import
                </Button>
                <Button icon={<ExportOutlined />}>
                  Export
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Content Table */}
      <motion.div
        initial="hidden"
        animate="fadeIn"
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card>
          <ContentTable
            data={contents}
            loading={loading}
            total={total}
            pagination={{
              current: filters.page || 1,
              pageSize: filters.limit || 10,
            }}
            onTableChange={handleTableChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        title={editingContent ? 'Edit Content' : 'Create New Content'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingContent(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input placeholder="Enter content title" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Type is required' }]}
              >
                <Select placeholder="Select type">
                  <Option value="news">News</Option>
                  <Option value="service">Service</Option>
                  <Option value="case-study">Case Study</Option>
                  <Option value="success-story">Success Story</Option>
                  <Option value="page">Page</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="excerpt"
            label="Excerpt"
          >
            <Input.TextArea rows={2} placeholder="Brief description..." />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Content is required' }]}
          >
            <RichTextEditor
              placeholder="Enter content..."
              height={300}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Status is required' }]}
              >
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
              >
                <Input placeholder="Category" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select mode="tags" placeholder="Enter tags">
                  <Option value="sustainability">Sustainability</Option>
                  <Option value="climate">Climate</Option>
                  <Option value="carbon">Carbon</Option>
                  <Option value="energy">Energy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="seoTitle"
            label="SEO Title"
          >
            <Input placeholder="SEO title" />
          </Form.Item>

          <Form.Item
            name="seoDescription"
            label="SEO Description"
          >
            <Input.TextArea rows={2} placeholder="SEO description" />
          </Form.Item>

          <Form.Item
            name="featuredImage"
            label="Featured Image"
          >
            <FileUpload
              maxCount={1}
              accept="image/*"
              listType="picture-card"
              multiple={false}
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Additional Images"
          >
            <FileUpload
              maxCount={5}
              accept="image/*"
              listType="picture-card"
              multiple={true}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingContent ? 'Update' : 'Create'} Content
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}