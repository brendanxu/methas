// Force dynamic rendering for this entire route segment
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation
export default function ButtonDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}