FROM node:20-slim AS base
ENV NODE_ENV=production
WORKDIR /app

# Install all dependencies (including dev) for building
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Build the app
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production dependencies only
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Final runtime image
FROM base
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./
# db.server.ts reads the SQLite file from ./public at runtime
COPY public ./public

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]
