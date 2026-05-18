import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  title: string
  price: number
  category: string
  image: string
  rating: { rate: number; count: number }
}

function StarRating({ rate }: { rate: number }) {
  const full = Math.round(rate)
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= full ? 'text-amber-400' : 'text-neutral-700'}`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ProductCard({ product }: { product: Product }) {
  const categoryLabel = product.category
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60">

      {/* Image area */}
      <div className="relative h-52 bg-neutral-800 overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-7 group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-green-400 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-green-500/20">
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-sm font-medium text-neutral-200 line-clamp-2 mb-3 leading-snug flex-1">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rate={product.rating.rate} />
          <span className="text-xs text-neutral-600">({product.rating.count})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800">
          <span className="text-xl font-bold text-white tracking-tight">
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="flex-shrink-0 text-xs font-bold bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 active:scale-95 transition-all duration-150 shadow-sm shadow-green-500/20"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
