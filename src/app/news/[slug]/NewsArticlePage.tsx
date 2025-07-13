'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Tag, 
  Button as AntButton, 
  Avatar, 
  Card,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption?: string;
  publishedAt: string;
  updatedAt?: string;
  category: 'company' | 'industry' | 'events';
  tags: string[];
  readingTime: number;
  author: {
    name: string;
    title: string;
    avatar: string;
    bio: string;
    social?: {
      twitter?: string;
      linkedin?: string;
    };
  };
}

interface NewsArticlePageProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export default function NewsArticlePage({ article, relatedArticles }: NewsArticlePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/news">
            <AntButton 
              type="text" 
              icon={<ArrowLeftOutlined />}
              className="text-gray-600 hover:text-gray-900"
            >
              返回新闻列表
            </AntButton>
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag color="blue">{article.category}</Tag>
            {article.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>
          
          <div className="text-lg text-gray-600 mb-6">
            {article.excerpt}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Avatar src={article.author.avatar} size="small" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarOutlined />
              <span>{new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserOutlined />
              <span>{article.readingTime} 分钟阅读</span>
            </div>
          </div>
        </header>

        {/* 文章图片 */}
        <div className="mb-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.imageCaption && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              {article.imageCaption}
            </p>
          )}
        </div>

        {/* 文章内容 */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: article.content.replace(/\n/g, '<br />') 
            }} 
          />
        </article>

        {/* 作者信息 */}
        <Card className="mb-8">
          <div className="flex items-start gap-4">
            <Avatar src={article.author.avatar} size={64} />
            <div>
              <h3 className="text-xl font-semibold mb-1">{article.author.name}</h3>
              <p className="text-gray-600 mb-2">{article.author.title}</p>
              <p className="text-gray-700">{article.author.bio}</p>
            </div>
          </div>
        </Card>

        {/* 相关文章 */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 4).map((relatedArticle) => (
                <Card key={relatedArticle.id} hoverable>
                  <Link href={`/news/${relatedArticle.slug}`}>
                    <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={relatedArticle.imageUrl}
                        alt={relatedArticle.imageAlt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <CalendarOutlined />
                      <span>{new Date(relatedArticle.publishedAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}