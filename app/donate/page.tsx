'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Heart, ArrowLeft, CheckCircle2, Package, Loader2 } from 'lucide-react'

const CONDITIONS = [
  { value: 'New', label: 'New' },
  { value: 'LikeNew', label: 'Like New' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
] as const

interface FormState {
  donorName: string
  email: string
  itemName: string
  itemDescription: string
  condition: string
  message: string
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Thank you for donating!</h2>
      <p className="text-neutral-500 mb-10 max-w-sm text-sm leading-relaxed">
        Your item has been submitted to the community. Someone will give it a new home soon.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-green-500 text-black font-bold px-7 py-3 rounded-xl hover:bg-green-400 transition-colors shadow-lg shadow-green-500/20"
        >
          <Heart className="w-4 h-4" />
          Donate Another Item
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 font-medium px-7 py-3 rounded-xl transition-colors"
        >
          <Package className="w-4 h-4" />
          Browse Items
        </Link>
      </div>
    </div>
  )
}

export default function DonatePage() {
  const { data: session } = useSession()

  const defaultForm: FormState = {
    donorName: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    itemName: '',
    itemDescription: '',
    condition: '',
    message: '',
  }

  const [form, setForm] = useState<FormState>(defaultForm)

  // Pre-fill name/email once session loads (middleware guarantees auth)
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        donorName: prev.donorName || session.user?.name || '',
        email: prev.email || session.user?.email || '',
      }))
    }
  }, [session])
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {}
    if (!form.donorName.trim()) e.donorName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.itemName.trim()) e.itemName = 'Item name is required'
    if (!form.itemDescription.trim()) e.itemDescription = 'Please describe the item'
    if (!form.condition) e.condition = 'Please select a condition'
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
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setLoading(false); return }
      setSuccess(true)
    } catch {
      setServerError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({
      donorName: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      itemName: '',
      itemDescription: '',
      condition: '',
      message: '',
    })
    setErrors({})
    setServerError('')
    setSuccess(false)
  }

  const inputClass = (field: keyof FormState) =>
    `w-full bg-neutral-900 border ${
      errors[field] ? 'border-red-500/60' : 'border-neutral-800 focus:border-green-500'
    } text-white placeholder-neutral-600 rounded-xl px-4 py-3 outline-none transition-colors text-sm`

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        {success ? (
          <SuccessState onReset={handleReset} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Donate an Item</h1>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Give something you no longer need a second life. Fill in the details below and we&apos;ll list it for the community.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {serverError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                    {serverError}
                  </div>
                )}

                {/* Donor name + email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.donorName}
                      onChange={set('donorName')}
                      className={inputClass('donorName')}
                    />
                    {errors.donorName && <p className="mt-1.5 text-xs text-red-400">{errors.donorName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                  </div>
                </div>

                {/* Item name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Item Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vintage Denim Jacket"
                    value={form.itemName}
                    onChange={set('itemName')}
                    className={inputClass('itemName')}
                  />
                  {errors.itemName && <p className="mt-1.5 text-xs text-red-400">{errors.itemName}</p>}
                </div>

                {/* Item description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Item Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the item — size, colour, brand, any defects..."
                    value={form.itemDescription}
                    onChange={set('itemDescription')}
                    className={`${inputClass('itemDescription')} resize-none`}
                  />
                  {errors.itemDescription && <p className="mt-1.5 text-xs text-red-400">{errors.itemDescription}</p>}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Item Condition <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.condition}
                    onChange={set('condition')}
                    className={`${inputClass('condition')} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>Select a condition...</option>
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="mt-1.5 text-xs text-red-400">{errors.condition}</p>}
                </div>

                {/* Optional message */}
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">
                    Message <span className="text-neutral-600 text-xs font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Anything you'd like the recipient to know..."
                    value={form.message}
                    onChange={set('message')}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-500 text-white placeholder-neutral-600 rounded-xl px-4 py-3 outline-none transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-black font-bold py-3.5 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Submitting donation…</>
                    ) : (
                      <><Heart className="w-4 h-4" />Submit Donation</>
                    )}
                  </button>
                  <p className="text-center text-xs text-neutral-600 mt-3">
                    Fields marked <span className="text-red-400">*</span> are required
                  </p>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
