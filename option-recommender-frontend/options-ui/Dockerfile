# frontend/options-ui/Dockerfile

# Stage 1: Build the React/Vite application
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Listen on port 8080 for GCP compatibility
EXPOSE 8080

# Override default port in nginx
ENV PORT=8080

CMD ["nginx", "-g", "daemon off;"]
