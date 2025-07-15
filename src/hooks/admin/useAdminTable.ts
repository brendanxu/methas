import { useState, useCallback, useEffect } from 'react'
import { message } from 'antd'

// 通用分页配置
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
}

// 通用过滤器类型
export interface FilterConfig {
  [key: string]: any
}

// API响应接口
export interface AdminTableResponse<T> {
  success: boolean
  data: {
    [key: string]: T[] | {
      page: number
      limit: number
      total: number
      pages: number
    }
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

// Hook配置选项
export interface UseAdminTableOptions {
  endpoint: string          // API端点，如 '/api/users'
  dataKey: string          // 响应数据键名，如 'users'
  initialPageSize?: number // 初始页面大小
  initialFilters?: FilterConfig
}

// Hook返回值
export interface UseAdminTableReturn<T> {
  // 数据状态
  data: T[]
  loading: boolean
  pagination: PaginationConfig
  filters: FilterConfig
  
  // 操作方法
  fetchData: (page?: number) => Promise<void>
  setFilters: (newFilters: FilterConfig) => void
  updatePagination: (config: Partial<PaginationConfig>) => void
  refresh: () => void
  
  // 删除操作
  handleDelete: (id: string, name: string, onSuccess?: () => void) => Promise<void>
}

export function useAdminTable<T extends { id: string, name?: string, title?: string }>(
  options: UseAdminTableOptions
): UseAdminTableReturn<T> {
  const { endpoint, dataKey, initialPageSize = 20, initialFilters = {} } = options
  
  // 状态管理
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: initialPageSize,
    total: 0
  })
  const [filters, setFilters] = useState<FilterConfig>(initialFilters)

  // 获取数据
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.pageSize.toString(),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>)
      })

      const response = await fetch(`${endpoint}?${params}`)
      
      if (response.ok) {
        const result: AdminTableResponse<T> = await response.json()
        
        if (result.success) {
          const dataArray = result.data[dataKey] as T[]
          setData(dataArray || [])
          setPagination(prev => ({
            ...prev,
            current: page,
            total: result.data.pagination.total
          }))
        } else {
          throw new Error('API response indicates failure')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || 'Failed to fetch data')
      }
    } catch (error: any) {
      console.error(`Error fetching ${dataKey}:`, error)
      message.error(error.message || `获取${dataKey}失败，请稍后重试`)
    } finally {
      setLoading(false)
    }
  }, [endpoint, dataKey, pagination.pageSize, filters])

  // 更新过滤器
  const handleSetFilters = useCallback((newFilters: FilterConfig) => {
    setFilters(newFilters)
    // 重置到第一页
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [])

  // 更新分页配置
  const updatePagination = useCallback((config: Partial<PaginationConfig>) => {
    setPagination(prev => ({ ...prev, ...config }))
  }, [])

  // 刷新数据
  const refresh = useCallback(() => {
    setPagination(prev => {
      fetchData(prev.current)
      return prev
    })
  }, [fetchData])

  // 删除操作
  const handleDelete = useCallback(async (id: string, name: string, onSuccess?: () => void) => {
    const { Modal } = await import('antd')
    
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${name}"吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        try {
          const response = await fetch(`${endpoint}/${id}`, {
            method: 'DELETE'
          })

          if (response.ok) {
            message.success('删除成功')
            refresh()
            onSuccess?.()
          } else {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || 'Delete failed')
          }
        } catch (error: any) {
          console.error('Delete error:', error)
          message.error(error.message || '删除失败，请稍后重试')
        }
      }
    })
  }, [endpoint, refresh])

  // 初始化和依赖更新
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    // 数据状态
    data,
    loading,
    pagination,
    filters,
    
    // 操作方法
    fetchData,
    setFilters: handleSetFilters,
    updatePagination,
    refresh,
    handleDelete
  }
}

// 常用过滤器构建工具
export const FilterUtils = {
  // 构建搜索过滤器
  buildSearchFilter: (search: string, field: string = 'search') => ({
    [field]: search?.trim() || undefined
  }),

  // 构建选择过滤器
  buildSelectFilter: (value: any, field: string) => ({
    [field]: value || undefined
  }),

  // 合并过滤器
  mergeFilters: (...filters: FilterConfig[]) => {
    return filters.reduce((acc, filter) => ({ ...acc, ...filter }), {})
  },

  // 清理空值过滤器
  cleanFilters: (filters: FilterConfig) => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value
      }
      return acc
    }, {} as FilterConfig)
  }
}

// 预设的hook配置
export const AdminTableConfigs = {
  users: {
    endpoint: '/api/users',
    dataKey: 'users',
    initialPageSize: 20
  },
  
  contents: {
    endpoint: '/api/content',
    dataKey: 'contents',
    initialPageSize: 10
  },
  
  forms: {
    endpoint: '/api/forms',
    dataKey: 'submissions',
    initialPageSize: 20
  },
  
  files: {
    endpoint: '/api/upload',
    dataKey: 'files',
    initialPageSize: 20
  }
}