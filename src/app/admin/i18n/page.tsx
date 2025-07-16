import { Metadata } from 'next'
import { Suspense } from 'react'
import { Spin } from 'antd'
import I18nManagement from './I18nManagement'

export const metadata: Metadata = {
  title: 'I18n Management - Admin',
  description: 'Manage internationalization system'
}

// 强制动态渲染
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function I18nPage() {
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
      <I18nManagement />
    </Suspense>
  )
}