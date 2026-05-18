import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] })
  }

  const saved = await prisma.savedCartItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({
    items: saved.map((item) => ({
      id: item.productId,
      title: item.title,
      price: item.price.toNumber(),
      image: item.image,
      category: item.category,
      quantity: item.quantity,
    })),
  })
}

type CartItemPayload = {
  id: number
  title: string
  price: number
  image: string
  category: string
  quantity: number
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { items }: { items: CartItemPayload[] } = await req.json()
  const userId = session.user.id

  if (!Array.isArray(items) || items.length > 100) {
    return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 })
  }

  for (const item of items) {
    if (
      typeof item.id !== 'number' ||
      typeof item.price !== 'number' || item.price < 0 ||
      typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1 ||
      typeof item.title !== 'string' || item.title.length > 500 ||
      typeof item.image !== 'string' || item.image.length > 1000 ||
      typeof item.category !== 'string' || item.category.length > 100
    ) {
      return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
    }
  }

  // Full replace inside a transaction so the cart is never left in a partial state
  await prisma.$transaction(async (tx) => {
    await tx.savedCartItem.deleteMany({ where: { userId } })
    if (items.length > 0) {
      await tx.savedCartItem.createMany({
        data: items.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity,
          userId,
        })),
      })
    }
  })

  return NextResponse.json({ success: true })
}
