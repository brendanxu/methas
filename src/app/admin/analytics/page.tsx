import { Metadata } from 'next'
import dynamicImport from 'next/dynamic'

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin',
  description: 'Comprehensive analytics and performance monitoring dashboard'
}

// 动态导入客户端组件
const AnalyticsDashboardClient = dynamicImport(() => import('./AnalyticsDashboard'), {
  loading: () => <div>Loading analytics dashboard...</div>
})

export default function AnalyticsDashboardPage() {
  return <AnalyticsDashboardClient />
}