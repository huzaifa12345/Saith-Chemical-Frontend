import CategoryView from '@/components/catalog/CategoryView';
import {
  getCategoryById,
  getProductsByCategory,
} from '@/lib/api-server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  try {
    const category = await getCategoryById(categorySlug);
    if (category?.name) {
      return buildPageMetadata({
        title: category.name,
        description:
          category.description ||
          `Shop ${category.name} products from Saith Chemical.`,
        path: `/category/${categorySlug}`,
      });
    }
  } catch {
    // fall through
  }
  const label = decodeURIComponent(categorySlug).replace(/-/g, ' ');
  return buildPageMetadata({
    title: label,
    description: `Shop ${label} products from Saith Chemical.`,
    path: `/category/${categorySlug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;

  let initialCategory = null;
  let initialProducts = [];
  let initialTotalPages = 1;

  try {
    const [category, productsData] = await Promise.all([
      getCategoryById(categorySlug),
      getProductsByCategory(categorySlug, { page: 1, limit: 12 }),
    ]);
    initialCategory = category;
    initialProducts = productsData.products || [];
    initialTotalPages = productsData.pagination?.pages || 1;
  } catch {
    // Client retries
  }

  return (
    <CategoryView
      categorySlug={categorySlug}
      initialCategory={initialCategory}
      initialProducts={initialProducts}
      initialTotalPages={initialTotalPages}
    />
  );
}
