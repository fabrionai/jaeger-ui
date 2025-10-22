# Multi-stage build for Jaeger UI
# Build context should be the jaeger-ui source directory
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./
COPY tsconfig.json ./

# Install dependencies (skip prepare script - no git hooks or workspace setup needed)
RUN npm install --ignore-scripts

# Copy source code
COPY packages ./packages
COPY scripts ./scripts

# Build plexus first (dependency)
WORKDIR /app/packages/plexus
RUN npm install --ignore-scripts
RUN npm run build

# Build the UI
WORKDIR /app/packages/jaeger-ui
RUN npm install --ignore-scripts
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/packages/jaeger-ui/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

