# Stage 0: Base image with pnpm & turbo
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable \
     && corepack prepare pnpm@latest --activate \
     && pnpm install -g turbo


# Stage 1: Prune workspace for `backend`
FROM base AS pruner
WORKDIR /app

COPY . .

RUN turbo prune --scope=backend --docker

# Stage 2: Install full deps + build
FROM base AS builder
WORKDIR /app
# Copy only pruned JSON workspace (package.json, lockfile)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy full source of backend & its deps
COPY --from=pruner /app/out/full/ .

# Build via turborepo (this runs build in dto then backend)
RUN turbo run build --filter=backend

# Stage 3: Install production-only deps
FROM base AS prod-deps
WORKDIR /app
COPY --from=builder /app/deps .

RUN pnpm install --prod --frozen-lockfile

# Stage 4: Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy prod deps and build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist

# TODO find a way to do that automatially
# Copy internal package compiled into node_modules
COPY --from=builder /app/packages/dto/dist ./node_modules/@repo/dto

CMD ["node", "dist/main.js"]
