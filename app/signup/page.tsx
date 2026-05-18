'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Leaf, Loader2 } from 'lucide-react'

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

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const strength = getStrength(form.password)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setLoading(false); return }

      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      window.location.href = '/'
    } catch {
      setServerError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    `w-full bg-neutral-900 border ${errors[field] ? 'border-red-500/60' : 'border-neutral-800 focus:border-green-500'} text-white placeholder-neutral-600 rounded-xl px-4 py-3 outline-none transition-colors text-sm`

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-green-500 rounded-md flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-bold text-white text-sm">
            E·Thrift<span className="text-green-400">Store</span>
          </span>
        </Link>
        <Link href="/login" className="text-sm text-neutral-500 hover:text-white transition-colors">
          Already have an account?{' '}
          <span className="text-green-400 font-medium">Login</span>
        </Link>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-neutral-500">Join our sustainable shopping community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {serverError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} className={inputClass('name')} />
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
              <input type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} autoComplete="email" className={inputClass('email')} />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  className={`${inputClass('password')} pr-11`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${bar <= strength ? STRENGTH_COLOR[strength] : 'bg-neutral-800'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${STRENGTH_TEXT_COLOR[strength]}`}>
                    {STRENGTH_TEXT[strength]}
                    {strength < 4 && <span className="text-neutral-600 font-normal"> — try adding uppercase, numbers or symbols</span>}
                  </p>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                  className={`${inputClass('confirm')} pr-11`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1.5 text-xs text-red-400">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-600">
            By signing up you agree to our{' '}
            <span className="text-neutral-500 cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-neutral-500 cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
