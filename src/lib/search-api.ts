// 搜索API接口定义和实现
import { SearchResultItem, SearchFilters } from '@/hooks/useSearch';
import { searchResultsCache, debounceCache, performanceMonitor } from './search-cache';

// 搜索响应类型
export interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  suggestions: SearchResultItem[];
  query: string;
  took: number; // 搜索耗时(ms)
}

// 搜索建议类型
export interface SearchSuggestion {
  text: string;
  category: string;
  count: number;
}

// 搜索API类
export class SearchAPI {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/search') {
    this.baseUrl = baseUrl;
  }

  // 执行搜索
  async search(
    query: string, 
    filters: SearchFilters,
    options: {
      limit?: number;
      offset?: number;
      includeContent?: boolean;
    } = {}
  ): Promise<SearchResponse> {
    const { limit = 20, offset = 0, includeContent = false } = options;
    const startTime = Date.now();
    
    // 生成缓存键
    const cacheKey = `search:${query}:${JSON.stringify(filters)}:${limit}:${offset}`;
    
    // 检查缓存
    const cached = searchResultsCache.getWithQuery(query, { filters, limit, offset }) as SearchResponse | null;
    if (cached) {
      performanceMonitor.recordSearch(Date.now() - startTime, true);
      return cached;
    }
    
    // 使用防抖缓存防止重复请求
    return debounceCache.get(cacheKey, async () => {
      const searchParams = new URLSearchParams({
        q: query,
        type: filters.type,
        timeRange: filters.timeRange,
        sortBy: filters.sortBy,
        limit: limit.toString(),
        offset: offset.toString(),
        includeContent: includeContent.toString(),
      });

      try {
        const response = await fetch(`${this.baseUrl}?${searchParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // 添加缓存控制
          cache: 'default',
        });

        if (!response.ok) {
          performanceMonitor.recordError();
          throw new Error(`Search API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // 缓存结果 (较小的结果缓存更久)
        const cacheTTL = data.results.length > 10 ? 5 * 60 * 1000 : 10 * 60 * 1000;
        searchResultsCache.setWithQuery(query, { filters, limit, offset }, data, cacheTTL);
        
        performanceMonitor.recordSearch(Date.now() - startTime, false);
        return data;
      } catch (error) {
        performanceMonitor.recordError();
        console.error('Search API request failed:', error);
        throw new Error('搜索服务暂时不可用，请稍后重试');
      }
    });
  }

  // 获取搜索建议
  async getSuggestions(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'default',
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Search suggestions request failed:', error);
      return [];
    }
  }

  // 记录搜索行为
  async trackSearch(query: string, results: number, clickedResult?: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          results,
          clickedResult,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      // 分析请求失败不影响用户体验
      console.warn('Search analytics tracking failed:', error);
    }
  }
}

// 单例实例
export const searchAPI = new SearchAPI();

// 辅助函数：构建全文搜索数据源
export function buildSearchIndex(): SearchResultItem[] {
  const allContent: SearchResultItem[] = [];
  
  // 静态页面内容
  const staticPages = [
    {
      id: 'home',
      title: 'South Pole - 全球领先的碳中和解决方案提供商',
      excerpt: '专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案',
      content: '南极碳中和咨询公司为全球企业和政府提供专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案。助力企业实现净零排放目标，共建可持续未来。',
      url: '/',
      type: 'page' as const,
      breadcrumb: ['首页'],
    },
    {
      id: 'services',
      title: '服务中心',
      excerpt: '专业的环境咨询和碳中和解决方案服务',
      content: '我们提供全方位的可持续发展服务，包括碳足迹评估、碳中和咨询、ESG报告、绿色金融等专业服务。',
      url: '/services',
      type: 'page' as const,
      breadcrumb: ['服务中心'],
    },
    {
      id: 'about',
      title: '关于我们',
      excerpt: '了解South Pole的使命、愿景和团队',
      content: 'South Pole致力于成为全球最受信赖的气候解决方案提供商，通过创新技术和专业服务，助力全球实现碳中和目标。',
      url: '/about',
      type: 'page' as const,
      breadcrumb: ['关于我们'],
    },
  ];
  
  allContent.push(...staticPages);
  
  // TODO: 这里可以集成CMS数据、数据库内容等
  // 例如：从Contentful、Strapi等CMS获取内容
  // 或者从数据库中查询新闻、案例等动态内容
  
  return allContent;
}

