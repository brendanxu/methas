'use client';

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Space, Statistic } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { EmissionChart, generateSampleEmissionData } from './EmissionChart';
import { ProgressChart, generateSampleProgressData } from './ProgressChart';
import { ImpactChart, generateSampleImpactData } from './ImpactChart';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DashboardFilters {
  timeRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  region: string;
  chartTypes: {
    emission: 'line' | 'column' | 'pie';
    progress: 'progress' | 'gauge';
    impact: 'area' | 'column' | 'rose';
  };
}

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: [dayjs().subtract(2, 'year'), dayjs()],
    region: 'all',
    chartTypes: {
      emission: 'line',
      progress: 'progress',
      impact: 'area',
    },
  });

  // 示例数据
  const emissionData = useMemo(() => generateSampleEmissionData(), []);
  const progressData = useMemo(() => generateSampleProgressData(), []);
  const impactData = useMemo(() => generateSampleImpactData(), []);

  // 计算统计数据
  const statistics = useMemo(() => {
    const latestEmission = emissionData[emissionData.length - 1];
    const previousEmission = emissionData[emissionData.length - 2];
    
    if (!latestEmission || !previousEmission) {
      return {
        totalEmissions: 0,
        emissionReduction: 0,
        completedProjects: 0,
        progressRate: 0,
      };
    }

    const reductionPercent = ((previousEmission.total - latestEmission.total) / previousEmission.total) * 100;
    const avgProgress = progressData.reduce((sum, item) => sum + (item.current / item.target), 0) / progressData.length;

    return {
      totalEmissions: latestEmission.total,
      emissionReduction: reductionPercent,
      completedProjects: impactData.length,
      progressRate: avgProgress * 100,
    };
  }, [emissionData, progressData, impactData]);

  const handleRefresh = async () => {
    setLoading(true);
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    // 模拟数据导出
    const data = {
      emissions: emissionData,
      progress: progressData,
      impact: impactData,
      filters,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climate-dashboard-${dayjs().format('YYYY-MM-DD')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateChartType = (category: keyof DashboardFilters['chartTypes'], type: any) => {
    setFilters(prev => ({
      ...prev,
      chartTypes: {
        ...prev.chartTypes,
        [category]: type,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页头 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                气候数据仪表板
              </h1>
              <p className="text-gray-600">
                实时监控碳排放、减排进度和环境影响数据
              </p>
            </div>
            
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新数据
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出报告
              </Button>
            </Space>
          </div>

          {/* 筛选器 */}
          <Card className="shadow-sm">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">时间范围</label>
                  <RangePicker
                    value={filters.timeRange}
                    onChange={(dates) => setFilters(prev => ({ 
                      ...prev, 
                      timeRange: dates as [dayjs.Dayjs, dayjs.Dayjs] | null 
                    }))}
                    className="w-full"
                  />
                </div>
              </Col>
              
              <Col xs={24} sm={12} md={8}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">地区</label>
                  <Select
                    value={filters.region}
                    onChange={(value) => setFilters(prev => ({ ...prev, region: value }))}
                    className="w-full"
                  >
                    <Option value="all">全球</Option>
                    <Option value="asia">亚洲</Option>
                    <Option value="europe">欧洲</Option>
                    <Option value="americas">美洲</Option>
                    <Option value="africa">非洲</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* 关键指标 */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="当前总排放量"
                value={statistics.totalEmissions}
                suffix="吨CO2e"
                precision={0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="年度减排率"
                value={statistics.emissionReduction}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="活跃项目数"
                value={statistics.completedProjects}
                suffix="个"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card className="shadow-sm">
              <Statistic
                title="平均完成度"
                value={statistics.progressRate}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[24, 24]}>
          {/* 排放趋势图 */}
          <Col xs={24} lg={12}>
            <Card 
              className="shadow-sm"
              title="温室气体排放趋势"
              extra={
                <Select
                  value={filters.chartTypes.emission}
                  onChange={(value) => updateChartType('emission', value)}
                  style={{ width: 120 }}
                >
                  <Option value="line">
                    <LineChartOutlined /> 线图
                  </Option>
                  <Option value="column">
                    <BarChartOutlined /> 柱图
                  </Option>
                  <Option value="pie">
                    <PieChartOutlined /> 饼图
                  </Option>
                </Select>
              }
            >
              <EmissionChart
                data={emissionData}
                chartType={filters.chartTypes.emission}
                loading={loading}
                height={350}
                title=""
                description=""
              />
            </Card>
          </Col>

          {/* 进度图表 */}
          <Col xs={24} lg={12}>
            <Card 
              className="shadow-sm"
              title="减排目标进度"
              extra={
                <Select
                  value={filters.chartTypes.progress}
                  onChange={(value) => updateChartType('progress', value)}
                  style={{ width: 120 }}
                >
                  <Option value="progress">进度条</Option>
                  <Option value="gauge">仪表盘</Option>
                </Select>
              }
            >
              <ProgressChart
                data={progressData}
                chartType={filters.chartTypes.progress}
                loading={loading}
                height={350}
                title=""
                description=""
              />
            </Card>
          </Col>

          {/* 环境影响图 */}
          <Col xs={24}>
            <Card 
              className="shadow-sm"
              title="环境影响分析"
              extra={
                <Select
                  value={filters.chartTypes.impact}
                  onChange={(value) => updateChartType('impact', value)}
                  style={{ width: 120 }}
                >
                  <Option value="area">面积图</Option>
                  <Option value="column">柱状图</Option>
                  <Option value="rose">玫瑰图</Option>
                </Select>
              }
            >
              <ImpactChart
                data={impactData}
                chartType={filters.chartTypes.impact}
                loading={loading}
                height={400}
                title=""
                description=""
                groupBy="region"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};