// Database Schema and Types for Admin CMS System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Content {
  id: string;
  type: 'news' | 'service' | 'case-study' | 'success-story' | 'page';
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  images?: string[];
  tags?: string[];
  category?: string;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  authorId: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface File {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  description?: string;
  uploadedBy: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  group?: string;
  isPublic: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface FormSubmission {
  id: string;
  type: 'contact' | 'newsletter' | 'download';
  data: Record<string, any>;
  email?: string;
  name?: string;
  phone?: string;
  message?: string;
  status: 'new' | 'replied' | 'archived';
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Success Story specific metadata
export interface SuccessStoryMetadata {
  industry: string;
  industryColor: string;
  co2Reduction: string;
  energySaving: string;
  clientLogo?: string;
  results?: {
    metric: string;
    value: string;
    unit: string;
  }[];
}

// Service specific metadata
export interface ServiceMetadata {
  icon: string;
  features: string[];
  benefits: string[];
  pricing?: {
    basic?: string;
    premium?: string;
    enterprise?: string;
  };
}

// Database Connection Types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, any>;
}

// Content Query Parameters
export interface ContentQueryParams extends QueryParams {
  type?: Content['type'];
  status?: Content['status'];
  author?: string;
  category?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
}

// File Query Parameters
export interface FileQueryParams extends QueryParams {
  mimeType?: string;
  extension?: string;
  size?: {
    min?: number;
    max?: number;
  };
}

// Validation Schemas
export const contentValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200
  },
  slug: {
    required: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    maxLength: 100
  },
  content: {
    required: true,
    minLength: 10
  },
  type: {
    required: true,
    enum: ['news', 'service', 'case-study', 'success-story', 'page']
  },
  status: {
    required: true,
    enum: ['draft', 'published', 'archived']
  }
};

export const userValidation = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 100
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  role: {
    required: true,
    enum: ['admin', 'editor', 'viewer']
  }
};

// Database utilities
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const sanitizeContent = (content: string): string => {
  // Basic HTML sanitization - in production, use a proper sanitizer like DOMPurify
  return content
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
};

export const validateFileType = (mimeType: string): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json'
  ];
  return allowedTypes.includes(mimeType);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Error types
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Mock database - in production, this would be replaced with actual database queries
export class MockDatabase {
  private static data: {
    users: User[];
    contents: Content[];
    files: File[];
    categories: Category[];
    settings: Setting[];
    formSubmissions: FormSubmission[];
  } = {
    users: [],
    contents: [],
    files: [],
    categories: [],
    settings: [],
    formSubmissions: []
  };

  static async getContents(params: ContentQueryParams = {}): Promise<{ data: Content[]; total: number }> {
    let filtered = [...this.data.contents];
    
    // Apply filters
    if (params.type) {
      filtered = filtered.filter(c => c.type === params.type);
    }
    if (params.status) {
      filtered = filtered.filter(c => c.status === params.status);
    }
    if (params.search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        c.content.toLowerCase().includes(params.search!.toLowerCase())
      );
    }
    
    // Apply sorting
    if (params.sort) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[params.sort!];
        const bVal = (b as any)[params.sort!];
        const order = params.order === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedData = filtered.slice(offset, offset + limit);
    
    return {
      data: paginatedData,
      total: filtered.length
    };
  }

  static async getContentById(id: string): Promise<Content | null> {
    return this.data.contents.find(c => c.id === id) || null;
  }

  static async createContent(content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> {
    const newContent: Content = {
      ...content,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.contents.push(newContent);
    return newContent;
  }

  static async updateContent(id: string, updates: Partial<Content>): Promise<Content | null> {
    const index = this.data.contents.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.data.contents[index] = {
      ...this.data.contents[index],
      ...updates,
      updatedAt: new Date()
    };
    return this.data.contents[index];
  }

  static async deleteContent(id: string): Promise<boolean> {
    const index = this.data.contents.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.contents.splice(index, 1);
    return true;
  }

  // Similar methods for other entities (users, files, etc.)
  static async getUsers(params: QueryParams = {}): Promise<{ data: User[]; total: number }> {
    // Implementation similar to getContents
    return { data: this.data.users, total: this.data.users.length };
  }

  static async getFiles(params: FileQueryParams = {}): Promise<{ data: File[]; total: number }> {
    // Implementation similar to getContents
    return { data: this.data.files, total: this.data.files.length };
  }

  // Initialize with sample data
  static init() {
    // Add sample data
    this.data.users.push({
      id: '1',
      email: 'admin@southpole.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });

    this.data.contents.push({
      id: '1',
      type: 'news',
      title: 'South Pole Announces New Climate Initiative',
      slug: 'climate-initiative-announcement',
      content: 'We are excited to announce our new climate initiative...',
      status: 'published',
      authorId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    });
  }
}

// Initialize mock database
MockDatabase.init();

export default MockDatabase;