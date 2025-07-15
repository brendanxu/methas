import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// 导出格式枚举
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XLSX = 'xlsx',
  XML = 'xml',
  PDF = 'pdf'
}

// 数据源枚举
export enum DataSource {
  USERS = 'users',
  CONTENT = 'content',
  FORM_SUBMISSIONS = 'form_submissions',
  FILES = 'files',
  AUDIT_LOGS = 'audit_logs',
  NEWSLETTER_SUBSCRIPTIONS = 'newsletter_subscriptions'
}

// 导出配置接口
export interface ExportConfig {
  source: DataSource
  format: ExportFormat
  filters?: ExportFilters
  fields?: string[]                    // 要导出的字段
  includeRelations?: boolean           // 是否包含关联数据
  dateRange?: {
    start?: Date
    end?: Date
    field?: string                     // 日期过滤字段
  }
  limit?: number                       // 记录数限制
  sortBy?: string                      // 排序字段
  sortOrder?: 'asc' | 'desc'          // 排序方向
  template?: string                    // 导出模板（用于PDF等）
  password?: string                    // 文件密码保护
  compression?: boolean                // 是否压缩
}

// 过滤条件接口
export interface ExportFilters {
  [key: string]: any
}

// 导出结果接口
export interface ExportResult {
  success: boolean
  filename: string
  format: ExportFormat
  size: number                         // 文件大小（字节）
  recordCount: number                  // 记录数量
  downloadUrl?: string                 // 下载链接
  expiresAt?: Date                     // 过期时间
  checksum?: string                    // 文件校验和
  metadata?: {
    exportedAt: Date
    exportedBy: string
    source: DataSource
    filters: ExportFilters
  }
}

// 验证Schema
const exportConfigSchema = z.object({
  source: z.nativeEnum(DataSource),
  format: z.nativeEnum(ExportFormat),
  filters: z.record(z.any()).optional(),
  fields: z.array(z.string()).optional(),
  includeRelations: z.boolean().default(false),
  dateRange: z.object({
    start: z.coerce.date().optional(),
    end: z.coerce.date().optional(),
    field: z.string().default('createdAt')
  }).optional(),
  limit: z.number().min(1).max(100000).default(10000),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  template: z.string().optional(),
  password: z.string().optional(),
  compression: z.boolean().default(false)
})

// 数据导出器类
export class DataExporter {
  private readonly maxRecords = 100000
  private readonly tempDir = '/tmp/exports'

  constructor() {
    // 确保临时目录存在
    this.ensureTempDir()
  }

