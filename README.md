# Saith Chemical — Next.js Frontend

App Router storefront. Express + Sequelize API stays in `../Backend`.

## Migration status

Phases 0–8 complete. Production app root for the storefront is **`frontend-next/`**. Legacy Vite app remains in `../Frontend/` until you archive it after a successful production smoke test.

### API layer

| Module | Use in |
|--------|--------|
| `@/lib/api-server` | Server Components / `generateMetadata` only |
| `@/lib/api-client` | Client Components (`themeApi`, `websiteSettingsApi`) |

## Local setup

```bash
# Terminal 1 — API (check Backend/.env PORT, often 3000)
cd Backend
npm run dev

# Terminal 2 — Next.js
cd frontend-next
cp .env.example .env.local
# Align API URLs with Backend PORT
npm install
npm run dev
```

Open the URL Next prints (`http://localhost:3000` or `:3001` if 3000 is the API).

## Env vars

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Browser axios/fetch (must include `/api`) |
| `API_URL` | Server-side SSR fetch |

## Vercel cutover

1. Create/update Vercel project with **Root Directory = `frontend-next`** (not `Frontend`).
2. Set env:
   - `NEXT_PUBLIC_API_URL=https://<your-api-host>/api`
   - `API_URL=https://<your-api-host>/api` (server-side; same host is fine)
3. Ensure Backend CORS includes:
   - `https://www.saithchemicals.com`
   - `https://saithchemicals.com`
   - `https://saith-chemical-e-com.vercel.app`
   - any new Vercel preview production URL
4. Deploy. Confirm `/api/health` on the API host returns OK.
5. Point the custom domain DNS to the new Vercel deployment.
6. After smoke tests pass, rename/archive `Frontend/` (Vite) so it is not deployed by mistake.

Do **not** use the old Vite `vercel.json` SPA rewrite on the Next app.

## Smoke checklist

- [ ] `/` loads hero + category products (API up)
- [ ] `/product/<barcode>` View Source: `<title>`, `rel=canonical`, `application/ld+json`, specs table HTML
- [ ] Hard refresh PDP — no empty title flash
- [ ] Add to Cart → `/cart` → `/checkout` → place COD order
- [ ] Discount badge + out-of-stock disables purchase buttons
- [ ] Submit a product review
- [ ] `/login` admin → `/admin` dashboard
- [ ] `/robots.txt` and `/sitemap.xml` respond

## SEO endpoints

- `/robots.txt` — `app/robots.js`
- `/sitemap.xml` — `app/sitemap.js` (static + products/categories when API reachable)

## Route map

| Path | Folder |
|------|--------|
| `/` | `app/page.js` |
| `/all-products` | `app/all-products/page.js` |
| `/product/:barcode` | `app/product/[barcode]/page.js` |
| `/category/:slug` | `app/category/[categorySlug]/page.js` |
| `/:slug` | `app/[categorySlug]/page.js` |
| `/cart` | `app/cart/page.js` |
| `/checkout` | `app/checkout/page.js` |
| `/about` | `app/about/page.js` |
| `/return-policy` | `app/return-policy/page.js` |
| `/login` | `app/login/page.js` |
| `/register` | `app/register/page.js` |
| `/change-password` | `app/change-password/page.js` |
| `/admin` | `app/admin/page.js` |
