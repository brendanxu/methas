'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Select, Spin, Alert, Tabs } from 'antd';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface AnalyticsData {
  overview: {
    pageViews: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  trafficTrend: Array<{
    date: string;
    pageviews: number;
    visitors: number;
    sessions: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
    visitors: number;
    avgTime: string;
    bounceRate: number;
  }>;
  deviceTypes: Array<{
    type: string;
    value: number;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    count: number;
    percentage: number;
  }>;
  performanceMetrics: Array<{
    metric: string;
    value: number;
    status: 'good' | 'needs-improvement' | 'poor';
    threshold: number;
  }>;
  userFlow: Array<{
    step: string;
    users: number;
    dropoffRate: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    users: number;
    conversionRate: number;
  }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('pageviews');
  const [comparisonPeriod, setComparisonPeriod] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, comparisonPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analytics/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dateRange: [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')],
          comparison: comparisonPeriod 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        action={
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            重试
          </button>
        }
      />
    );
  }

  if (!analytics) return null;

  // 图表配置
  const trafficTrendConfig = {
    data: analytics.trafficTrend,
    xField: 'date',
    yField: selectedMetric,
    smooth: true,
    height: 300,
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: selectedMetric,
        value: datum[selectedMetric]?.toLocaleString(),
      }),
    },
  };

  const deviceTypeConfig = {
    data: analytics.deviceTypes,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    height: 300,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  const browserConfig = {
    data: analytics.browsers,
    xField: 'browser',
    yField: 'count',
    height: 300,
    color: '#52c41a',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
  };

  const performanceConfig = {
    data: analytics.performanceMetrics,
    xField: 'metric',
    yField: 'value',
    height: 300,
    colorField: 'status',
    color: ({ status }: { status: string }) => {
      switch (status) {
        case 'good': return '#52c41a';
        case 'needs-improvement': return '#faad14';
        case 'poor': return '#ff4d4f';
        default: return '#d9d9d9';
      }
    },
  };

  const conversionFunnelConfig = {
    data: analytics.conversionFunnel,
    xField: 'stage',
    yField: 'users',
    height: 300,
    color: '#722ed1',
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* 页面头部 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">数据分析仪表板</h1>
          <div className="flex items-center space-x-4">
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates)}
              style={{ width: 300 }}
            />
            <Select
              value={selectedMetric}
              onChange={setSelectedMetric}
              style={{ width: 150 }}
            >
              <Option value="pageviews">页面浏览量</Option>
              <Option value="visitors">访客数</Option>
              <Option value="sessions">会话数</Option>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="overview" className="bg-white rounded-lg shadow-sm">
        <TabPane tab="概览" key="overview">
          {/* 关键指标 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="页面浏览量"
                  value={analytics.overview.pageViews}
                  suffix="次"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="独立访客"
                  value={analytics.overview.uniqueVisitors}
                  suffix="人"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="平均停留时间"
                  value={analytics.overview.avgSessionDuration}
                  suffix="秒"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="跳出率"
                  value={analytics.overview.bounceRate}
                  suffix="%"
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 流量趋势图 */}
          <Card title="流量趋势" className="mb-6">
            <Line {...trafficTrendConfig} />
          </Card>

          {/* 热门页面 */}
          <Card title="热门页面">
            <Table
              dataSource={analytics.topPages}
              columns={[
                { title: '页面', dataIndex: 'page', key: 'page' },
                { 
                  title: '浏览量', 
                  dataIndex: 'views', 
                  key: 'views',
                  render: (value: number) => value.toLocaleString()
                },
                { 
                  title: '独立访客', 
                  dataIndex: 'visitors', 
                  key: 'visitors',
                  render: (value: number) => value.toLocaleString()
                },
                { title: '平均停留时间', dataIndex: 'avgTime', key: 'avgTime' },
                { 
                  title: '跳出率', 
                  dataIndex: 'bounceRate', 
                  key: 'bounceRate',
                  render: (value: number) => `${value}%`
                },
              ]}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="用户行为" key="behavior">
          <Row gutter={[24, 24]}>
            {/* 设备分布 */}
            <Col xs={24} lg={12}>
              <Card title="设备类型分布">
                <Pie {...deviceTypeConfig} />
              </Card>
            </Col>

            {/* 浏览器分布 */}
            <Col xs={24} lg={12}>
              <Card title="浏览器分布">
                <Column {...browserConfig} />
              </Card>
            </Col>

            {/* 用户流程 */}
            <Col xs={24}>
              <Card title="用户流程分析">
                <Table
                  dataSource={analytics.userFlow}
                  columns={[
                    { title: '步骤', dataIndex: 'step', key: 'step' },
                    { 
                      title: '用户数', 
                      dataIndex: 'users', 
                      key: 'users',
                      render: (value: number) => value.toLocaleString()
                    },
                    { 
                      title: '流失率', 
                      dataIndex: 'dropoffRate', 
                      key: 'dropoffRate',
                      render: (value: number) => `${value}%`
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="性能监控" key="performance">
          <Row gutter={[24, 24]}>
            {/* 性能指标 */}
            <Col xs={24}>
              <Card title="Core Web Vitals">
                <Column {...performanceConfig} />
              </Card>
            </Col>

            {/* 性能详情表格 */}
            <Col xs={24}>
              <Card title="性能指标详情">
                <Table
                  dataSource={analytics.performanceMetrics}
                  columns={[
                    { title: '指标', dataIndex: 'metric', key: 'metric' },
                    { 
                      title: '当前值', 
                      dataIndex: 'value', 
                      key: 'value',
                      render: (value: number) => `${value}ms`
                    },
                    { 
                      title: '状态', 
                      dataIndex: 'status', 
                      key: 'status',
                      render: (status: string) => (
                        <span className={
                          status === 'good' ? 'text-green-600' :
                          status === 'needs-improvement' ? 'text-yellow-600' :
                          'text-red-600'
                        }>
                          {status === 'good' ? '良好' : 
                           status === 'needs-improvement' ? '需要改进' : '较差'}
                        </span>
                      )
                    },
                    { 
                      title: '建议阈值', 
                      dataIndex: 'threshold', 
                      key: 'threshold',
                      render: (value: number) => `${value}ms`
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="转化分析" key="conversion">
          <Row gutter={[24, 24]}>
            {/* 转化漏斗 */}
            <Col xs={24}>
              <Card title="转化漏斗">
                <Column {...conversionFunnelConfig} />
              </Card>
            </Col>

            {/* 转化率趋势 */}
            <Col xs={24}>
              <Card title="转化率趋势">
                <Area
                  data={analytics.trafficTrend.map(item => ({
                    ...item,
                    conversion: (Math.random() * 5).toFixed(2), // 模拟数据
                  }))}
                  xField="date"
                  yField="conversion"
                  height={300}
                  smooth
                  color="#fa541c"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};