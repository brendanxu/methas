import { Metadata } from 'next'
import I18nExample from '@/components/examples/I18nExample'

export const metadata: Metadata = {
  title: 'I18n Demo - South Pole',
  description: 'Demonstration of the lightweight internationalization system'
}

// 强制动态渲染，避免SSR时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function I18nDemoPage() {
  return <I18nExample />
}