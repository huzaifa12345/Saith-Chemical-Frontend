'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const href = `/product/${product.barcode || product.id}`;
  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    addToCart(
      { ...product, price: product.discount_price || product.price },
      1
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e) => {
    e?.stopPropagation?.();
    addToCart(
      { ...product, price: product.discount_price || product.price },
      1
    );
    router.push('/checkout');
  };

  return (
    <div className={`item-card ${viewMode === 'list' ? 'list-card' : ''}`}>
      <div className="item-thumb" onClick={() => router.push(href)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && router.push(href)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0] || product.image_url || '/placeholder.png'}
          alt={product.name}
        />
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
            onClick={handleAddToCart}
            className="circle-btn"
            aria-label="Add to cart"
          >
            <ShoppingCart />
          </button>
          <button
            type="button"
            onClick={() => router.push(href)}
            className="circle-btn"
            aria-label="View product"
          >
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className="item-details">
        <div className="item-meta">
          <h5 className="item-name" title={product.name}>
            {product.name}
          </h5>
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
            className="card-buy-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
