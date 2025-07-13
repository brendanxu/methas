'use client';

// Force dynamic rendering for interactive news page with filtering and search
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import React, { useState, useMemo } from 'react';
import {  motion  } from '@/lib/mock-framer-motion';
import { 
  Select, 
  DatePicker, 
  Input, 
  Radio, 
  Pagination, 
  Tag, 
  Form, 
  Button as AntButton, 
  Skeleton, 
  Empty,
  Card
} from 'antd';
import { 
  SearchOutlined, 
  CalendarOutlined, 
  FilterOutlined,
  DownloadOutlined,
  MailOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { NewsCard } from '@/components/ui/NewsCard';
import { Button } from '@/components/ui/Button';
import { useThemeColors } from '@/app/providers';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 类型定义
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: Date;
  category: 'company' | 'industry' | 'events';
  author: string;
  readingTime: number;
  tags: string[];
  href: string;
  featured?: boolean;
  views?: number;
}

// 模拟数据
const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'South Pole 获得 2024 年度可持续发展创新奖',
    excerpt: '凭借在碳中和领域的突破性技术创新和卓越的客户服务，South Pole 荣获联合国环境规划署颁发的可持续发展创新奖，这是对我们在全球气候行动中贡献的重要认可。',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '可持续发展创新奖颁奖典礼',
    publishedAt: new Date('2024-03-15'),
    category: 'company',
    author: 'Sarah Chen',
    readingTime: 3,
    tags: ['企业动态', '获奖', '创新', '联合国'],
    href: '/news/sustainability-innovation-award-2024',
    featured: true,
    views: 1250
  },
  {
    id: 'news-2',
    title: '全球碳市场发展趋势报告：2024年第一季度',
    excerpt: '最新发布的全球碳市场分析显示，2024年第一季度碳信用交易量同比增长45%，价格稳定在每吨25-30美元区间。企业对高质量碳信用的需求持续强劲。',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '碳市场趋势图表',
    publishedAt: new Date('2024-03-12'),
    category: 'industry',
    author: 'Michael Johnson',
    readingTime: 5,
    tags: ['市场分析', '碳信用', '趋势报告'],
    href: '/news/carbon-market-trends-q1-2024',
    views: 890
  },
  {
    id: 'news-3',
    title: 'COP29 气候峰会预热：企业脱碳路径新思考',
    excerpt: '随着COP29气候峰会临近，全球企业界对脱碳路径的讨论日趋激烈。South Pole 首席执行官将在峰会上分享"科技驱动的企业脱碳解决方案"主题演讲。',
    imageUrl: 'https://images.unsplash.com/photo-1497436072909-f5e4be1713b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'COP29 气候峰会会场',
    publishedAt: new Date('2024-03-10'),
    category: 'events',
    author: 'David Liu',
    readingTime: 4,
    tags: ['COP29', '脱碳', '峰会', '演讲'],
    href: '/news/cop29-summit-preparation',
    views: 675
  },
  {
    id: 'news-4',
    title: '欧盟碳边境调节机制正式实施对亚洲企业的影响分析',
    excerpt: '欧盟碳边境调节机制(CBAM)正式实施，对出口到欧盟的亚洲制造企业带来新的合规要求。我们为企业提供详细的应对策略和实施指南。',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '欧盟总部大楼',
    publishedAt: new Date('2024-03-08'),
    category: 'industry',
    author: 'Emma Wang',
    readingTime: 6,
    tags: ['CBAM', '欧盟', '合规', '制造业'],
    href: '/news/eu-cbam-impact-analysis',
    views: 1120
  },
  {
    id: 'news-5',
    title: 'South Pole 亚太区总部正式落户新加坡',
    excerpt: '为更好地服务亚太地区客户，South Pole 亚太区总部正式落户新加坡，这将进一步加强我们在东南亚可持续发展市场的布局和服务能力。',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '新加坡天际线',
    publishedAt: new Date('2024-03-05'),
    category: 'company',
    author: 'Jennifer Lee',
    readingTime: 3,
    tags: ['新加坡', '总部', '亚太区', '扩张'],
    href: '/news/apac-headquarters-singapore',
    views: 580
  },
  {
    id: 'news-6',
    title: '人工智能在碳排放监测中的革命性应用',
    excerpt: 'South Pole 最新推出的AI驱动碳排放监测平台，能够实时追踪企业碳足迹，准确率较传统方法提升40%，为企业制定更精准的减排策略提供数据支持。',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'AI技术应用图示',
    publishedAt: new Date('2024-03-03'),
    category: 'industry',
    author: 'Alex Chen',
    readingTime: 4,
    tags: ['人工智能', '碳监测', '技术创新'],
    href: '/news/ai-carbon-monitoring-platform',
    views: 950
  },
  {
    id: 'news-7',
    title: '绿色金融新纪元：可持续投资基金突破千亿美元',
    excerpt: '全球可持续投资基金规模首次突破千亿美元大关，ESG投资理念深入人心。South Pole 为超过50家金融机构提供ESG评估和绿色投资咨询服务。',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '绿色金融概念图',
    publishedAt: new Date('2024-03-01'),
    category: 'industry',
    author: 'Robert Zhang',
    readingTime: 5,
    tags: ['绿色金融', 'ESG', '投资', '基金'],
    href: '/news/sustainable-investment-milestone',
    views: 720
  },
  {
    id: 'news-8',
    title: '2024 年可持续发展峰会圆满落幕',
    excerpt: '为期三天的2024年可持续发展峰会圆满落幕，来自全球的500多位企业领袖和专家共同探讨了净零转型的最佳实践和未来趋势。',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: '可持续发展峰会现场',
    publishedAt: new Date('2024-02-28'),
    category: 'events',
    author: 'Lisa Kim',
    readingTime: 4,
    tags: ['峰会', '可持续发展', '净零转型'],
    href: '/news/sustainability-summit-2024-recap',
    views: 630
  }
];

