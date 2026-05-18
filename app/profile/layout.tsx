import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Profile — E-Thrift Store',
  description: 'View and manage your E-Thrift Store account details.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
