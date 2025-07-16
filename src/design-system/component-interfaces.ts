/**
 * 统一的组件接口
 * 消除重复的Props定义，建立一致的组件API
 */

import { ReactNode, HTMLAttributes, CSSProperties } from 'react'
import { ComponentSize } from './tokens'

// 基础组件属性
export interface BaseComponentProps {
  /** 额外的CSS类名 */
  className?: string
  /** 子元素 */
  children?: ReactNode
  /** 自定义样式 */
  style?: CSSProperties
  /** 组件是否禁用 */
  disabled?: boolean
  /** 组件是否处于加载状态 */
  loading?: boolean
  /** 测试ID */
  testId?: string
  /** 是否可见 */
  visible?: boolean
}

// 可交互组件属性
export interface InteractiveComponentProps extends BaseComponentProps {
  /** 点击事件处理器 */
  onClick?: (event: React.MouseEvent) => void
  /** 鼠标悬停事件处理器 */
  onMouseEnter?: (event: React.MouseEvent) => void
  /** 鼠标离开事件处理器 */
  onMouseLeave?: (event: React.MouseEvent) => void
  /** 焦点事件处理器 */
  onFocus?: (event: React.FocusEvent) => void
  /** 失焦事件处理器 */
  onBlur?: (event: React.FocusEvent) => void
  /** 键盘事件处理器 */
  onKeyDown?: (event: React.KeyboardEvent) => void
  /** 是否可聚焦 */
  tabIndex?: number
  /** 无障碍标签 */
  'aria-label'?: string
  /** 无障碍描述 */
  'aria-describedby'?: string
}

// 表单组件属性
export interface FormComponentProps extends InteractiveComponentProps {
  /** 表单字段名称 */
  name?: string
  /** 是否必填 */
  required?: boolean
  /** 错误状态 */
  error?: boolean
  /** 错误信息 */
  errorMessage?: string
  /** 帮助文本 */
  helpText?: string
  /** 标签文本 */
  label?: string
  /** 占位符文本 */
  placeholder?: string
  /** 字段值 */
  value?: any
  /** 默认值 */
  defaultValue?: any
  /** 值变化处理器 */
  onChange?: (value: any, event?: any) => void
  /** 验证函数 */
  validator?: (value: any) => string | null
}

// 尺寸变体
export interface SizeVariantProps {
  /** 组件尺寸 */
  size?: ComponentSize
}

// 颜色变体
export interface ColorVariantProps {
  /** 颜色变体 */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline'
}

// 按钮组件属性
export interface ButtonProps extends InteractiveComponentProps, SizeVariantProps, ColorVariantProps {
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
  /** 是否为全宽按钮 */
  fullWidth?: boolean
  /** 按钮图标 */
  icon?: ReactNode
  /** 左侧图标 */
  leftIcon?: ReactNode
  /** 右侧图标 */
  rightIcon?: ReactNode
  /** 加载状态文本 */
  loadingText?: string
  /** 是否显示加载指示器 */
  showLoadingIcon?: boolean
}

// 输入框组件属性
export interface InputProps extends FormComponentProps, SizeVariantProps {
  /** 输入框类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  /** 是否只读 */
  readOnly?: boolean
  /** 最大长度 */
  maxLength?: number
  /** 最小长度 */
  minLength?: number
  /** 输入模式 */
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'search' | 'email' | 'url'
  /** 自动完成 */
  autoComplete?: string
  /** 自动聚焦 */
  autoFocus?: boolean
  /** 前缀内容 */
  prefix?: ReactNode
  /** 后缀内容 */
  suffix?: ReactNode
  /** 清除按钮 */
  clearable?: boolean
  /** 清除回调 */
  onClear?: () => void
}

// 卡片组件属性
export interface CardProps extends BaseComponentProps, SizeVariantProps {
  /** 卡片标题 */
  title?: ReactNode
  /** 卡片副标题 */
  subtitle?: ReactNode
  /** 额外操作区域 */
  extra?: ReactNode
  /** 卡片类型 */
  type?: 'default' | 'inner' | 'meta'
  /** 是否可悬停 */
  hoverable?: boolean
  /** 封面图片 */
  cover?: ReactNode
  /** 操作按钮列表 */
  actions?: ReactNode[]
  /** 是否有边框 */
  bordered?: boolean
  /** 卡片头部 */
  header?: ReactNode
  /** 卡片底部 */
  footer?: ReactNode
  /** 点击事件处理器 */
  onClick?: (event: React.MouseEvent) => void
  /** 鼠标悬停事件处理器 */
  onMouseEnter?: (event: React.MouseEvent) => void
  /** 鼠标离开事件处理器 */
  onMouseLeave?: (event: React.MouseEvent) => void
}

// 模态框组件属性
export interface ModalProps extends BaseComponentProps {
  /** 是否显示模态框 */
  open?: boolean
  /** 模态框标题 */
  title?: ReactNode
  /** 关闭回调 */
  onClose?: () => void
  /** 确认回调 */
  onConfirm?: () => void
  /** 取消回调 */
  onCancel?: () => void
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 是否显示遮罩 */
  mask?: boolean
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
  /** 模态框宽度 */
  width?: number | string
  /** 模态框高度 */
  height?: number | string
  /** 是否居中显示 */
  centered?: boolean
  /** 是否全屏 */
  fullScreen?: boolean
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮属性 */
  confirmButtonProps?: ButtonProps
  /** 取消按钮属性 */
  cancelButtonProps?: ButtonProps
}

