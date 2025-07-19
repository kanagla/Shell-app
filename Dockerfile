# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

# Serve stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
RUN npm install -g serve

EXPOSE 3001
CMD ["serve", "-s", "dist", "-l", "3001"]
