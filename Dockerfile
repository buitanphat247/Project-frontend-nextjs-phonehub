# Multi-stage Dockerfile for Next.js (App Router)
# - Small final image using standalone output
# - Supports build-time envs for NEXT_PUBLIC_*

# ---------- Base ----------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json* ./
# If you use npm workspaces, copy package*.json at repo root accordingly
RUN npm ci --legacy-peer-deps

# ---------- Builder ----------
FROM base AS builder

# Build-time public envs (embedded into the bundle)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}

# Disable font optimization during build (to avoid Google Fonts download issues)
ENV NEXT_FONT_OPTIMIZATION=false

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Clean any previous build artifacts
RUN rm -rf .next

# Ensure Next can build in CI environments
ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1

# Build với webpack (không dùng Turbopack)
RUN npm run build

# ---------- Prod deps (only production) ----------
FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --legacy-peer-deps

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy production node_modules and build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]


