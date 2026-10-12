'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { themeApi } from '@/lib/api-client';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import FilterBar from '@/components/catalog/FilterBar';
import ProductCard from '@/components/catalog/ProductCard';
import '@/styles/AllProducts.css';

export default function AllProductsView({
  initialProducts = [],
  initialPagination = {},
  initialSearch = '',
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination);
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const q = searchParams.get('search') || '';
    if (q !== searchQuery) {
      setSearchQuery(q);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, currentPage, priceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await themeApi.getProducts({
        page: currentPage,
        limit: 12,
        sortBy,
        search: searchQuery,
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
      });
      setProducts(data.products || []);
      setPagination(data.pagination || {});
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e?.preventDefault?.();
    setCurrentPage(1);
    const q = searchQuery.trim();
    router.push(q ? `/all-products?search=${encodeURIComponent(q)}` : '/all-products');
  };

  return (
    <ProductPageChrome>
      <div className="ap-page-wrapper">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onApplyFilters={fetchProducts}
        />

        <div className="container py-5">
          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-navy mx-auto" size={40} />
              <p className="mt-3 fw-bold text-muted">Loading Catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted">No chemical products found</h4>
              <p>Try adjusting your search query</p>
            </div>
          ) : (
            <>
              <div
                className={`product-grid-modern ${
                  viewMode === 'list' ? 'list-view' : ''
                }`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="ap-pagination-wrap mt-5">
                  <button
                    type="button"
                    className="ap-page-nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`ap-page-num ${
                        currentPage === i + 1 ? 'active' : ''
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="ap-page-nav-btn"
                    disabled={currentPage === pagination.pages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProductPageChrome>
  );
}
