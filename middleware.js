import { NextResponse } from 'next/server';

function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function apiBase() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3000/api';
  return base.replace(/\/$/, '').replace('://localhost', '://127.0.0.1');
}

function productMissingHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="robots" content="noindex, nofollow"/>
  <title>Product Not Found | Saith Chemical</title>
  <meta name="description" content="This product could not be found on Saith Chemical."/>
  <style>
    body{font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f8f9fa;color:#1c1c1e}
    main{text-align:center;padding:2rem}
    a{color:#e86c24;font-weight:600}
  </style>
</head>
<body>
  <main>
    <h1>Product not found</h1>
    <p>We couldn't find a product for this barcode. It may be inactive or removed.</p>
    <p><a href="/all-products">Browse all products</a> · <a href="/">Home</a></p>
  </main>
</body>
</html>`;
}

/**
 * One-hop 301: /category/1 and /category/1/ → /category/{slug}
 * Missing products: real HTTP 404 + exact robots "noindex, nofollow"
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const productMatch = pathname.match(/^\/product\/([^/]+)\/?$/);
  if (productMatch) {
    const barcode = decodeURIComponent(productMatch[1]);
    try {
      const res = await fetch(
        `${apiBase()}/products/${encodeURIComponent(barcode)}`,
        { headers: { Accept: 'application/json' }, cache: 'no-store' }
      );
      if (res.status === 404) {
        return new NextResponse(productMissingHtml(), {
          status: 404,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        });
      }
    } catch {
      // Let the page handle API-down UI
    }
  }

  const categoryIdMatch = pathname.match(/^\/category\/(\d+)\/?$/);
  if (categoryIdMatch) {
    const id = categoryIdMatch[1];
    try {
      const res = await fetch(`${apiBase()}/categories/${id}`, {
        headers: { Accept: 'application/json' },
        cache: 'force-cache',
      });
      if (res.ok) {
        const json = await res.json();
        const category = json?.data ?? json;
        const slug = slugify(category?.name);
        if (slug) {
          const dest = new URL(`/category/${slug}`, request.nextUrl.origin);
          return NextResponse.redirect(dest, 301);
        }
      }
    } catch {
      // fall through
    }
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    const dest = new URL(
      pathname.replace(/\/+$/, '') || '/',
      request.nextUrl.origin
    );
    dest.search = request.nextUrl.search;
    return NextResponse.redirect(dest, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/product/:path*',
    '/category/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
