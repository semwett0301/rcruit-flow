# Use Node.js LTS Alpine image
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and environment file
COPY . .
COPY .env .env

# Build the application
RUN pnpm run build

# Remove source code and dev dependencies after build
RUN rm -rf src/ test/ && \
    pnpm prune --prod && \
    pnpm store prune

# Expose port (defaults to 3000, override with docker run -p)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]