
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
import { getServerSession } from 'next-auth'
import { unlink } from 'fs/promises'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import path from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 获取文件信息
    const file = await prisma.file.findUnique({
      where: { id: params.id }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // 权限检查：只有文件上传者或管理员可以删除
    const isOwner = file.uploadedBy === session.user.id
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // 检查文件是否被使用（如作为用户头像）
    if (file.url.includes('/avatar/')) {
      const userUsingFile = await prisma.user.findFirst({
        where: { image: file.url }
      })

      if (userUsingFile) {
        return NextResponse.json(
          { error: 'File is currently being used as a user avatar' },
          { status: 400 }
        )
      }
    }

    // 删除物理文件
    try {
      const filePath = path.join(process.cwd(), 'public', file.url)
      await unlink(filePath)
    } catch (error) {
      console.warn('Failed to delete physical file:', error)
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 删除数据库记录
    await prisma.file.delete({
      where: { id: params.id }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'DELETE_FILE',
        resource: 'file',
        details: {
          fileId: params.id,
          fileName: file.originalName,
          fileUrl: file.url
        }
      }
    })

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    logError('File deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const file = await prisma.file.findUnique({
      where: { id: params.id }
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(file)
  } catch (error) {
    logError('File fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    )
  }
}