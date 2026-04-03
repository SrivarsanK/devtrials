# Use Node.js LTS image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (production + dev for build)
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Use a smaller runtime image
FROM node:20-slim AS runner

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the Cloud Run default port
EXPOSE 8080

# Run the app
CMD ["node", "dist/index.js"]
