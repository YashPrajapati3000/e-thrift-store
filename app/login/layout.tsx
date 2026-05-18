import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — E-Thrift Store',
  description: 'Sign in to your E-Thrift Store account to browse items, donate, and manage your cart.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
