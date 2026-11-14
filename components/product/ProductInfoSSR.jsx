import { FaStar } from 'react-icons/fa';
import { formatRsPrice, getOfferPrice } from '@/lib/schema';

/**
 * Server Component — title, price, stock, ratings.
 * Price + stock are in the initial HTML for crawlers (no client loading gate).
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
  const offerPrice = getOfferPrice(product);
  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);
  const offerLabel = formatRsPrice(product);

  return (
    <>
      <span className="category-badge">Home Care &amp; Cleaning Product</span>
      <h1 className="product-main-title">{product.name}</h1>

      <div className="price-display mb-2">
        {hasDiscount ? (
          <>
            <span className="original-price-tag">Rs {product.price}</span>
            <span className="price-tag ms-2">{offerLabel}</span>
            <span className="discount-badge ms-2">
              {Math.round(
                ((Number(product.price) - offerPrice) /
                  Number(product.price)) *
                  100
              )}
              % OFF
            </span>
          </>
        ) : (
          <span className="price-tag">{offerLabel}</span>
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
        {isAvailable ? 'In stock' : 'Out of stock'}
      </p>

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
    </>
  );
}
