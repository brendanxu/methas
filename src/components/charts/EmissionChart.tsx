'use client';

import React, { useMemo } from 'react';
import { Line, Column, Pie } from '@ant-design/charts';
import { BaseChart } from './BaseChart';

interface EmissionData {
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

interface EmissionChartProps {
  data: EmissionData[];
  chartType?: 'line' | 'column' | 'pie';
  loading?: boolean;
  error?: string | null;
  height?: number;
  title?: string;
  description?: string;
}

export const EmissionChart: React.FC<EmissionChartProps> = ({
  data,
  chartType = 'line',
  loading = false,
  error = null,
  height = 400,
  title = '温室气体排放趋势',
  description = '按范围分类的年度温室气体排放量（吨CO2当量）'
}) => {
  const chartData = useMemo(() => {
    if (chartType === 'pie') {
      // 为饼图转换数据 - 使用最新年份的数据
      const latestData = data[data.length - 1];
      if (!latestData) return [];
      
      return [
        { type: 'Scope 1 直接排放', value: latestData.scope1 },
        { type: 'Scope 2 电力排放', value: latestData.scope2 },
        { type: 'Scope 3 价值链排放', value: latestData.scope3 },
      ];
    }
    
    // 为线图和柱图转换数据
    return data.flatMap(item => [
      { year: item.year.toString(), type: 'Scope 1', value: item.scope1 },
      { year: item.year.toString(), type: 'Scope 2', value: item.scope2 },
      { year: item.year.toString(), type: 'Scope 3', value: item.scope3 },
    ]);
  }, [data, chartType]);

  const lineConfig = {
    data: chartData,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 2000,
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toLocaleString()} 吨CO2e`,
      }),
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()}`,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
    },
  };

  const columnConfig = {
    data: chartData,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    isStack: true,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1500,
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toLocaleString()} 吨CO2e`,
      }),
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()}`,
      },
    },
  };

  const pieConfig = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
    },
    legend: {
      position: 'right' as const,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toLocaleString()} 吨CO2e`,
      }),
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line {...lineConfig} />;
      case 'column':
        return <Column {...columnConfig} />;
      case 'pie':
        return <Pie {...pieConfig} />;
      default:
        return <Line {...lineConfig} />;
    }
  };

  return (
    <BaseChart
      loading={loading}
      error={error}
      title={title}
      description={description}
      height={height}
    >
      {renderChart()}
    </BaseChart>
  );
};

// 示例数据生成器
export const generateSampleEmissionData = (): EmissionData[] => [
  { year: 2020, scope1: 12500, scope2: 8300, scope3: 45000, total: 65800 },
  { year: 2021, scope1: 11800, scope2: 7200, scope3: 42000, total: 61000 },
  { year: 2022, scope1: 10200, scope2: 6100, scope3: 38500, total: 54800 },
  { year: 2023, scope1: 8900, scope2: 5400, scope3: 35000, total: 49300 },
  { year: 2024, scope1: 7500, scope2: 4800, scope3: 32000, total: 44300 },
];