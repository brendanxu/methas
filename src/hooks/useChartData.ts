'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChartDataHookOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  cacheKey?: string;
  cacheDuration?: number;
}

interface ChartDataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useChartData<T>(
  fetcher: () => Promise<T[]>,
  options: ChartDataHookOptions = {}
) {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5分钟
    cacheKey,
    cacheDuration = 10 * 60 * 1000, // 10分钟
  } = options;

  const [state, setState] = useState<ChartDataState<T>>({
    data: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  // 缓存管理
  const getCachedData = useCallback((): T[] | null => {
    if (!cacheKey || typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > cacheDuration) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }, [cacheKey, cacheDuration]);

  const setCachedData = useCallback((data: T[]) => {
    if (!cacheKey || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch {
      // 忽略缓存失败
    }
  }, [cacheKey]);

  // 数据获取函数
  const fetchData = useCallback(async (useCache = true) => {
    // 如果启用缓存且有缓存数据，直接使用
    if (useCache) {
      const cachedData = getCachedData();
      if (cachedData) {
        setState(prev => ({
          ...prev,
          data: cachedData,
          loading: false,
          lastUpdated: new Date(),
        }));
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const newData = await fetcher();
      
      setState({
        data: newData,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });

      // 缓存新数据
      setCachedData(newData);
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '数据获取失败',
      }));
    }
  }, [fetcher, getCachedData, setCachedData]);

  // 刷新数据（强制重新获取）
  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // 初始数据加载
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    ...state,
    refresh,
    fetchData,
  };
}

// 专用于排放数据的hook
export function useEmissionData(filters?: any) {
  return useChartData(
    async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该是真实的API调用
      return [
        { year: 2020, scope1: 12500, scope2: 8300, scope3: 45000, total: 65800 },
        { year: 2021, scope1: 11800, scope2: 7200, scope3: 42000, total: 61000 },
        { year: 2022, scope1: 10200, scope2: 6100, scope3: 38500, total: 54800 },
        { year: 2023, scope1: 8900, scope2: 5400, scope3: 35000, total: 49300 },
        { year: 2024, scope1: 7500, scope2: 4800, scope3: 32000, total: 44300 },
      ];
    },
    {
      cacheKey: 'emission-data',
      autoRefresh: true,
      refreshInterval: 5 * 60 * 1000, // 5分钟刷新
    }
  );
}

// 专用于进度数据的hook
export function useProgressData() {
  return useChartData(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        { current: 8500, target: 10000, label: '可再生能源使用', unit: 'MWh' },
        { current: 7200, target: 8000, label: '废物回收率', unit: '吨' },
        { current: 4800, target: 6000, label: '水资源节约', unit: '立方米' },
        { current: 15000, target: 20000, label: '碳抵消项目', unit: '吨CO2e' },
      ];
    },
    {
      cacheKey: 'progress-data',
      autoRefresh: true,
      refreshInterval: 10 * 60 * 1000, // 10分钟刷新
    }
  );
}

// 专用于影响数据的hook
export function useImpactData() {
  return useChartData(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return [
        { category: '森林保护', value: 125000, year: 2024, region: '亚洲', unit: '公顷' },
        { category: '森林保护', value: 98000, year: 2024, region: '南美', unit: '公顷' },
        { category: '森林保护', value: 67000, year: 2024, region: '非洲', unit: '公顷' },
        { category: '可再生能源', value: 450000, year: 2024, region: '亚洲', unit: 'MWh' },
        { category: '可再生能源', value: 320000, year: 2024, region: '欧洲', unit: 'MWh' },
        { category: '可再生能源', value: 280000, year: 2024, region: '北美', unit: 'MWh' },
        { category: '甲烷回收', value: 85000, year: 2024, region: '全球', unit: '吨CO2e' },
        { category: '社区发展', value: 12000, year: 2024, region: '发展中国家', unit: '受益人数' },
      ];
    },
    {
      cacheKey: 'impact-data',
      autoRefresh: true,
      refreshInterval: 15 * 60 * 1000, // 15分钟刷新
    }
  );
}

// 数据导出工具
export function useDataExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // 处理包含逗号的值
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportToJSON = useCallback((data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return {
    exportToCSV,
    exportToJSON,
  };
}