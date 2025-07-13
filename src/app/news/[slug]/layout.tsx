// Force dynamic rendering for individual news articles
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation for news article pages
export default function NewsSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}