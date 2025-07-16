import { Metadata } from 'next'
import dynamicImport from 'next/dynamic'

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Cache Management | Admin',
  description: 'Cache performance monitoring and management'
}

// 动态导入客户端组件
const CacheManagementClient = dynamicImport(() => import('./CacheManagement'), {
  loading: () => <div>Loading cache management...</div>
})

export default function CacheManagementPage() {
  return <CacheManagementClient />
}