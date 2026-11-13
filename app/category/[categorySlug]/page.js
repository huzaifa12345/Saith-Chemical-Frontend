import { notFound, permanentRedirect } from 'next/navigation';
import CategoryView from '@/components/catalog/CategoryView';
import {
  getProductsByCategory,
  resolveCategory,
} from '@/lib/api-server';
import { buildPageMetadata } from '@/lib/seo';
import { categoryPath, slugify } from '@/lib/slug';

export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  try {
    const category = await resolveCategory(categorySlug);
    if (category?.name) {
      return buildPageMetadata({
        title: category.name,
        description:
          category.description ||
          `Shop ${category.name} products from Saith Chemical — dishwash, detergents and home care in Lahore.`,
        path: categoryPath(category),
      });
    }
  } catch {
    // fall through to noindex 404 metadata
  }
  return {
    title: {
      absolute: 'Category Not Found | Saith Chemical',
    },
    description: 'This category does not exist on Saith Chemical.',
    robots: 'noindex, nofollow',
  };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;
  const category = await resolveCategory(categorySlug).catch(() => null);

  if (!category) {
    notFound();
  }

  // 301 numeric /category/1 → /category/dishwash-soap
  if (/^\d+$/.test(String(categorySlug))) {
    permanentRedirect(categoryPath(category));
  }

  // Canonicalize mismatched slug spelling
  const canonicalSlug = slugify(category.name);
  if (canonicalSlug && slugify(categorySlug) !== canonicalSlug) {
    permanentRedirect(`/category/${canonicalSlug}`);
  }

  let initialProducts = [];
  let initialTotalPages = 1;
  try {
    const productsData = await getProductsByCategory(category.id, {
      page: 1,
      limit: 12,
    });
    initialProducts = productsData.products || [];
    initialTotalPages = productsData.pagination?.pages || 1;
  } catch {
    // Client can retry
  }

  return (
    <CategoryView
      categorySlug={String(category.id)}
      categoryPathSlug={canonicalSlug}
      initialCategory={category}
      initialProducts={initialProducts}
      initialTotalPages={initialTotalPages}
    />
  );
}
