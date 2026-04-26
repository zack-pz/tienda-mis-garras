FROM node:24-alpine AS base

WORKDIR /workspace

RUN corepack enable

# Copy only files needed to install dependencies first (better layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./
COPY api/package.json ./api/package.json
COPY dashboard/package.json ./dashboard/package.json

RUN pnpm install --frozen-lockfile

# Copy source after deps
COPY . .

# Build dashboard
RUN pnpm --filter dashboard build

WORKDIR /workspace/dashboard

ENV NODE_ENV=production
EXPOSE 4173

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
