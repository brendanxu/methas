import { APIResponse, APIRequest, APIClientConfig } from '@/types/api';
import { AppError } from '@/types/common';

// API错误类
export class APIError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(code: string, message: string, status: number, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// 网络错误类
export class NetworkError extends Error {
  constructor(message: string, public readonly originalError: Error) {
    super(message);
    this.name = 'NetworkError';
  }
}

// 超时错误类
export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.name = 'TimeoutError';
  }
}

// 类型安全的API客户端
export class TypeSafeAPIClient {
  private config: APIClientConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  constructor(config: APIClientConfig) {
    this.config = config;
  }

  // 通用请求方法
  async request<T = any>(options: APIRequest): Promise<APIResponse<T>> {
    const { endpoint, method, params, data, headers = {}, cache = 'default' } = options;

    // 构建完整URL
    const url = new URL(endpoint, this.config.baseURL);
    
    // 添加查询参数
    if (params && method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // 缓存检查
    const cacheKey = `${method}:${url.toString()}`;
    if (cache !== 'no-cache' && method === 'GET') {
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // 构建请求配置
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...headers,
      },
      cache,
    };

    // 添加认证头
    if (this.config.auth) {
      if (this.config.auth.type === 'bearer') {
        requestInit.headers = {
          ...requestInit.headers,
          Authorization: `Bearer ${this.config.auth.token}`,
        };
      } else if (this.config.auth.type === 'apikey') {
        requestInit.headers = {
          ...requestInit.headers,
          'X-API-Key': this.config.auth.token,
        };
      }
    }

    // 添加请求体
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestInit.body = JSON.stringify(data);
    }

    // 执行请求
    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      response = await fetch(url.toString(), {
        ...requestInit,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(this.config.timeout);
        }
        throw new NetworkError('Network request failed', error);
      }
      throw error;
    }

    // 处理响应
    const result = await this.handleResponse<T>(response);

    // 缓存成功的GET请求
    if (method === 'GET' && result.success && this.config.cache.enabled) {
      this.setCachedData(cacheKey, result);
    }

    return result;
  }

  // GET请求
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>({ endpoint, method: 'GET', params });
  }

  // POST请求
  async post<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({ endpoint, method: 'POST', data });
  }

  // PUT请求
  async put<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({ endpoint, method: 'PUT', data });
  }

  // PATCH请求
  async patch<T = any>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>({ endpoint, method: 'PATCH', data });
  }

  // DELETE请求
  async delete<T = any>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>({ endpoint, method: 'DELETE' });
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    let data: any;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      throw new APIError(
        'INVALID_RESPONSE',
        'Invalid response format',
        response.status,
        { originalError: error }
      );
    }

    // 处理错误响应
    if (!response.ok) {
      const errorCode = data?.error?.code || `HTTP_${response.status}`;
      const errorMessage = data?.error?.message || response.statusText;
      
      throw new APIError(
        errorCode,
        errorMessage,
        response.status,
        data?.error?.details
      );
    }

    // 返回标准化响应
    return {
      success: true,
      data: data?.data || data,
      meta: data?.meta || {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };
  }

  // 缓存管理
  private getCachedData(key: string): APIResponse<any> | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.config.cache.duration) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData(key: string, data: APIResponse<any>): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // 清理过期缓存
    this.cleanupCache();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.config.cache.duration) {
        this.cache.delete(key);
      }
    }
  }

  // 清除所有缓存
  clearCache(): void {
    this.cache.clear();
  }

  // 重试机制
  async withRetry<T>(
    operation: () => Promise<APIResponse<T>>,
    retries: number = this.config.retries
  ): Promise<APIResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // 不重试的错误类型
        if (error instanceof APIError && error.status < 500) {
          throw error;
        }

        // 最后一次尝试失败
        if (attempt === retries) {
          throw error;
        }

        // 等待指数退避
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // 批量请求
  async batch<T = any>(requests: APIRequest[]): Promise<APIResponse<T>[]> {
    const promises = requests.map(request => 
      this.withRetry(() => this.request<T>(request))
    );

    return Promise.allSettled(promises).then(results =>
      results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            error: {
              code: 'BATCH_REQUEST_FAILED',
              message: result.reason.message,
              details: result.reason,
            },
          };
        }
      })
    );
  }

  // 更新配置
  updateConfig(updates: Partial<APIClientConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // 获取当前配置
  getConfig(): Readonly<APIClientConfig> {
    return { ...this.config };
  }
}

// 默认配置
const defaultConfig: APIClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  cache: {
    enabled: true,
    duration: 5 * 60 * 1000, // 5分钟
  },
};

// 导出默认实例
export const apiClient = new TypeSafeAPIClient(defaultConfig);

// 错误处理工具函数
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

// 响应类型守卫
export function isSuccessResponse<T>(response: APIResponse<T>): response is APIResponse<T> & { success: true; data: T } {
  return response.success === true && response.data !== undefined;
}

export function isErrorResponse<T>(response: APIResponse<T>): response is APIResponse<T> & { success: false; error: NonNullable<APIResponse<T>['error']> } {
  return response.success === false && response.error !== undefined;
}