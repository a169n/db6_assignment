FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm install --legacy-peer-deps
RUN npm run build -w apps/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/package.json ./package.json
RUN npm install --omit=dev --legacy-peer-deps
EXPOSE 5173
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
