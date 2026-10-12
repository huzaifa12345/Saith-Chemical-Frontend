'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHeadset, FaBolt, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLogo } from '@/context/LogoContext';
import '@/styles/Topbar.css';

const FALLBACK_LOGO =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjEyMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ288L3RleHQ+Cjwvc3ZnPg==';

const TopBar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const { getCartItemsCount } = useCart();
  const { websiteLogo } = useLogo();
  const pathname = usePathname();

  const isActive = (path) => (pathname === path ? 'active-link' : '');

  return (
    <header className="ts-header">
      {/* 1. Top Utility */}
      <div className="ts-utility">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="ts-u-left">
            <FaHeadset className="ts-accent-text me-2" />
            <span className="d-none d-sm-inline">Support:</span> +92 322 7594213
          </div>
          <div className="ts-u-right">
            <Link href={user ? '/' : '/login'} className="ts-auth-link">
              <FaUser className="ts-accent-text me-2" />
              <span>
                {user?.first_name ? `Hi, ${user.first_name}` : 'Login'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Nav */}
      <nav className="ts-main-nav">
        <div className="container ts-nav-container">
          {/* LEFT: Menu */}
          <div className="ts-nav-left">
            <button
              type="button"
              className="ts-menu-toggle"
              onClick={onMenuToggle}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="ts-nav-center">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={websiteLogo || FALLBACK_LOGO}
                alt="Saith Chemical"
                className="ts-logo"
              />
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div className="ts-nav-right">
            <div className="ts-desktop-links d-none d-lg-flex">
              <Link href="/" className={`ts-link ${isActive('/')}`}>
                Home
              </Link>
              <Link
                href="/all-products"
                className={`ts-link ${isActive('/all-products')}`}
              >
                Shop
              </Link>
            </div>

            <Link href="/cart" className="ts-cart-btn">
              <div className="ts-cart-icon-box">
                <FaShoppingCart />
                {getCartItemsCount && getCartItemsCount() > 0 && (
                  <span className="ts-badge">{getCartItemsCount()}</span>
                )}
              </div>
              <span className="d-none d-md-inline ms-2"></span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. Trust Bar */}
      <div className="ts-trust-bar">
        <div className="container">
          <p className="m-0">
            <FaBolt className="me-2" />Trusted Supplier of Premium Home Care Products
          </p>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
