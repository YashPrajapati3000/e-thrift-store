'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

interface ProductGridProps {
  products: Product[]
  categories: string[]
}

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [active, setActive] = useState('all')

  const filtered =
    active === 'all' ? products : products.filter((p) => p.category === active)

  const labelFor = (cat: string) => {
    if (cat === 'all') return 'All Items'
    return cat
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              active === cat
                ? 'bg-green-500 text-black font-semibold shadow-sm shadow-green-500/25'
                : 'bg-transparent text-neutral-400 border border-neutral-700 hover:border-green-500/50 hover:text-green-400'
            }`}
          >
            {labelFor(cat)}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-neutral-600 mb-6">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
