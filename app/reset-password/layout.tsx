import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password — E-Thrift Store',
  description: 'Set a new password for your E-Thrift Store account.',
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
