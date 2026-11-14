'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getCardImage } from '@/lib/images';

const DESKTOP_VISIBLE = 3;

function ProductCard({ product, onAddToCart, onBuyNow }) {
  const href = `/product/${product.barcode || product.id}`;
  const img = getCardImage(product);
  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);

  return (
    <div className="item-card">
      <Link href={href} className="item-thumb item-thumb-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={product.name} loading="lazy" />
        {hasDiscount && (
          <div className="discount-badge-image">
            -
            {Math.round(
              ((product.price - product.discount_price) / product.price) * 100
            )}
            %
          </div>
        )}
        <div className="item-overlay">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="circle-btn"
            aria-label="Add to cart"
          >
            <FaShoppingCart />
          </button>
          <span className="circle-btn" aria-hidden="true">
            <FaSearch />
          </span>
        </div>
      </Link>
      <div className="item-details">
        <h3 className="item-name">
          <Link href={href}>{product.name}</Link>
        </h3>
        <div className="item-pricing">
          {hasDiscount ? (
            <>
              <span className="price-original">Rs. {product.price}</span>
              <span className="price-now">Rs. {product.discount_price}</span>
            </>
          ) : (
            <span className="price-now">Rs. {product.price}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onBuyNow(product)}
          className="card-buy-btn"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop (≥992px): show exactly 3 products + L/R arrows when more exist.
 * Below 992px: full wrap grid, arrows hidden via CSS.
 */
export default function CategoryProductSlider({
  products = [],
  onAddToCart,
  onBuyNow,
}) {
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart(0);
  }, [products]);

  if (!products.length) return null;

  const maxStart = Math.max(0, products.length - DESKTOP_VISIBLE);
  const canSlide = products.length > DESKTOP_VISIBLE;
  const safeStart = Math.min(start, maxStart);
  const desktopProducts = products.slice(
    safeStart,
    safeStart + DESKTOP_VISIBLE
  );

  return (
    <div className={`category-product-slider${canSlide ? ' has-arrows' : ''}`}>
      {canSlide && (
        <>
          <button
            type="button"
            className="cat-slider-arrow cat-slider-prev"
            onClick={() => setStart((s) => Math.max(0, s - 1))}
            disabled={safeStart <= 0}
            aria-label="Previous products"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            className="cat-slider-arrow cat-slider-next"
            onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
            disabled={safeStart >= maxStart}
            aria-label="Next products"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      <div className="product-grid-modern cat-slider-grid-mobile">
        {products.map((product) => (
          <ProductCard
            key={`m-${product.id}`}
            product={product}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>

      <div className="product-grid-modern cat-slider-grid-desktop">
        {desktopProducts.map((product) => (
          <ProductCard
            key={`d-${product.id}`}
            product={product}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
    </div>
  );
}
