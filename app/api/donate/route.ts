import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ItemCondition } from '@prisma/client'
import { Resend } from 'resend'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function escHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const resend = new Resend(process.env.RESEND_API_KEY)

const CONDITION_LABEL: Record<ItemCondition, string> = {
  New: 'New',
  LikeNew: 'Like New',
  Good: 'Good',
  Fair: 'Fair',
}

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { donorName, email, itemName, itemDescription, condition, message } = await req.json()

    if (!donorName?.trim() || !email?.trim() || !itemName?.trim() || !itemDescription?.trim() || !condition) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
    }

    if (!Object.values(ItemCondition).includes(condition as ItemCondition)) {
      return NextResponse.json({ error: 'Invalid condition value' }, { status: 400 })
    }

    const donation = await prisma.donation.create({
      data: {
        donorName: donorName.trim(),
        email: email.trim().toLowerCase(),
        itemName: itemName.trim(),
        itemDescription: itemDescription.trim(),
        condition: condition as ItemCondition,
        message: message?.trim() || null,
        userId: session.user.id,
      },
    })

    try {
      await resend.emails.send({
        from: 'E-Thrift Store <onboarding@resend.dev>',
        to: email.trim(),
        subject: `We received your donation — ${itemName.trim()}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;border-radius:16px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
              <div style="width:28px;height:28px;background:#22c55e;border-radius:6px;display:flex;align-items:center;justify-content:center;">
                <span style="color:black;font-size:14px;font-weight:900;">E</span>
              </div>
              <span style="font-weight:700;font-size:14px;color:white;">E·Thrift<span style="color:#4ade80;">Store</span></span>
            </div>

            <h2 style="color:white;margin:0 0 8px;">Thank you for your donation!</h2>
            <p style="color:#737373;margin:0 0 24px;">Hi ${escHtml(donorName.trim())}, your item has been submitted to the community. Here's a summary of what you shared:</p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:10px 14px;background:#171717;border:1px solid #262626;border-radius:0;color:#a3a3a3;font-size:13px;width:36%;">Item</td>
                <td style="padding:10px 14px;background:#171717;border:1px solid #262626;color:white;font-size:13px;">${escHtml(itemName.trim())}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;background:#0d0d0d;border:1px solid #262626;color:#a3a3a3;font-size:13px;">Condition</td>
                <td style="padding:10px 14px;background:#0d0d0d;border:1px solid #262626;color:white;font-size:13px;">${escHtml(CONDITION_LABEL[condition as ItemCondition])}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;background:#171717;border:1px solid #262626;color:#a3a3a3;font-size:13px;vertical-align:top;">Description</td>
                <td style="padding:10px 14px;background:#171717;border:1px solid #262626;color:white;font-size:13px;">${escHtml(itemDescription.trim())}</td>
              </tr>
              ${message?.trim() ? `
              <tr>
                <td style="padding:10px 14px;background:#0d0d0d;border:1px solid #262626;color:#a3a3a3;font-size:13px;vertical-align:top;">Your message</td>
                <td style="padding:10px 14px;background:#0d0d0d;border:1px solid #262626;color:white;font-size:13px;">${escHtml(message.trim())}</td>
              </tr>` : ''}
            </table>

            <p style="color:#525252;font-size:13px;margin:0;">Someone in the community will give it a new home soon. Thanks for making a difference!</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[donate] email send failed', emailErr)
    }

    return NextResponse.json({ success: true, id: donation.id }, { status: 201 })
  } catch (err) {
    console.error('[donate]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
