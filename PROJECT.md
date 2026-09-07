# Thumba — E-Commerce Jewelry Platform

## Architecture Overview

Thumba is a monorepo containing two top-level Next.js applications sharing types, catalog helpers, and a Prisma schema.

```
project-root/
├── storefront/          # Customer-facing e-commerce website (port 3000)
├── dashboard/           # Admin dashboard (port 3001)
├── shared/              # Types, catalog helpers, Prisma schema
├── .env                 # Local secrets (gitignored)
├── .env.example         # Placeholder names only — no real keys
├── package.json         # npm workspaces
├── PROJECT.md
└── TASKS.md
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| State | Zustand (storefront cart) |
| Payments | Razorpay test mode |
| Database | PostgreSQL + Prisma (schema only so far) |
| Package Manager | npm workspaces |

## Running the Project

```bash
npm install
npm run dev
```

- Storefront: http://localhost:3000
- Dashboard: http://localhost:3001

Copy `.env.example` to `.env` and fill Razorpay **test** keys (`rzp_test_...`) locally. Never commit `.env`.

## Current data

Catalog, orders, and customers are mock data so the UI can run without a database. Checkout creates a real Razorpay test order when test keys are present in `.env`.
