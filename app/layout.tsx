import React from 'react'
import './globals.css'

export const metadata = {
  title: '随机决策器',
  description: '帮助你做出随机选择的工具',
  keywords: ['随机选择', '决策工具', '转盘', '抽签'],
  authors: [{ name: 'Random Selector' }],
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
        <meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" />
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}