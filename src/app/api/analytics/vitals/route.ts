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

interface WebVitalData {
  dsn?: string;
  id: string;
  page: string;
  href: string;
  event_name: string;
  value: string;
  rating?: string;
  delta?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  device?: {
    userAgent: string;
    language: string;
    platform: string;
    viewport: {
      width: number;
      height: number;
    };
    screen: {
      width: number;
      height: number;
    };
  };
  timestamp: number;
  navigationType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: WebVitalData = await request.json();
    
    // 验证数据
    if (!data.id || !data.event_name || !data.value) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 记录到控制台（开发环境）
    if (process.env.NODE_ENV === 'development') {
      // Debug log removed for production
    }

    // 这里可以将数据保存到数据库
    // await saveWebVitalToDatabase(data);

    // 可以发送到外部分析服务
    await Promise.allSettled([
      // 发送到Google Analytics（服务端）
      sendToGoogleAnalytics(data),
      
      // 发送到其他分析服务
      // sendToAmplitude(data),
      // sendToMixpanel(data),
      
      // 保存到时序数据库
      // saveToInfluxDB(data),
    ]);

    // 检查性能阈值
    const numericValue = parseFloat(data.value);
    if (!isNaN(numericValue)) {
      checkPerformanceThresholds(data.event_name, numericValue, data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('Web Vitals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 发送到Google Analytics Measurement Protocol
async function sendToGoogleAnalytics(data: WebVitalData) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
  const GA_API_SECRET = process.env.GA_API_SECRET;
  
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    console.warn('GA credentials not configured');
    return;
  }

  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
    
    const payload = {
      client_id: data.id,
      events: [{
        name: 'web_vital',
        params: {
          metric_name: data.event_name,
          metric_value: parseFloat(data.value),
          metric_rating: data.rating,
          page_location: data.href,
          page_title: data.page,
          connection_type: data.connection?.effectiveType,
          device_category: getDeviceCategory(data.device?.userAgent),
        },
      }],
    };

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    logError('Failed to send to Google Analytics:', error);
  }
}

// 检查性能阈值并发送告警
async function checkPerformanceThresholds(metric: string, value: number, data: WebVitalData) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric as keyof typeof thresholds];
  if (!threshold) return;

  let status: 'good' | 'needs-improvement' | 'poor';
  if (value <= threshold.good) {
    status = 'good';
  } else if (value <= threshold.poor) {
    status = 'needs-improvement';
  } else {
    status = 'poor';
  }

  // 如果性能较差，发送告警
  if (status === 'poor') {
    await sendPerformanceAlert({
      metric,
      value,
      threshold: threshold.poor,
      page: data.page,
      device: data.device,
      connection: data.connection,
    });
  }
}

// 发送性能告警
async function sendPerformanceAlert(alertData: any) {
  try {
    // 发送到监控告警API
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/monitoring/alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'performance',
        severity: 'high',
        message: `Poor ${alertData.metric} detected: ${alertData.value}ms`,
        metadata: alertData,
      }),
    });
  } catch (error) {
    logError('Failed to send performance alert:', error);
  }
}

// 获取设备类型
function getDeviceCategory(userAgent?: string): string {
  if (!userAgent) return 'unknown';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  }
  
  return 'desktop';
}

// OPTIONS方法处理CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}