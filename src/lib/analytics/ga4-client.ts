import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { GoogleAuth } from 'google-auth-library'

// GA4 客户端配置
interface GA4Config {
  propertyId: string
  keyFilePath?: string
  credentials?: {
    client_email: string
    private_key: string
    project_id: string
  }
}

// GA4 查询参数
interface GA4QueryParams {
  startDate: string
  endDate: string
  metrics: string[]
  dimensions?: string[]
  filter?: string
  orderBy?: Array<{
    metric?: { metricName: string }
    dimension?: { dimensionName: string }
    desc?: boolean
  }>
  limit?: number
}

// GA4 响应数据结构
interface GA4Response {
  rows: Array<{
    dimensionValues: Array<{ value: string }>
    metricValues: Array<{ value: string }>
  }>
  totals: Array<{
    metricValues: Array<{ value: string }>
  }>
  metadata: {
    dataLossFromOtherRow: boolean
    samplingMetadatas: any[]
  }
}

export class GA4Client {
  private client: BetaAnalyticsDataClient | null = null
  private propertyId: string
  private initialized = false

  constructor(config: GA4Config) {
    this.propertyId = config.propertyId
    this.initializeClient(config)
  }

  private async initializeClient(config: GA4Config) {
    try {
      // 如果有凭据，使用凭据初始化
      if (config.credentials) {
        const auth = new GoogleAuth({
          credentials: config.credentials,
          scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        })
        
        this.client = new BetaAnalyticsDataClient({
          auth: auth
        })
      } else if (config.keyFilePath) {
        // 使用服务账户密钥文件
        this.client = new BetaAnalyticsDataClient({
          keyFilename: config.keyFilePath,
        })
      } else {
        // 使用默认应用凭据（在生产环境中）
        this.client = new BetaAnalyticsDataClient()
      }
      
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize GA4 client:', error)
      this.initialized = false
    }
  }

  async query(params: GA4QueryParams): Promise<GA4Response | null> {
    if (!this.initialized || !this.client) {
      console.warn('GA4 client not initialized')
      return null
    }

    try {
      const request = {
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: params.startDate,
            endDate: params.endDate,
          },
        ],
        metrics: params.metrics.map(name => ({ name })),
        dimensions: params.dimensions?.map(name => ({ name })) || [],
        orderBys: params.orderBy || [],
        limit: params.limit || 1000,
        dimensionFilter: params.filter ? {
          filter: {
            fieldName: params.filter.split('==')[0],
            stringFilter: {
              value: params.filter.split('==')[1],
              matchType: 'EXACT' as const
            }
          }
        } : undefined
      }

      const response = await this.client.runReport(request)
      
      const data = response[0]
      
