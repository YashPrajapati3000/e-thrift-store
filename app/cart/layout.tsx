import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart — E-Thrift Store',
  description: 'Review the items in your E-Thrift Store cart and proceed to checkout.',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
