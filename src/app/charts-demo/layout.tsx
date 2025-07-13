// Force dynamic rendering for charts demo
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation
export default function ChartsDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}