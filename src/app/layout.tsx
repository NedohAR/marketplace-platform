import type { Metadata } from 'next'
import './globals.css'
import ToastProvider from '@/components/ui/ToastProvider'

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Web application built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
