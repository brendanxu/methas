'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, Upload, message, Space, Tooltip } from 'antd'
import { 
  DownloadIcon, 
  ShareIcon, 
  PlusIcon, 
  MinusIcon,
  UploadIcon
} from '@/components/icons/LightweightIcons'

// 动态导入React-Quill，避免SSR问题
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

// 引入样式
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  maxHeight?: number
  readOnly?: boolean
  onSave?: () => void
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '请输入内容...',
  height = 400,
  maxHeight = 600,
  readOnly = false,
  onSave,
  className = ''
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算字数
  useEffect(() => {
    if (value) {
      const textContent = value.replace(/<[^>]*>/g, '')
      setWordCount(textContent.length)
    } else {
      setWordCount(0)
    }
  }, [value])

  // 全屏切换
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
    }
  }

  // 插入图片
  const insertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        // 文件大小检查 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          message.error('图片大小不能超过10MB')
          return
        }
        
        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const { url } = await response.json()
            const quillComponent = editorRef.current?.querySelector('.ql-editor')
            if (quillComponent) {
              // For ReactQuill, we need to get the Quill instance differently
              const reactQuillInstance = editorRef.current?.firstChild as any
              const quill = reactQuillInstance?.getEditor?.()
              if (quill) {
                const range = quill.getSelection()
                quill.insertEmbed(range?.index || 0, 'image', url)
                message.success('图片上传成功')
              }
            }
          } else {
            const errorData = await response.json()
            message.error(errorData.error || '图片上传失败')
          }
        } catch (error) {
          message.error('图片上传失败')
        }
      }
    }
    input.click()
  }

  // 插入链接
  const insertLink = () => {
    const url = prompt('请输入链接地址:')
    if (url) {
      const reactQuillInstance = editorRef.current?.firstChild as any
      const quill = reactQuillInstance?.getEditor?.()
      if (quill) {
        const range = quill.getSelection()
        if (range) {
          quill.insertText(range.index, url, 'link', url)
        }
      }
    }
  }

  // 自定义工具栏
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'image': insertImage,
        'link': insertLink
      }
    },
    clipboard: {
      matchVisual: false
    }
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'sub', 'super',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align', 'direction',
    'link', 'image', 'video'
  ]

  const editorStyle = {
    height: isFullscreen ? '100vh' : `${height}px`,
    maxHeight: isFullscreen ? 'none' : `${maxHeight}px`,
    fontSize: '14px'
  }

  return (
    <div 
      ref={containerRef}
      className={`rich-text-editor ${className} ${isFullscreen ? 'fullscreen' : ''}`}
      style={isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'white'
      } : {}}
    >
      {/* 工具栏 */}
      <div className="editor-toolbar flex justify-between items-center p-2 border-b bg-gray-50">
        <Space>
          <Tooltip title="插入图片">
            <Button 
              icon={<DownloadIcon />} 
              size="small" 
              onClick={insertImage}
              disabled={readOnly}
            />
          </Tooltip>
          <Tooltip title="插入链接">
            <Button 
              icon={<ShareIcon />} 
              size="small" 
              onClick={insertLink}
              disabled={readOnly}
            />
          </Tooltip>
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏编辑'}>
            <Button 
              icon={isFullscreen ? <MinusIcon /> : <PlusIcon />} 
              size="small" 
              onClick={toggleFullscreen}
            />
          </Tooltip>
          {onSave && (
            <Tooltip title="保存">
              <Button 
                icon={<DownloadIcon />} 
                size="small" 
                type="primary" 
                onClick={onSave}
              />
            </Tooltip>
          )}
        </Space>
        
        <div className="text-sm text-gray-500">
          字数: {wordCount}
        </div>
      </div>

      {/* 编辑器 */}
      <div className="editor-container" style={{ height: isFullscreen ? 'calc(100vh - 60px)' : 'auto' }}>
        <div ref={editorRef}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            readOnly={readOnly}
            style={editorStyle}
          />
        </div>
      </div>

      {/* 自定义样式 */}
      <style jsx>{`
        .rich-text-editor .ql-editor {
          min-height: ${height - 80}px;
          max-height: ${maxHeight - 80}px;
          overflow-y: auto;
        }
        
        .rich-text-editor.fullscreen .ql-editor {
          min-height: calc(100vh - 140px);
          max-height: none;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
        }
        
        .rich-text-editor .ql-container {
          border-bottom: none;
          border-left: none;
          border-right: none;
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #999;
        }
      `}</style>
    </div>
  )
}