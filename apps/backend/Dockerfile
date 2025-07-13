# ---- Base Node image ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Install pnpm ----
RUN npm install -g pnpm@10.13.1

# ---- Copy only the pnpm files and install dependencies ----
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

RUN pnpm install --frozen-lockfile

# ---- Build the app with Turborepo ----
RUN pnpm turbo run build --filter=backend

# ---- Production image ----
FROM base AS prod
WORKDIR /app

# Copy only the built backend app and its node_modules
COPY --from=deps /app/apps/backend/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]