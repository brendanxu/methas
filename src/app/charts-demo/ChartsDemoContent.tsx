'use client';

import React from 'react';
import { Dashboard } from '@/components/charts/Dashboard';
import { EmissionChart, generateSampleEmissionData } from '@/components/charts/EmissionChart';
import { ProgressChart, generateSampleProgressData } from '@/components/charts/ProgressChart';
import { ImpactChart, generateSampleImpactData } from '@/components/charts/ImpactChart';
import { Card, Row, Col, Typography, Divider, Button, Space } from 'antd';
import { BarChartOutlined, DashboardOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function ChartsDemoContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <Title level={1} className="mb-4">
              <BarChartOutlined className="mr-3" />
              数据可视化展示
            </Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              South Pole 气候数据可视化系统，提供实时的温室气体排放监控、减排进度跟踪和环境影响分析。
              使用 Ant Design Charts 构建的交互式图表组件，支持多种图表类型和实时数据更新。
            </Paragraph>
            
            <Space className="mt-6">
              <Button type="primary" size="large" icon={<DashboardOutlined />}>
                查看完整仪表板
              </Button>
              <Button size="large" icon={<LineChartOutlined />}>
                详细数据分析
              </Button>
            </Space>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 完整仪表板 */}
        <section className="mb-12">
          <Card className="shadow-lg">
            <Title level={2} className="mb-6">
              <DashboardOutlined className="mr-2" />
              综合数据仪表板
            </Title>
            <Paragraph className="mb-6 text-gray-600">
              集成了所有关键气候指标的交互式仪表板，支持实时数据更新、多维度筛选和数据导出功能。
            </Paragraph>
            <Dashboard />
          </Card>
        </section>

        <Divider />

        {/* 单独图表展示 */}
        <section className="mb-12">
          <Title level={2} className="mb-8 text-center">
            图表组件展示
          </Title>
          
          <Row gutter={[24, 24]}>
            {/* 排放趋势图 */}
            <Col xs={24} lg={12}>
              <Card title="温室气体排放趋势 - 线图" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  展示按范围分类的年度温室气体排放量趋势，支持平滑曲线动画。
                </Paragraph>
                <EmissionChart
                  data={generateSampleEmissionData()}
                  chartType="line"
                  height={350}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="温室气体排放趋势 - 柱图" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  堆叠柱状图显示各范围排放量的构成和变化趋势。
                </Paragraph>
                <EmissionChart
                  data={generateSampleEmissionData()}
                  chartType="column"
                  height={350}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="排放构成分析 - 饼图" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  最新年份的排放量按范围分布情况分析。
                </Paragraph>
                <EmissionChart
                  data={generateSampleEmissionData()}
                  chartType="pie"
                  height={350}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="减排目标进度 - 进度条" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  多个减排目标的完成进度，使用颜色编码显示完成状态。
                </Paragraph>
                <ProgressChart
                  data={generateSampleProgressData()}
                  chartType="progress"
                  height={350}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="总体进度 - 仪表盘" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  单一指标的完成度展示，适合关键KPI监控。
                </Paragraph>
                <ProgressChart
                  data={[generateSampleProgressData()[0]]}
                  chartType="gauge"
                  height={350}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="环境影响分析 - 面积图" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  各项目和地区的环境影响数据，展示时间序列变化。
                </Paragraph>
                <ImpactChart
                  data={generateSampleImpactData()}
                  chartType="area"
                  height={350}
                  groupBy="region"
                />
              </Card>
            </Col>

            <Col xs={24}>
              <Card title="项目分布 - 玫瑰图" className="shadow-md">
                <Paragraph className="text-gray-600 mb-4">
                  各类环境项目的分布情况，使用玫瑰图展示比例关系。
                </Paragraph>
                <ImpactChart
                  data={generateSampleImpactData()}
                  chartType="rose"
                  height={400}
                  groupBy="category"
                />
              </Card>
            </Col>
          </Row>
        </section>

        <Divider />

        {/* 功能特性说明 */}
        <section className="mb-12">
          <Title level={2} className="mb-8 text-center">
            功能特性
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <LineChartOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>多样化图表类型</Title>
                <Paragraph className="text-gray-600">
                  支持线图、柱图、饼图、面积图、仪表盘等多种图表类型，满足不同数据展示需求。
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <DashboardOutlined className="text-4xl text-green-500 mb-4" />
                <Title level={4}>实时数据更新</Title>
                <Paragraph className="text-gray-600">
                  支持自动数据刷新、缓存管理和实时监控，确保数据的时效性和准确性。
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center h-full">
                <BarChartOutlined className="text-4xl text-purple-500 mb-4" />
                <Title level={4}>交互式操作</Title>
                <Paragraph className="text-gray-600">
                  支持图表类型切换、数据筛选、导出功能，提供丰富的用户交互体验。
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        {/* 技术说明 */}
        <section>
          <Card className="bg-blue-50 border-blue-200">
            <Title level={3} className="text-blue-800 mb-4">
              技术实现
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={5} className="text-blue-700">前端技术栈</Title>
                <ul className="text-gray-700 space-y-2">
                  <li>• React 18 + TypeScript</li>
                  <li>• Ant Design Charts (基于 G2Plot)</li>
                  <li>• Ant Design UI 组件库</li>
                  <li>• Tailwind CSS 样式框架</li>
                  <li>• Next.js 全栈框架</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5} className="text-blue-700">核心特性</Title>
                <ul className="text-gray-700 space-y-2">
                  <li>• 响应式设计，支持移动端</li>
                  <li>• 服务端渲染优化</li>
                  <li>• 数据缓存和性能优化</li>
                  <li>• 可访问性支持</li>
                  <li>• 模块化组件设计</li>
                </ul>
              </Col>
            </Row>
          </Card>
        </section>
      </div>
    </div>
  );
}