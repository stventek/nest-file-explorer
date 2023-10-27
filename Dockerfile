# Building layer
ARG PORT=3000

FROM node:16-alpine as build

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci --omit=dev

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:16-alpine as production

WORKDIR /app

# Copy production build
COPY --from=build /app/dist/ ./dist/

# Expose application port
EXPOSE ${PORT}

# Start application
CMD [ "node", "dist/main.js" ]
