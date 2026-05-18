'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/context/CartContext'

// Bridges the session (inside AuthProvider) with the cart (inside CartProvider).
//
// Login  → fetch the user's saved cart from PostgreSQL and load it into React context.
// Change → debounce-sync the full cart back to the DB (full replace, 800 ms delay).
// Logout → clear React context only; DB row is preserved for the next login.
export default function CartSessionSync() {
  const { data: session, status } = useSession()
  const { items, clearCart, loadItems } = useCart()

  // Tracks the previous user ID so we detect actual changes (not just re-renders).
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  // syncEnabled stays false while we're loading from the DB so the sync effect
  // doesn't fire with the stale empty cart and wipe the user's saved items.
  const [syncEnabled, setSyncEnabled] = useState(false)

  // ── Session changes ────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === 'loading') return
    const userId = session?.user?.id ?? null

    const onLogin = async () => {
      setSyncEnabled(false)
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const { items: dbItems } = await res.json()
          loadItems(dbItems)
        }
      } catch {}
      setSyncEnabled(true)
    }

    // First resolution after mount
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = userId
      if (userId) onLogin()
      return
    }

    // User actually changed (login → logout, or account switch)
    if (prevUserIdRef.current !== userId) {
      prevUserIdRef.current = userId
      if (userId) {
        onLogin()
      } else {
        setSyncEnabled(false)
        clearCart()
      }
    }
  }, [session?.user?.id, status, clearCart, loadItems])

  // ── Debounced DB sync ──────────────────────────────────────────────────────
  // Fires whenever cart items change, but only while the user is logged in AND
  // the initial DB load has already completed (syncEnabled = true).
  useEffect(() => {
    if (!session?.user?.id || !syncEnabled) return

    const timer = setTimeout(() => {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }).catch(() => {})
    }, 800)

    return () => clearTimeout(timer)
  }, [items, session?.user?.id, syncEnabled])

  return null
}
