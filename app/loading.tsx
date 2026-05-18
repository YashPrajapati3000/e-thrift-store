import ProductsLoadingSkeleton from '@/components/ProductsLoadingSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navbar placeholder */}
      <div className="h-16 sticky top-0 z-50 bg-neutral-950/80 border-b border-white/[0.06]" />

      {/* Hero placeholder */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center space-y-6">
        <div className="h-4 w-56 rounded-full skeleton-shimmer mx-auto" />
        <div className="space-y-3">
          <div className="h-14 w-3/4 rounded-2xl skeleton-shimmer mx-auto" />
          <div className="h-14 w-1/2 rounded-2xl skeleton-shimmer mx-auto" />
        </div>
        <div className="h-5 w-2/3 rounded-full skeleton-shimmer mx-auto" />
        <div className="flex justify-center gap-4 pt-2">
          <div className="h-12 w-40 rounded-xl skeleton-shimmer" />
          <div className="h-12 w-40 rounded-xl skeleton-shimmer" />
        </div>
      </div>

      <ProductsLoadingSkeleton />
    </div>
  )
}
