# Stage 1: Build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/api ./api
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "api/index.js"]
