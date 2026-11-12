import { getCategories, getProducts } from '@/lib/api-server';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import { categoryPath } from '@/lib/slug';
import {
  getProductPrimaryImage,
  toAbsoluteImageUrl,
} from '@/lib/images';

/** Revalidate often so new products appear in sitemap without redeploy. */
export const revalidate = 60;

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
    const [productsData, categories] = await Promise.all([
      getProducts({ limit: 500, page: 1 }, { revalidate: 60 }),
      getCategories({ revalidate: 60 }),
    ]);

    const products = productsData.products || productsData || [];
    productRoutes = (Array.isArray(products) ? products : [])
      .filter((p) => p?.barcode || p?.id)
      .map((p) => {
        const image = toAbsoluteImageUrl(getProductPrimaryImage(p));
        return {
          url: `${SITE_URL}/product/${p.barcode || p.id}`,
          lastModified: p.updatedAt || p.updated_at
            ? new Date(p.updatedAt || p.updated_at)
            : new Date(),
          changeFrequency: 'weekly',
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
  } catch {
    // Still return static routes if API is unreachable
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
