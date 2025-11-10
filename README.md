# NovaShop – Full-Stack NoSQL Recommendation Platform

NovaShop is a production-ready monorepo showcasing a collaborative-filtering recommendation engine backed by Fastify, MongoDB, Redis, and a modern React UI. It satisfies the assignment requirements with authentication, product catalog management, interaction tracking, search, analytics, and automated testing.

## Key Features

- **Authentication** with argon2 hashing, JWT access/refresh tokens in httpOnly cookies, rate-limited endpoints, and CSRF guards.
- **Product catalog** with MongoDB text search, pagination, admin CRUD, and 50+ seeded SKUs.
- **Interaction tracking** for views, likes, and purchases feeding a collaborative-filtering engine.
- **Recommendations** implementing both user-user and item-item cosine similarity with Redis caching and warm-up jobs.
- **Responsive React UI** built with Vite, Tailwind, shadcn-inspired primitives, React Query, react-hook-form, and Zod validation.
- **Observability** via pino structured logging, metrics endpoint, and health probes.
- **Tooling** including ESLint, Prettier, Husky, lint-staged, Vitest, Playwright, Jest, docker-compose orchestration, and k6 load scripts.

## Monorepo Layout

- `apps/api` – Fastify API service
- `apps/web` – React SPA
- `packages/config` – Shared ESLint/Prettier/Tailwind config
- `packages/tsconfig` – Base TypeScript configs
- `infra/` – Docker, seed, and load test tooling
- `docs/` – OpenAPI spec and architecture diagram

Refer to [`RUN.md`](RUN.md) for local development and Docker commands, and [`docs/openapi.yaml`](docs/openapi.yaml) for complete API documentation.

## Performance & Tuning

- MongoDB indexes on users, products, and interactions keep query plans efficient (see models).
- Redis caches recommendation payloads for 10 minutes and is busted on purchases for fresh recs.
- k6 scenario (infra/k6/reco-load.js) validates /reco, /search, and /products stay below p95 150–400ms thresholds with warm caches.
- Aggregation pipelines batch nearest-neighbour math to reduce round trips, and nightly precompute jobs warm Redis.
