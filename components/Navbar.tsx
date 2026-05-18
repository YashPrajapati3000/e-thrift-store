'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Leaf, ShoppingCart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { totalItems, hydrated, clearCart } = useCart()
  const { data: session, status } = useSession()
  const [bounce, setBounce] = useState(false)
  const prevCount = useRef(totalItems)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cart badge bounce on item add (skip during initial localStorage hydration)
  useEffect(() => {
    if (!hydrated) return
    if (totalItems > prevCount.current) {
      setBounce(true)
      const t = setTimeout(() => setBounce(false), 500)
      return () => clearTimeout(t)
    }
    prevCount.current = totalItems
  }, [totalItems, hydrated])

  // Close user dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    function onOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [dropdownOpen])

  const initials = session?.user?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow">
              <Leaf className="w-4 h-4 text-black" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              E·Thrift<span className="text-green-400">Store</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Browse
            </Link>
            <Link href="/donate" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">
              Donate an Item
            </Link>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-neutral-400 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  style={bounce ? { animation: 'cartBounce 0.45s ease-out' } : undefined}
                  className="absolute -top-0.5 -right-0.5 bg-green-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {status === 'loading' && (
              <div className="w-28 h-8 bg-neutral-800 rounded-lg animate-pulse" />
            )}

            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-semibold bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition-colors shadow-sm shadow-green-500/20">
                  Sign Up
                </Link>
              </>
            )}

            {status === 'authenticated' && session?.user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors max-w-[100px] truncate">
                    {session.user.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                    <div className="px-4 py-3 border-b border-neutral-800">
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={async () => { setDropdownOpen(false); clearCart(); await signOut({ redirect: false }); window.location.href = '/' }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-1">
            <Link href="/cart" className="relative p-2 text-neutral-400">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  style={bounce ? { animation: 'cartBounce 0.45s ease-out' } : undefined}
                  className="absolute -top-0.5 -right-0.5 bg-green-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-white/[0.06] py-4 space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Browse
            </Link>
            <Link href="/donate" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              Donate an Item
            </Link>

            {status === 'authenticated' && session?.user ? (
              <>
                <div className="px-3 py-2 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center">
                    {initials}
                  </div>
                  <span className="text-sm text-neutral-300">{session.user.name}</span>
                </div>
                <button
                  onClick={async () => { setIsOpen(false); clearCart(); await signOut({ redirect: false }); window.location.href = '/' }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Login
                </Link>
                <div className="pt-2">
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-green-500 text-black text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-green-400 transition-colors">
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
