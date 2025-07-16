import { Metadata } from 'next'
import { Suspense } from 'react'
import { Spin } from 'antd'
import FormSubmissionsPage from './FormSubmissionsPage'

export const metadata: Metadata = {
  title: 'Form Submissions - Admin',
  description: 'Manage form submissions'
}

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function FormsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    }>
      <FormSubmissionsPage />
    </Suspense>
  )
}