export default function ProductsLoadingSkeleton() {
  return (
    <>
      {/* Stats bar skeleton */}
      <div className="bg-neutral-900/60 border-y border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-800 text-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-4 py-2 flex flex-col items-center gap-2">
                <div className="h-7 w-12 rounded-lg skeleton-shimmer" />
                <div className="h-2.5 w-16 rounded-full skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products section skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header row */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="h-7 w-32 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-20 rounded-full skeleton-shimmer hidden sm:block" />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full skeleton-shimmer flex-shrink-0"
              style={{ width: `${72 + i * 12}px` }}
            />
          ))}
        </div>

        {/* Count line */}
        <div className="h-4 w-24 rounded-full skeleton-shimmer mb-6" />

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              {/* Image area */}
              <div className="h-52 skeleton-shimmer" />
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-4 w-full rounded-full skeleton-shimmer" />
                <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
                <div className="h-3 w-16 rounded-full skeleton-shimmer" />
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <div className="h-6 w-16 rounded-lg skeleton-shimmer" />
                  <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