      return {
        rows: (data?.rows || []).map(row => ({
          dimensionValues: (row.dimensionValues || []).map(dv => ({ value: dv.value || '' })),
          metricValues: (row.metricValues || []).map(mv => ({ value: mv.value || '' }))
        })),
        totals: (data?.totals || []).map(total => ({
          metricValues: (total.metricValues || []).map(mv => ({ value: mv.value || '' }))
        })),
        metadata: {
          dataLossFromOtherRow: data?.metadata?.dataLossFromOtherRow || false,
          samplingMetadatas: data?.metadata?.samplingMetadatas || []
        }
      }
    } catch (error) {
      console.error('GA4 query failed:', error)
      return null
    }
  }

  // 获取实时数据
  async getRealtimeData() {
    if (!this.initialized || !this.client) {
      return null
    }

    try {
      const response = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' }
        ],
        dimensions: [
          { name: 'unifiedPagePathScreen' }
        ],
        limit: 10
      })

      return {
        activeUsers: response[0]?.totals?.[0]?.metricValues?.[0]?.value || '0',
        pageViews: response[0]?.totals?.[0]?.metricValues?.[1]?.value || '0',
        topPages: response[0]?.rows?.map(row => ({
          path: row.dimensionValues?.[0]?.value || '',
          users: parseInt(row.metricValues?.[0]?.value || '0')
        })) || []
      }
    } catch (error) {
      console.error('Failed to get realtime data:', error)
      return null
    }
  }

  // 获取用户概览数据
  async getUsersData(startDate: string, endDate: string) {
    const response = await this.query({
      startDate,
      endDate,
      metrics: [
        'totalUsers',
        'newUsers',
        'sessions',
        'screenPageViews',
        'averageSessionDuration',
        'bounceRate'
      ]
    })

    if (!response?.totals?.[0]) return null

    const metrics = response.totals[0].metricValues
    return {
      totalUsers: parseInt(metrics[0]?.value || '0'),
      newUsers: parseInt(metrics[1]?.value || '0'),
      sessions: parseInt(metrics[2]?.value || '0'),
      pageViews: parseInt(metrics[3]?.value || '0'),
      avgSessionDuration: parseFloat(metrics[4]?.value || '0'),
      bounceRate: parseFloat(metrics[5]?.value || '0') / 100
    }
  }

  // 获取流量来源数据
  async getTrafficSources(startDate: string, endDate: string) {
    const response = await this.query({
      startDate,
      endDate,
      metrics: ['sessions'],
      dimensions: ['sessionSource', 'sessionMedium'],
      orderBy: [{
        metric: { metricName: 'sessions' },
        desc: true
      }],
      limit: 10
    })

    if (!response?.rows) return []

    return response.rows.map(row => ({
      source: row.dimensionValues[0]?.value || 'Unknown',
      medium: row.dimensionValues[1]?.value || 'Unknown',
      sessions: parseInt(row.metricValues[0]?.value || '0')
    }))
  }

  // 获取设备数据
  async getDeviceData(startDate: string, endDate: string) {
    const response = await this.query({
      startDate,
      endDate,
      metrics: ['sessions'],
      dimensions: ['deviceCategory'],
      orderBy: [{
        metric: { metricName: 'sessions' },
        desc: true
      }]
    })

    if (!response?.rows) return []

    const total = response.rows.reduce((sum, row) => 
      sum + parseInt(row.metricValues[0]?.value || '0'), 0
    )

    return response.rows.map(row => {
      const sessions = parseInt(row.metricValues[0]?.value || '0')
      return {
        device: row.dimensionValues[0]?.value || 'Unknown',
        sessions,
        percentage: total > 0 ? (sessions / total) * 100 : 0
      }
    })
  }

  // 获取热门页面数据
  async getTopPages(startDate: string, endDate: string) {
    const response = await this.query({
      startDate,
      endDate,
      metrics: ['screenPageViews', 'averageTimeOnPage'],
      dimensions: ['unifiedPagePathScreen'],
      orderBy: [{
        metric: { metricName: 'screenPageViews' },
        desc: true
      }],
      limit: 10
    })

    if (!response?.rows) return []

    return response.rows.map(row => ({
      path: row.dimensionValues[0]?.value || '',
      views: parseInt(row.metricValues[0]?.value || '0'),
      avgTime: parseFloat(row.metricValues[1]?.value || '0')
    }))
  }

  // 获取每日流量数据
  async getDailyTraffic(startDate: string, endDate: string) {
    const response = await this.query({
      startDate,
      endDate,
      metrics: ['totalUsers', 'screenPageViews'],
      dimensions: ['date'],
      orderBy: [{
        dimension: { dimensionName: 'date' },
        desc: false
      }]
    })

    if (!response?.rows) return []

    return response.rows.map(row => ({
      date: row.dimensionValues[0]?.value || '',
      visitors: parseInt(row.metricValues[0]?.value || '0'),
      pageViews: parseInt(row.metricValues[1]?.value || '0')
    }))
  }

  // 检查客户端是否可用
  isAvailable(): boolean {
    return this.initialized && this.client !== null
  }

  // 测试连接
  async testConnection(): Promise<boolean> {
    try {
      await this.query({
        startDate: '7daysAgo',
        endDate: 'today',
        metrics: ['totalUsers'],
        limit: 1
      })
      return true
    } catch (error) {
      console.error('GA4 connection test failed:', error)
      return false
    }
  }
}

// 工厂函数，创建GA4客户端实例
export function createGA4Client(): GA4Client | null {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID
    
    if (!propertyId) {
      console.warn('GA4_PROPERTY_ID not configured')
      return null
    }

    const config: GA4Config = {
      propertyId
    }

    // 检查是否有服务账户凭据
    if (process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY && process.env.GA4_PROJECT_ID) {
      config.credentials = {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n'),
        project_id: process.env.GA4_PROJECT_ID
      }
    } else if (process.env.GA4_KEY_FILE_PATH) {
      config.keyFilePath = process.env.GA4_KEY_FILE_PATH
    }

    return new GA4Client(config)
  } catch (error) {
    console.error('Failed to create GA4 client:', error)
    return null
  }
}