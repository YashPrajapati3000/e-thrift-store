'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Leaf, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">
            E·Thrift<span className="text-green-400">Store</span>
          </span>
        </Link>
        <Link href="/login" className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-3">Check your inbox</h1>
              <p className="text-neutral-500 text-sm mb-2">
                If an account exists for <span className="text-neutral-300">{email}</span>, we&apos;ve sent a password reset link.
              </p>
              <p className="text-neutral-600 text-xs mb-8">The link expires in 1 hour. Check your spam folder if you don&apos;t see it.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
                <p className="text-neutral-500">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    autoComplete="email"
                    autoFocus
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Sending link…</>
                  ) : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-neutral-600">
                Remember your password?{' '}
                <Link href="/login" className="text-green-400 font-medium hover:text-green-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
