import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password — E-Thrift Store',
  description: 'Reset your E-Thrift Store account password.',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
