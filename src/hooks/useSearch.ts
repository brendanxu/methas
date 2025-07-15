'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { searchAPI, SearchResponse } from '@/lib/search-api';

// 搜索结果类型定义
export interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  type: 'page' | 'news' | 'service' | 'case' | 'resource';
  category?: string;
  publishedAt?: string;
  breadcrumb: string[];
  imageUrl?: string;
}

// 搜索过滤器
export interface SearchFilters {
  type: 'all' | 'page' | 'news' | 'service' | 'case' | 'resource';
  timeRange: 'all' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  sortBy: 'relevance' | 'date' | 'title';
}

// 搜索状态
interface SearchState {
  query: string;
  results: SearchResultItem[];
  loading: boolean;
  total: number;
  filters: SearchFilters;
  error: string | null;
  took: number; // 搜索耗时
}

// 模拟搜索数据
const mockSearchData: SearchResultItem[] = [
  // 页面
  {
    id: 'home',
    title: 'South Pole - 全球领先的碳中和解决方案提供商',
    excerpt: '专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案',
    content: '南极碳中和咨询公司为全球企业和政府提供专业的碳足迹评估、碳中和策略制定、碳信用交易等气候解决方案。助力企业实现净零排放目标，共建可持续未来。',
    url: '/',
    type: 'page',
    breadcrumb: ['首页'],
  },
  {
    id: 'services',
    title: '服务中心',
    excerpt: '专业的环境咨询和碳中和解决方案服务',
    content: '我们提供全方位的可持续发展服务，包括碳足迹评估、碳中和咨询、ESG报告、绿色金融等专业服务。',
    url: '/services',
    type: 'page',
    breadcrumb: ['服务中心'],
  },
  
  // 服务
  {
    id: 'carbon-footprint-assessment',
    title: '碳足迹评估',
    excerpt: '全面的企业碳排放量化评估服务，帮助企业精确掌握碳排放现状，制定科学的减排策略。',
    content: '基于国际标准的碳足迹评估方法，为企业提供全面、准确的碳排放数据分析。采用ISO 14064和GHG Protocol国际标准，确保数据的准确性和可比性。',
    url: '/services/carbon-footprint-assessment',
    type: 'service',
    category: '评估服务',
    breadcrumb: ['服务中心', '碳足迹评估'],
  },
  {
    id: 'carbon-neutrality-consulting',
    title: '碳中和咨询',
    excerpt: '为企业制定全面的碳中和策略，提供从目标设定到实施执行的全流程咨询服务。',
    content: '基于科学减排目标(SBTi)，为企业量身定制碳中和路径和实施方案。从策略制定到实施执行，提供全程专业指导和技术支持。',
    url: '/services/carbon-neutrality-consulting',
    type: 'service',
    category: '咨询服务',
    breadcrumb: ['服务中心', '碳中和咨询'],
  },
  
  // 新闻
  {
    id: 'sustainability-innovation-award-2024',
    title: 'South Pole 获得 2024 年度可持续发展创新奖',
    excerpt: '凭借在碳中和领域的突破性技术创新和卓越的客户服务，South Pole 荣获联合国环境规划署颁发的可持续发展创新奖',
    content: '2024年3月15日，South Pole 在联合国环境规划署举办的全球可持续发展峰会上荣获"可持续发展创新奖"。这一荣誉不仅是对我们在碳中和领域技术创新的认可，更是对整个团队多年来不懈努力的肯定。',
    url: '/news/sustainability-innovation-award-2024',
    type: 'news',
    category: '公司新闻',
    publishedAt: '2024-03-15',
    breadcrumb: ['新闻中心', '公司新闻'],
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'carbon-market-trends-q1-2024',
    title: '全球碳市场发展趋势报告：2024年第一季度',
    excerpt: '最新发布的全球碳市场分析显示，2024年第一季度碳信用交易量同比增长45%',
    content: '2024年第一季度，全球碳市场呈现出强劲的增长势头。根据我们的最新分析，碳信用交易量达到了历史新高，市场信心持续增强。交易量增长45%，平均价格稳定在25-30美元/吨区间。',
    url: '/news/carbon-market-trends-q1-2024',
    type: 'news',
    category: '行业洞察',
    publishedAt: '2024-03-12',
    breadcrumb: ['新闻中心', '行业洞察'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  
  // 案例
  {
    id: 'case-manufacturing-company',
    title: '某大型制造企业碳中和案例',
    excerpt: '成功帮助制造企业制定2030年碳中和路径，识别出15个减排机会点',
    content: '该企业希望了解自身碳排放现状，制定2030年碳中和路径。我们采用ISO 14064标准，对企业进行全面碳足迹评估，识别减排热点。最终完成Scope 1-3全面评估，识别出15个减排机会点，制定了详细的碳中和路径，预计可减排35%的碳排放。',
    url: '/cases/manufacturing-company',
    type: 'case',
    category: '制造业',
    breadcrumb: ['案例研究', '制造业'],
  },
  
  // 资源
  {
    id: 'carbon-market-report-2024',
    title: '2024年碳市场趋势报告',
    excerpt: '深度分析全球碳市场发展趋势和投资机会',
    content: '本报告详细分析了2024年全球碳市场的发展趋势，包括各国政策变化、市场价格波动、技术创新等方面。为企业和投资者提供专业的市场洞察和投资建议。',
    url: '/resources/carbon-market-report-2024',
    type: 'resource',
    category: '研究报告',
    breadcrumb: ['资源中心', '研究报告'],
  },
  {
    id: 'esg-investment-guide',
    title: 'ESG投资指南白皮书',
    excerpt: '企业ESG投资的完整指南，涵盖评估框架和实施策略',
    content: 'ESG投资已成为全球投资的重要趋势。本白皮书为企业提供完整的ESG投资指南，包括评估框架、实施策略、风险管理等方面的专业建议。',
    url: '/resources/esg-investment-guide',
    type: 'resource',
    category: '白皮书',
    breadcrumb: ['资源中心', '白皮书'],
  },
];

// Add tags property to the mock data (kept for backward compatibility)
const _mockData: (SearchResultItem & { tags: string[] })[] = mockSearchData.map(item => ({
  ...item,
  tags: [item.category || '', item.type, ...(item.breadcrumb || [])],
}));

// 模糊搜索算法 (kept for potential future use)
function _fuzzySearch(query: string, text: string): number {
  if (!query || !text) return 0;
  
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  
  // 完全匹配得分最高
  if (normalizedText.includes(normalizedQuery)) {
    const index = normalizedText.indexOf(normalizedQuery);
    // 越靠前得分越高
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
    } else {
      // 支持部分匹配（3个字符以上）
      if (word.length >= 3) {
        for (let i = 0; i <= normalizedText.length - word.length; i++) {
          const textSubstr = normalizedText.substr(i, word.length);
          let matches = 0;
          for (let j = 0; j < word.length; j++) {
            if (word[j] === textSubstr[j]) matches++;
          }
          if (matches / word.length >= 0.7) {
            matchCount++;
            totalScore += 0.5;
            break;
          }
        }
      }
    }
  }
  
  return queryWords.length > 0 ? (totalScore + matchCount * 0.3) / queryWords.length : 0;
}

// 高亮关键词
export function highlightKeywords(text: string, query: string): string {
  if (!query || !text) return text;
  
  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/).filter(word => word.length >= 2);
  
  let highlightedText = text;
  
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900">$1</mark>');
  });
  
  return highlightedText;
}

