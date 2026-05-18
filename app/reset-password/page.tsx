'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Leaf, Loader2, CheckCircle, XCircle } from 'lucide-react'

function getStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_COLOR = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500']
const STRENGTH_TEXT = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_TEXT_COLOR = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400']

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const strength = getStrength(password)

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Invalid reset link</h1>
        <p className="text-neutral-500 text-sm mb-8">This link is missing a token. Please request a new password reset.</p>
        <Link href="/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium">
          Request new link
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!password) { setError('Please enter a new password'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Password updated</h1>
        <p className="text-neutral-500 text-sm mb-2">Your password has been changed successfully.</p>
        <p className="text-neutral-600 text-xs">Redirecting you to login…</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Set new password</h1>
        <p className="text-neutral-500">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              autoComplete="new-password"
              autoFocus
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 pr-11 outline-none transition-colors text-sm"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {password && (
            <div className="mt-2.5">
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3, 4].map((bar) => (
                  <div key={bar} className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar <= strength ? STRENGTH_COLOR[strength] : 'bg-neutral-800'}`} />
                ))}
              </div>
              <p className={`text-xs font-medium ${STRENGTH_TEXT_COLOR[strength]}`}>
                {STRENGTH_TEXT[strength]}
                {strength < 4 && <span className="text-neutral-600 font-normal"> — try adding uppercase, numbers or symbols</span>}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError('') }}
              autoComplete="new-password"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 pr-11 outline-none transition-colors text-sm"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Updating password…</>
          ) : 'Update Password'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-600">
        Remembered it?{' '}
        <Link href="/login" className="text-green-400 font-medium hover:text-green-300 transition-colors">
          Sign in
        </Link>
      </p>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="px-6 py-5 flex items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">
            E·Thrift<span className="text-green-400">Store</span>
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="h-64" />}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
