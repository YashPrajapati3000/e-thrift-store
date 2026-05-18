'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Leaf, Loader2 } from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get('callbackUrl') || '/'
  // middleware sends absolute URLs — extract only the path to avoid port/host mismatches
  let callbackUrl = '/'
  try {
    callbackUrl = new URL(rawCallback).pathname
  } catch {
    callbackUrl = rawCallback.startsWith('/') ? rawCallback : '/'
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    const result = await signIn('credentials', {
      email: email.toLowerCase(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    window.location.href = callbackUrl
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-neutral-500">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-neutral-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-neutral-600 hover:text-green-400 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 pr-11 outline-none transition-colors text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-3 select-none">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${
                rememberMe
                  ? 'bg-green-500 border-green-500'
                  : 'bg-transparent border-neutral-700 hover:border-neutral-500'
              }`}
              aria-checked={rememberMe}
              role="checkbox"
            >
              {rememberMe && (
                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span
              className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300 transition-colors"
              onClick={() => setRememberMe(!rememberMe)}
            >
              Remember me for 30 days
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-green-400 font-medium hover:text-green-300 transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">
            E·Thrift<span className="text-green-400">Store</span>
          </span>
        </Link>
        <Link href="/signup" className="text-sm text-neutral-500 hover:text-white transition-colors">
          New here?{' '}
          <span className="text-green-400 font-medium">Create account</span>
        </Link>
      </header>

      <Suspense fallback={<div className="flex-1" />}>
        <LoginContent />
      </Suspense>
    </div>
  )
}
