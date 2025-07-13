// Force dynamic rendering for the entire news section
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation for news routes
export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}