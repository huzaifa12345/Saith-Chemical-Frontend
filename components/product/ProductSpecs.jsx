import { PRODUCT_BRAND } from '@/lib/schema';

/**
 * Server Component — technical specs table for SEO / GEO / AEO.
 * Must stay server-rendered (do not mark 'use client').
 */
export default function ProductSpecs({ product, isAvailable }) {
  return (
    <section className="spec-card mb-4" aria-labelledby="product-specs-heading">
      <h2 id="product-specs-heading" className="h5 text-navy fw-bold mb-3">
        Product Overview &amp; Specifications
      </h2>
      <table className="table table-bordered text-start small mb-3">
        <tbody>
          <tr>
            <th scope="row" className="bg-light w-35">
              Brand
            </th>
            <td>{PRODUCT_BRAND}</td>
          </tr>
          <tr>
            <th scope="row" className="bg-light">
              SKU
            </th>
            <td>{product.sku || product.barcode || 'IND-786'}</td>
          </tr>
          <tr>
            <th scope="row" className="bg-light">
              Category
            </th>
            <td>
              {product.category_relation?.name || product.category || 'Home Care'}
            </td>
          </tr>
          <tr>
            <th scope="row" className="bg-light">
              Availability
            </th>
            <td>
              {isAvailable
                ? 'In Stock (Ready to Ship) — 20+ units'
                : 'Out of Stock'}
            </td>
          </tr>
        </tbody>
      </table>
      {product.description ? (
        <p className="description-text">{product.description}</p>
      ) : null}
    </section>
  );
}
