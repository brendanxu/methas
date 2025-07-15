import { Tag } from 'antd'
import React from 'react'

// 状态标签配置
export interface TagConfig {
  color: string
  text: string
}

// 用户角色标签配置
export const UserRoleTags: Record<string, TagConfig> = {
  USER: { color: 'default', text: '用户' },
  ADMIN: { color: 'blue', text: '管理员' },
  SUPER_ADMIN: { color: 'red', text: '超级管理员' }
}

// 内容类型标签配置
export const ContentTypeTags: Record<string, TagConfig> = {
  NEWS: { color: 'blue', text: '新闻' },
  CASE_STUDY: { color: 'green', text: '案例研究' },
  SERVICE: { color: 'orange', text: '服务' },
  PAGE: { color: 'purple', text: '页面' }
}

// 内容状态标签配置
export const ContentStatusTags: Record<string, TagConfig> = {
  DRAFT: { color: 'default', text: '草稿' },
  PUBLISHED: { color: 'green', text: '已发布' },
  ARCHIVED: { color: 'volcano', text: '已归档' }
}

// 表单类型标签配置
export const FormTypeTags: Record<string, TagConfig> = {
  CONTACT: { color: 'blue', text: '联系表单' },
  CONSULTATION: { color: 'green', text: '咨询表单' },
  NEWSLETTER: { color: 'orange', text: '邮件订阅' }
}

// 表单状态标签配置
export const FormStatusTags: Record<string, TagConfig> = {
  NEW: { color: 'processing', text: '新提交' },
  PROCESSED: { color: 'warning', text: '已处理' },
  REPLIED: { color: 'success', text: '已回复' },
  ARCHIVED: { color: 'default', text: '已归档' }
}

// 文件分类标签配置
export const FileCategoryTags: Record<string, TagConfig> = {
  IMAGE: { color: 'blue', text: '图片' },
  DOCUMENT: { color: 'green', text: '文档' },
  AVATAR: { color: 'orange', text: '头像' }
}

// 文件类型标签配置
export const FileTypeTags: Record<string, TagConfig> = {
  avatar: { color: 'orange', text: '头像' },
  content: { color: 'blue', text: '内容' },
  document: { color: 'green', text: '文档' }
}

// 通用标签渲染函数
export function renderTag(
  value: string, 
  tagConfig: Record<string, TagConfig>,
  defaultConfig: TagConfig = { color: 'default', text: value }
): React.ReactElement {
  const config = tagConfig[value] || defaultConfig
  return React.createElement(Tag, { color: config.color }, config.text)
}

// 预设的标签渲染器
export const TagRenderers = {
  userRole: (role: string) => renderTag(role, UserRoleTags),
  contentType: (type: string) => renderTag(type, ContentTypeTags),
  contentStatus: (status: string) => renderTag(status, ContentStatusTags),
  formType: (type: string) => renderTag(type, FormTypeTags),
  formStatus: (status: string) => renderTag(status, FormStatusTags),
  fileCategory: (category: string) => renderTag(category, FileCategoryTags),
  fileType: (type: string) => renderTag(type, FileTypeTags)
}

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// 日期格式化
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 相对时间格式化
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return formatDate(date)
  }
}

// 文本截断
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// JSON数据美化显示
export function formatJsonData(data: any): string {
  try {
    if (typeof data === 'string') {
      return JSON.stringify(JSON.parse(data), null, 2)
    }
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

// 常用的表格列配置生成器
export const ColumnUtils = {
  // ID列
  idColumn: {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 100,
    ellipsis: true
  },

  // 名称列
  nameColumn: (dataIndex = 'name', title = '名称') => ({
    title,
    dataIndex,
    key: dataIndex,
    ellipsis: true
  }),

  // 邮箱列
  emailColumn: {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    ellipsis: true
  },

  // 创建时间列
  createdAtColumn: {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 160,
    render: (date: string) => formatDate(date),
    sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  },

  // 更新时间列
  updatedAtColumn: {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 160,
    render: (date: string) => formatDate(date),
    sorter: (a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  },

  // 文件大小列
  fileSizeColumn: {
    title: '文件大小',
    dataIndex: 'size',
    key: 'size',
    width: 100,
    render: (size: number) => formatFileSize(size),
    sorter: (a: any, b: any) => a.size - b.size
  }
}

// 搜索高亮工具
export function highlightSearchText(text: string, searchText: string): React.ReactNode {
  if (!searchText || !text) return text
  
  const regex = new RegExp(`(${searchText})`, 'gi')
  const parts = text.split(regex)
  
  return React.createElement(
    'span',
    {},
    ...parts.map((part, index) =>
      regex.test(part) 
        ? React.createElement('mark', { key: index, style: { backgroundColor: '#ffeaa7' } }, part)
        : part
    )
  )
}

// 导出功能工具
export const ExportUtils = {
  // 导出CSV
  exportToCSV: (data: any[], filename: string, columns: string[]) => {
    const csvContent = [
      columns.join(','),
      ...data.map(row => 
        columns.map(col => {
          const value = row[col]
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        }).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },

  // 导出JSON
  exportToJSON: (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}