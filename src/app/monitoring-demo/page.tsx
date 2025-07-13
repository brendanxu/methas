'use client';

import dynamic from 'next/dynamic';

// Dynamically import the monitoring demo content with no SSR
const MonitoringDemoContent = dynamic(() => import('./MonitoringDemoContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function MonitoringDemoPage() {
  return <MonitoringDemoContent />;
}