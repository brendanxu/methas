'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent prerendering issues
const SearchPageClient = dynamic(() => import('./SearchPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function SearchClientWrapper() {
  return <SearchPageClient />;
}