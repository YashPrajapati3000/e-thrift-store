import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account — E-Thrift Store',
  description: 'Join the E-Thrift Store community. Create a free account to donate items, browse second-hand goods, and shop sustainably.',
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
