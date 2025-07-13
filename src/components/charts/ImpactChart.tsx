'use client';

import React from 'react';
import { Area, Column, Rose } from '@ant-design/charts';
import { BaseChart } from './BaseChart';

interface ImpactData {
  category: string;
  value: number;
  year?: number;
  region?: string;
  unit?: string;
}

interface ImpactChartProps {
  data: ImpactData[];
  chartType?: 'area' | 'column' | 'rose';
  loading?: boolean;
  error?: string | null;
  height?: number;
  title?: string;
  description?: string;
  groupBy?: 'category' | 'year' | 'region';
}

export const ImpactChart: React.FC<ImpactChartProps> = ({
  data,
  chartType = 'area',
  loading = false,
  error = null,
  height = 400,
  title = '环境影响分析',
  description = '各项目和地区的环境影响数据',
  groupBy = 'category'
}) => {
  const getColorPalette = () => [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#fa8c16', '#eb2f96', '#13c2c2', '#a0d911', '#2f54eb'
  ];

  const areaConfig = {
    data,
    xField: groupBy === 'year' ? 'year' : 'category',
    yField: 'value',
    seriesField: groupBy === 'year' ? 'category' : 'region',
    color: getColorPalette(),
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 2000,
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum[groupBy === 'year' ? 'category' : 'region'] || datum.category,
        value: `${datum.value.toLocaleString()} ${datum.unit || '单位'}`,
      }),
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()}`,
      },
    },
    areaStyle: {
      fillOpacity: 0.7,
    },
  };

  const columnConfig = {
    data,
    xField: 'category',
    yField: 'value',
    seriesField: groupBy === 'region' ? 'region' : 'year',
    isGroup: true,
    color: getColorPalette(),
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
        name: `${datum.category} (${datum[groupBy === 'region' ? 'region' : 'year']})`,
        value: `${datum.value.toLocaleString()} ${datum.unit || '单位'}`,
      }),
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()}`,
      },
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  const roseConfig = {
    data,
    xField: 'category',
    yField: 'value',
    seriesField: 'category',
    radius: 0.8,
    innerRadius: 0.2,
    color: getColorPalette(),
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'right' as const,
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.category,
        value: `${datum.value.toLocaleString()} ${datum.unit || '单位'}`,
      }),
    },
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
      style: {
        fontSize: 12,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return <Area {...areaConfig} />;
      case 'column':
        return <Column {...columnConfig} />;
      case 'rose':
        return <Rose {...roseConfig} />;
      default:
        return <Area {...areaConfig} />;
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
export const generateSampleImpactData = (): ImpactData[] => [
  { category: '森林保护', value: 125000, year: 2024, region: '亚洲', unit: '公顷' },
  { category: '森林保护', value: 98000, year: 2024, region: '南美', unit: '公顷' },
  { category: '森林保护', value: 67000, year: 2024, region: '非洲', unit: '公顷' },
  { category: '可再生能源', value: 450000, year: 2024, region: '亚洲', unit: 'MWh' },
  { category: '可再生能源', value: 320000, year: 2024, region: '欧洲', unit: 'MWh' },
  { category: '可再生能源', value: 280000, year: 2024, region: '北美', unit: 'MWh' },
  { category: '甲烷回收', value: 85000, year: 2024, region: '全球', unit: '吨CO2e' },
  { category: '社区发展', value: 12000, year: 2024, region: '发展中国家', unit: '受益人数' },
];