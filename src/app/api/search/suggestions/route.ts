import { NextRequest, NextResponse } from 'next/server';
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};

// 热门搜索建议数据
const popularSuggestions = [
  { text: '碳中和', category: '服务', count: 156 },
  { text: '碳足迹评估', category: '服务', count: 142 },
  { text: 'ESG报告', category: '服务', count: 98 },
  { text: '绿色金融', category: '资源', count: 87 },
  { text: '可持续发展', category: '新闻', count: 76 },
  { text: '净零排放', category: '案例', count: 65 },
  { text: '碳交易', category: '服务', count: 54 },
  { text: '气候变化', category: '新闻', count: 43 },
  { text: '再生能源', category: '案例', count: 38 },
  { text: '环境咨询', category: '服务', count: 32 },
];

// GET /api/search/suggestions - 搜索建议接口
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 10);
    
    if (!query || query.length < 2) {
      // 返回热门搜索建议
      const suggestions = popularSuggestions.slice(0, limit);
      return NextResponse.json({ suggestions });
    }
    
    // 根据查询筛选相关建议
    const normalizedQuery = query.toLowerCase().trim();
    const filteredSuggestions = popularSuggestions
      .filter(suggestion => 
        suggestion.text.toLowerCase().includes(normalizedQuery) ||
        suggestion.category.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, limit);
    
    // 如果没有匹配的建议，返回模糊匹配
    if (filteredSuggestions.length === 0) {
      const fuzzyMatches = popularSuggestions
        .filter(suggestion => {
          const text = suggestion.text.toLowerCase();
          return query.split('').every(char => text.includes(char.toLowerCase()));
        })
        .slice(0, limit);
      
      return NextResponse.json({ suggestions: fuzzyMatches });
    }
    
    const response = NextResponse.json({ suggestions: filteredSuggestions });
    
    // 添加缓存控制
    response.headers.set('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
    
  } catch (error) {
    logError('Search suggestions API error:', error);
    return NextResponse.json(
      { error: '搜索建议服务暂时不可用' },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}