import { getCategories, getProducts } from '@/lib/api-server';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { categoryPath } from '@/lib/slug';
import {
  getProductPrimaryImage,
  toAbsoluteImageUrl,
} from '@/lib/images';

/** Always rebuild from live API so new products appear without redeploy. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  let pages = 1;

  do {
    const data = await getProducts(
      { limit: 100, page, sortBy: 'created_at' },
      { revalidate: 0, cache: 'no-store' }
    );
    const batch = data?.products || (Array.isArray(data) ? data : []);
    if (Array.isArray(batch)) all.push(...batch);
    pages = Number(data?.pagination?.pages) || 1;
    page += 1;
  } while (page <= pages && page <= 50);

  return all;
}

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/all-products',
    '/about',
    '/contact',
    '/return-policy',
    '/privacy-policy',
    '/terms',
    '/shipping-policy',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  let productRoutes = [];
  let categoryRoutes = [];

  try {
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      getCategories({ revalidate: 0, cache: 'no-store' }),
    ]);

    productRoutes = (Array.isArray(products) ? products : [])
      .filter((p) => p?.barcode || p?.id)
      .map((p) => {
        const image = toAbsoluteImageUrl(getProductPrimaryImage(p));
        return {
          url: `${SITE_URL}/product/${p.barcode || p.id}`,
          lastModified: p.updatedAt || p.updated_at
            ? new Date(p.updatedAt || p.updated_at)
            : new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
          images: image ? [image] : undefined,
        };
      });

    categoryRoutes = (Array.isArray(categories) ? categories : [])
      .filter((c) => c?.id && c?.name)
      .map((c) => ({
        url: absoluteUrl(categoryPath(c)),
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } catch (err) {
    console.error('[sitemap] Failed to load products/categories:', err?.message || err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
