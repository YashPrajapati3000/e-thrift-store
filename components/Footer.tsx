import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shadow-sm shadow-green-500/25">
                <Leaf className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-bold text-white text-[15px]">
                E·Thrift<span className="text-green-400">Store</span>
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Give old things a new life. A community-driven second-hand marketplace built for sustainability.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/',        label: 'Browse Items' },
                { href: '/donate',  label: 'Donate an Item' },
                { href: '/cart',    label: 'Shopping Cart' },
                { href: '/profile', label: 'My Profile' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-500 hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Built With
            </h3>
            <ul className="space-y-2.5">
              {[
                'Next.js 14 App Router',
                'Tailwind CSS',
                'Prisma + PostgreSQL',
                'NextAuth.js',
                'DummyJSON',
              ].map((tech) => (
                <li key={tech} className="text-sm text-neutral-500">{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} E-Thrift Store · Product data by{' '}
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-green-400 transition-colors"
            >
              DummyJSON
            </a>
          </p>
          <p className="text-xs text-neutral-600">Portfolio project — not a real store</p>
        </div>

      </div>
    </footer>
  )
}
