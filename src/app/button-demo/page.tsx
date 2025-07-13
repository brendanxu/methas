import dynamic from 'next/dynamic';

// Force dynamic rendering to prevent ALL server-side rendering issues
export const dynamic = 'force-dynamic';

// Dynamically import the client component with NO SSR
const ButtonDemoClient = dynamic(() => import('./ButtonDemoClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function ButtonDemoPage() {
  return <ButtonDemoClient />;
}