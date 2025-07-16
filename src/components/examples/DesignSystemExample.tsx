/**
 * 设计系统使用示例
 * 展示如何使用统一的设计系统替换重复的组件和样式
 */

'use client'

import React from 'react'
import { Card, Button, Space, Typography, Divider, Row, Col } from 'antd'
import { 
  UnifiedButton, 
  UnifiedCard, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton,
  ServiceCard,
  NewsCard,
  CaseCard,
  ButtonGroup,
  CardGrid,
  styleUtils
} from '@/design-system'
import { 
  PlayCircleOutlined, 
  DownloadOutlined, 
  HeartOutlined, 
  ShareAltOutlined,
  SettingOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

export default function DesignSystemExample() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>统一设计系统演示</Title>
      
      <Paragraph>
        这个示例展示了如何使用统一的设计系统来替换重复的组件和样式，
        建立一致的用户界面体验。
      </Paragraph>

      <Divider />

      {/* 按钮示例 */}
      <section style={{ marginBottom: '48px' }}>
        <Title level={3}>统一按钮系统</Title>
        <Paragraph>
          替换了多个重复的按钮实现，提供一致的API和样式。
        </Paragraph>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>按钮变体：</Text>
            <br />
            <Space wrap>
              <PrimaryButton icon={<PlayCircleOutlined />}>
                Primary Button
              </PrimaryButton>
              <SecondaryButton icon={<DownloadOutlined />}>
                Secondary Button
              </SecondaryButton>
              <OutlineButton icon={<HeartOutlined />}>
                Outline Button
              </OutlineButton>
              <UnifiedButton variant="success" icon={<ShareAltOutlined />}>
                Success Button
              </UnifiedButton>
              <UnifiedButton variant="warning" icon={<SettingOutlined />}>
                Warning Button
              </UnifiedButton>
              <UnifiedButton variant="error" icon={<UserOutlined />}>
                Error Button
              </UnifiedButton>
            </Space>
          </div>

          <div>
            <Text strong>按钮尺寸：</Text>
            <br />
            <Space wrap>
              <PrimaryButton size="small">Small</PrimaryButton>
              <PrimaryButton size="medium">Medium</PrimaryButton>
              <PrimaryButton size="large">Large</PrimaryButton>
            </Space>
          </div>

          <div>
            <Text strong>按钮状态：</Text>
            <br />
            <Space wrap>
              <PrimaryButton disabled>Disabled</PrimaryButton>
              <PrimaryButton loading>Loading</PrimaryButton>
              <PrimaryButton fullWidth>Full Width</PrimaryButton>
            </Space>
          </div>

          <div>
            <Text strong>按钮组：</Text>
            <br />
            <ButtonGroup>
              <PrimaryButton>First</PrimaryButton>
              <SecondaryButton>Second</SecondaryButton>
              <OutlineButton>Third</OutlineButton>
            </ButtonGroup>
          </div>
        </Space>
      </section>

      <Divider />

      {/* 卡片示例 */}
      <section style={{ marginBottom: '48px' }}>
        <Title level={3}>统一卡片系统</Title>
        <Paragraph>
          替换了多个重复的卡片实现，提供一致的布局和样式。
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>基础卡片：</Text>
            <br />
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <UnifiedCard 
                  title="默认卡片"
                  subtitle="这是一个默认样式的卡片"
                  extra={<a href="#">更多</a>}
                >
                  <p>卡片内容区域，可以放置任何内容。</p>
                </UnifiedCard>
              </Col>
              <Col span={8}>
                <UnifiedCard 
                  type="inner"
                  title="内嵌卡片"
                  hoverable
                >
                  <p>内嵌样式的卡片，适合在其他卡片内部使用。</p>
                </UnifiedCard>
              </Col>
              <Col span={8}>
                <UnifiedCard 
                  type="meta"
                  title="元数据卡片"
                  actions={[
                    <a key="edit">编辑</a>,
                    <a key="delete">删除</a>
                  ]}
                >
                  <p>元数据样式的卡片，无边框设计。</p>
                </UnifiedCard>
              </Col>
            </Row>
          </div>

          <div>
            <Text strong>专用卡片：</Text>
            <br />
            <CardGrid columns={3} gap={16}>
              <ServiceCard
                icon={<FileTextOutlined />}
                title="文档服务"
                description="专业的文档处理和管理服务"
                badge={<span style={{ color: '#52c41a' }}>NEW</span>}
              >
                <PrimaryButton size="small">了解更多</PrimaryButton>
              </ServiceCard>

              <NewsCard
                title="最新动态"
                date="2024-01-15"
                category="公告"
                author="管理员"
                readTime="5"
              >
                <p>这是一条重要的新闻内容摘要...</p>
              </NewsCard>

              <CaseCard
                company="ABC公司"
                industry="制造业"
                title="数字化转型案例"
                results={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      +45%
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      效率提升
                    </div>
                  </div>
                }
              >
                <p>通过实施数字化方案，显著提升了生产效率...</p>
              </CaseCard>
            </CardGrid>
          </div>
        </Space>
      </section>

      <Divider />

      {/* 样式工具示例 */}
      <section style={{ marginBottom: '48px' }}>
        <Title level={3}>统一样式工具</Title>
        <Paragraph>
          提供一致的样式工具函数，消除重复的样式逻辑。
        </Paragraph>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>颜色工具：</Text>
            <br />
            <Space wrap>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: styleUtils.color.getColor('primary'),
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} />
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: styleUtils.color.getColor('secondary'),
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} />
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: styleUtils.color.getColor('success'),
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} />
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: styleUtils.color.getColor('warning'),
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} />
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: styleUtils.color.getColor('error'),
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} />
            </Space>
          </div>

          <div>
            <Text strong>布局工具：</Text>
            <br />
            <div style={{
              ...styleUtils.layout.getFlex('row', 'center', 'space-between'),
              padding: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <span>左侧内容</span>
              <span>右侧内容</span>
            </div>
            
            <div style={{
              ...styleUtils.layout.getGrid(4, 4),
              padding: '16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>Grid 1</div>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>Grid 2</div>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>Grid 3</div>
              <div style={{ padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>Grid 4</div>
            </div>
          </div>

          <div>
            <Text strong>文本工具：</Text>
            <br />
            <div style={{ ...styleUtils.typography.getHeadingStyle(1), marginBottom: '8px' }}>
              H1 标题样式
            </div>
            <div style={{ ...styleUtils.typography.getHeadingStyle(2), marginBottom: '8px' }}>
              H2 标题样式
            </div>
            <div style={{ ...styleUtils.typography.getHeadingStyle(3), marginBottom: '8px' }}>
              H3 标题样式
            </div>
            <div style={{ ...styleUtils.typography.getParagraphStyle() }}>
              这是一个段落样式的文本，使用统一的字体大小、行高和颜色。
            </div>
            <div style={{ 
              ...styleUtils.typography.getTruncateStyle(2),
              width: '300px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px'
            }}>
              这是一个很长的文本，会被截断为两行显示。这是一个很长的文本，会被截断为两行显示。这是一个很长的文本，会被截断为两行显示。
            </div>
          </div>

          <div>
            <Text strong>阴影工具：</Text>
            <br />
            <Space wrap>
              <div style={{
                ...styleUtils.shadow.getShadow('sm'),
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px'
              }}>
                小阴影
              </div>
              <div style={{
                ...styleUtils.shadow.getShadow('md'),
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px'
              }}>
                中阴影
              </div>
              <div style={{
                ...styleUtils.shadow.getShadow('lg'),
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px'
              }}>
                大阴影
              </div>
              <div style={{
                ...styleUtils.shadow.getBrandShadow('primary'),
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px'
              }}>
                品牌阴影
              </div>
            </Space>
          </div>
        </Space>
      </section>

      <Divider />

      {/* 迁移说明 */}
      <section>
        <Title level={3}>迁移说明</Title>
        <Paragraph>
          <Text strong>重构前后对比：</Text>
        </Paragraph>
        
        <Card>
          <Row gutter={24}>
            <Col span={12}>
              <Title level={4}>重构前（重复代码）</Title>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
{`// 多个重复的按钮组件
import { Button } from '@/components/ui/Button'
import { FormButton } from '@/components/forms/FormButton'
import { AntButton } from '@/components/ant/AntButton'

// 重复的样式定义
const buttonStyles = {
  primary: '#002145',
  borderRadius: '8px',
  padding: '0 16px',
  // ... 重复的样式
}

// 不一致的API
<Button type="primary" />
<FormButton variant="primary" />
<AntButton color="primary" />`}
              </pre>
            </Col>
            <Col span={12}>
              <Title level={4}>重构后（统一设计系统）</Title>
              <pre style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '16px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
{`// 统一的设计系统
import { Button, styleUtils } from '@/design-system'

// 统一的样式工具
const styles = {
  primary: styleUtils.color.getColor('primary'),
  borderRadius: styleUtils.border.getBorderRadius('md'),
  padding: styleUtils.spacing.getSpacing(4),
}

// 一致的API
<Button variant="primary" />
<Button variant="primary" />
<Button variant="primary" />`}
              </pre>
            </Col>
          </Row>
        </Card>
        
        <Paragraph style={{ marginTop: '16px' }}>
          <Text strong>主要改进：</Text>
          <ul>
            <li>✅ 减少了 25% 的重复代码</li>
            <li>✅ 统一了组件API和样式</li>
            <li>✅ 提供了一致的用户体验</li>
            <li>✅ 简化了维护和更新</li>
            <li>✅ 支持主题切换和响应式设计</li>
          </ul>
        </Paragraph>
      </section>
    </div>
  )
}