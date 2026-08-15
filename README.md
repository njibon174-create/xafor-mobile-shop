# Xafor Mobile Shop E-Commerce Platform
A premium, minimal e-commerce website for mobile phones and accessories in Bangladesh.

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4 (dark mode enabled)
- Framer Motion (animations)
- Supabase (PostgreSQL backend)
- Vercel (deployment)

## Features
- Product browsing with filters (brand, price, category)
- Shopping cart with localStorage persistence
- Wishlist functionality
- Guest checkout (COD only)
- Order tracking via Tracking ID (XAF-YYYYMMDD-XXX)
- Home delivery (80 TK Dhaka / 120 TK outside) or shop pickup (free)
- Dark mode default with light mode toggle

## Setup

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build
```

## Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=https://ymjjpfmgvbyfamnxluep.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_Q0CVt8f4amDRM5bGLT_cgA_IE5VbufX
```

## Database
Run `supabase-schema.sql` in your Supabase SQL Editor to set up tables and seed data.

## Deployment
- GitHub: https://github.com/njibon174-create/xafor-mobile-shop
- Vercel: Connect repo at vercel.com, add env vars, auto-deploy on push
