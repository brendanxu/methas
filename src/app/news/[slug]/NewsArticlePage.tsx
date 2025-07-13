'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {  motion  } from '@/lib/mock-framer-motion';
import { 
  Tag, 
  Tooltip, 
  Button as AntButton, 
  Avatar, 
  Progress,
  Affix,
  Card,
  Form,
  Input
} from 'antd';
import {
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  LinkOutlined,
  ShareAltOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { NewsCard } from '@/components/ui/NewsCard';
import { useThemeColors } from '@/app/providers';
import { formatDate, formatNumber } from '@/lib/i18n';
import type { NewsArticle } from './page';

const { TextArea } = Input;

interface NewsArticlePageProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

// 分享功能
const ShareButtons: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const [articleUrl, setArticleUrl] = useState('');
  const shareText = `${article.title} - ${article.excerpt}`;
  
  useEffect(() => {
    // 只在客户端设置 URL
    if (typeof window !== 'undefined') {
      setArticleUrl(`${window.location.origin}/news/${article.slug}`);
    }
  }, [article.slug]);

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      // 这里可以添加成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">分享：</span>
      <Tooltip title="分享到 Twitter">
        <AntButton
          icon={<TwitterOutlined />}
          shape="circle"
          size="small"
          onClick={shareToTwitter}
        />
      </Tooltip>
      <Tooltip title="分享到 Facebook">
        <AntButton
          icon={<FacebookOutlined />}
          shape="circle"
          size="small"
          onClick={shareToFacebook}
        />
      </Tooltip>
      <Tooltip title="分享到 LinkedIn">
        <AntButton
          icon={<LinkedinOutlined />}
          shape="circle"
          size="small"
          onClick={shareToLinkedIn}
        />
      </Tooltip>
      <Tooltip title="复制链接">
        <AntButton
          icon={<LinkOutlined />}
          shape="circle"
          size="small"
          onClick={copyToClipboard}
        />
      </Tooltip>
    </div>
  );
};

