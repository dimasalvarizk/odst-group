# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
ENV NODE_ENV=development
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Set Vite build argument (defaults to '/api' for single domain setup)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the production bundle
RUN npm run build

# Serve stage (Nginx)
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files from build stage to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
