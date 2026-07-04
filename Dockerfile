# Dockerfile for Bun + Next.js (without standalone)
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Build args — required for NEXT_PUBLIC_* vars (inlined at build time)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Copy package.json only
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Use existing bun user
USER bun

# Copy built files (no standalone needed)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Run exactly like you do locally
CMD ["bun", "run", "start"]