  // 主要导出方法
  async export(config: ExportConfig, userId: string): Promise<ExportResult> {
    // 验证配置
    const validatedConfig = exportConfigSchema.parse(config)

    // 获取数据
    const data = await this.fetchData(validatedConfig)

    // 生成文件
    const filename = this.generateFilename(validatedConfig.source, validatedConfig.format)
    const filePath = `${this.tempDir}/${filename}`

    let fileContent: Buffer
    let mimeType: string

    // 根据格式生成文件内容
    switch (validatedConfig.format) {
      case ExportFormat.JSON:
        fileContent = await this.generateJSON(data, validatedConfig)
        mimeType = 'application/json'
        break
      case ExportFormat.CSV:
        fileContent = await this.generateCSV(data, validatedConfig)
        mimeType = 'text/csv'
        break
      case ExportFormat.XLSX:
        fileContent = await this.generateXLSX(data, validatedConfig)
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case ExportFormat.XML:
        fileContent = await this.generateXML(data, validatedConfig)
        mimeType = 'application/xml'
        break
      case ExportFormat.PDF:
        fileContent = await this.generatePDF(data, validatedConfig)
        mimeType = 'application/pdf'
        break
      default:
        throw new Error(`Unsupported export format: ${validatedConfig.format}`)
    }

    // 应用密码保护
    if (validatedConfig.password) {
      fileContent = await this.applyPasswordProtection(fileContent, validatedConfig.password, validatedConfig.format)
    }

    // 应用压缩
    if (validatedConfig.compression) {
      fileContent = await this.compressFile(fileContent, filename)
    }

    // 保存文件（在实际应用中，这里会保存到云存储）
    await this.saveFile(filePath, fileContent)

    // 计算校验和
    const checksum = await this.calculateChecksum(fileContent)

    // 记录导出日志
    await this.logExport(validatedConfig, userId, filename, fileContent.length, data.length)

    return {
      success: true,
      filename,
      format: validatedConfig.format,
      size: fileContent.length,
      recordCount: data.length,
      downloadUrl: `/api/admin/exports/download/${filename}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后过期
      checksum,
      metadata: {
        exportedAt: new Date(),
        exportedBy: userId,
        source: validatedConfig.source,
        filters: validatedConfig.filters || {}
      }
    }
  }

  // 根据数据源获取数据
  private async fetchData(config: ExportConfig): Promise<any[]> {
    const { source, filters, dateRange, limit, sortBy, sortOrder, includeRelations } = config

    let whereClause: any = {}
    let include: any = {}

    // 应用过滤条件
    if (filters) {
      whereClause = { ...whereClause, ...filters }
    }

    // 应用日期范围过滤
    if (dateRange?.start || dateRange?.end) {
      const field = dateRange.field || 'createdAt'
      whereClause[field] = {}
      if (dateRange.start) {
        whereClause[field].gte = dateRange.start
      }
      if (dateRange.end) {
        whereClause[field].lte = dateRange.end
      }
    }

    // 配置关联数据
    if (includeRelations) {
      include = this.getIncludeConfig(source)
    }

    // 构建排序条件
    const orderBy: any = {}
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'desc'
    } else {
      orderBy.createdAt = 'desc'
    }

    // 根据数据源执行查询
    switch (source) {
      case DataSource.USERS:
        return await prisma.user.findMany({
          where: whereClause,
          include,
          orderBy,
          take: limit
        })

      case DataSource.CONTENT:
        return await prisma.content.findMany({
          where: whereClause,
          include,
          orderBy,
          take: limit
        })

      case DataSource.FORM_SUBMISSIONS:
        return await prisma.formSubmission.findMany({
          where: whereClause,
          orderBy,
          take: limit
        })

      case DataSource.FILES:
        return await prisma.file.findMany({
          where: whereClause,
          orderBy,
          take: limit
        })

      case DataSource.AUDIT_LOGS:
        return await prisma.auditLog.findMany({
          where: whereClause,
          include,
          orderBy,
          take: limit
        })

      case DataSource.NEWSLETTER_SUBSCRIPTIONS:
        return await prisma.formSubmission.findMany({
          where: {
            type: 'NEWSLETTER',
            ...whereClause
          },
          orderBy,
          take: limit
        })

      default:
        throw new Error(`Unsupported data source: ${source}`)
    }
  }

  // 获取关联配置
  private getIncludeConfig(source: DataSource): any {
    switch (source) {
      case DataSource.USERS:
        return {
          contents: { select: { id: true, title: true, type: true } },
          auditLogs: { select: { id: true, action: true, createdAt: true } }
        }
      case DataSource.CONTENT:
        return {
          author: { select: { id: true, name: true, email: true } }
        }
      case DataSource.AUDIT_LOGS:
        return {
          user: { select: { id: true, name: true, email: true } }
        }
      default:
        return {}
    }
  }

  // 生成JSON格式
  private async generateJSON(data: any[], config: ExportConfig): Promise<Buffer> {
    const processedData = this.processData(data, config)
    const jsonData = {
      metadata: {
        source: config.source,
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        format: 'json'
      },
      data: processedData
    }
    return Buffer.from(JSON.stringify(jsonData, null, 2), 'utf-8')
  }

  // 生成CSV格式
  private async generateCSV(data: any[], config: ExportConfig): Promise<Buffer> {
    const processedData = this.processData(data, config)
    
    if (processedData.length === 0) {
      return Buffer.from('No data to export', 'utf-8')
    }

    // 获取所有字段名
    const headers = Object.keys(processedData[0])
    
    // 生成CSV内容
    const csvRows = [
      headers.join(','), // 标题行
      ...processedData.map(row => 
        headers.map(header => {
          const value = row[header]
          // 处理包含逗号、引号或换行的值
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        }).join(',')
      )
    ]

    return Buffer.from(csvRows.join('\n'), 'utf-8')
  }

  // 生成XLSX格式（模拟实现）
  private async generateXLSX(data: any[], config: ExportConfig): Promise<Buffer> {
    // 在实际应用中，这里会使用像 exceljs 这样的库
    // 目前返回JSON格式作为占位符
    const processedData = this.processData(data, config)
    return Buffer.from(JSON.stringify({
      message: 'XLSX export would be implemented using exceljs library',
      data: processedData
    }, null, 2), 'utf-8')
  }

  // 生成XML格式
  private async generateXML(data: any[], config: ExportConfig): Promise<Buffer> {
    const processedData = this.processData(data, config)
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += `<export source="${config.source}" exportedAt="${new Date().toISOString()}">\n`
    xml += `  <metadata>\n`
    xml += `    <recordCount>${processedData.length}</recordCount>\n`
    xml += `    <format>xml</format>\n`
    xml += `  </metadata>\n`
    xml += `  <data>\n`
    
    processedData.forEach((record, index) => {
      xml += `    <record id="${index + 1}">\n`
      Object.entries(record).forEach(([key, value]) => {
        xml += `      <${key}>${this.escapeXml(String(value || ''))}</${key}>\n`
      })
      xml += `    </record>\n`
    })
    
    xml += `  </data>\n`
    xml += `</export>`
    
    return Buffer.from(xml, 'utf-8')
  }

  // 生成PDF格式（模拟实现）
  private async generatePDF(data: any[], config: ExportConfig): Promise<Buffer> {
    // 在实际应用中，这里会使用像 puppeteer 或 pdfkit 这样的库
    const processedData = this.processData(data, config)
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Data Export - ${config.source}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Data Export Report</h1>
        <p>Source: ${config.source}</p>
        <p>Exported at: ${new Date().toISOString()}</p>
        <p>Record count: ${processedData.length}</p>
      </div>
    `

    if (processedData.length > 0) {
      const headers = Object.keys(processedData[0])
      html += '<table>'
      html += '<thead><tr>'
      headers.forEach(header => {
        html += `<th>${header}</th>`
      })
      html += '</tr></thead>'
      html += '<tbody>'
      
      processedData.slice(0, 1000).forEach(record => { // 限制PDF中的记录数
        html += '<tr>'
        headers.forEach(header => {
          html += `<td>${String(record[header] || '')}</td>`
        })
        html += '</tr>'
      })
      
      html += '</tbody></table>'
    }

    html += '</body></html>'
    
    return Buffer.from(html, 'utf-8')
  }

  // 处理数据（字段选择、格式化等）
  private processData(data: any[], config: ExportConfig): any[] {
    return data.map(record => {
      let processedRecord: any = {}

      // 如果指定了字段，只导出指定字段
      if (config.fields && config.fields.length > 0) {
        config.fields.forEach(field => {
          if (field.includes('.')) {
            // 处理嵌套字段，如 'author.name'
            const value = this.getNestedValue(record, field)
            processedRecord[field] = value
          } else {
            processedRecord[field] = record[field]
          }
        })
      } else {
        // 导出所有字段，但对某些字段进行处理
        processedRecord = { ...record }
      }

      // 格式化特殊字段
      Object.keys(processedRecord).forEach(key => {
        const value = processedRecord[key]
        
        // 格式化日期
        if (value instanceof Date) {
          processedRecord[key] = value.toISOString()
        }
        
        // 格式化JSON字段
        if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          processedRecord[key] = JSON.stringify(value)
        }
        
        // 移除敏感信息
        if (this.isSensitiveField(key)) {
          processedRecord[key] = '[REDACTED]'
        }
      })

      return processedRecord
    })
  }

