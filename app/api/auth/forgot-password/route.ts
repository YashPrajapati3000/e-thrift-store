import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })

  // Return success regardless to prevent email enumeration
  if (!user) return NextResponse.json({ ok: true })

  // Delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  })

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'E-Thrift Store <onboarding@resend.dev>',
    to: user.email,
    subject: 'Reset your E-Thrift Store password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;border-radius:16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
          <div style="width:28px;height:28px;background:#22c55e;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="color:black;font-size:14px;font-weight:900;">E</span>
          </div>
          <span style="font-weight:700;font-size:14px;color:white;">E·Thrift<span style="color:#4ade80;">Store</span></span>
        </div>
        <h2 style="color:white;margin:0 0 8px;">Reset your password</h2>
        <p style="color:#737373;margin:0 0 24px;">Hi ${user.name}, we received a request to reset your password.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#22c55e;color:black;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">Reset Password</a>
        <p style="color:#525252;font-size:13px;margin:24px 0 0;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
