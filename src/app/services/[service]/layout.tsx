// Force dynamic rendering for individual service pages
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation
export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}