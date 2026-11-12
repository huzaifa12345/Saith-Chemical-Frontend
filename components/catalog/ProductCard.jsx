'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { getCardImage } from '@/lib/images';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const href = `/product/${product.barcode || product.id}`;
  const imageSrc = getCardImage(product);
  const hasDiscount =
    product.discount_price &&
    Number(product.discount_price) < Number(product.price);

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    addToCart(
      { ...product, price: product.discount_price || product.price },
      1
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    addToCart(
      { ...product, price: product.discount_price || product.price },
      1
    );
    router.push('/checkout');
  };

  return (
    <div className={`item-card ${viewMode === 'list' ? 'list-card' : ''}`}>
      <Link href={href} className="item-thumb item-thumb-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={product.name} loading="lazy" width={600} height={600} />
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
          <span className="circle-btn" aria-hidden="true">
            <ArrowRight />
          </span>
        </div>
      </Link>

      <div className="item-details">
        <div className="item-meta">
          <h5 className="item-name" title={product.name}>
            <Link href={href}>{product.name}</Link>
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
