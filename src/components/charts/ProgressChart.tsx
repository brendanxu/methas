'use client';

import React from 'react';
import { Column, Gauge } from '@ant-design/charts';
import { BaseChart } from './BaseChart';

interface ProgressData {
  current: number;
  target: number;
  label: string;
  unit?: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  chartType?: 'progress' | 'gauge';
  loading?: boolean;
  error?: string | null;
  height?: number;
  title?: string;
  description?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  chartType = 'progress',
  loading = false,
  error = null,
  height = 400,
  title = '碳中和目标进度',
  description = '各项减排目标的完成情况'
}) => {
  const progressConfig = {
    height: Math.max(200, height - 120),
    data: data.map(item => ({
      ...item,
      percent: Math.min(item.current / item.target, 1), // 确保不超过100%
    })),
    xField: 'label',
    yField: 'percent',
    color: ['#52c41a', '#faad14', '#fa8c16', '#ff4d4f'],
    label: {
      position: 'middle' as const,
      style: {
        fill: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.label,
        value: `${datum.current.toLocaleString()} / ${datum.target.toLocaleString()} ${datum.unit || ''}`,
      }),
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1500,
      },
    },
  };

  // 如果是单个指标，使用仪表盘
  const gaugeConfig = {
    height: Math.max(300, height - 120),
    percent: data.length > 0 ? Math.min(data[0].current / data[0].target, 1) : 0,
    range: {
      color: '#30BF78',
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    axis: {
      label: {
        formatter: (v: string) => `${Math.round(parseFloat(v) * 100)}%`,
      },
      subTickLine: {
        count: 3,
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '32px',
          lineHeight: '32px',
          fontWeight: 'bold',
          color: '#4B5563',
        },
        formatter: () => 
          data.length > 0 
            ? `${Math.round((data[0].current / data[0].target) * 100)}%`
            : '0%',
      },
      title: {
        offsetY: -36,
        style: {
          fontSize: '14px',
          color: '#6B7280',
        },
        formatter: () => data.length > 0 ? data[0].label : '进度',
      },
    },
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 2000,
      },
    },
  };

  const renderChart = () => {
    if (chartType === 'gauge' || data.length === 1) {
      return <Gauge {...gaugeConfig} />;
    }
    return <Column {...progressConfig} />;
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
export const generateSampleProgressData = (): ProgressData[] => [
  { current: 8500, target: 10000, label: '可再生能源使用', unit: 'MWh' },
  { current: 7200, target: 8000, label: '废物回收率', unit: '吨' },
  { current: 4800, target: 6000, label: '水资源节约', unit: '立方米' },
  { current: 15000, target: 20000, label: '碳抵消项目', unit: '吨CO2e' },
];