// 分类选项
const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: 'company', label: '公司新闻' },
  { value: 'industry', label: '行业洞察' },
  { value: 'events', label: '活动报道' }
];

// 时间筛选选项
const timeFilterOptions = [
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一月' },
  { value: 'quarter', label: '最近三月' },
  { value: 'custom', label: '自定义时间' }
];

// 热门标签
const popularTags = [
  '碳中和', 'ESG', '可持续发展', '气候变化', '绿色金融',
  '净零排放', '碳市场', '清洁能源', '环保技术', '企业责任'
];

// 资源下载
const downloadResources = [
  {
    title: '2024年碳市场趋势报告',
    description: '深度分析全球碳市场发展趋势',
    type: 'PDF',
    size: '2.5MB'
  },
  {
    title: 'ESG投资指南白皮书',
    description: '企业ESG投资的完整指南',
    type: 'PDF',
    size: '1.8MB'
  },
  {
    title: '净零转型实施手册',
    description: '帮助企业制定净零转型策略',
    type: 'PDF',
    size: '3.2MB'
  }
];

export default function NewsPage() {
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  
  // 筛选状态
  const [filters, setFilters] = useState({
    category: 'all',
    timeFilter: 'all',
    customDateRange: null as [Dayjs | null, Dayjs | null] | null,
    searchQuery: '',
    sortBy: 'latest'
  });
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12
  });

  // 筛选和搜索逻辑
  const filteredArticles = useMemo(() => {
    let filtered = [...newsArticles];

    // 分类筛选
    if (filters.category !== 'all') {
      filtered = filtered.filter(article => article.category === filters.category);
    }

    // 时间筛选
    const now = dayjs();
    if (filters.timeFilter === 'week') {
      filtered = filtered.filter(article => 
        dayjs(article.publishedAt).isAfter(now.subtract(1, 'week'))
      );
    } else if (filters.timeFilter === 'month') {
      filtered = filtered.filter(article => 
        dayjs(article.publishedAt).isAfter(now.subtract(1, 'month'))
      );
    } else if (filters.timeFilter === 'quarter') {
      filtered = filtered.filter(article => 
        dayjs(article.publishedAt).isAfter(now.subtract(3, 'month'))
      );
    } else if (filters.timeFilter === 'custom' && filters.customDateRange) {
      const [start, end] = filters.customDateRange;
      if (start && end) {
        filtered = filtered.filter(article => {
          const publishDate = dayjs(article.publishedAt);
          return publishDate.isAfter(start) && publishDate.isBefore(end);
        });
      }
    }

    // 搜索筛选
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 排序
    if (filters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return filtered;
  }, [filters]);

  // 分页数据
  const paginatedArticles = useMemo(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, pagination]);

  // 特色文章（第一篇）
  const featuredArticle = paginatedArticles[0];
  const regularArticles = paginatedArticles.slice(1);

  // 处理筛选变化
  const handleFilterChange = (key: string, value: string | [Dayjs | null, Dayjs | null] | null) => {
    setLoading(true);
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
    
    // 模拟加载效果
    setTimeout(() => setLoading(false), 300);
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      current: page,
      pageSize: pageSize || pagination.pageSize
    });
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 简化版 Hero */}
      <section 
        className="relative py-20 bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              新闻中心
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              了解最新的行业动态和公司新闻
            </p>
          </motion.div>
        </div>
        
        {/* 装饰性元素 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区域 */}
          <main className="flex-1">
            {/* 筛选工具栏 */}
            <motion.div
              className="bg-card rounded-2xl p-6 mb-8 shadow-soft border border-border"
              style={{ backgroundColor: colors.card }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FilterOutlined className="text-primary" />
                <h3 className="text-lg font-semibold text-foreground">筛选和搜索</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 分类筛选 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">分类</label>
                  <Select
                    value={filters.category}
                    onChange={(value) => handleFilterChange('category', value)}
                    className="w-full"
                    size="large"
                  >
                    {categoryOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* 时间筛选 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">时间</label>
                  <Select
                    value={filters.timeFilter}
                    onChange={(value) => handleFilterChange('timeFilter', value)}
                    className="w-full"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                  >
                    <Option value="all">全部时间</Option>
                    {timeFilterOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* 自定义时间范围 */}
                {filters.timeFilter === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">时间范围</label>
                    <RangePicker
                      value={filters.customDateRange}
                      onChange={(dates) => handleFilterChange('customDateRange', dates)}
                      className="w-full"
                      size="large"
                    />
                  </div>
                )}

                {/* 排序 */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">排序</label>
                  <Radio.Group
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full"
                    size="large"
                  >
                    <Radio.Button value="latest">最新</Radio.Button>
                    <Radio.Button value="popular">最热门</Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              {/* 搜索框 */}
              <div className="mt-4">
                <Input.Search
                  placeholder="搜索文章标题、内容或标签..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  onSearch={(value) => handleFilterChange('searchQuery', value)}
                  size="large"
                  enterButton={<SearchOutlined />}
                  allowClear
                />
              </div>
            </motion.div>

            {/* 文章列表 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="w-full">
                      <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Card>
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <Empty
                  description="没有找到相关文章"
                  className="py-16"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <>
                  {/* 特色文章（全宽） */}
                  {featuredArticle && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative">
                        <div className="absolute top-4 left-4 z-10">
                          <Tag color="gold" className="font-medium">特色文章</Tag>
                        </div>
                        <NewsCard
                          {...featuredArticle}
                          layout="horizontal"
                          className="shadow-lg"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* 常规文章网格 */}
                  {regularArticles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {regularArticles.map((article, index) => (
                        <motion.div
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <NewsCard {...article} layout="vertical" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* 分页 */}
                  {filteredArticles.length > pagination.pageSize && (
                    <motion.div
                      className="flex justify-center mt-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={filteredArticles.length}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                          `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                        }
                        onChange={handlePageChange}
                        size="default"
                      />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </main>

          {/* 侧边栏 */}
          <aside className="lg:w-80">
            <div className="space-y-6 sticky top-24">
              {/* 热门标签云 */}
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-soft border border-border"
                style={{ backgroundColor: colors.card }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <Tag
                      key={tag}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleFilterChange('searchQuery', tag)}
                      style={{
                        backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 90%)`,
                        color: colors.foreground,
                        border: 'none'
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter 订阅 */}
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-soft border border-border"
                style={{ backgroundColor: colors.card }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MailOutlined className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">订阅动态</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  订阅我们的新闻简报，第一时间获取最新的行业洞察和公司动态。
                </p>
                <Form layout="vertical">
                  <Form.Item
                    label="邮箱地址"
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="your@email.com" size="large" />
                  </Form.Item>
                  <Form.Item>
                    <Button variant="primary" fullWidth>
                      立即订阅
                    </Button>
                  </Form.Item>
                </Form>
              </motion.div>

              {/* 相关资源下载 */}
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-soft border border-border"
                style={{ backgroundColor: colors.card }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <DownloadOutlined className="text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">资源下载</h3>
                </div>
                <div className="space-y-4">
                  {downloadResources.map((resource, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h4 className="font-medium text-foreground mb-1">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {resource.type} • {resource.size}
                        </span>
                        <AntButton size="small" type="link" icon={<DownloadOutlined />}>
                          下载
                        </AntButton>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}