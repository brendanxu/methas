'use client';

import { useCallback } from 'react';
import { SearchResultItem } from './useSearch';

// 分析事件类型
interface AnalyticsEvent {
  eventType: 'search' | 'click' | 'view' | 'exit';
  query: string;
  resultCount?: number;
  clickedResult?: {
    id: string;
    position: number;
    type: string;
  };
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

// 会话管理
class SessionManager {
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    // 监听页面卸载事件
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    }
  }

  private generateSessionId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handlePageUnload(): void {
    // 发送会话结束事件
    const duration = Date.now() - this.startTime;
    this.trackEvent({
      eventType: 'exit',
      query: '',
      metadata: {
        sessionDuration: duration,
      },
    });
  }

  getSessionId(): string {
    return this.sessionId;
  }

  private async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // 使用 sendBeacon 确保数据能在页面卸载时发送
      const data = JSON.stringify({
        ...event,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/search/analytics', new Blob([data], { type: 'application/json' }));
      } else {
        // 回退到 fetch
        fetch('/api/search/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        }).catch(() => {
          // 忽略错误，分析失败不应影响用户体验
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  async track(event: Omit<AnalyticsEvent, 'sessionId'>): Promise<void> {
    return this.trackEvent({
      ...event,
      sessionId: this.sessionId,
    });
  }
}

// 全局会话管理器
let sessionManager: SessionManager | null = null;

function getSessionManager(): SessionManager {
  if (!sessionManager) {
    sessionManager = new SessionManager();
  }
  return sessionManager;
}

// 搜索分析Hook
export function useSearchAnalytics() {
  const session = getSessionManager();

  // 跟踪搜索事件
  const trackSearch = useCallback(async (query: string, resultCount: number, metadata?: Record<string, unknown>) => {
    if (!query.trim()) return;
    
    await session.track({
      eventType: 'search',
      query: query.trim(),
      resultCount,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
    });
  }, [session]);

  // 跟踪点击事件
  const trackClick = useCallback(async (
    query: string,
    result: SearchResultItem,
    position: number,
    metadata?: Record<string, unknown>
  ) => {
    if (!query.trim() || !result) return;

    await session.track({
      eventType: 'click',
      query: query.trim(),
      clickedResult: {
        id: result.id,
        position,
        type: result.type,
      },
      metadata: {
        ...metadata,
        resultUrl: result.url,
        resultTitle: result.title,
        timestamp: Date.now(),
      },
    });
  }, [session]);

  // 跟踪页面浏览事件
  const trackView = useCallback(async (query: string, metadata?: Record<string, unknown>) => {
    if (!query.trim()) return;

    await session.track({
      eventType: 'view',
      query: query.trim(),
      metadata: {
        ...metadata,
        url: window.location.href,
        timestamp: Date.now(),
      },
    });
  }, [session]);

  // 批量跟踪多个事件
  const trackBatch = useCallback(async (events: Array<Omit<AnalyticsEvent, 'sessionId'>>) => {
    try {
      const data = JSON.stringify({
        events: events.map(event => ({
          ...event,
          sessionId: session.getSessionId(),
          timestamp: new Date().toISOString(),
        })),
      });

      await fetch('/api/search/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      });
    } catch (error) {
      console.warn('Batch analytics tracking failed:', error);
    }
  }, [session]);

  return {
    trackSearch,
    trackClick,
    trackView,
    trackBatch,
    sessionId: session.getSessionId(),
  };
}

// 搜索性能监控Hook
export function useSearchPerformance() {
  const { trackSearch } = useSearchAnalytics();

  // 测量搜索性能
  const measureSearch = useCallback(async <T>(
    query: string,
    searchFn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await searchFn();
      const duration = performance.now() - startTime;
      
      // 记录性能数据
      await trackSearch(query, Array.isArray(result) ? result.length : 0, {
        ...metadata,
        performanceMs: Math.round(duration),
        success: true,
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // 记录错误
      await trackSearch(query, 0, {
        ...metadata,
        performanceMs: Math.round(duration),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  }, [trackSearch]);

  return {
    measureSearch,
  };
}

// 搜索洞察Hook - 用于获取分析数据
export function useSearchInsights() {
  const getAnalyticsReport = useCallback(async (period: string = '7d') => {
    try {
      const response = await fetch(`/api/search/analytics?period=${period}&format=summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics report');
      }
      return await response.json();
    } catch (error) {
      logError('Failed to get analytics report:', error);
      return null;
    }
  }, []);

  const getPopularQueries = useCallback(async (limit: number = 10) => {
    try {
      const report = await getAnalyticsReport('7d');
      return report?.topQueries?.slice(0, limit) || [];
    } catch (error) {
      logError('Failed to get popular queries:', error);
      return [];
    }
  }, [getAnalyticsReport]);

  return {
    getAnalyticsReport,
    getPopularQueries,
  };
}

// 搜索个性化Hook
export function useSearchPersonalization() {
  const { trackClick } = useSearchAnalytics();

  // 基于用户点击历史的个性化
  const personalizeResults = useCallback((results: SearchResultItem[], userHistory?: string[]): SearchResultItem[] => {
    if (!userHistory || userHistory.length === 0) {
      return results;
    }

    // 简单的个性化逻辑：提升用户历史点击过的类型
    const typePreferences = new Map<string, number>();
    
    userHistory.forEach(type => {
      typePreferences.set(type, (typePreferences.get(type) || 0) + 1);
    });

    return results.sort((a, b) => {
      const aScore = typePreferences.get(a.type) || 0;
      const bScore = typePreferences.get(b.type) || 0;
      
      if (aScore !== bScore) {
        return bScore - aScore; // 偏好类型排在前面
      }
      
      return 0; // 保持原有顺序
    });
  }, []);

  // 记录用户偏好
  const recordPreference = useCallback(async (query: string, result: SearchResultItem, position: number) => {
    await trackClick(query, result, position, {
      preferenceSignal: true,
    });
    
    // 保存到本地存储
    try {
      const prefs = JSON.parse(localStorage.getItem('search_preferences') || '[]');
      prefs.push({
        type: result.type,
        timestamp: Date.now(),
      });
      
      // 只保留最近50个偏好
      const recentPrefs = prefs.slice(-50);
      localStorage.setItem('search_preferences', JSON.stringify(recentPrefs));
    } catch (error) {
      console.warn('Failed to save user preference:', error);
    }
  }, [trackClick]);

  return {
    personalizeResults,
    recordPreference,
  };
}