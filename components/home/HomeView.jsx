'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import '@/styles/ThemeHome.css';

export default function HomeView({
  heroSlides = [],
  categories = [],
  productsByCategory = {},
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = heroSlides.length > 0 ? heroSlides : [];

  useEffect(() => {
    if (slides.length === 0) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      price: product.discount_price || product.price,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    addToCart(
      {
        ...product,
        price: product.discount_price || product.price,
      },
      1
    );
    router.push('/checkout');
  };

  if (slides.length === 0) {
    return (
      <ProductPageChrome>
        <div className="loader-container">
          <p>Unable to load home content. Is the API running?</p>
          <Link href="/all-products" className="btn btn-primary mt-3">
            Browse products
          </Link>
        </div>
      </ProductPageChrome>
    );
  }

  const slide = slides[currentSlide] || slides[0];

  return (
    <ProductPageChrome>
      <div className="home-modern-layout">
        <section className="hero-wrapper">
          <div className="container position-relative">
            <button
              type="button"
              className="slider-arrow prev-arrow"
              onClick={handlePrevSlide}
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              className="slider-arrow next-arrow"
              onClick={handleNextSlide}
            >
              <FaChevronRight />
            </button>

            <div className="hero-grid">
              <div className="hero-info-col">
                <span className="hero-tag">
                  Premium Quality • Professional Grade
                </span>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-desc">{slide.description}</p>
                <div className="hero-btns">
                  <Link href="/all-products" className="btn-main">
                    Shop Now <FaArrowRight />
                  </Link>
                  <Link href="/all-products" className="btn-sec">
                    View Catalog
                  </Link>
                </div>
              </div>

              <div className="hero-visual-col">
                <div className="image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.image} className="hero-img" alt={slide.title} />
                  <div className="floating-badge">
                    <FaStar /> <span>#1 in Lahore</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-dots">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="content-area container">
          {categories.map((category) => (
            <div key={category.id} className="category-group">
              <div className="group-header">
                <div>
                  <h2 className="group-title">{category.name}</h2>
                  <div className="title-line"></div>
                </div>
                <Link href={`/category/${category.id}`} className="view-link">
                  Explore All
                </Link>
              </div>

              <div className="product-grid-modern">
                {(productsByCategory[category.id] || []).map((product) => (
                  <div key={product.id} className="item-card">
                    <div className="item-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          product.images?.[0] ||
                          product.image_url ||
                          '/placeholder.png'
                        }
                        alt={product.name}
                      />
                      {product.discount_price &&
                        product.discount_price < product.price && (
                          <div className="discount-badge-image">
                            -
                            {Math.round(
                              ((product.price - product.discount_price) /
                                product.price) *
                                100
                            )}
                            %
                          </div>
                        )}
                      <div className="item-overlay">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="circle-btn"
                        >
                          <FaShoppingCart />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/product/${product.barcode || product.id}`
                            )
                          }
                          className="circle-btn"
                        >
                          <FaSearch />
                        </button>
                      </div>
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{product.name}</h3>
                      <div className="item-pricing">
                        {product.discount_price &&
                        product.discount_price < product.price ? (
                          <>
                            <span className="price-original">
                              Rs. {product.price}
                            </span>
                            <span className="price-now">
                              Rs. {product.discount_price}
                            </span>
                          </>
                        ) : (
                          <span className="price-now">Rs. {product.price}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuyNow(product)}
                        className="card-buy-btn"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="feature-strip">
          <div className="container">
            <div className="feature-grid">
              <div className="feat-box">
                <FaTruck className="f-icon" />{' '}
                <div>
                  <h6>Fast Delivery</h6>
                  <p>Same day dispatch</p>
                </div>
              </div>
              <div className="feat-box">
                <FaShieldAlt className="f-icon" />{' '}
                <div>
                  <h6>Tested Chemicals</h6>
                  <p>100% Original products</p>
                </div>
              </div>
              <div className="feat-box">
                <FaHeadset className="f-icon" />{' '}
                <div>
                  <h6>24/7 Support</h6>
                  <p>Professional service</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProductPageChrome>
  );
}
