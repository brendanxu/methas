// 通用类型定义

// 基础实体类型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 可选的基础实体（用于创建）
export type CreateEntity<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// 可选的基础实体（用于更新）
export type UpdateEntity<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>;

// 通用状态类型
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// 通用优先级类型
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// 通用进度状态
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';

// 地理位置类型
export interface Location {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  address?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

// 时间范围类型
export interface DateRange {
  start: string;
  end: string;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
  timezone?: string;
}

// 货币和金额类型
export interface Money {
  amount: number;
  currency: string; // ISO 4217 currency code
}

// 测量单位类型
export interface Measurement {
  value: number;
  unit: string;
  precision?: number;
}

// 联系信息类型
export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  countryCode: string;
}

// 文档/文件类型
export interface FileInfo {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  checksum?: string;
  uploadedAt: string;
  uploadedBy: string;
}

// 分类标签类型
export interface Tag {
  id: string;
  name: string;
  color?: string;
  category?: string;
  description?: string;
}

// 评论类型
export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  parentId?: string; // 用于回复
  attachments?: FileInfo[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

// 审计日志类型
export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// 通知类型
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'reminder' | 'alert' | 'update';
  priority: Priority;
  recipientId: string;
  isRead: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
  createdAt: string;
  readAt?: string;
}

// 排序类型
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// 筛选类型
export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'greater_than_or_equal' 
  | 'less_than' 
  | 'less_than_or_equal'
  | 'in' 
  | 'not_in' 
  | 'is_null' 
  | 'is_not_null'
  | 'between'
  | 'regex';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup {
  operator: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  requestId?: string;
  stack?: string;
}

// 主题和样式类型
export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: Theme;
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontSize: 'small' | 'medium' | 'large';
}

// 语言和国际化类型
export type Language = 'zh-CN' | 'en-US' | 'zh-TW' | 'ja-JP' | 'ko-KR';

export interface I18nConfig {
  language: Language;
  fallbackLanguage: Language;
  rtl: boolean;
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
    precision: number;
  };
}

// 导出类型
export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  fields?: string[];
  filters?: FilterGroup;
  sort?: SortOption[];
  includeHeaders: boolean;
  filename?: string;
}

// 数据验证类型
export type ValidationRule = 
  | 'required'
  | 'email'
  | 'url'
  | 'phone'
  | 'numeric'
  | 'integer'
  | 'positive'
  | 'negative'
  | 'date'
  | 'datetime'
  | 'regex'
  | 'min_length'
  | 'max_length'
  | 'min_value'
  | 'max_value';

export interface ValidationSchema {
  field: string;
  rules: ValidationRule[];
  message?: string;
  params?: Record<string, any>;
}

// 性能监控类型
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
}

// 配置类型
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxFileSize: number;
    maxUploadFiles: number;
    sessionTimeout: number;
    rateLimits: Record<string, number>;
  };
  security: {
    enableCsrf: boolean;
    enableCors: boolean;
    allowedOrigins: string[];
    passwordMinLength: number;
    sessionCookieName: string;
  };
  monitoring: {
    enableAnalytics: boolean;
    enableErrorTracking: boolean;
    sampleRate: number;
  };
}