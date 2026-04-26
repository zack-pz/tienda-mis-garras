FROM node:24-alpine AS base

WORKDIR /workspace

RUN corepack enable

# Copy only files needed to install dependencies first (better layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

# Copy source after deps
COPY . .

# Build API
RUN pnpm --filter api build

WORKDIR /workspace/apps/api

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start:prod"]
