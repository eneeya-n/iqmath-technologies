# IQMath Technologies - Enterprise EdTech SaaS

High-end full-stack SaaS platform for IQMath Technologies with:

- Premium Next.js 14 frontend (App Router + TypeScript + Tailwind + Framer Motion + Anime.js + Three.js)
- Express.js + TypeScript REST API backend
- Prisma ORM with TiDB Cloud (MySQL compatible)
- JWT auth + role-based access control + Google token login endpoint
- Multi-product demo suite, training pages, and enterprise dashboard experiences

## Monorepo Structure

```text
frontend/   -> Next.js enterprise UI
backend/    -> Express REST API + Prisma
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `frontend/.env.local.example` to `frontend/.env.local`
- Copy `backend/.env.example` to `backend/.env`

3. Setup database schema and seed:

```bash
npm run prisma:generate --workspace backend
npm run prisma:push --workspace backend
npm run prisma:seed --workspace backend
```

4. Run apps:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

## Deployment

- Frontend: deploy `frontend` to Vercel
- Backend: deploy `backend` to any Node host
- Database: TiDB Cloud

Set all environment variables in deployment platforms before release.
