import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
