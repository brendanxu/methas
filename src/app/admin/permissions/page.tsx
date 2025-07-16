import { Metadata } from 'next'
import dynamicImport from 'next/dynamic'

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Permission Management | Admin',
  description: 'Manage user permissions and access control'
}

// 动态导入客户端组件
const PermissionManagementClient = dynamicImport(() => import('./PermissionManagement'), {
  loading: () => <div>Loading...</div>
})

export default function PermissionManagementPage() {
  return <PermissionManagementClient />
}