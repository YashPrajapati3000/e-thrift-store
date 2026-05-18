'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Something went wrong</h2>
        <p className="text-neutral-500 mb-8 text-sm">
          An unexpected error occurred. Try refreshing the page or head back home.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-green-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-green-400 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-neutral-400 hover:text-white font-medium px-6 py-2.5 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
