# OIDC Provider

OIDC (OpenID Connect) Provider の学習・検証用プロジェクト。Better Auth を使った Provider と、それを利用するクライアントアプリのサンプル実装。

## 構成

```
├── provider/           ← OIDC Provider
│   ├── src/            ← Hono + Better Auth (API)
│   └── web/            ← React + Tailwind (ログイン/同意画面)
│
├── client/             ← クライアントアプリ (RP)
│   ├── server/         ← Hono (OIDC クライアント)
│   └── web/            ← React (ユーザー向けUI)
│
└── docker-compose.yml  ← 全サービス管理
```

## 技術スタック

- **Language**: TypeScript
- **Framework**: Hono
- **Auth**: Better Auth + @better-auth/oauth-provider
- **Frontend**: React, Tailwind CSS
- **Database**: PostgreSQL
- **Infrastructure**: Docker / Docker Compose, nginx

## 起動

```bash
docker compose up --build
```

| サービス | URL | 役割 |
|----------|-----|------|
| Provider API | http://localhost:3000 | OIDC Provider (Better Auth) |
| Provider Web | http://localhost:5173 | ログイン/同意画面 |
| Client Server | http://localhost:8080 | クライアントのバックエンド |
| Client Web | http://localhost:5174 | クライアントのフロント |
| PostgreSQL | localhost:5433 | データベース |

## OIDC フロー

```
Client Web (5174) → Client Server (8080) /login
  → Provider API (3000) /oauth2/authorize
  → Provider Web (5173) ログイン → 同意
  → Client Server (8080) /callback (code → token 交換)
  → Client Web (5174) ログイン完了
```

## 環境変数

`.env` を参照。主な設定:

| 変数 | 説明 |
|------|------|
| `BETTER_AUTH_SECRET` | Better Auth の署名シークレット |
| `CLIENT_ID` | クライアントアプリの ID |
| `CLIENT_SECRET` | クライアントアプリのシークレット |
| `FRONTEND_URL` | Provider フロントの URL |
