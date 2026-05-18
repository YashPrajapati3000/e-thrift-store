'use client'

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  category: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  loadItems: (items: CartItem[]) => void
  totalItems: number
  totalPrice: number
  hydrated: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; id: number }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT'; payload: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((item) => item.id === action.payload.id)
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id)
    case 'UPDATE_QUANTITY':
      return state
        .map((item) =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        )
        .filter((item) => item.quantity > 0)
    case 'CLEAR_CART':
      return []
    case 'INIT':
      return action.payload
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ethrift-cart')
      if (saved) dispatch({ type: 'INIT', payload: JSON.parse(saved) })
    } catch {}
    setHydrated(true)
  }, [])

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('ethrift-cart', JSON.stringify(items))
    }
  }, [items, hydrated])

  const addItem = (product: Omit<CartItem, 'quantity'>) =>
    dispatch({ type: 'ADD_ITEM', payload: product })

  const removeItem = (id: number) => dispatch({ type: 'REMOVE_ITEM', id })

  const updateQuantity = (id: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })

  // Clears localStorage synchronously so the next page load starts with an empty cart.
  const clearCart = useCallback(() => {
    try { localStorage.removeItem('ethrift-cart') } catch {}
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  // Replaces the entire cart (used when restoring from DB on login).
  const loadItems = useCallback((newItems: CartItem[]) => {
    dispatch({ type: 'INIT', payload: newItems })
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, loadItems, totalItems, totalPrice, hydrated }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
