<div align="center">

# NovaShop

A full-stack commerce sandbox that demonstrates how favorites, carts, and user activity drive a MongoDB + Redis powered recommendation system.

</div>

## What’s inside

| Area | Highlights |
| --- | --- |
| **apps/api** | Express 4 API, MongoDB via Mongoose, Redis caching, JWT auth with httpOnly cookies, argon2 password hashing, Zod validation, Jest tests |
| **apps/web** | React 18 + Vite, React Router, React Query, shadcn-inspired UI primitives, react-hook-form + Zod forms, Vitest + Playwright tests, rich skeleton loaders |
| **packages/** | Shared ESLint/Prettier/Tailwind/TS config |
| **docs/** | OpenAPI spec plus architecture diagrams |

Monorepo commands (lint/test/dev/build) are wired through npm workspaces—run them from the repo root and they fan out to each package.

## Core features

- **Authentication & profiles** – secure registration/login with refresh token rotation, CSRF/origin checks, and basic preference storage.
- **Product catalog & search** – MongoDB-backed catalog with full-text search, live categories from `/products/categories`, debounced keyword/price filters, pagination, and trending views.
- **Interaction tracking** – views, likes, cart additions, and purchases become weighted `Interaction` documents that feed the recommenders.
- **Favorites** – heart any product (from cards or detail pages) for one-click recall; hearts now fill when saved so it’s obvious what you love.
- **Cart** – add items from anywhere, see cart badges and “In cart” states instantly, adjust quantities inline, and run a simulated checkout that records purchase interactions.
- **Recommendation engine** – both user-user and item-item collaborative filtering modes with Redis caching and automatic invalidation on new signals.
- **Tooling & quality gates** – ESLint, Prettier, Vitest, Playwright, Jest, Husky, and lint-staged keep the mono-repo tidy.

## Recommendation engine in practice

1. **Signals** – every view, favorite (like), add-to-cart, and checkout call posts to `/interactions` with a weight (`view=1`, `like=3`, `purchase=5`).  
2. **Storage** – the `InteractionModel` collects those events; nightly jobs in `src/reco/jobs` pre-compute similarity matrices, while live purchases bust relevant Redis keys for freshness.  
3. **Algorithms** – user-based filtering compares interaction vectors to find neighbours, while item-based filtering uses cosine similarity on co-interaction pairs.  
4. **Serving** – `/reco/user` and `/reco/item` stream cached payloads (default 10 minutes) and fall back to on-demand aggregation if the cache is cold.  
5. **Feedback loop** – new likes/favorites immediately invalidate cached recommendations for that user, so toggling the heart or checking out visibly changes the ribbons on `/`.

## Favorites & cart flows

- **Favorites API**:  
  - `GET /me/favorites` – list saved products.  
  - `POST /me/favorites { productId }` – add (idempotent).  
  - `DELETE /me/favorites/:productId` – remove.
- **Cart API**:  
  - `GET /me/cart` – populated items with quantities and subtotals.  
  - `POST /me/cart { productId, quantity? }` – add or increment.  
  - `PATCH /me/cart/:productId { quantity }` – set quantity (≤0 removes).  
  - `DELETE /me/cart/:productId` – remove the line.

On the React side:

- Hearts are rendered inside `InteractionButtons` and on the product detail sidebar. They fill + read “Liked”/“In favorites” after a successful toggle, and every toast ships with a dismiss action for quick cleanup.
- The cart lives at `/cart`, with quantity steppers, removal buttons, “In cart” button states across the app, a running subtotal, and a faux checkout action that fires purchase interactions for every line. The nav shows a live badge for total items.
- Favorites list at `/favorites` reuses the same product cards so you can hop back into browsing quickly.

## Getting started

> Need a deeper walkthrough? See [`RUN.md`](RUN.md) for Docker notes, env samples, and seeding scripts.

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment**  
   Create a `.env` at the repo root (the API auto-loads it) and supply at least:
   ```
   MONGO_URI=mongodb://localhost:27017/nova
   REDIS_URL=redis://localhost:6379
   WEB_ORIGIN=http://localhost:5173
   ```
   Other values have sensible defaults—see `apps/api/src/config/env.ts`.
3. **Seed sample data (optional but recommended)**
   ```bash
   npm run seed -w apps/api
   ```
4. **Start the stack**
   ```bash
   # API (http://localhost:4000)
   npm run dev -w apps/api

   # Web (http://localhost:5173)
   npm run dev -w apps/web
   ```
5. **Sign up, like a few products, add them to your cart, and run checkout** to watch both recommendation ribbons react in real time.

## Testing & quality

- **Web unit tests** – `npm run test -w apps/web`
- **API tests** – `npm run test -w apps/api`
- **Playwright smoke** – `npm run test:e2e -w apps/web`
- **Lint/format** – `npm run lint`, `npm run format`
- **Recommendation quality** – `npm run reco:evaluate -w apps/api [-- --limit 10 --holdout 3]` computes precision/recall/F1, add `--synthetic` to run against a generated offline dataset when Mongo isn’t available.

CI can run `npm run test -ws` to execute both backend Jest suites and frontend Vitest suites together.

## API map

| Route | Description |
| --- | --- |
| `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh` | Authentication lifecycle |
| `GET /me` | Session inspection (returns profile, favorites, and cart IDs) |
| `GET /products`, `/products/:slug` | Catalog browsing |
| `GET /products/categories` | Distinct category list for the search filters |
| `GET /search` | Full-text search with filters |
| `POST /interactions` | Record view/like/purchase signals |
| `GET /reco/user`, `/reco/item` | Collaborative filtering recommendations |
| `GET/POST/DELETE /me/favorites*` | Favorites CRUD |
| `GET/POST/PATCH/DELETE /me/cart*` | Cart CRUD + checkout hook |

Swagger docs live at `/docs` when the API server is running.

## Architecture at a glance

- **Data stores** – MongoDB houses users/products/interactions; Redis caches recommendation payloads and refresh tokens.
- **Security** – rate limiting, helmet, origin-bound CSRF checks, signed JWT cookies, argon2 password hashing.
- **Observability** – pino structured logging plus lightweight request metrics in `@lib/metrics`.

---

NovaShop is intentionally compact, but the new favorites and cart rails make it easy to demonstrate how explicit user input reshapes personalized feeds. Enjoy hacking on it!
