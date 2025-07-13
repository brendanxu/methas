'use client';

import dynamic from 'next/dynamic';

// Dynamically import the charts demo content with no SSR
const ChartsDemoContent = dynamic(() => import('./ChartsDemoContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function ChartsDemoPage() {
  return <ChartsDemoContent />;
}