import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductsSection from '@/components/ProductsSection'
import ProductsLoadingSkeleton from '@/components/ProductsLoadingSkeleton'

export const metadata: Metadata = {
  title: 'E-Thrift Store — Give Old Things a New Life',
  description:
    'Browse quality second-hand items donated by your community, or give something you no longer need a fresh start. Free to list. Free to browse.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,197,94,0.13),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-green-500/60 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center">

          {/* Label — first to appear */}
          <div
            className="inline-flex items-center gap-3 mb-8 animate-fade-in-up"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-6 h-px bg-green-500/60" />
            <span className="text-green-400 text-sm font-medium tracking-widest uppercase">
              Sustainable Community Shopping
            </span>
            <span className="w-6 h-px bg-green-500/60" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            Give Old Things
            <br />
            <span className="text-green-400">a New Life</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-neutral-400 text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Browse quality second-hand items donated by your community — or give
            something you no longer need a fresh start.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              href="/donate"
              className="w-full sm:w-auto bg-green-500 text-black font-bold px-8 py-3.5 rounded-xl hover:bg-green-400 transition-colors text-base shadow-lg shadow-green-500/20"
            >
              Donate an Item
            </Link>
            <a
              href="#products"
              className="w-full sm:w-auto border border-neutral-700 text-neutral-300 font-medium px-8 py-3.5 rounded-xl hover:border-neutral-500 hover:text-white transition-colors text-base"
            >
              Browse Items ↓
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </section>

      {/* ── Products (Suspense-streamed) ──────────────────────────────── */}
      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsSection />
      </Suspense>

      <Footer />
    </div>
  )
}
