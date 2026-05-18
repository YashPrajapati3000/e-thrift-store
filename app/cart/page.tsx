'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Tag, LogIn } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'

const SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 4.99

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <ShoppingCart className="w-10 h-10 text-neutral-700" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <span className="text-neutral-600 text-sm font-bold">0</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
      <p className="text-neutral-500 mb-10 max-w-xs">
        Looks like you haven&apos;t added anything yet. Discover items from our community.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-green-500 text-black font-bold px-8 py-3.5 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>
    </div>
  )
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, hydrated } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checkoutClicked, setCheckoutClicked] = useState(false)

  const handleCheckout = () => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/cart')
      return
    }
    setCheckoutClicked(true)
  }

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const orderTotal = totalPrice + shipping

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse space-y-4 max-w-2xl">
            <div className="h-8 bg-neutral-800 rounded-xl w-48" />
            <div className="h-28 bg-neutral-900 border border-neutral-800 rounded-2xl" />
            <div className="h-28 bg-neutral-900 border border-neutral-800 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyCart />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 text-neutral-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Shopping Cart
            <span className="ml-3 text-base font-normal text-neutral-500">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4 group"
              >
                {/* Product image */}
                <Link href={`/products/${item.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-800 rounded-xl overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <span className="inline-block text-[11px] text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full mb-1.5 capitalize">
                        {item.category}
                      </span>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-sm font-medium text-neutral-200 line-clamp-2 hover:text-white transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 p-1.5 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line price */}
                    <span className="text-base font-bold text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">
                    Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                  <span className="text-neutral-200 font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Estimated Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-400 font-medium">FREE</span>
                  ) : (
                    <span className="text-neutral-200 font-medium">${shipping.toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Free shipping nudge */}
              {totalPrice < SHIPPING_THRESHOLD && (
                <div className="flex items-center gap-2 bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2.5 mb-5">
                  <Tag className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-300">
                    Add{' '}
                    <span className="font-bold">${(SHIPPING_THRESHOLD - totalPrice).toFixed(2)}</span>
                    {' '}more for free shipping
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="h-px bg-neutral-800 mb-5" />
              <div className="flex justify-between mb-6">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">${orderTotal.toFixed(2)}</span>
              </div>

              {/* Checkout */}
              {status === 'unauthenticated' ? (
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20 active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in to Checkout
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              )}

              {checkoutClicked && (
                <p className="text-center text-sm text-green-400 mt-4 animate-pulse">
                  🚀 Checkout coming soon — thanks for shopping with E·ThriftStore!
                </p>
              )}

              <Link
                href="/"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
