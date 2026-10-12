'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { themeApi } from '@/lib/api-client';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import FilterBar from '@/components/catalog/FilterBar';
import ProductCard from '@/components/catalog/ProductCard';
import '@/styles/AllProducts.css';
import '@/styles/DynamicCategory.css';

export default function CategoryView({
  categorySlug,
  initialCategory = null,
  initialProducts = [],
  initialTotalPages = 1,
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(!initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (initialCategory) return;
    const loadCategory = async () => {
      try {
        setLoading(true);
        const data = await themeApi.getCategoryById(categorySlug);
        setCategory(data);
      } catch {
        toast.error('Failed to load category');
        router.push('/all-products');
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) loadCategory();
  }, [categorySlug, initialCategory, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await themeApi.getProductsByCategory(categorySlug, {
          page: currentPage,
          limit: 12,
          search: debouncedSearch,
          sort_by: sortBy,
          ...(priceRange.min && { min_price: priceRange.min }),
          ...(priceRange.max && { max_price: priceRange.max }),
        });
        setProducts(data.products || []);
        setTotalPages(data.pagination?.pages || 1);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) fetchProducts();
  }, [categorySlug, currentPage, debouncedSearch, sortBy, priceRange]);

  if (loading && !category) {
    return (
      <ProductPageChrome>
        <div className="ct-loader-wrapper d-flex flex-column justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 fw-bold text-navy">Loading Chemical Catalog...</p>
        </div>
      </ProductPageChrome>
    );
  }

  return (
    <ProductPageChrome>
      <div className="ct-category-page-wrapper ap-page-wrapper">
        <div className="container pt-4">
          <h1 className="h3 fw-bold mb-1">
            {category?.name || 'Category'}
          </h1>
          {category?.description && (
            <p className="text-muted mb-0">{category.description}</p>
          )}
        </div>

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={() => setCurrentPage(1)}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onApplyFilters={() => setCurrentPage(1)}
        />

        <div className="container py-5">
          <div
            className={`product-grid-modern ${
              viewMode === 'list' ? 'list-view' : ''
            }`}
          >
            {products.length === 0 ? (
              <div className="text-center py-5 no-results">
                <h3>No products found</h3>
                <p>Try adjusting your search filters.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="ap-pagination-wrap mt-5">
              <button
                type="button"
                className="ap-page-nav-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="ap-page-nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ProductPageChrome>
  );
}
