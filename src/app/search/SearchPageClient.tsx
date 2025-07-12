'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Input,
  Tabs,
  Card,
  Select,
  DatePicker,
  Radio,
  Pagination,
  Tag,
  Empty,
  Spin,
  Row,
  Col,
  Button as AntButton,
} from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  BookOutlined,
  ToolOutlined,
  FolderOutlined,
  FilterOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import dayjs, { Dayjs } from 'dayjs';
import { useThemeColors } from '@/app/providers';
import { useSearch, SearchResultItem, SearchFilters } from '@/hooks/useSearch';
import { trackClick } from '@/lib/analytics';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 类型图标映射
const typeIcons: Record<string, React.ComponentType> = {
  page: FileTextOutlined,
  news: BookOutlined,
  service: ToolOutlined,
  case: FolderOutlined,
  resource: FolderOutlined,
};

// 类型标签颜色
const typeColors: Record<string, string> = {
  page: 'blue',
  news: 'green',
  service: 'orange',
  case: 'purple',
  resource: 'cyan',
};

// 类型中文名称
const typeNames: Record<string, string> = {
  all: '全部',
  page: '页面',
  news: '新闻',
  service: '服务',
  case: '案例',
  resource: '资源',
};

// 搜索结果卡片组件
const SearchResultCard: React.FC<{
  item: SearchResultItem;
  query: string;
}> = ({ item, query }) => {
  const colors = useThemeColors();
  const IconComponent = typeIcons[item.type];

  const handleClick = () => {
    trackClick('search_result', {
      result_type: item.type,
      result_id: item.id,
      search_query: query,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        hoverable
        className="mb-4 border border-border"
        style={{ backgroundColor: colors.card }}
        onClick={handleClick}
      >
        <Link href={item.url} className="block">
          <div className="flex gap-4">
            {/* 左侧图标和图片 */}
            <div className="flex-shrink-0">
              {item.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent />
                  )}
                </div>
              )}
            </div>

            {/* 右侧内容 */}
            <div className="flex-1 min-w-0">
              {/* 标题和类型 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 
                  className="text-lg font-semibold text-foreground line-clamp-2 flex-1"
                  dangerouslySetInnerHTML={{ 
                    __html: item.title.replace(
                      new RegExp(`(${query})`, 'gi'), 
                      '<span style="background-color: yellow; color: #000;">$1</span>'
                    )
                  }}
                />
                <Tag color={typeColors[item.type]} className="flex-shrink-0">
                  {typeNames[item.type]}
                </Tag>
              </div>

              {/* 内容摘要 */}
              <p 
                className="text-muted-foreground mb-3 line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: item.excerpt.replace(
                    new RegExp(`(${query})`, 'gi'), 
                    '<span style="color: ' + colors.primary + '; font-weight: 500;">$1</span>'
                  )
                }}
              />

              {/* 元信息 */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                {/* 面包屑 */}
                <div className="flex items-center gap-1">
                  {item.breadcrumb.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span>/</span>}
                      <span>{crumb}</span>
                    </React.Fragment>
                  ))}
                </div>

                {/* 发布时间 */}
                {item.publishedAt && (
                  <div className="flex items-center gap-1">
                    <CalendarOutlined />
                    <span>{dayjs(item.publishedAt).format('YYYY年MM月DD日')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

// 高级筛选组件
const AdvancedFilters: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
}> = ({ filters, onFiltersChange }) => {
  const [customDateRange, setCustomDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  return (
    <Card className="mb-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <FilterOutlined className="text-primary" />
        <h3 className="font-semibold text-foreground">高级筛选</h3>
      </div>

      <Row gutter={[16, 16]}>
        {/* 时间范围 */}
        <Col xs={24} sm={12} md={8}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">时间范围</label>
            <Select
              value={filters.timeRange}
              onChange={(value) => onFiltersChange({ timeRange: value })}
              className="w-full"
              size="large"
            >
              <Select.Option value="all">全部时间</Select.Option>
              <Select.Option value="week">最近一周</Select.Option>
              <Select.Option value="month">最近一月</Select.Option>
              <Select.Option value="quarter">最近三月</Select.Option>
              <Select.Option value="year">最近一年</Select.Option>
            </Select>
          </div>
        </Col>

        {/* 自定义时间范围 */}
        {filters.timeRange === 'custom' && (
          <Col xs={24} sm={12} md={8}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">自定义时间</label>
              <RangePicker
                value={customDateRange}
                onChange={(dates) => setCustomDateRange(dates)}
                className="w-full"
                size="large"
              />
            </div>
          </Col>
        )}

        {/* 排序方式 */}
        <Col xs={24} sm={12} md={8}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">排序方式</label>
            <Radio.Group
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
              className="w-full"
              size="large"
            >
              <Radio.Button value="relevance">相关性</Radio.Button>
              <Radio.Button value="date">时间</Radio.Button>
              <Radio.Button value="title">标题</Radio.Button>
            </Radio.Group>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

// 搜索页面内容组件
const SearchPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    query,
    resultsByType,
    loading,
    total,
    filters,
    error,
    took,
    setQuery,
    updateFilters,
  } = useSearch();

  // 从URL参数初始化搜索
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) {
      setQuery(q);
    }
  }, [searchParams, query, setQuery]);

  // 处理搜索
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    setCurrentPage(1);
  };

  // 处理Tab切换
  const handleTabChange = (activeKey: string) => {
    updateFilters({ type: activeKey as SearchFilters['type'] });
    setCurrentPage(1);
  };

  // 获取当前Tab的结果
  const currentResults = resultsByType[filters.type] || [];
  const paginatedResults = currentResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 获取Tab统计
  const getTabCount = (type: string) => {
    return type === 'all' ? total : resultsByType[type]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 搜索头部 */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold text-foreground mb-4">搜索</h1>
            
            {/* 搜索框 */}
            <div className="relative max-w-2xl">
              <SearchOutlined 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg" 
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                placeholder="搜索页面、新闻、服务或资源..."
                className="pl-12 h-12 text-lg"
                size="large"
                suffix={
                  <AntButton
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => handleSearch(query)}
                    disabled={!query.trim()}
                  >
                    搜索
                  </AntButton>
                }
              />
            </div>

            {/* 搜索统计 */}
            {query && (
              <div className="mt-4 text-muted-foreground">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spin size="small" />
                    <span>搜索中...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <span>⚠️ {error}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>
                      找到 <strong className="text-foreground">{total}</strong> 条关于 &ldquo;
                      <strong className="text-primary">{query}</strong>&rdquo; 的结果
                    </span>
                    {took > 0 && (
                      <span className="text-xs text-muted-foreground">
                        用时 {took}ms
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!query.trim() ? (
          /* 无搜索内容时的提示 */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <SearchOutlined className="text-6xl text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              开始搜索
            </h2>
            <p className="text-muted-foreground mb-8">
              输入关键词搜索页面、新闻、服务或资源
            </p>
            
            {/* 热门搜索建议 */}
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-foreground mb-4">热门搜索</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['碳中和', '碳足迹', 'ESG', '可持续发展', '绿色金融'].map((tag) => (
                  <Tag
                    key={tag}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleSearch(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </motion.div>
        ) : loading ? (
          /* 加载状态 */
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        ) : error ? (
          /* 错误状态 */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              搜索出现问题
            </h2>
            <p className="text-muted-foreground mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              刷新重试
            </button>
          </motion.div>
        ) : total === 0 ? (
          /* 无结果状态 */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Empty
              description={
                <div>
                  <p className="text-lg mb-2">没有找到相关内容</p>
                  <p className="text-muted-foreground">
                    试试其他关键词或者检查拼写
                  </p>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-16"
            />
          </motion.div>
        ) : (
          /* 搜索结果 */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 高级筛选 */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={updateFilters}
            />

            {/* 结果分类Tab */}
            <Tabs
              activeKey={filters.type}
              onChange={handleTabChange}
              size="large"
              className="mb-6"
            >
              <TabPane
                tab={`全部 (${getTabCount('all')})`}
                key="all"
              />
              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    页面 ({getTabCount('page')})
                  </span>
                }
                key="page"
              />
              <TabPane
                tab={
                  <span>
                    <BookOutlined />
                    新闻 ({getTabCount('news')})
                  </span>
                }
                key="news"
              />
              <TabPane
                tab={
                  <span>
                    <ToolOutlined />
                    服务 ({getTabCount('service')})
                  </span>
                }
                key="service"
              />
              <TabPane
                tab={
                  <span>
                    <FolderOutlined />
                    案例 ({getTabCount('case')})
                  </span>
                }
                key="case"
              />
              <TabPane
                tab={
                  <span>
                    <FolderOutlined />
                    资源 ({getTabCount('resource')})
                  </span>
                }
                key="resource"
              />
            </Tabs>

            {/* 搜索结果列表 */}
            <div className="mb-8">
              {paginatedResults.length === 0 ? (
                <Empty
                  description={`没有找到${typeNames[filters.type]}类型的相关内容`}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                paginatedResults.map((item) => (
                  <SearchResultCard
                    key={item.id}
                    item={item}
                    query={query}
                  />
                ))
              )}
            </div>

            {/* 分页 */}
            {currentResults.length > pageSize && (
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={currentResults.length}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// 主搜索页面组件
export default function SearchPageClient() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Spin size="large" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}