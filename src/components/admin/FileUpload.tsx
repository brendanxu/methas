'use client';

import React, { useState, useCallback } from 'react';
import { Upload, message, Button, Image, Progress, Card } from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  FileOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FilePdfOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload';

interface FileUploadProps {
  value?: string[];
  onChange?: (fileUrls: string[]) => void;
  maxCount?: number;
  maxSize?: number; // MB
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  multiple?: boolean;
  disabled?: boolean;
  showUploadList?: boolean;
  className?: string;
}

// 文件类型图标映射
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return <PictureOutlined style={{ color: '#52c41a' }} />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <VideoCameraOutlined style={{ color: '#fa8c16' }} />;
    case 'pdf':
      return <FilePdfOutlined style={{ color: '#f5222d' }} />;
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
      return <FileTextOutlined style={{ color: '#1890ff' }} />;
    default:
      return <FileOutlined style={{ color: '#8c8c8c' }} />;
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

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  onChange,
  maxCount = 10,
  maxSize = 10, // 10MB
  accept = 'image/*,video/*,.pdf,.doc,.docx,.txt,.md',
  listType = 'picture-card',
  multiple = true,
  disabled = false,
  showUploadList = true,
  className = ''
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 自定义上传处理
  const customRequest = useCallback(async ({ file, onSuccess, onError, onProgress }: any) => {
    setUploading(true);
    
    try {
      // 这里应该是实际的文件上传逻辑
      // 模拟上传过程
      const formData = new FormData();
      formData.append('file', file);
      
      // 模拟上传进度
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress({ percent: progress });
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // 模拟上传成功
          const mockUrl = URL.createObjectURL(file);
          onSuccess({
            url: mockUrl,
            name: file.name,
            size: file.size,
            type: file.type
          });
          
          // 更新文件列表
          const newUrls = [...value, mockUrl];
          onChange?.(newUrls);
          
          message.success(`${file.name} 上传成功`);
        }
      }, 100);
      
    } catch (error) {
      onError(error);
      message.error(`${file.name} 上传失败`);
    } finally {
      setUploading(false);
    }
  }, [value, onChange]);

  // 文件上传前验证
  const beforeUpload = (file: File) => {
    const isValidType = accept.includes(file.type) || 
                       accept.includes('*') || 
                       accept.split(',').some(type => file.type.includes(type.replace('*', '')));
    
    if (!isValidType) {
      message.error('文件类型不支持');
      return false;
    }
    
    const isValidSize = file.size / 1024 / 1024 < maxSize;
    if (!isValidSize) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }
    
    if (value.length >= maxCount) {
      message.error(`最多只能上传 ${maxCount} 个文件`);
      return false;
    }
    
    return true;
  };

  // 处理文件移除
  const handleRemove = (file: UploadFile) => {
    const newUrls = value.filter(url => url !== file.url);
    onChange?.(newUrls);
    message.success('文件已删除');
  };

  // 处理预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    
    setPreviewImage(file.url || file.preview || '');
    setPreviewVisible(true);
    setPreviewTitle(file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : ''));
  };

  // 转换为base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 渲染上传按钮
  const uploadButton = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <UploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
      <div style={{ marginTop: 8, color: '#666' }}>
        {uploading ? '上传中...' : '点击上传'}
      </div>
    </div>
  );

  // 自定义文件列表项
  const customItemRender = (originNode: React.ReactElement, file: UploadFile) => {
    const isImage = file.type?.startsWith('image/');
    
    return (
      <Card 
        size="small" 
        className="file-item"
        actions={[
          <EyeOutlined key="preview" onClick={() => handlePreview(file)} />,
          <DeleteOutlined key="delete" onClick={() => handleRemove(file)} />
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isImage ? (
            <Image
              src={file.url || file.thumbUrl}
              alt={file.name}
              width={40}
              height={40}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          ) : (
            <div style={{ fontSize: 32 }}>
              {getFileIcon(file.name || '')}
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 500, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {file.name}
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {file.size ? formatFileSize(file.size) : ''}
            </div>
            {file.status === 'uploading' && (
              <Progress 
                percent={file.percent} 
                size="small" 
                showInfo={false}
                style={{ marginTop: 4 }}
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  const uploadProps: UploadProps = {
    customRequest,
    beforeUpload,
    onRemove: handleRemove,
    onPreview: handlePreview,
    multiple,
    listType,
    showUploadList: showUploadList ? {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    } : false,
    disabled,
    accept,
    maxCount,
    fileList: value.map((url, index) => ({
      uid: `${index}`,
      name: url.split('/').pop() || `file-${index}`,
      status: 'done' as const,
      url: url,
    })),
  };

  return (
    <div className={`file-upload ${className}`}>
      <style jsx global>{`
        .file-upload .ant-upload-select-picture-card {
          width: 104px;
          height: 104px;
          border: 2px dashed #d9d9d9;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        
        .file-upload .ant-upload-select-picture-card:hover {
          border-color: #1890ff;
        }
        
        .file-upload .ant-upload-list-picture-card-container {
          width: 104px;
          height: 104px;
        }
        
        .file-upload .ant-upload-list-picture-card .ant-upload-list-item {
          width: 104px;
          height: 104px;
          border-radius: 6px;
        }
        
        .file-upload .file-item {
          width: 200px;
          margin-bottom: 8px;
        }
        
        .file-upload .file-item .ant-card-actions {
          margin: 0;
          padding: 8px;
          background: #fafafa;
          border-top: 1px solid #e8e8e8;
        }
        
        .file-upload .file-item .ant-card-actions > li {
          margin: 0;
          padding: 0 8px;
        }
        
        .file-upload .file-item .ant-card-actions > li > span {
          color: #666;
          cursor: pointer;
          transition: color 0.3s;
        }
        
        .file-upload .file-item .ant-card-actions > li > span:hover {
          color: #1890ff;
        }
        
        .file-upload .file-item .ant-card-actions > li:last-child > span:hover {
          color: #f5222d;
        }
      `}</style>
      
      <Upload {...uploadProps}>
        {value.length >= maxCount ? null : uploadButton}
      </Upload>
      
      {/* 预览模态框 */}
      <Image.PreviewGroup
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
        }}
      >
        <Image src={previewImage} style={{ display: 'none' }} alt="Preview" />
      </Image.PreviewGroup>
    </div>
  );
};

export default FileUpload;