  // 获取嵌套属性值
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // 检查是否为敏感字段
  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'refresh_token', 'access_token']
    return sensitiveFields.some(field => fieldName.toLowerCase().includes(field))
  }

  // XML转义
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  // 生成文件名
  private generateFilename(source: DataSource, format: ExportFormat): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    return `${source}_export_${timestamp}.${format}`
  }

  // 应用密码保护（模拟实现）
  private async applyPasswordProtection(content: Buffer, password: string, format: ExportFormat): Promise<Buffer> {
    // 在实际应用中，这里会实现真正的加密
    // Debug log removed for production
    return content
  }

  // 压缩文件（模拟实现）
  private async compressFile(content: Buffer, filename: string): Promise<Buffer> {
    // 在实际应用中，这里会使用 zlib 进行压缩
    // Debug log removed for production
    return content
  }

  // 保存文件（模拟实现）
  private async saveFile(filePath: string, content: Buffer): Promise<void> {
    // 在实际应用中，这里会保存到文件系统或云存储
    // Debug log removed for production
  }

  // 计算校验和
  private async calculateChecksum(content: Buffer): Promise<string> {
    // 简单的校验和实现
    const crypto = await import('crypto')
    return crypto.createHash('md5').update(content).digest('hex')
  }

  // 记录导出日志
  private async logExport(
    config: ExportConfig, 
    userId: string, 
    filename: string, 
    fileSize: number, 
    recordCount: number
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_EXPORT',
        resource: config.source,
        details: {
          filename,
          format: config.format,
          fileSize,
          recordCount,
          filters: config.filters,
          dateRange: config.dateRange
        }
      }
    })
  }

  // 确保临时目录存在
  private ensureTempDir(): void {
    // 在实际应用中，这里会创建目录
    // Debug log removed for production
  }

  // 清理过期文件
  async cleanupExpiredFiles(): Promise<void> {
    // 在实际应用中，这里会清理过期的导出文件
    // Debug log removed for production
  }
}

// 全局导出器实例
export const globalDataExporter = new DataExporter()

// 便捷的导出函数
export async function exportData(config: ExportConfig, userId: string): Promise<ExportResult> {
  return globalDataExporter.export(config, userId)
}