// 本地搜索实现（用于离线模式或后备方案）
export class LocalSearchAPI {
  private searchIndex: SearchResultItem[] = [];
  
  constructor() {
    this.searchIndex = buildSearchIndex();
  }
  
  // 模糊搜索算法
  private fuzzySearch(query: string, text: string): number {
    if (!query || !text) return 0;
    
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedText = text.toLowerCase();
    
    // 完全匹配得分最高
    if (normalizedText.includes(normalizedQuery)) {
      const index = normalizedText.indexOf(normalizedQuery);
      const positionScore = 1 - (index / normalizedText.length) * 0.3;
      return 1.0 * positionScore;
    }
    
    // 分词匹配
    const queryWords = normalizedQuery.split(/\s+/);
    let matchCount = 0;
    let totalScore = 0;
    
    for (const word of queryWords) {
      if (word.length < 2) continue;
      
      if (normalizedText.includes(word)) {
        matchCount++;
        const index = normalizedText.indexOf(word);
        const positionScore = 1 - (index / normalizedText.length) * 0.2;
        totalScore += 0.8 * positionScore;
      }
    }
    
    return queryWords.length > 0 ? (totalScore + matchCount * 0.3) / queryWords.length : 0;
  }
  
  async search(
    query: string, 
    filters: SearchFilters,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<SearchResponse> {
    const { limit = 20, offset = 0 } = options;
    const startTime = Date.now();
    
    if (!query.trim()) {
      return {
        results: [],
        total: 0,
        suggestions: [],
        query,
        took: Date.now() - startTime,
      };
    }
    
    // 执行搜索
    const results = this.searchIndex.filter(item => {
      // 类型筛选
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }
      
      // 时间筛选（如果有发布时间）
      if (filters.timeRange !== 'all' && item.publishedAt) {
        const publishDate = new Date(item.publishedAt);
        const now = new Date();
        const timeRanges = {
          week: 7 * 24 * 60 * 60 * 1000,
          month: 30 * 24 * 60 * 60 * 1000,
          quarter: 90 * 24 * 60 * 60 * 1000,
          year: 365 * 24 * 60 * 60 * 1000,
        };
        
        const timeRange = timeRanges[filters.timeRange as keyof typeof timeRanges];
        if (timeRange && now.getTime() - publishDate.getTime() > timeRange) {
          return false;
        }
      }
      
      // 文本搜索
      const titleScore = this.fuzzySearch(query, item.title);
      const contentScore = this.fuzzySearch(query, item.content);
      const excerptScore = this.fuzzySearch(query, item.excerpt);
      
      const totalScore = titleScore * 2 + contentScore + excerptScore * 1.5;
      (item as unknown as Record<string, unknown>).score = totalScore;
      
      return totalScore > 0.1;
    });
    
    // 排序
    if (filters.sortBy === 'relevance') {
      results.sort((a, b) => 
        ((b as unknown as Record<string, unknown>).score as number || 0) - 
        ((a as unknown as Record<string, unknown>).score as number || 0)
      );
    } else if (filters.sortBy === 'date') {
      results.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    const total = results.length;
    const paginatedResults = results.slice(offset, offset + limit);
    const suggestions = results.slice(0, 5);
    
    return {
      results: paginatedResults,
      total,
      suggestions,
      query,
      took: Date.now() - startTime,
    };
  }
}

// 本地搜索实例
export const localSearchAPI = new LocalSearchAPI();