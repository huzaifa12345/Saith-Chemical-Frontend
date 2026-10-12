import { getCategories, getProducts } from '@/lib/api-server';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/all-products',
    '/about',
    '/return-policy',
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
      getProducts({ limit: 500, page: 1 }, { revalidate: 3600 }),
      getCategories({ revalidate: 3600 }),
    ]);

    const products = productsData.products || productsData || [];
    productRoutes = (Array.isArray(products) ? products : [])
      .filter((p) => p?.barcode || p?.id)
      .map((p) => ({
        url: `${SITE_URL}/product/${p.barcode || p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));

    categoryRoutes = (Array.isArray(categories) ? categories : [])
      .filter((c) => c?.id)
      .map((c) => ({
        url: `${SITE_URL}/category/${c.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
  } catch {
    // Sitemap still returns static routes if API is unreachable at build time
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
