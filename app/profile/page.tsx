'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()

  const joined = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to store
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-neutral-500 text-sm mt-1">Your account details</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500 text-black text-2xl font-bold flex items-center justify-center flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{session?.user?.name}</p>
              <p className="text-sm text-neutral-500">Community member</p>
            </div>
          </div>

          <div className="border-t border-neutral-800" />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-0.5">Full name</p>
                <p className="text-sm text-neutral-200">{session?.user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-0.5">Email address</p>
                <p className="text-sm text-neutral-200">{session?.user?.email}</p>
              </div>
            </div>

            {joined && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-0.5">Member since</p>
                  <p className="text-sm text-neutral-200">{joined}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-800" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/donate"
              className="flex items-center justify-center gap-2 bg-green-500 text-black font-bold px-5 py-2.5 rounded-xl hover:bg-green-400 transition-colors text-sm"
            >
              Donate an Item
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
