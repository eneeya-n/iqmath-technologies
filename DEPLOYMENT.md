# Deployment Guide (GoDaddy + Cloudflare Pages + Apps Script)

## 1) Deploy registration (Google Apps Script)

1. Open the registration spreadsheet and go to **Extensions → Apps Script**.
2. Paste `apps-script/Registration.gs` in as `Code.gs`.
3. Add script properties `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
4. **Deploy → New deployment → Web app**. Execute as yourself. Access: **Anyone**.
5. Run `installReconcileTrigger` once from the editor and approve the permissions.
6. Copy the web app `/exec` URL. The site uses it as `NEXT_PUBLIC_APPS_SCRIPT_URL`.

## 2) Deploy Frontend (Cloudflare Pages)

1. Push this repo to GitHub (see below).
2. In [Cloudflare Dashboard](https://dash.cloudflare.com/) go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the GitHub repo and configure:

| Setting | Value |
|---|---|
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | `npm ci --legacy-peer-deps && npm run build:frontend` |
| **Build output directory** | *(not used for Workers static assets — assets path is in `wrangler.toml`)* |
| **Deploy command** | `npx wrangler deploy` *(default)* or `npm run deploy` |
| **Node.js version** | `20` (uses root `.node-version`) |

> **Important:** Do **not** use `npx wrangler deploy`. That deploys a Worker and fails in this monorepo. This site is a static Next.js export published from `frontend/out`.

4. Environment variable, set before the frontend build:
   - `NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<deployment-id>/exec`
5. Deploy. Cloudflare gives you a `*.pages.dev` URL.
6. Add custom domain under **Pages → Custom domains** (e.g. `www.iqmathtech.com`).

### GitHub Actions deploy (recommended)

Add these repository secrets in GitHub (**Settings → Secrets and variables → Actions**):

- `CLOUDFLARE_API_TOKEN` — create in Cloudflare with **Account → Cloudflare Pages → Edit**
- `CLOUDFLARE_ACCOUNT_ID` — from Cloudflare dashboard URL or **Workers & Pages → Overview**

Push to `main` runs `.github/workflows/deploy-cloudflare-pages.yml` and deploys with:

```bash
wrangler pages deploy frontend/out --project-name=iqmath-technologies
```

This avoids the broken `npx wrangler deploy` Workers command.

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
3. Set the Netlify environment variable before building:
   - `NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<deployment-id>/exec`
4. Deploy site and copy frontend URL, e.g. `https://iqmath-tech.netlify.app`.

## 3) Connect GoDaddy Domain

Use domain example: `iqmathtech.com`

- Frontend:
  - `www.iqmathtech.com` -> CNAME -> `<your-project>.pages.dev` (Cloudflare Pages)
  - `iqmathtech.com` -> Cloudflare apex DNS (follow Pages custom domain wizard)
## 4) Post-Deploy Checks

1. `https://www.<domain>` loads the landing page.
2. `/register/python-data-analytics` opens the registration page.
3. A test payment writes a row on the Registrations tab and only then shows as paid.
