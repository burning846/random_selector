import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '随机决策器 - 让选择变得简单',
  description: '一个帮助你做决定的随机选择工具，支持自定义选项、历史记录和数据导出',
  keywords: ['随机选择', '决策工具', '选择器', '随机决策'],
  authors: [{ name: '随机决策器' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="google-signin-client_id" content="your-google-client-id.apps.googleusercontent.com" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}