// 防抖函数
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 主要的搜索Hook
export function useSearch() {
  const router = useRouter();
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    total: 0,
    filters: {
      type: 'all',
      timeRange: 'all',
      sortBy: 'relevance',
    },
    error: null,
    took: 0,
  });

  // 防抖搜索查询
  const debouncedQuery = useDebounce(state.query, 300);

  // 执行搜索
  const performSearch = useCallback(async (query: string, filters: SearchFilters) => {
    if (!query.trim()) {
      setState(prev => ({ 
        ...prev, 
        results: [], 
        total: 0, 
        loading: false, 
        error: null,
        took: 0 
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const searchResult: SearchResponse = await searchAPI.search(query, filters, {
        limit: 50, // 获取更多结果用于本地分页
        offset: 0,
      });

      setState(prev => ({
        ...prev,
        results: searchResult.results,
        total: searchResult.total,
        loading: false,
        error: null,
        took: searchResult.took,
      }));

      // 记录搜索行为
      searchAPI.trackSearch(query, searchResult.total).catch(() => {
        // 忽略分析错误
      });

    } catch (error) {
      logError('Search failed:', error);
      setState(prev => ({
        ...prev,
        results: [],
        total: 0,
        loading: false,
        error: error instanceof Error ? error.message : '搜索失败，请稍后重试',
        took: 0,
      }));
    }
  }, []);

  // 当查询或筛选器变化时执行搜索
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, state.filters);
    } else {
      setState(prev => ({ 
        ...prev, 
        results: [], 
        total: 0, 
        loading: false, 
        error: null, 
        took: 0 
      }));
    }
  }, [debouncedQuery, state.filters, performSearch]);

  // 设置查询
  const setQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
  }, []);

  // 更新筛选器
  const updateFilters = useCallback((filters: Partial<SearchFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      total: 0,
      loading: false,
      error: null,
      took: 0,
    }));
  }, []);

  // 跳转到搜索页面
  const navigateToSearch = useCallback((query?: string) => {
    const searchQuery = query || state.query;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [router, state.query]);

  // 获取搜索建议（前5个结果）
  const suggestions = useMemo(() => {
    return state.results.slice(0, 5);
  }, [state.results]);

  // 按类型分组的结果
  const resultsByType = useMemo(() => {
    const grouped: Record<string, SearchResultItem[]> = {
      all: state.results,
      page: [],
      news: [],
      service: [],
      case: [],
      resource: [],
    };

    state.results.forEach(result => {
      if (grouped[result.type]) {
        grouped[result.type].push(result);
      }
    });

    return grouped;
  }, [state.results]);

  return {
    query: state.query,
    results: state.results,
    resultsByType,
    suggestions,
    loading: state.loading,
    total: state.total,
    filters: state.filters,
    error: state.error,
    took: state.took,
    setQuery,
    updateFilters,
    clearSearch,
    navigateToSearch,
    highlightKeywords,
  };
}