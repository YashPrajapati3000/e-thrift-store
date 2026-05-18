import Link from 'next/link'
import { Leaf, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center shadow-sm shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow">
            <Leaf className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">
            E·Thrift<span className="text-green-400">Store</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md animate-fade-in-up">
          {/* Icon */}
          <div className="relative mb-8 inline-block">
            <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Search className="w-10 h-10 text-neutral-700" />
            </div>
            <span className="absolute -top-1 -right-1 bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-bold px-2 py-0.5 rounded-full">
              404
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Head back home to browse items or donate something.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 bg-green-500 text-black font-bold px-7 py-3 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <Link
              href="/donate"
              className="flex items-center gap-2 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 font-medium px-7 py-3 rounded-xl transition-colors"
            >
              Donate an Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
