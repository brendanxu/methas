
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
};
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 获取团队成员信息 - 只返回管理员和超级管理员，且名字不为空的用户
    const teamMembers = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        },
        name: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        _count: {
          select: {
            contents: true
          }
        }
      },
      orderBy: [
        { role: 'desc' }, // SUPER_ADMIN first
        { name: 'asc' }
      ]
    })

    // 转换角色显示
    const formattedMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      title: member.role === 'SUPER_ADMIN' ? '技术总监' : '高级顾问',
      role: member.role,
      image: member.image || '/images/default-avatar.png',
      contentCount: member._count.contents,
      description: `负责碳中和项目的${member.role === 'SUPER_ADMIN' ? '技术架构和团队管理' : '咨询服务和客户关系管理'}`
    }))

    return NextResponse.json({
      success: true,
      data: formattedMembers,
      count: formattedMembers.length
    })
  } catch (error) {
    logError('Team fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}