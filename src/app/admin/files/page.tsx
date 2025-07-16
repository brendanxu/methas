'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  message, 
  Modal,
  Form,
  Typography,
  Card,
  Row,
  Col,
  Breadcrumb,
  Image,
  Popconfirm,
  Tag,
  Statistic,
  Upload
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  HomeOutlined,
  FileOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { File, FileQueryParams } from '@/lib/database';
import { motion } from '@/lib/modern-animations';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 文件类型图标映射
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <PictureOutlined style={{ color: '#52c41a', fontSize: 20 }} />;
  } else if (mimeType.startsWith('video/')) {
    return <VideoCameraOutlined style={{ color: '#fa8c16', fontSize: 20 }} />;
  } else if (mimeType === 'application/pdf') {
    return <FilePdfOutlined style={{ color: '#f5222d', fontSize: 20 }} />;
  } else if (mimeType.startsWith('text/')) {
    return <FileTextOutlined style={{ color: '#1890ff', fontSize: 20 }} />;
  } else {
    return <FileOutlined style={{ color: '#8c8c8c', fontSize: 20 }} />;
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 获取文件类型标签
const getFileTypeTag = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Tag color="green">图片</Tag>;
  } else if (mimeType.startsWith('video/')) {
    return <Tag color="orange">视频</Tag>;
  } else if (mimeType === 'application/pdf') {
    return <Tag color="red">PDF</Tag>;
  } else if (mimeType.startsWith('text/')) {
    return <Tag color="blue">文本</Tag>;
  } else {
    return <Tag color="default">其他</Tag>;
  }
};

interface FileTableProps {
  data: File[];
  loading: boolean;
  total: number;
  pagination: {
    current: number;
    pageSize: number;
  };
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
  onDelete: (id: string) => void;
  onEdit: (record: File) => void;
}

const FileTable: React.FC<FileTableProps> = ({
  data,
  loading,
  total,
  pagination,
  onTableChange,
  onDelete,
  onEdit
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = (file: File) => {
    if (file.mimeType.startsWith('image/')) {
      setPreviewImage(file.url);
      setPreviewTitle(file.originalName);
      setPreviewVisible(true);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const columns = [
    {
      title: '文件',
      dataIndex: 'filename',
      key: 'filename',
      render: (text: string, record: File) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {getFileIcon(record.mimeType)}
          <div>
            <div style={{ fontWeight: 500 }}>{record.originalName}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.filename}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'mimeType',
      key: 'mimeType',
      width: 100,
      render: (mimeType: string) => getFileTypeTag(mimeType),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      sorter: true,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '上传时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: true,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (record: File) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            title="预览"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => window.open(record.url, '_blank')}
            title="下载"
          />
          <Popconfirm
            title="确定要删除这个文件吗？"
            onConfirm={() => onDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
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
      
      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
        }}
      >
        <Image src={previewImage} style={{ display: 'none' }} alt="Preview" />
      </Image.PreviewGroup>
    </>
  );
};

export default function FilesManagementPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState<FileQueryParams>({
    page: 1,
    limit: 20,
    sort: 'createdAt',
    order: 'desc'
  });

  // 获取文件列表
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/files?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setFiles(data.data);
        setTotal(data.pagination.total);
      } else {
        message.error(data.error || 'Failed to fetch files');
      }
    } catch (error) {
      message.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [filters]);

  // 处理表格变化
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

    setFilters(newFilters);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setFilters({
      ...filters,
      search: value,
      page: 1
    });
  };

  // 处理文件上传
  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/files', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`${file.name} 上传成功`);
        onSuccess();
        fetchFiles();
      } else {
        message.error(data.error || 'Upload failed');
        onError();
      }
    } catch (error) {
      message.error('Network error');
      onError();
    } finally {
      setUploading(false);
    }
  };

  // 处理文件删除
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/files/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('File deleted successfully');
        fetchFiles();
      } else {
        message.error(data.error || 'Failed to delete file');
      }
    } catch (error) {
      message.error('Network error');
    }
  };

  return (
    <div>
      {/* 面包屑导航 */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FolderOpenOutlined />
          File Management
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* 页面标题 */}
      <motion.div 
        className="mb-6"
        initial="hidden"
        animate="fadeIn"
        transition={{ duration: 0.6 }}
      >
        <Title level={2}>文件管理</Title>
        <Text type="secondary">
          管理网站中的所有文件资源，包括图片、视频、文档等。
        </Text>
      </motion.div>

      {/* 统计信息 */}
      <motion.div
        initial="hiddenLeft"
        animate="slideLeft"
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic title="总文件数" value={total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="图片文件" 
                value={files.filter(f => f.mimeType.startsWith('image/')).length} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="视频文件" 
                value={files.filter(f => f.mimeType.startsWith('video/')).length} 
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic 
                title="文档文件" 
                value={files.filter(f => f.mimeType === 'application/pdf' || f.mimeType.startsWith('text/')).length} 
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* 控制栏 */}
      <motion.div
        initial="hiddenLeft"
        animate="slideLeft"
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="mb-4">
          <Row gutter={16} align="middle">
            <Col flex={1}>
              <Search
                placeholder="搜索文件..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
            </Col>
            <Col>
              <Select
                placeholder="文件类型"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setFilters({ ...filters, mimeType: value, page: 1 })}
              >
                <Option value="image/">图片</Option>
                <Option value="video/">视频</Option>
                <Option value="application/pdf">PDF</Option>
                <Option value="text/">文本</Option>
              </Select>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setUploadModalVisible(true)}
              >
                上传文件
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* 文件表格 */}
      <motion.div
        initial="hidden"
        animate="fadeIn"
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <FileTable
            data={files}
            loading={loading}
            total={total}
            pagination={{
              current: filters.page || 1,
              pageSize: filters.limit || 20,
            }}
            onTableChange={handleTableChange}
            onDelete={handleDelete}
            onEdit={(record) => {
              // TODO: 实现文件编辑功能
              console.log('Edit file:', record);
            }}
          />
        </Card>
      </motion.div>

      {/* 上传模态框 */}
      <Modal
        title="上传文件"
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Upload.Dragger
          name="file"
          multiple
          customRequest={handleUpload}
          showUploadList={true}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.md"
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传。支持图片、视频、PDF、文档等格式。
          </p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
}