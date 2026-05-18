# E-Thrift Store

> Give old things a new life — a full-stack community thrift marketplace built as a portfolio project.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)](https://neon.tech/)
[![NextAuth](https://img.shields.io/badge/NextAuth.js-4-purple)](https://next-auth.js.org/)

**Live Demo:** _Coming soon (Vercel deployment)_

---

## Overview

E-Thrift Store is a dark-themed, full-stack e-commerce application where users can browse second-hand items, add them to a persistent cart, and donate items they no longer need. Built end-to-end across six development phases as a hands-on portfolio project.

---

## Features

- **Browse & Filter** — Product grid with category filter pills, star ratings, and hover animations
- **Product Detail Pages** — Full product view with related items, description, and "Add to Cart"
- **Authentication** — Email/password sign-up and login via NextAuth.js with JWT sessions
- **Per-User Persistent Cart** — Cart saved to PostgreSQL; survives logouts and page refreshes
- **Donate an Item** — Protected form to submit donations, saved to the database
- **User Profile** — View account details after signing in
- **Skeleton Loading** — Shimmer skeletons while product data streams in (Suspense + streaming RSC)
- **Custom Error & 404 Pages** — Graceful error states with on-brand dark theme
- **SEO Metadata** — Per-page titles and descriptions, dynamic product page metadata, favicon
- **Mobile Responsive** — Fully responsive across all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Components, Streaming) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via [Neon.tech](https://neon.tech) (serverless) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v4 (Credentials provider, JWT strategy) |
| Icons | Lucide React |
| Product data | [FakeStoreAPI](https://fakestoreapi.com) |
| Deployment | Vercel (planned) |

---

## Screenshots

> _Screenshots coming after Vercel deployment._

| Homepage | Product Detail | Cart |
|---|---|---|
| _placeholder_ | _placeholder_ | _placeholder_ |

---

## Running Locally

### Prerequisites
- Node.js 18+
- A PostgreSQL database (free tier on [Neon.tech](https://neon.tech) works)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/e-thrift-store.git
cd e-thrift-store

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET

# 4. Push the schema to your database
npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
DATABASE_URL="postgresql://..."        # Neon (or any PostgreSQL) connection string
NEXTAUTH_URL="http://localhost:3000"   # Base URL of the app
NEXTAUTH_SECRET="..."                  # Random secret (openssl rand -base64 32)
```

---

## Database Schema

```
enum ItemCondition { New | LikeNew | Good | Fair }

User
  id             String        CUID, PK
  name           VarChar(100)
  email          VarChar(254)  unique
  hashedPassword Char(60)      bcrypt hash — fixed 60 chars
  createdAt      DateTime
  donations      Donation[]
  savedCart      SavedCartItem[]

SavedCartItem
  id        String      CUID, PK
  productId Int
  title     VarChar(255)
  price     Decimal(10,2)
  image     Text
  category  VarChar(100)
  quantity  Int         default 1
  createdAt DateTime
  userId    String      → User (cascade delete)
  @@unique([userId, productId])

Donation
  id              String        CUID, PK
  donorName       VarChar(100)
  email           VarChar(254)
  itemName        VarChar(200)
  itemDescription Text
  condition       ItemCondition
  message         Text?
  createdAt       DateTime
  userId          String?       → User
```

---

## Project Structure

```
app/
  page.tsx               Homepage (Server Component, Suspense-streamed products)
  layout.tsx             Root layout (CartProvider → AuthProvider → CartSessionSync)
  loading.tsx            Full-page skeleton fallback
  not-found.tsx          Custom 404 page
  error.tsx              Global error boundary
  icon.tsx               Favicon generator (next/og)
  login/                 Login page + metadata layout
  signup/                Signup page + metadata layout
  donate/                Donation form + metadata layout
  cart/                  Cart page + metadata layout
  profile/               Profile page + metadata layout
  products/[id]/         Dynamic product detail page
  api/
    auth/[...nextauth]/  NextAuth handler
    signup/              Registration endpoint
    donate/              Donation submission endpoint
    cart/                Cart GET + POST (full-replace sync)

components/
  Navbar.tsx             Sticky navbar with cart badge and user dropdown
  Footer.tsx             Shared footer with navigation and tech credits
  ProductCard.tsx        Product grid card
  ProductGrid.tsx        Category-filtered product grid
  ProductsSection.tsx    Async server component (fetches + renders stats + grid)
  ProductsLoadingSkeleton.tsx  Shimmer skeleton for product section
  CartSessionSync.tsx    Bridge: watches session, loads DB cart on login, syncs on change
  AuthProvider.tsx       NextAuth SessionProvider wrapper

context/
  CartContext.tsx        Cart state (useReducer + localStorage + loadItems)

lib/
  auth.ts                NextAuth configuration
  prisma.ts              Prisma client singleton

middleware.ts            Protects /donate and /profile routes
```

---

## What I Learned

- **Next.js App Router architecture** — Server vs. Client component boundaries, when each is appropriate, and how to pass data between them without over-fetching
- **React Suspense for streaming** — Isolating async data fetching inside a Suspense boundary so the hero renders immediately while products stream in
- **NextAuth.js with Credentials** — JWT strategy, session callbacks, `getServerSession` in API routes, and the subtle differences between client and server session access
- **Prisma with PostgreSQL** — Schema design, relations, `@@unique` constraints, transactions, and the `prisma db push` workflow for iterative schema changes
- **Context architecture in App Router** — Why provider order matters, and how to bridge client-only context with session state using a bridge component (`CartSessionSync`)
- **Full-stack cart design** — Debounced DB sync, preventing the "empty cart wipes the database on login" race condition using a `syncEnabled` flag, clearing localStorage synchronously before navigation
- **Debug-first thinking** — Diagnosing subtle auth redirect issues (`router.push` inside Suspense cancelled by SessionProvider re-renders → fixed with `window.location.href`)

---

## Acknowledgements

- [FakeStoreAPI](https://fakestoreapi.com) — Free REST API providing realistic product data
- [Neon.tech](https://neon.tech) — Serverless PostgreSQL with a generous free tier
- [Lucide React](https://lucide.dev) — Clean, consistent icon library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS that made the dark theme fast to build
- [shadcn/ui](https://ui.shadcn.com) — Design reference for the neutral/green colour palette

---

_This is a portfolio project. No real transactions are processed._
