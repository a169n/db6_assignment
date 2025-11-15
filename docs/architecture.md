# Architecture Overview

```mermaid
flowchart LR
  Web["Web App (Vite React)"] -- REST/Fetch --> API["Express.js"]
  API -- JWT Cookies --> Web
  API -- CRUD --> MongoDB[(MongoDB Cluster)]
  API -- Cache Recos --> Redis[(Redis LRU Cache)]
  API -- Metrics --> Observability[(Metrics & Logs)]
  API -- Aggregations --> MongoDB
  Reco["Reco Jobs"] -- Precompute --> Redis
  User((User)) --> Web
```

The SPA communicates with the Fastify API via HTTPS using httpOnly cookie authentication. The API persists data in MongoDB, caches recommendation payloads in Redis, and exposes observability endpoints. A scheduled recommendation job precomputes similarity matrices and warms caches.
