FROM node:20-slim AS deps
WORKDIR /app/backend
COPY backend/package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.17.1
RUN pnpm install --filter backend --frozen-lockfile

FROM node:20-slim AS builder
WORKDIR /app/backend
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY backend/package.json pnpm-lock.yaml ./
COPY backend/ ./
RUN echo $(cat pnpm-lock.yaml) > /dev/null
ENV NODE_ENV=development
ENV CI=true
RUN pnpm install --filter backend --frozen-lockfile
RUN pnpm --filter backend run build
RUN pnpm --filter backend exec prisma generate

FROM node:20-alpine AS runtime
WORKDIR /app/backend
ENV NODE_ENV=production
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/.env ./.env
EXPOSE 4000
CMD ["node", "dist/main.js"]