# CareerDown

A professional micro-blogging platform where people share career struggles, wins, and advice. Think Reddit meets X (Twitter) for career advice.

## Features
- Share Thoughts (short posts) and Articles (long-form with title)
- Like, repost, and comment with threaded replies
- Follow users and get a personalized home feed
- Browse by topic (#layoffs, #salary, #wlb, etc.)
- Search posts and users
- SEO-optimized with sitemap, JSON-LD structured data
- AdSense-ready ad slots
- Dark/light mode

## Tech Stack
- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM** + SQLite (dev) / PostgreSQL (prod)
- **NextAuth.js** v4 (Credentials + Google OAuth)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite: `file:./dev.db` / PostgreSQL: connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | ✅ |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | Google AdSense publisher ID | Optional |

### Test Accounts

After seeding, you can log in with any of these:
- `alice@example.com` / `password123`
- `bob@example.com` / `password123`
- `carol@example.com` / `password123`

## Deploying to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. For production, switch `DATABASE_URL` to a PostgreSQL connection string (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
5. Update `prisma/schema.prisma` datasource provider to `postgresql`
6. Deploy!

## Project Structure

```
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (main)/          # Main app (home, explore, profile, etc.)
│   └── api/             # API routes (NextAuth, signup)
├── components/
│   ├── ads/             # AdSlot component
│   ├── feed/            # PostCard, skeletons
│   ├── layout/          # Header, Sidebar, RightRail
│   ├── posts/           # Composers, CommentsSection, FollowButton
│   ├── profile/         # ProfileTabs
│   ├── seo/             # JsonLd
│   └── ui/              # Skeleton, EmptyState, DarkModeToggle
├── lib/
│   ├── actions/         # Server actions (posts, comments, interactions)
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # Prisma client singleton
│   ├── rateLimit.ts     # In-memory rate limiter
│   ├── sanitize.ts      # Input sanitization
│   └── utils.ts         # relativeTime, truncate
├── prisma/
│   ├── schema.prisma    # Data models
│   ├── seed.ts          # Seed script
│   └── migrations/      # Migration history
└── types/
    └── index.ts         # TypeScript interfaces
```

> **Note on rate limiting:** The in-memory rate limiter (`lib/rateLimit.ts`) uses a module-level `Map`. This works correctly for single-process deployments (local dev, single Vercel serverless instance). For multi-instance production deployments, replace with a Redis-backed solution (e.g. Upstash).
