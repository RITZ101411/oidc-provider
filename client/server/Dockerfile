FROM node:22-slim
RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY tsconfig.json ./
COPY src ./src

EXPOSE 8080
CMD ["pnpm", "dev"]
