'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: number
  title: string
  price: number
  image: string
  category: string
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 ${
        added
          ? 'bg-green-500/15 text-green-400 border border-green-500/30 cursor-default'
          : 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20 active:scale-[0.98]'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  )
}
