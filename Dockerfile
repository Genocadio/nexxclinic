# Multi-stage Dockerfile for Bun + Next.js Standalone
FROM oven/bun:1-alpine AS builder

ARG API_BASE_URL=http://backend:8080
ENV API_BASE_URL=${API_BASE_URL}

WORKDIR /app

# Copy dependency descriptors (wildcard ensures it matches bun.lock or bun.lockb if present)
COPY package.json bun.lock* ./

# Install all dependencies with frozen lockfile
RUN bun install --frozen-lockfile

# Copy application source code
COPY . .

# Run check and build the application in standalone mode
RUN bun run build

# ── Production Runtime Stage ──
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install dumb-init for proper PID 1 signal forwarding
RUN apk add --no-cache dumb-init

# Run as non-root bun user
USER bun

# Copy only the standalone output, public folder, and static chunks
COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["bun", "server.js"]