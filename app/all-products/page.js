import { Suspense } from 'react';
import AllProductsView from '@/components/catalog/AllProductsView';
import { getProducts } from '@/lib/api-server';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'All Products',
  description:
    'Browse all Saith Chemical home-care and cleaning products. Best prices in Pakistan.',
  path: '/all-products',
});

async function AllProductsLoader({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';

  let initialProducts = [];
  let initialPagination = {};

  try {
    const data = await getProducts({
      page: 1,
      limit: 12,
      search,
      sortBy: 'created_at',
    });
    initialProducts = data.products || [];
    initialPagination = data.pagination || {};
  } catch {
    // Client view will retry
  }

  return (
    <AllProductsView
      initialProducts={initialProducts}
      initialPagination={initialPagination}
      initialSearch={search}
    />
  );
}

export default function AllProductsPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status" />
        </div>
      }
    >
      <AllProductsLoader searchParams={searchParams} />
    </Suspense>
  );
}
