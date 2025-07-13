// Force dynamic rendering for monitoring demo
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation
export default function MonitoringDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}