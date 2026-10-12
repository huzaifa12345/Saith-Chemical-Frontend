import { FaStar } from 'react-icons/fa';

/**
 * Server Component — title, ratings summary, price & discount badge.
 * Crawlers see these without waiting for client hydration.
 */
export default function ProductInfoSSR({ product, reviews = [], isAvailable }) {
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const rounded = avgRating ? Math.round(Number(avgRating)) : 0;
  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);

  return (
    <>
      <span className="category-badge">Home Care &amp; Cleaning Product</span>
      <h1 className="product-main-title">{product.name}</h1>

      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="star-rating-box">
          {[...Array(5)].map((_, s) => (
            <FaStar
              key={s}
              className="me-1"
              color={reviews.length > 0 && s < rounded ? '#ffc300' : '#e0e0e0'}
            />
          ))}
          <span className="ms-2">{avgRating || 'N/A'}</span>
        </div>
        <span className="text-muted">({reviews.length} Verified Reviews)</span>
      </div>

      <div className="price-display mb-3">
        {hasDiscount ? (
          <>
            <span className="original-price-tag">Rs. {product.price}</span>
            <span className="price-tag ms-2">Rs. {product.discount_price}</span>
            <span className="discount-badge ms-2">
              {Math.round(
                ((product.price - product.discount_price) / product.price) * 100
              )}
              % OFF
            </span>
          </>
        ) : (
          <span className="price-tag">Rs. {product.price}</span>
        )}
      </div>

      <p
        className={`fw-semibold mb-3 ${
          isAvailable ? 'text-success' : 'text-danger'
        }`}
        data-stock={isAvailable ? 'in-stock' : 'out-of-stock'}
        data-stock-quantity={
          product.stock_quantity !== undefined && product.stock_quantity !== null
            ? String(product.stock_quantity)
            : ''
        }
      >
        {isAvailable ? 'In Stock — Ready to Ship' : 'Currently Out of Stock'}
      </p>
    </>
  );
}
