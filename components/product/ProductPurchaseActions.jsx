'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTruck, FaShieldAlt } from 'react-icons/fa';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import { getStockQuantity } from '@/lib/schema';

/**
 * Client island — qty + cart / buy now, gated by stock_quantity.
 */
export default function ProductPurchaseActions({ product, isAvailable }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const stockQty = getStockQuantity(product);
  const maxQty = isAvailable ? Math.max(1, stockQty || 99) : 1;
  const [quantity, setQuantity] = useState(1);

  const unitPrice = product.discount_price || product.price;

  const handleAddToCart = () => {
    if (!isAvailable || stockQty <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > stockQty) {
      toast.error(`Only ${stockQty} units available`);
      return;
    }
    addToCart({ ...product, price: unitPrice }, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAvailable || stockQty <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity > stockQty) {
      toast.error(`Only ${stockQty} units available`);
      return;
    }
    addToCart({ ...product, price: unitPrice }, quantity);
    router.push('/checkout');
  };

  return (
    <>
      <div className="action-row mb-4">
        <div className="qty-input">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={!isAvailable}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <input type="number" value={quantity} readOnly aria-label="Quantity" />
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={!isAvailable}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="action-buttons d-flex gap-2">
          <button
            type="button"
            className="btn btn-add-cart"
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            <ShoppingCart size={18} className="me-1" /> ADD TO CART
          </button>
          <button
            type="button"
            className="btn btn-buy-now"
            onClick={handleBuyNow}
            disabled={!isAvailable}
          >
            Buy Now
          </button>
        </div>
      </div>

      {!isAvailable && (
        <p className="text-danger fw-semibold mb-3">Currently out of stock</p>
      )}

      {isAvailable && stockQty > 0 && stockQty <= 10 && (
        <p className="text-warning fw-semibold mb-3">
          Only {stockQty} left in stock
        </p>
      )}

      <div className="trust-grid row g-3">
        <div className="col-6">
          <div className="trust-item">
            <FaTruck /> <span>Fast Delivery Across Pakistan</span>
          </div>
        </div>
        <div className="col-6">
          <div className="trust-item">
            <FaShieldAlt /> <span>100% Lab Tested Quality</span>
          </div>
        </div>
      </div>
    </>
  );
}
