'use client'

import React from 'react'
import { Table, Button, Space, TableProps } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { PaginationConfig } from '@/hooks/admin/useAdminTable'

// 通用操作按钮配置
export interface ActionConfig {
  key: string
  label: string
  icon?: React.ReactNode
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  danger?: boolean
  disabled?: boolean
  onClick: (record: any) => void
}

// 表格配置接口
export interface AdminTableProps<T = any> {
  // 数据相关
  data: T[]
  loading: boolean
  pagination: PaginationConfig
  columns: ColumnsType<T>
  
  // 操作相关
  title?: string
  onRefresh?: () => void
  onAdd?: () => void
  addButtonText?: string
  showAddButton?: boolean
  showRefreshButton?: boolean
  
  // 分页相关
  onPageChange?: (page: number, pageSize: number) => void
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  showTotal?: boolean
  
  // 表格配置
  rowKey?: string | ((record: T) => string)
  size?: 'small' | 'middle' | 'large'
  scroll?: { x?: number; y?: number }
  bordered?: boolean
  
  // 额外的表格属性
  tableProps?: Omit<TableProps<T>, 'dataSource' | 'loading' | 'pagination' | 'columns'>
}

export function AdminTable<T extends Record<string, any>>({
  data,
  loading,
  pagination,
  columns,
  title,
  onRefresh,
  onAdd,
  addButtonText = '新建',
  showAddButton = true,
  showRefreshButton = true,
  onPageChange,
  showQuickJumper = true,
  showSizeChanger = true,
  showTotal = true,
  rowKey = 'id',
  size = 'middle',
  scroll,
  bordered = false,
  tableProps = {}
}: AdminTableProps<T>) {
  
  // 构建分页配置
  const paginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showQuickJumper,
    showSizeChanger,
    showTotal: showTotal ? (total: number, range: [number, number]) => 
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条` : undefined,
    pageSizeOptions: ['10', '20', '50', '100'],
    onChange: (page: number, pageSize: number) => {
      onPageChange?.(page, pageSize)
    },
    onShowSizeChange: (current: number, size: number) => {
      onPageChange?.(1, size) // 改变页面大小时重置到第一页
    }
  }

  return (
    <div className="admin-table-container">
      {/* 表格头部操作栏 */}
      {(title || showAddButton || showRefreshButton) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
          </div>
          
          <Space>
            {showRefreshButton && (
              <Button 
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
              >
                刷新
              </Button>
            )}
            
            {showAddButton && onAdd && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={onAdd}
              >
                {addButtonText}
              </Button>
            )}
          </Space>
        </div>
      )}

      {/* 数据表格 */}
      <Table<T>
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={paginationConfig}
        rowKey={rowKey}
        size={size}
        scroll={scroll}
        bordered={bordered}
        locale={{
          emptyText: loading ? '加载中...' : '暂无数据',
          filterReset: '重置',
          filterConfirm: '确定',
          filterEmptyText: '无筛选项',
          selectAll: '全选当页',
          selectInvert: '反选当页',
          selectionAll: '全选所有',
          sortTitle: '排序',
        }}
        {...tableProps}
      />
    </div>
  )
}

// 常用的操作列构建工具
export const ActionColumnUtils = {
  // 构建标准操作列
  buildActionColumn: <T extends { id: string }>(actions: ActionConfig[]): ColumnsType<T>[0] => ({
    title: '操作',
    key: 'action',
    width: actions.length * 80,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        {actions.map(action => (
          <Button
            key={action.key}
            type={action.type || 'link'}
            icon={action.icon}
            danger={action.danger}
            disabled={action.disabled}
            size="small"
            onClick={() => action.onClick(record)}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    )
  }),

  // 构建简单的查看/编辑/删除操作列
  buildStandardActions: <T extends { id: string }>(
    onView?: (record: T) => void,
    onEdit?: (record: T) => void,
    onDelete?: (record: T) => void
  ): ActionConfig[] => {
    const actions: ActionConfig[] = []
    
    if (onView) {
      actions.push({
        key: 'view',
        label: '查看',
        type: 'link',
        onClick: onView
      })
    }
    
    if (onEdit) {
      actions.push({
        key: 'edit',
        label: '编辑',
        type: 'link',
        onClick: onEdit
      })
    }
    
    if (onDelete) {
      actions.push({
        key: 'delete',
        label: '删除',
        type: 'link',
        danger: true,
        onClick: onDelete
      })
    }
    
    return actions
  }
}

// 预设的表格样式
export const TableStyles = {
  compact: {
    size: 'small' as const,
    bordered: true,
    scroll: { x: 800 }
  },
  
  standard: {
    size: 'middle' as const,
    bordered: false,
    scroll: { x: 1000 }
  },
  
  spacious: {
    size: 'large' as const,
    bordered: false,
    scroll: { x: 1200 }
  }
}