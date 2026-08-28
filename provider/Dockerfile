FROM node:22-slim AS base
RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts

COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:22-slim AS production
RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts --prod

COPY --from=base /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
