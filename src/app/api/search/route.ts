import { NextRequest, NextResponse } from 'next/server';
import { localSearchAPI } from '@/lib/search-api';
import { SearchFilters } from '@/hooks/useSearch';
import { validateSearchQuery, searchRateLimiter, isSuspiciousQuery } from '@/lib/search-validation';

// GET /api/search - 搜索接口
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const rawQuery = searchParams.get('q') || '';
    const type = (searchParams.get('type') || 'all') as SearchFilters['type'];
    const timeRange = (searchParams.get('timeRange') || 'all') as SearchFilters['timeRange'];
    const sortBy = (searchParams.get('sortBy') || 'relevance') as SearchFilters['sortBy'];
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
    
    // 速率限制检查
    if (!searchRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: '搜索请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }
    
    // 搜索查询验证和清理
    const validation = validateSearchQuery(rawQuery);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] || '无效的搜索查询' },
        { status: 400 }
      );
    }
    
    const query = validation.cleanedQuery;
    
    // 可疑查询检查
    if (isSuspiciousQuery(query)) {
      console.warn('Suspicious search query detected:', { query, ip: clientIP });
      return NextResponse.json(
        { error: '搜索查询包含不支持的内容' },
        { status: 400 }
      );
    }
    
    // 空查询处理
    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        suggestions: [],
        query: '',
        took: 0,
      });
    }
    
    const filters: SearchFilters = {
      type,
      timeRange,
      sortBy,
    };
    
    // 执行搜索
    const searchResult = await localSearchAPI.search(query, filters, {
      limit,
      offset,
    });
    
    // 添加CORS头
    const response = NextResponse.json(searchResult);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // 添加缓存控制
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    
    return response;
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: '搜索服务暂时不可用' },
      { status: 500 }
    );
  }
}

// POST /api/search - 搜索分析（可选）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, action, metadata } = body;
    
    // 这里可以记录搜索行为到数据库或分析服务
    // 例如：记录热门搜索词、点击率等
    console.log('Search analytics:', {
      query,
      action,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Search analytics error:', error);
    return NextResponse.json(
      { error: '分析数据记录失败' },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}