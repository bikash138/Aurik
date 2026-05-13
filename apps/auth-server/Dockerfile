# Base
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable


# Dependencies
FROM base AS deps

WORKDIR /app

# Copy turbo pruned package files
COPY out/json/ .

RUN pnpm install --frozen-lockfile --config.node-linker=hoisted


# Builder
FROM base AS builder

WORKDIR /app

COPY --from=deps /app ./

COPY out/full/ .

RUN pnpm --filter @aurik/database exec prisma generate

RUN pnpm --filter @aurik/auth-server... build

RUN CI=true pnpm install --prod --frozen-lockfile --config.node-linker=hoisted


# Runner
FROM node:22-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "apps/auth-server/dist/index.mjs"]