# syntax=docker/dockerfile:1

# ---- Base ---------------------------------------------------------------
# Debian slim so sharp's prebuilt binaries work without extra system libs.
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ---- Dependencies -------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build --------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
# A non-empty secret is required for the production build; the real secret is
# supplied at runtime. Kept inline so it isn't baked into the image.
RUN PAYLOAD_SECRET=build-only-placeholder pnpm build

# ---- Runner -------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production
# Persistent data lives here — mount a volume at /app/data.
ENV DATABASE_URI=file:/app/data/bjr.db
ENV MEDIA_DIR=/app/data/media
ENV PORT=3000

# Keep full node_modules (incl. the Payload/Next runtime) and built output.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Create the data dir and run as the unprivileged node user.
RUN mkdir -p /app/data/media && chown -R node:node /app/data
USER node

EXPOSE 3000
VOLUME ["/app/data"]

# Apply any pending DB migrations (creates the schema on a fresh volume), then
# start the server.
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]
