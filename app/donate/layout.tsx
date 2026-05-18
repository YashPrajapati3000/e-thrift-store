import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate an Item — E-Thrift Store',
  description: 'Give something you no longer need a second life. Donate items to the E-Thrift Store community for free.',
}

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
