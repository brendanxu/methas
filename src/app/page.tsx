'use client';

import dynamic from 'next/dynamic';

// Dynamically import the home content with no SSR
const HomeContent = dynamic(() => import('./HomeContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function Home() {
  return <HomeContent />;
}
