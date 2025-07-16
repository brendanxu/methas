import { NextRequest } from 'next/server'
import { ApiWrappers, createSuccessResponse } from '@/lib/api-error-handler'
import { AnalyticsService } from '@/lib/analytics/analytics-service'

// GET /api/admin/analytics/ga4-status - 检查GA4连接状态
const handleGetGA4Status = async (
  request: NextRequest,
  { session }: { session: any }
) => {
  const analyticsService = AnalyticsService.getInstance()
  const status = await analyticsService.checkGA4Status()
  
  return createSuccessResponse({
    ...status,
    timestamp: new Date().toISOString(),
    environment: {
      hasPropertyId: !!process.env.GA4_PROPERTY_ID,
      hasCredentials: !!process.env.GA4_CLIENT_EMAIL && !!process.env.GA4_PRIVATE_KEY,
      hasKeyFile: !!process.env.GA4_KEY_FILE_PATH
    }
  })
}

// POST /api/admin/analytics/ga4-status - 测试GA4连接
const handleTestGA4Connection = async (
  request: NextRequest,
  { session }: { session: any }
) => {
  const analyticsService = AnalyticsService.getInstance()
  
  try {
    const status = await analyticsService.checkGA4Status()
    
    if (!status.available) {
      return createSuccessResponse({
        success: false,
        message: 'GA4 client not properly configured',
        error: status.error
      })
    }
    
    if (!status.connected) {
      return createSuccessResponse({
        success: false,
        message: 'GA4 connection test failed',
        error: 'Unable to connect to Google Analytics API'
      })
    }
    
    // 试着获取一些实时数据来验证连接
    const realtimeData = await analyticsService.getRealtimeData()
    
    return createSuccessResponse({
      success: true,
      message: 'GA4 connection successful',
      propertyId: status.propertyId,
      sampleData: {
        activeUsers: realtimeData.activeUsers,
        currentPageViews: realtimeData.currentPageViews
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return createSuccessResponse({
      success: false,
      message: 'GA4 connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const GET = ApiWrappers.admin(handleGetGA4Status)
export const POST = ApiWrappers.admin(handleTestGA4Connection)