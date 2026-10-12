'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLogo } from '@/context/LogoContext';
import '@/styles/login-styles.css';

export default function LoginForm() {
  const { websiteLogo } = useLogo();
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await login(formData.email, formData.password);
      toast.success('Welcome back!');

      if (response.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="lg-container">
      <div className="lg-card">
        <div className="lg-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={websiteLogo} alt="Store Logo" className="lg-main-logo" />
          <h1 className="lg-title">Sign In</h1>
          <p className="lg-subtitle">
            Log in to your account to manage orders and track deliveries
          </p>
        </div>

        <form className="lg-form" onSubmit={handleSubmit}>
          <div className="lg-form-group">
            <label htmlFor="email" className="lg-label">
              <Mail size={14} style={{ marginRight: '6px' }} />
              Email Address
            </label>
            <div className="lg-input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="lg-input"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="lg-form-group">
            <label htmlFor="password" className="lg-label">
              <Lock size={14} style={{ marginRight: '6px' }} />
              Password
            </label>
            <div className="lg-input-wrapper" style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="lg-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="lg-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="lg-options">
            <label className="lg-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Keep me signed in</span>
            </label>
            <Link href="/change-password" className="lg-forgot">
              Change Password
            </Link>
          </div>

          <button type="submit" disabled={isLoading} className="lg-submit-btn">
            {isLoading ? (
              <>
                <Loader2 className="lg-spin" size={20} />
                Verifying...
              </>
            ) : (
              <>
                Sign In to Account{' '}
                <ShoppingBag size={18} style={{ marginLeft: '8px' }} />
              </>
            )}
          </button>
        </form>

        <div className="lg-footer-text">
          Don&apos;t have an account? <Link href="/register">Join us today</Link>
        </div>
      </div>
    </div>
  );
}
