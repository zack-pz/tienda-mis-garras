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

# Build dashboard
RUN pnpm --filter dashboard build

WORKDIR /workspace/apps/web

ENV NODE_ENV=production
EXPOSE 4173

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
