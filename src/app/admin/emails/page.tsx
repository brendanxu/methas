import { Metadata } from 'next'
import { Suspense } from 'react'
import { Spin } from 'antd'
import EmailQueueManagement from './EmailQueueManagement'

export const metadata: Metadata = {
  title: 'Email Management - Admin',
  description: 'Manage email queue and notifications'
}

// 强制动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function EmailsPage() {
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
      <EmailQueueManagement />
    </Suspense>
  )
}