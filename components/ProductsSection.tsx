import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import ProductGrid from './ProductGrid'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

interface DJsonProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string
  rating: number
  reviews?: unknown[]
}

function mapProduct(p: DJsonProduct): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    rating: { rate: p.rating, count: Array.isArray(p.reviews) ? p.reviews.length : 0 },
  }
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://dummyjson.com/products?limit=30', {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('API unavailable')
  const data = await res.json()
  return (data.products as DJsonProduct[]).map(mapProduct)
}

export default async function ProductsSection() {
  let products: Product[] = []
  let fetchError = false

  try {
    products = await fetchProducts()
  } catch {
    fetchError = true
  }

  if (fetchError) {
    return (
      <>
        <div className="bg-neutral-900/60 border-y border-neutral-800">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center">
            <p className="text-sm text-neutral-500">Product data unavailable</p>
          </div>
        </div>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
              <RefreshCw className="w-7 h-7 text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Couldn&apos;t load products</h2>
            <p className="text-sm text-neutral-500 mb-8 max-w-sm">
              FakeStoreAPI couldn&apos;t be reached. This is likely a temporary issue — try refreshing the page.
            </p>
            <Link
              href="/"
              className="flex items-center gap-2 bg-green-500 text-black font-bold px-7 py-3 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Link>
          </div>
        </section>
      </>
    )
  }

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <>
      {/* Stats bar */}
      <div className="bg-neutral-900/60 border-y border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-800 text-center">
            <div className="px-4 py-2">
              <div className="text-2xl font-bold text-white">{products.length}+</div>
              <div className="text-[11px] text-neutral-500 mt-1 uppercase tracking-widest">Items Listed</div>
            </div>
            <div className="px-4 py-2">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-[11px] text-neutral-500 mt-1 uppercase tracking-widest">Community</div>
            </div>
            <div className="px-4 py-2">
              <div className="text-2xl font-bold text-white">Free</div>
              <div className="text-[11px] text-neutral-500 mt-1 uppercase tracking-widest">To List</div>
            </div>
            <div className="px-4 py-2">
              <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
              <div className="text-[11px] text-neutral-500 mt-1 uppercase tracking-widest">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Browse Items</h2>
          <span className="text-sm text-neutral-600 hidden sm:block">Updated hourly</span>
        </div>
        <ProductGrid products={products} categories={categories} />
      </section>
    </>
  )
}
