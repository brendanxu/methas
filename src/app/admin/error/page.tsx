import { Suspense } from 'react'
import { Metadata } from 'next'
import { Spin } from 'antd'
import AuthErrorClient from './client'

export const metadata: Metadata = {
  title: '认证错误 - South Pole Admin',
  description: '认证过程中发生错误'
}

export const dynamic = 'force-dynamic'

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    }>
      <AuthErrorClient />
    </Suspense>
  )
}