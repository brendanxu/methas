import dynamic from 'next/dynamic'

// 强制动态渲染，避免静态生成时的onClick函数序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 动态导入客户端组件
const NewsletterConfirmClient = dynamic(() => import('./client'), {
  loading: () => <div>Loading...</div>
})

export default function NewsletterConfirmPage() {
  return <NewsletterConfirmClient />
}