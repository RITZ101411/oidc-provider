# OIDC Provider

OIDC (OpenID Connect) Provider の学習・検証用プロジェクト。Better Auth を使った Provider と、それを利用するクライアントアプリのサンプル実装。

## Project Structure

```
├── provider/           ← OIDC Provider
│   ├── src/            ← Hono + Better Auth (API)
│   └── web/            ← React + Tailwind (ログイン/同意画面)
│
├── client/             ← クライアントアプリ (RP)
│   ├── server/         ← Hono (OIDC クライアント)
│   └── web/            ← React (ユーザー向けUI)
│
└── docker-compose.yml  ← Docker Compose
```

## Tech Stack

- **Language**: TypeScript
- **Framework**: Hono
- **Auth**: Better Auth + @better-auth/oauth-provider
- **Frontend**: React, Tailwind CSS
- **Database**: PostgreSQL
- **Infrastructure**: Docker / Docker Compose, nginx

## How to run

```bash
docker compose up --build
```