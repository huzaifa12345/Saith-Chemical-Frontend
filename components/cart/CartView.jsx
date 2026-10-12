'use client';

import Link from 'next/link';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import '@/styles/Cart.css';

export default function CartView() {
  const {
    items,
    shippingMethod,
    setShippingMethod,
    shippingOptions,
    freeShippingThreshold,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
    getShippingCost,
    clearCart,
  } = useCart();

  const subtotal = getCartTotal();
  const itemsCount = getCartItemsCount();
  const shippingCost = getShippingCost(subtotal, shippingMethod);
  const total = Math.max(0, subtotal + shippingCost);

  if (items.length === 0) {
    return (
      <ProductPageChrome>
        <div className="cart-page-wrapper">
          <div className="container py-5 text-center empty-cart-container">
            <div className="empty-cart-circle">
              <ShoppingBag size={80} />
            </div>
            <h1 className="navy-title mt-4">Your Cart is Empty</h1>
            <p className="text-muted mb-5">
              Explore trusted home care chemical supplies and packaging
              essentials.
            </p>
            <Link href="/all-products" className="industrial-btn-primary px-5">
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      </ProductPageChrome>
    );
  }

  return (
    <ProductPageChrome>
      <div className="cart-page-wrapper">
        <div className="container py-5">
          <div className="cart-header-modern mb-4">
            <h2 className="navy-title">Chemical Supply Cart</h2>
            <span className="item-count-badge">
              {itemsCount} Items Reserved
            </span>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="cart-items-card">
                {items.map((item) => (
                  <div className="cart-item-row" key={item.id}>
                    <div className="item-img-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.images?.[0] ||
                          item.image_url ||
                          '/placeholder.png'
                        }
                        alt={item.name}
                      />
                    </div>

                    <div className="item-details">
                      <h5 className="item-name">{item.name}</h5>
                      <p className="item-sku">
                        SKU: {item.sku || item.barcode || `IND-${item.id}`}
                      </p>
                      {item.barcode && (
                        <Link
                          href={`/product/${item.barcode}`}
                          className="text-decoration-none small"
                        >
                          View product
                        </Link>
                      )}
                      <button
                        type="button"
                        className="remove-link"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="item-qty-control">
                      <div className="qty-stepper">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input type="text" value={item.quantity} readOnly />
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="item-price-box text-end">
                      <span className="unit-price">Rs. {item.price}</span>
                      <h5 className="total-price">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </h5>
                    </div>
                  </div>
                ))}

                <div className="cart-footer-actions">
                  <Link href="/all-products" className="btn-continue">
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>
                  <button
                    type="button"
                    className="btn-clear-all"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="order-summary-card">
                <h4 className="summary-title">Order Summary</h4>

                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-line vertical">
                  <span>Shipping Method</span>
                  <select
                    className="cart-select"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                  >
                    {shippingOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} (Rs. {opt.cost})
                      </option>
                    ))}
                  </select>
                  {subtotal >= freeShippingThreshold && (
                    <small className="success-text">
                      Order qualifies for FREE shipping!
                    </small>
                  )}
                </div>

                <div className="divider-dashed"></div>

                <div className="summary-line total">
                  <span>Total Amount</span>
                  <span className="total-val">Rs. {total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="checkout-btn-full">
                  PROCEED TO CHECKOUT <CreditCard size={18} />
                </Link>

                <div className="trust-badges-cart mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1162/1162499.png"
                    alt="Secure"
                  />
                  <p>Secure SSL Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductPageChrome>
  );
}