// 表格组件属性
export interface TableProps extends BaseComponentProps {
  /** 表格数据 */
  data?: any[]
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 是否显示分页 */
  pagination?: boolean | PaginationProps
  /** 是否显示排序 */
  sortable?: boolean
  /** 是否显示过滤 */
  filterable?: boolean
  /** 是否可选择行 */
  selectable?: boolean
  /** 选中的行 */
  selectedRows?: any[]
  /** 选择变化回调 */
  onSelectionChange?: (selectedRows: any[]) => void
  /** 行点击回调 */
  onRowClick?: (row: any, index: number) => void
  /** 空数据显示 */
  emptyText?: ReactNode
  /** 是否显示加载状态 */
  loading?: boolean
}

// 表格列配置
export interface TableColumn {
  /** 列标题 */
  title: ReactNode
  /** 数据字段 */
  dataIndex?: string
  /** 列键 */
  key?: string
  /** 列宽度 */
  width?: number | string
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可过滤 */
  filterable?: boolean
  /** 自定义渲染 */
  render?: (value: any, row: any, index: number) => ReactNode
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否固定列 */
  fixed?: 'left' | 'right'
}

// 分页组件属性
export interface PaginationProps extends BaseComponentProps {
  /** 当前页码 */
  current?: number
  /** 每页条数 */
  pageSize?: number
  /** 总数据量 */
  total?: number
  /** 页码变化回调 */
  onChange?: (page: number, pageSize: number) => void
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示每页条数选择器 */
  showSizeChanger?: boolean
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 是否显示总数 */
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode)
  /** 简单模式 */
  simple?: boolean
}

// 列表组件属性
export interface ListProps extends BaseComponentProps {
  /** 列表数据 */
  data?: any[]
  /** 列表项渲染函数 */
  renderItem?: (item: any, index: number) => ReactNode
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示分割线 */
  split?: boolean
  /** 列表头部 */
  header?: ReactNode
  /** 列表底部 */
  footer?: ReactNode
  /** 空数据显示 */
  emptyText?: ReactNode
  /** 网格配置 */
  grid?: {
    gutter?: number
    column?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
}

// 导航组件属性
export interface NavigationProps extends BaseComponentProps {
  /** 导航项 */
  items?: NavigationItem[]
  /** 当前激活项 */
  activeKey?: string
  /** 导航模式 */
  mode?: 'horizontal' | 'vertical' | 'inline'
  /** 主题 */
  theme?: 'light' | 'dark'
  /** 是否可折叠 */
  collapsible?: boolean
  /** 是否折叠 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapse?: (collapsed: boolean) => void
  /** 选择回调 */
  onSelect?: (key: string, item: NavigationItem) => void
}

// 导航项
export interface NavigationItem {
  /** 项目键 */
  key: string
  /** 显示标题 */
  title: ReactNode
  /** 图标 */
  icon?: ReactNode
  /** 链接地址 */
  href?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 子项 */
  children?: NavigationItem[]
  /** 是否隐藏 */
  hidden?: boolean
  /** 徽章 */
  badge?: ReactNode
}

// 通知组件属性
export interface NotificationProps extends BaseComponentProps {
  /** 通知类型 */
  type?: 'success' | 'info' | 'warning' | 'error'
  /** 通知标题 */
  title?: ReactNode
  /** 通知内容 */
  message?: ReactNode
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标 */
  icon?: ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 自动关闭时间（毫秒） */
  duration?: number
  /** 通知位置 */
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  /** 操作按钮 */
  actions?: ReactNode[]
}

// 上传组件属性
export interface UploadProps extends BaseComponentProps {
  /** 上传URL */
  action?: string
  /** 上传方法 */
  method?: 'POST' | 'PUT'
  /** 上传数据 */
  data?: Record<string, any>
  /** 上传头部 */
  headers?: Record<string, string>
  /** 文件列表 */
  fileList?: UploadFile[]
  /** 默认文件列表 */
  defaultFileList?: UploadFile[]
  /** 文件列表变化回调 */
  onChange?: (fileList: UploadFile[]) => void
  /** 上传前回调 */
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  /** 自定义上传 */
  customRequest?: (options: any) => void
  /** 接受的文件类型 */
  accept?: string
  /** 是否支持多选 */
  multiple?: boolean
  /** 最大文件数 */
  maxCount?: number
  /** 最大文件大小 */
  maxSize?: number
  /** 上传按钮文本 */
  uploadText?: ReactNode
  /** 拖拽上传 */
  drag?: boolean
  /** 是否显示上传列表 */
  showUploadList?: boolean
  /** 列表类型 */
  listType?: 'text' | 'picture' | 'picture-card'
}

// 上传文件
export interface UploadFile {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  response?: any
  error?: any
  url?: string
  type?: string
  size?: number
  thumbUrl?: string
  preview?: string
}

// 所有接口已经通过interface声明自动导出