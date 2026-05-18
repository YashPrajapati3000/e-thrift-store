import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { CartProvider } from '@/context/CartContext'
import AuthProvider from '@/components/AuthProvider'
import CartSessionSync from '@/components/CartSessionSync'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'E-Thrift Store — Give Old Things a New Life',
  description:
    'Browse quality second-hand items and donate what you no longer need. A community-driven thrift store built for sustainability.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-neutral-950 text-neutral-50`}>
        <CartProvider>
          <AuthProvider>
            <CartSessionSync />
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  )
}
