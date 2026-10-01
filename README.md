# IQMath Technologies - Enterprise EdTech SaaS

IQMath Technologies website. The public site is a static Next.js app. Course registration is handled by the Google Apps Script in `apps-script/Registration.gs`, which writes to Google Sheets and confirms Razorpay payments.

## Structure

```text
frontend/     -> Next.js site
apps-script/  -> Registration and payment web app
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy `frontend/.env.local.example` to `frontend/.env.local` and set `NEXT_PUBLIC_APPS_SCRIPT_URL` after deploying the script.

3. Run the site:

```bash
npm run dev
```

Frontend: `http://localhost:3000`
Registration: `http://localhost:3000/register/python-data-analytics`

## Deployment

Deploy `frontend` as a static site. Deploy the Apps Script from the registration spreadsheet as a web app.