// 目录组件
const TableOfContents: React.FC<{ 
  toc: NewsArticle['tableOfContents']; 
  activeId: string;
}> = ({ toc, activeId }) => {
  const colors = useThemeColors();

  if (!toc || toc.length === 0) return null;

  return (
    <Card className="mb-6" size="small">
      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <ShareAltOutlined />
        目录
      </h4>
      <nav>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block py-1 px-2 rounded text-sm transition-colors hover:bg-muted ${
                  activeId === item.id 
                    ? 'text-primary font-medium bg-primary/10' 
                    : 'text-muted-foreground'
                }`}
                style={{
                  paddingLeft: `${(item.level - 2) * 12 + 8}px`,
                  color: activeId === item.id ? colors.primary : colors.mutedForeground
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
};

// 阅读进度组件
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <Progress 
        percent={progress} 
        showInfo={false} 
        strokeWidth={2}
        trailColor="transparent"
      />
    </div>
  );
};

// 返回顶部按钮
const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Affix offsetBottom={24}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: visible ? 1 : 0, 
          scale: visible ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <Tooltip title="返回顶部">
          <AntButton
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            size="large"
            onClick={scrollToTop}
            className="shadow-lg"
          />
        </Tooltip>
      </motion.div>
    </Affix>
  );
};

// 评论区组件
const CommentSection: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: { name: string; email: string; comment: string }) => {
    console.log('评论提交:', values);
    // 这里处理评论提交逻辑
    form.resetFields();
  };

  return (
    <Card className="mt-8">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageOutlined />
        评论 (预留接口)
      </h3>
      
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入您的姓名' }]}
          >
            <Input placeholder="您的姓名" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="your@email.com" />
          </Form.Item>
        </div>
        
        <Form.Item
          name="comment"
          label="评论内容"
          rules={[{ required: true, message: '请输入评论内容' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="分享您的想法..."
            maxLength={500}
            showCount
          />
        </Form.Item>
        
        <Form.Item>
          <AntButton type="primary" htmlType="submit">
            发表评论
          </AntButton>
        </Form.Item>
      </Form>
      
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          💡 评论功能正在开发中，敬请期待！
        </p>
      </div>
    </Card>
  );
};

// 主组件
const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ 
  article, 
  relatedArticles 
}) => {
  const colors = useThemeColors();
  const [activeHeadingId, setActiveHeadingId] = useState('');

  // 监听标题滚动
  useEffect(() => {
    const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => observer.observe(heading));
    
    return () => observer.disconnect();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* 阅读进度条 */}
      <ReadingProgress />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区域 */}
          <main className="flex-1 max-w-4xl">
            {/* 文章头部 */}
            <motion.header
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 分类标签 */}
              <div className="mb-4">
                <Tag 
                  color={article.category === 'company' ? 'blue' : 
                        article.category === 'industry' ? 'green' : 'orange'}
                  className="text-sm"
                >
                  {article.category === 'company' ? '公司新闻' :
                   article.category === 'industry' ? '行业洞察' : '活动报道'}
                </Tag>
                {article.featured && (
                  <Tag color="gold" className="ml-2">特色文章</Tag>
                )}
              </div>

              {/* 标题 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {article.title}
              </h1>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined />
                  <span>{article.readingTime} 分钟阅读</span>
                </div>
                {article.views && (
                  <div className="flex items-center gap-2">
                    <EyeOutlined />
                    <span>{formatNumber(article.views)} 次阅读</span>
                  </div>
                )}
              </div>

              {/* 社交分享按钮 */}
              <ShareButtons article={article} />
            </motion.header>

            {/* 特色图片 */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {article.imageCaption && (
                <p className="text-sm text-muted-foreground text-center mt-3 italic">
                  {article.imageCaption}
                </p>
              )}
            </motion.div>

            {/* 文章内容 */}
            <motion.article
              className="prose prose-lg max-w-none"
              style={{ 
                '--tw-prose-body': colors.foreground,
                '--tw-prose-headings': colors.foreground,
                '--tw-prose-links': colors.primary,
                '--tw-prose-bold': colors.foreground,
                '--tw-prose-quotes': colors.mutedForeground,
                '--tw-prose-quote-borders': colors.border,
                '--tw-prose-code': colors.foreground,
                '--tw-prose-pre-code': colors.foreground,
                '--tw-prose-pre-bg': colors.muted,
                '--tw-prose-th-borders': colors.border,
                '--tw-prose-td-borders': colors.border,
              } as React.CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              dangerouslySetInnerHTML={{ 
                __html: article.content.replace(/\n/g, '<br>') 
              }}
            />

            {/* 标签 */}
            <motion.div
              className="mt-8 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h4 className="text-lg font-semibold text-foreground mb-4">相关标签</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Tag 
                    key={tag}
                    className="cursor-pointer hover:scale-105 transition-transform"
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

            {/* 作者简介卡片 */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <Avatar 
                    src={article.author.avatar} 
                    size={80}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-1">
                      {article.author.name}
                    </h4>
                    <p className="text-primary mb-3">{article.author.title}</p>
                    <p className="text-muted-foreground mb-4">{article.author.bio}</p>
                    {article.author.social && (
                      <div className="flex gap-2">
                        {article.author.social.twitter && (
                          <AntButton
                            icon={<TwitterOutlined />}
                            href={article.author.social.twitter}
                            target="_blank"
                            size="small"
                          />
                        )}
                        {article.author.social.linkedin && (
                          <AntButton
                            icon={<LinkedinOutlined />}
                            href={article.author.social.linkedin}
                            target="_blank"
                            size="small"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 相关文章推荐 */}
            <motion.section
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">相关文章推荐</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <NewsCard
                    key={relatedArticle.id}
                    id={relatedArticle.id}
                    title={relatedArticle.title}
                    excerpt={relatedArticle.excerpt}
                    imageUrl={relatedArticle.imageUrl}
                    imageAlt={relatedArticle.imageAlt}
                    publishedAt={new Date(relatedArticle.publishedAt)}
                    category={relatedArticle.category}
                    author={relatedArticle.author.name}
                    readingTime={relatedArticle.readingTime}
                    layout="vertical"
                    href={`/news/${relatedArticle.slug}`}
                  />
                ))}
              </div>
            </motion.section>

            {/* 评论区 */}
            <CommentSection />
          </main>

          {/* 侧边栏（桌面端） */}
          <aside className="lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* 目录 */}
              <TableOfContents 
                toc={article.tableOfContents}
                activeId={activeHeadingId}
              />

              {/* 文章统计 */}
              <Card size="small">
                <h4 className="font-semibold text-foreground mb-4">文章统计</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">发布时间</span>
                    <span className="text-foreground">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">阅读时间</span>
                    <span className="text-foreground">{article.readingTime} 分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">阅读量</span>
                    <span className="text-foreground">
                      {formatNumber(article.views || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">字数</span>
                    <span className="text-foreground">
                      {formatNumber(article.content.length)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* 快速导航 */}
              <Card size="small">
                <h4 className="font-semibold text-foreground mb-4">快速导航</h4>
                <div className="space-y-2">
                  <Link href="/news" className="block text-primary hover:underline">
                    ← 返回新闻列表
                  </Link>
                  <Link href="/news#featured" className="block text-primary hover:underline">
                    查看特色文章
                  </Link>
                  <Link href="/subscribe" className="block text-primary hover:underline">
                    订阅更新
                  </Link>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* 返回顶部按钮 */}
      <BackToTop />
    </div>
  );
};

export default NewsArticlePage;