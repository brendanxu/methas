'use client'

import { useEffect, useState } from 'react'
import { Card, Progress, Statistic, Row, Col, Badge, Tooltip } from 'antd'
import { ThunderboltOutlined, DashboardOutlined, WarningOutlined } from '@ant-design/icons'
import { performanceMonitor, PERFORMANCE_THRESHOLDS } from '@/lib/monitoring/performance-monitor'

interface PerformanceWidgetProps {
  compact?: boolean
  showDetails?: boolean
  onMetricsUpdate?: (metrics: any) => void
}

export default function PerformanceWidget({ 
  compact = false, 
  showDetails = true,
  onMetricsUpdate 
}: PerformanceWidgetProps) {
  const [metrics, setMetrics] = useState<any>({})
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    // 设置回调以获取实时指标
    performanceMonitor.setReportCallback((newMetrics) => {
      setMetrics(newMetrics)
      setSummary(performanceMonitor.getPerformanceSummary())
      if (onMetricsUpdate) {
        onMetricsUpdate(newMetrics)
      }
    })

    // 获取当前指标
    const currentMetrics = performanceMonitor.getCurrentMetrics()
    if (Object.keys(currentMetrics).length > 0) {
      setMetrics(currentMetrics)
      setSummary(performanceMonitor.getPerformanceSummary())
    }

    return () => {
      performanceMonitor.setReportCallback(() => {})
    }
  }, [])

  const getStatusColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#52c41a'
      case 'needs-improvement': return '#faad14'
      case 'poor': return '#ff4d4f'
      default: return '#d9d9d9'
    }
  }

  const getStatusBadge = (rating: string) => {
    switch (rating) {
      case 'good': return <Badge status="success" text="Good" />
      case 'needs-improvement': return <Badge status="warning" text="Needs Improvement" />
      case 'poor': return <Badge status="error" text="Poor" />
      default: return <Badge status="default" text="Unknown" />
    }
  }

  const formatMetricValue = (key: string, value: number) => {
    switch (key) {
      case 'cls':
        return value.toFixed(3)
      case 'lcp':
      case 'inp':
      case 'fcp':
      case 'ttfb':
      case 'loadTime':
      case 'domReady':
        return `${(value / 1000).toFixed(2)}s`
      default:
        return value.toFixed(0)
    }
  }

  const getMetricTitle = (key: string) => {
    const titles: Record<string, string> = {
      lcp: 'Largest Contentful Paint',
      inp: 'Interaction to Next Paint',
      cls: 'Cumulative Layout Shift',
      fcp: 'First Contentful Paint',
      ttfb: 'Time to First Byte',
      loadTime: 'Page Load Time'
    }
    return titles[key] || key
  }

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <DashboardOutlined />
        {summary?.overall && getStatusBadge(summary.overall)}
        {(metrics.lcp || metrics.inp) && (
          <Tooltip title={`LCP: ${metrics.lcp ? formatMetricValue('lcp', metrics.lcp) : 'N/A'} | INP: ${metrics.inp ? formatMetricValue('inp', metrics.inp) : 'N/A'}`}>
            <span>{metrics.lcp ? formatMetricValue('lcp', metrics.lcp) : (metrics.inp ? formatMetricValue('inp', metrics.inp) : 'N/A')}</span>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <Card 
      title={
        <span>
          <ThunderboltOutlined /> Performance Metrics
        </span>
      }
      extra={summary?.overall && getStatusBadge(summary.overall)}
    >
      {Object.keys(metrics).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          Collecting performance data...
        </div>
      ) : (
        <>
          {/* Core Web Vitals */}
          {(metrics.lcp || metrics.inp || metrics.cls) && (
            <>
              <h4>Core Web Vitals</h4>
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                {metrics.lcp && (
                  <Col span={8}>
                    <Statistic
                      title="LCP"
                      value={formatMetricValue('lcp', metrics.lcp)}
                      valueStyle={{ 
                        color: getStatusColor(
                          performanceMonitor.evaluatePerformance('lcp', metrics.lcp)
                        ) 
                      }}
                    />
                    {showDetails && (
                      <Progress
                        percent={
                          Math.min(
                            (metrics.lcp / PERFORMANCE_THRESHOLDS.lcp.poor) * 100,
                            100
                          )
                        }
                        strokeColor={getStatusColor(
                          performanceMonitor.evaluatePerformance('lcp', metrics.lcp)
                        )}
                        showInfo={false}
                        size="small"
                      />
                    )}
                  </Col>
                )}
                
                {metrics.inp && (
                  <Col span={8}>
                    <Statistic
                      title="INP"
                      value={formatMetricValue('inp', metrics.inp)}
                      valueStyle={{ 
                        color: getStatusColor(
                          performanceMonitor.evaluatePerformance('inp', metrics.inp)
                        ) 
                      }}
                    />
                    {showDetails && (
                      <Progress
                        percent={
                          Math.min(
                            (metrics.inp / PERFORMANCE_THRESHOLDS.inp.poor) * 100,
                            100
                          )
                        }
                        strokeColor={getStatusColor(
                          performanceMonitor.evaluatePerformance('inp', metrics.inp)
                        )}
                        showInfo={false}
                        size="small"
                      />
                    )}
                  </Col>
                )}
                
                {metrics.cls && (
                  <Col span={8}>
                    <Statistic
                      title="CLS"
                      value={formatMetricValue('cls', metrics.cls)}
                      valueStyle={{ 
                        color: getStatusColor(
                          performanceMonitor.evaluatePerformance('cls', metrics.cls)
                        ) 
                      }}
                    />
                    {showDetails && (
                      <Progress
                        percent={
                          Math.min(
                            (metrics.cls / PERFORMANCE_THRESHOLDS.cls.poor) * 100,
                            100
                          )
                        }
                        strokeColor={getStatusColor(
                          performanceMonitor.evaluatePerformance('cls', metrics.cls)
                        )}
                        showInfo={false}
                        size="small"
                      />
                    )}
                  </Col>
                )}
              </Row>
            </>
          )}

          {/* 其他指标 */}
          {showDetails && (metrics.fcp || metrics.ttfb || metrics.loadTime) && (
            <>
              <h4>Other Metrics</h4>
              <Row gutter={[16, 16]}>
                {metrics.fcp && (
                  <Col span={8}>
                    <Statistic
                      title="FCP"
                      value={formatMetricValue('fcp', metrics.fcp)}
                    />
                  </Col>
                )}
                {metrics.ttfb && (
                  <Col span={8}>
                    <Statistic
                      title="TTFB"
                      value={formatMetricValue('ttfb', metrics.ttfb)}
                    />
                  </Col>
                )}
                {metrics.loadTime && (
                  <Col span={8}>
                    <Statistic
                      title="Load Time"
                      value={formatMetricValue('loadTime', metrics.loadTime)}
                    />
                  </Col>
                )}
              </Row>
            </>
          )}

          {/* 警告 */}
          {summary?.overall === 'poor' && (
            <div style={{ marginTop: '16px' }}>
              <WarningOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
              <span style={{ color: '#ff4d4f' }}>
                Performance issues detected. Consider optimizing your page.
              </span>
            </div>
          )}
        </>
      )}
    </Card>
  )
}