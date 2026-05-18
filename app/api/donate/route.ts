import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { ItemCondition } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    return NextResponse.json({ success: true, id: donation.id }, { status: 201 })
  } catch (err) {
    console.error('[donate]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
