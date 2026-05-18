import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import AddToCartButton from './AddToCartButton'

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

async function getProduct(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return mapProduct(await res.json())
  } catch {
    return null
  }
}

async function getRelated(category: string, excludeId: number): Promise<Product[]> {
  try {
    const encoded = encodeURIComponent(category)
    const res = await fetch(`https://dummyjson.com/products/category/${encoded}`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.products as DJsonProduct[])
      .filter((p) => p.id !== excludeId)
      .slice(0, 4)
      .map(mapProduct)
  } catch {
    return []
  }
}

function StarRating({ rate, count }: { rate: number; count: number }) {
  const full = Math.round(rate)
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= full ? 'text-amber-400' : 'text-neutral-700'}`}>
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-neutral-300">{rate.toFixed(1)}</span>
      <span className="text-sm text-neutral-600">({count} reviews)</span>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(parseInt(id))
  if (!product) return { title: 'Product Not Found — E-Thrift Store' }
  return {
    title: `${product.title} — E-Thrift Store`,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const productId = parseInt(id)

  if (isNaN(productId)) notFound()

  const product = await getProduct(productId)
  if (!product) notFound()

  const related = await getRelated(product.category, product.id)

  const categoryLabel = product.category
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-10">
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-green-400 transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-400 line-clamp-1 max-w-xs">{product.title}</span>
        </nav>

        {/* Product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Image */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center p-10 aspect-square lg:aspect-auto lg:min-h-[480px]">
            <div className="relative w-full h-80 lg:h-96">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {/* Category badge */}
            <span className="inline-flex self-start bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-500/20 mb-4">
              {categoryLabel}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mb-5">
              <StarRating rate={product.rating.rate} count={product.rating.count} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-neutral-800 mb-6" />

            {/* Description */}
            <p className="text-neutral-400 leading-relaxed mb-8 text-[15px]">
              {product.description}
            </p>

            {/* Add to cart */}
            <AddToCartButton product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              category: product.category,
            }} />

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Free shipping on orders over $50
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Community donated item
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                Secure checkout
              </span>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xl font-bold text-white">More in {categoryLabel}</h2>
              <Link href="/" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
