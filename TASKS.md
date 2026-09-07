# TASKS.md — Thumba Project

## Status Legend
- ✅ Done
- 🔄 In Progress
- ⏳ Next
- 🚫 Blocked

---

## Sprint 1 — Project Scaffold ✅

- [x] Initialize git repo and `.gitignore`
- [x] Create `.env` with Razorpay test-mode keys (gitignored)
- [x] Set up npm workspaces root `package.json`
- [x] Create shared TypeScript config (`tsconfig.base.json`)
- [x] Create shared ESLint config (`.eslintrc.json`)
- [x] Create shared Prettier config (`.prettierrc`)
- [x] Create `PROJECT.md` with architecture overview
- [x] Create `TASKS.md` running task list
- [x] Both apps run via single `npm run dev` command

## Sprint 2 — Shared Package ✅

- [x] Initialize `shared/` package with `package.json`
- [x] Define shared TypeScript interfaces (Product, Order, User, CartItem, Category, Address)
- [x] Define shared utility functions (currency formatting, slug generation, date formatting)
- [x] Define shared constants (Razorpay currency, order statuses, route constants)
- [x] Set up Prisma schema for Product/Order/User/Address/Cart

## Sprint 3 — Storefront ✅

- [x] Create Next.js storefront app (`storefront/`) on port 3000
- [x] Configure `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- [x] Set up app layout and global styles
- [x] Create hero page with featured products
- [x] Implement Razorpay checkout integration (`lib/razorpay.ts`)
- [x] Implement shared component utilities (`components/index.tsx`)

## Sprint 4 — Dashboard ✅

- [x] Create Next.js dashboard app (`dashboard/`) on port 3001
- [x] Configure `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- [x] Set up app layout with sidebar navigation
- [x] Build dashboard overview page with stats
- [x] Implement Razorpay integration (`lib/razorpay.ts`)
- [x] Implement shared component utilities (`components/index.tsx`)

## Sprint 5 — Git & Commit ⏳

- [x] Verify `npm run dev` works for both apps
- [x] Initialize git repo and commit initial scaffold
- [x] Add GitHub remote and push (after verification)

---

## Notes for the next agent

1. Do **not** commit `.env`. It contains Razorpay test-mode keys only.
2. Both apps run via `npm run dev` from the repo root.
3. Storefront runs on `:3000`, dashboard on `:3001`.
4. Shared package (`shared/`) contains reusable types, utils, and Prisma schema.
5. All code compiles without errors. Ready for further development.
