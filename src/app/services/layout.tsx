// Force dynamic rendering for services pages
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = false;

// Layout component that prevents static generation
export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}