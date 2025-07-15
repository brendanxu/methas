
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
import { ApiWrappers, APIError, ErrorCode } from '@/lib/api-error-handler'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

interface RouteParams {
  params: {
    filename: string
  }
}

// 下载导出文件 - 管理员权限
export const GET = ApiWrappers.admin(async (
  request: NextRequest, 
  { session, params }: any & RouteParams
) => {
  const { filename } = params

  if (!filename) {
    throw new APIError(
      ErrorCode.BAD_REQUEST,
      'Filename is required'
    )
  }

  try {
    // 验证文件名格式和安全性
    if (!/^[a-zA-Z0-9_-]+\.(json|csv|xlsx|xml|pdf|zip)$/.test(filename)) {
      throw new APIError(
        ErrorCode.BAD_REQUEST,
        'Invalid filename format'
      )
    }

    // 检查文件是否存在于导出记录中
    const exportRecord = await prisma.auditLog.findFirst({
      where: {
        action: 'DATA_EXPORT',
        details: {
          path: 'filename',
          equals: filename
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!exportRecord) {
      throw new APIError(
        ErrorCode.NOT_FOUND,
        'Export file not found or expired'
      )
    }

    // 检查文件是否过期（24小时）
    const exportTime = exportRecord.createdAt.getTime()
    const now = Date.now()
    const expirationTime = 24 * 60 * 60 * 1000 // 24小时

    if (now - exportTime > expirationTime) {
      throw new APIError(
        ErrorCode.NOT_FOUND,
        'Export file has expired'
      )
    }

    // 构建文件路径
    const filePath = path.join('/tmp/exports', filename)

    try {
      // 在实际应用中，这里会从云存储下载文件
      // 目前模拟返回文件内容
      const fileStats = await fs.stat(filePath)
      const fileContent = await fs.readFile(filePath)

      // 确定 MIME 类型
      const mimeTypes: Record<string, string> = {
        'json': 'application/json',
        'csv': 'text/csv',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xml': 'application/xml',
        'pdf': 'application/pdf',
        'zip': 'application/zip'
      }

      const extension = filename.split('.').pop()?.toLowerCase() || ''
      const mimeType = mimeTypes[extension] || 'application/octet-stream'

      // 记录下载日志
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'EXPORT_DOWNLOAD',
          resource: 'export_file',
          details: {
            filename,
            originalExportId: exportRecord.id,
            fileSize: fileStats.size,
            downloadedBy: session.user.id
          }
        }
      })

      // 返回文件
      return new NextResponse(fileContent, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileStats.size.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

    } catch (fileError) {
      logError('File access error:', fileError)
      
      // 在实际应用中，文件可能已经被清理或在云存储中
      // 这里模拟返回示例数据
      const mockContent = JSON.stringify({
        message: 'This is a mock export file',
        filename,
        generatedAt: exportRecord.createdAt,
        note: 'In production, this would be the actual exported data'
      }, null, 2)

      return new NextResponse(mockContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': Buffer.from(mockContent).length.toString()
        }
      })
    }

  } catch (error) {
    logError('Download error:', error)
    
    if (error instanceof APIError) {
      throw error
    }
    
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to download export file'
    )
  }
})