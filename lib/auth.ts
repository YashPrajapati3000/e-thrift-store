import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.hashedPassword)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { createdAt: true },
        })
        token.createdAt = dbUser?.createdAt.toISOString() ?? ''
      }
      // Backfill id for sessions minted before this field was added
      if (!token.id && token.sub) {
        token.id = token.sub
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { createdAt: true },
        })
        token.createdAt = dbUser?.createdAt.toISOString() ?? ''
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.createdAt = token.createdAt
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
