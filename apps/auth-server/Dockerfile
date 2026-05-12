# Build & Deploy
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter @aurik/database exec prisma generate

RUN pnpm --filter @aurik/auth-server build

RUN pnpm --filter=@aurik/auth-server --prod deploy /app/deployed

# Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/deployed .

EXPOSE 8080

CMD ["node", "dist/index.mjs"]
