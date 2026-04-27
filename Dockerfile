# Stage 1: Build the Vite Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:20-alpine

WORKDIR /app

# Copy package files for backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p /app/backend/uploads

EXPOSE 8080

CMD ["node", "backend/server.js"]
