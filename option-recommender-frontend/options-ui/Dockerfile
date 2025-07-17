# frontend/options-ui/Dockerfile
# Stage 1: Build the React/Vite application
FROM node:18 AS builder

# This /app is the root of your React project INSIDE the container for building
WORKDIR /app 

# Copy package.json and package-lock.json (or yarn.lock) first.
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code (src, public, etc.)
COPY . .

# Build the React/Vite application for production
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration file
# Assumes nginx.conf is now in the same directory as this Dockerfile (options-ui)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the 'builder' stage to Nginx's default html directory
# The 'dist' folder will be directly under /app in the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80, which Nginx will listen on
EXPOSE 80

# Command to start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]