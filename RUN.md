# RUNBOOK

## Prerequisites

- Node.js 20+
- npm 9+
- Docker + Docker Compose (for container workflow)
- Redis & MongoDB for local development (use Docker Compose to spin them up)

## Install Dependencies

```bash
npm install
```

## Local Development

### Start databases (Mongo & Redis)

```bash
docker compose -f infra/docker-compose.yml up -d mongo redis
```

### Seed database

```bash
npm run build -w apps/api
npm run seed -w apps/api
```

### API (Fastify)

```bash
npm run dev -w apps/api
```

### Web (Vite React)

```bash
npm run dev -w apps/web
```

## Quality Gates

```bash
npm run lint
npm run test -w apps/api
npm run test -w apps/web
npm run test:e2e -w apps/web
npm run typecheck
```

Run Playwright after starting the dev servers or using the Docker stack.

## Dockerized Stack

```bash
docker compose -f infra/docker-compose.yml up --build
```

Services:
- Web UI: http://localhost:5173
- API: http://localhost:4000
- Swagger docs: http://localhost:4000/docs
- Metrics: http://localhost:4000/metrics

Seed and recommendation cron jobs run automatically within the Compose stack.

## Load Test (k6)

```bash
k6 run infra/k6/reco-load.js --env API_BASE_URL=http://localhost:4000
```

## Demo Flow

1. Register or login with `user1@example.com` / `Password123!`
2. Browse `/products`, open a product, like and purchase it.
3. Return to the home page to observe updated recommendations.
4. Use `/search` to filter catalog entries.

## Scripts Reference

- `npm run reco:precompute -w apps/api` – Warm Redis recommendation cache
- `npm run openapi:gen -w apps/api` – Copy OpenAPI spec into the build output
- `npm run ui:build -w apps/web` – Produce a static Tailwind CSS build for snapshots
