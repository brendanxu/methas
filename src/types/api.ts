// API响应类型定义
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    version: string;
  };
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API请求参数类型
export interface APIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  cache?: 'no-cache' | 'default' | 'force-cache';
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 筛选参数
export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: string;
  category?: string;
}

// 完整的查询参数
export interface QueryParams extends PaginationParams, FilterParams {}

// 排放数据相关类型
export interface EmissionRecord {
  id: string;
  organizationId: string;
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  unit: 'tCO2e' | 'kgCO2e' | 'lbCO2e';
  methodology: string;
  certificationStatus: 'pending' | 'verified' | 'certified';
  reportingPeriod: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EmissionAPI {
  getRecords: (params: QueryParams) => Promise<APIResponse<EmissionRecord[]>>;
  getRecord: (id: string) => Promise<APIResponse<EmissionRecord>>;
  createRecord: (data: Omit<EmissionRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<APIResponse<EmissionRecord>>;
  updateRecord: (id: string, data: Partial<EmissionRecord>) => Promise<APIResponse<EmissionRecord>>;
  deleteRecord: (id: string) => Promise<APIResponse<void>>;
}

// 项目数据相关类型
export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'renewable-energy' | 'forest-protection' | 'methane-capture' | 'community-development';
  status: 'planning' | 'active' | 'completed' | 'suspended';
  location: {
    country: string;
    region: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  timeline: {
    startDate: string;
    endDate?: string;
    milestones: Milestone[];
  };
  impact: {
    co2Reduction: number;
    beneficiaries?: number;
    area?: number;
    unit: string;
  };
  certification: {
    standard: 'VCS' | 'Gold Standard' | 'CDM' | 'JI';
    registryId?: string;
    issuanceDate?: string;
  };
  financials: {
    totalBudget: number;
    currency: string;
    fundingSource: 'public' | 'private' | 'mixed';
  };
  stakeholders: Stakeholder[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  responsible: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: 'developer' | 'sponsor' | 'validator' | 'beneficiary' | 'government';
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'report' | 'certificate' | 'monitoring' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: number;
  mimeType: string;
}

// 组织数据类型
export interface Organization {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  headquarters: {
    country: string;
    city: string;
    address: string;
  };
  contact: {
    website?: string;
    email: string;
    phone?: string;
  };
  sustainability: {
    commitments: string[];
    targets: SustainabilityTarget[];
    certifications: string[];
  };
  subscription: {
    plan: 'basic' | 'professional' | 'enterprise';
    status: 'active' | 'inactive' | 'trial';
    startDate: string;
    endDate?: string;
  };
  settings: {
    timezone: string;
    currency: string;
    language: string;
    notifications: NotificationSettings;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SustainabilityTarget {
  id: string;
  category: 'emission-reduction' | 'renewable-energy' | 'waste-reduction' | 'water-conservation';
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  baseline: {
    value: number;
    year: number;
  };
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
}

export interface NotificationSettings {
  email: {
    reports: boolean;
    alerts: boolean;
    updates: boolean;
  };
  inApp: {
    milestones: boolean;
    deadlines: boolean;
    system: boolean;
  };
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  profile: {
    avatar?: string;
    title?: string;
    department?: string;
    bio?: string;
  };
  permissions: Permission[];
  preferences: {
    language: string;
    timezone: string;
    notifications: NotificationSettings;
  };
  lastLoginAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'admin')[];
}

// 报告相关类型
export interface Report {
  id: string;
  title: string;
  type: 'emission' | 'sustainability' | 'impact' | 'compliance';
  organizationId: string;
  period: {
    start: string;
    end: string;
  };
  status: 'draft' | 'review' | 'approved' | 'published';
  format: 'pdf' | 'excel' | 'json';
  data: any;
  metadata: {
    author: string;
    reviewers: string[];
    tags: string[];
    version: string;
  };
  generatedAt: string;
  publishedAt?: string;
}

// API客户端配置
export interface APIClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  auth?: {
    type: 'bearer' | 'apikey';
    token: string;
  };
  cache: {
    enabled: boolean;
    duration: number;
  };
}