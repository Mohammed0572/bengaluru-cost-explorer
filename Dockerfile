# Stage 1: Build React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root dependency manifests
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies needed for Vite build)
RUN npm ci

# Copy application source code
COPY . .

# Build production assets into dist/
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy server dependency manifests and install production dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server application files
COPY server/ ./server/

# Copy compiled frontend static assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose application port
EXPOSE 3001

# Run Express server (which serves API endpoints + static frontend)
CMD ["node", "server/server.mjs"]
