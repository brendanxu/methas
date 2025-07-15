import { NextResponse } from 'next/server';
import { generateRobotsTxt } from '@/lib/seo/sitemap';

export async function GET() {
  try {
    const robotsTxt = generateRobotsTxt();

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24小时缓存
      },
    });
  } catch (error) {
    logError('生成robots.txt时发生错误:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}