---
title: IQMath Backend API
emoji: "🚀"
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

# IQMath Backend API

Express + Prisma backend for IQMath Technologies.

## Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/products`
- `GET /api/dashboard/admin-overview`

## Required Space Secrets

Configure in Hugging Face Space settings:

- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `PORT` (set `7860`)
