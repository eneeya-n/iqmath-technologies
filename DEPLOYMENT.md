# Deployment Guide (GoDaddy + Netlify + Render)

## 1) Deploy Backend (Render)

1. Create a new **Web Service** in Render and connect this project.
2. Use `render.yaml` (Blueprint) or configure manually:
   - Root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
   - Health check: `/health`
3. Set environment variables in Render:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `PORT=5000`
4. Deploy and copy backend URL, e.g. `https://iqmath-backend.onrender.com`.

## 2) Deploy Frontend (Cloudflare Pages)

1. Push this repo to GitHub (see below).
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the GitHub repo and configure:

| Setting | Value |
|---|---|
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm ci --legacy-peer-deps && npm run build:frontend` |
| **Build output directory** | `frontend/out` |
| **Deploy command** | *(leave empty)* — or `npm run pages:deploy` if your plan requires one |
| **Node.js version** | `20` (uses root `.node-version`) |

> **Important:** Do **not** use `npx wrangler deploy`. That deploys a Worker and fails in this monorepo. This site is a static Next.js export published from `frontend/out`.

4. Optional environment variable (when backend is live):
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-api-domain>/api`
5. Deploy. Cloudflare gives you a `*.pages.dev` URL.
6. Add custom domain under **Pages → Custom domains** (e.g. `www.iqmathtech.com`).

### Manual deploy (optional)

```bash
npm run build:frontend
npm run pages:deploy
```

## 2b) Deploy Frontend (Netlify) — alternative

1. Create new site from repo in Netlify.
2. Netlify will use `netlify.toml`:
   - Base: `frontend`
   - Build: `npm run build`
3. Set Netlify environment variable:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>/api`
4. Deploy site and copy frontend URL, e.g. `https://iqmath-tech.netlify.app`.

## 3) Connect GoDaddy Domain

Use domain example: `iqmathtech.com`

- Frontend:
  - `www.iqmathtech.com` -> CNAME -> `<your-project>.pages.dev` (Cloudflare Pages)
  - `iqmathtech.com` -> Cloudflare apex DNS (follow Pages custom domain wizard)
- Backend:
  - `api.iqmathtech.com` -> CNAME -> `<render-service>.onrender.com`

After DNS propagation, update:

- Netlify env: `NEXT_PUBLIC_API_BASE_URL=https://api.iqmathtech.com/api`
- Cloudflare Pages env: `NEXT_PUBLIC_API_BASE_URL=https://api.iqmathtech.com/api`

## 4) Post-Deploy Checks

1. `https://www.<domain>` loads landing page.
2. API `https://api.<domain>/health` returns `{ "ok": true, ... }`.
3. Login and dashboard APIs work from frontend.
