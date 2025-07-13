'use client';

import dynamic from 'next/dynamic';
import { NewsArticle } from './page';

// Dynamically import NewsArticlePage with no SSR
const NewsArticlePage = dynamic(() => import('./NewsArticlePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
});

interface NewsArticleClientProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export default function NewsArticleClient({ article, relatedArticles }: NewsArticleClientProps) {
  return <NewsArticlePage article={article} relatedArticles={relatedArticles} />;
}