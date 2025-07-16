'use client';

import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';

// 动态导入 ReactQuill 以避免 SSR 问题
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <Spin size="large" />,
});

// Quill 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // 粗体、斜体、下划线、删除线
  ['blockquote', 'code-block'],                     // 引用、代码块
  [{ 'header': 1 }, { 'header': 2 }],              // 标题
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // 有序、无序列表
  [{ 'script': 'sub'}, { 'script': 'super' }],     // 上标、下标
  [{ 'indent': '-1'}, { 'indent': '+1' }],         // 缩进
  [{ 'direction': 'rtl' }],                         // 文本方向
  [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // 标题
  [{ 'color': [] }, { 'background': [] }],          // 字体颜色、背景颜色
  [{ 'font': [] }],                                 // 字体
  [{ 'align': [] }],                                // 对齐方式
  ['clean'],                                        // 清除格式
  ['link', 'image', 'video'],                       // 链接、图片、视频
];

// 富文本编辑器配置
const editorModules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};

const editorFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'align', 'color', 'background',
  'script', 'code-block'
];

export interface RichTextEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  className?: string;
}

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = '请输入内容...', height = 300, disabled = false, className = '' }, ref) => {
    useImperativeHandle(ref, () => ({
      getContent: () => {
        return value || '';
      },
      setContent: (content: string) => {
        onChange?.(content);
      },
      focus: () => {
        // Focus functionality would need to be implemented differently
      },
      blur: () => {
        // Blur functionality would need to be implemented differently
      },
    }));

    // 处理内容变化
    const handleChange = (content: string) => {
      onChange?.(content);
    };

    // 自定义样式
    const editorStyle = {
      height: height,
      marginBottom: '42px', // 为工具栏留出空间
    };

    return (
      <div className={`rich-text-editor ${className}`}>
        <style jsx global>{`
          .ql-toolbar {
            border-top: 1px solid #e5e7eb;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            border-bottom: none;
            border-radius: 6px 6px 0 0;
            background: #fafafa;
          }
          
          .ql-container {
            border-bottom: 1px solid #e5e7eb;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 6px 6px;
            background: white;
          }
          
          .ql-editor {
            min-height: ${height - 42}px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .ql-editor.ql-blank::before {
            color: #9ca3af;
            font-style: normal;
          }
          
          .ql-toolbar .ql-stroke {
            fill: none;
            stroke: #6b7280;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-width: 2;
          }
          
          .ql-toolbar .ql-stroke.ql-fill {
            fill: #6b7280;
          }
          
          .ql-toolbar .ql-fill,
          .ql-toolbar .ql-stroke.ql-fill {
            fill: #6b7280;
          }
          
          .ql-toolbar button:hover,
          .ql-toolbar button:focus {
            color: #1f2937;
          }
          
          .ql-toolbar button.ql-active {
            color: #3b82f6;
          }
          
          .ql-toolbar .ql-picker-label:hover,
          .ql-toolbar .ql-picker-label.ql-active {
            color: #3b82f6;
          }
          
          .ql-snow .ql-picker-options {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .ql-snow .ql-picker-item:hover {
            background: #f3f4f6;
          }
          
          .ql-snow .ql-picker-item.ql-selected {
            background: #3b82f6;
            color: white;
          }
          
          .ql-snow .ql-tooltip {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .ql-snow .ql-tooltip::before {
            border-bottom: 6px solid white;
          }
          
          .ql-snow .ql-tooltip input[type=text] {
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 4px 8px;
          }
          
          .ql-snow .ql-tooltip a.ql-action::after {
            border-right: 1px solid #e5e7eb;
          }
          
          .ql-snow .ql-tooltip a.ql-remove::before {
            color: #ef4444;
          }
          
          .rich-text-editor.disabled .ql-toolbar {
            opacity: 0.5;
            pointer-events: none;
          }
          
          .rich-text-editor.disabled .ql-editor {
            background: #f9fafb;
            color: #6b7280;
            cursor: not-allowed;
          }
        `}</style>
        
        <ReactQuill
          value={value}
          onChange={handleChange}
          modules={editorModules}
          formats={editorFormats}
          placeholder={placeholder}
          readOnly={disabled}
          style={editorStyle}
          className={disabled ? 'disabled' : ''}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;