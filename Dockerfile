# Stage 1: Build static production assets
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy source code and build configuration
COPY . .

# Run tests & build production dist bundle
RUN npm test -- --run
RUN npm run build

# Stage 2: Serve static app using Nginx Alpine
FROM nginx:alpine AS production

# Copy custom Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
