# Stage 1: Build the application
FROM node:18.18.2 as builder
WORKDIR /usr/src/app
COPY api-service/package*.json ./
RUN npm install
COPY api-service/ ./
RUN npm run build

# Stage 2: Production environment
FROM node:18.18.2-slim
WORKDIR /app
COPY --from=builder /usr/src/app/dist ./dist
COPY api-service/package*.json ./
RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/src/index.js"]
