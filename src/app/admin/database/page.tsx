import { Metadata } from 'next'
import dynamicImport from 'next/dynamic'

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Database Management | Admin',
  description: 'Database performance monitoring and optimization'
}

// 动态导入客户端组件
const DatabaseManagementClient = dynamicImport(() => import('./DatabaseManagement'), {
  loading: () => <div>Loading database management...</div>
})

export default function DatabaseManagementPage() {
  return <DatabaseManagementClient />
}