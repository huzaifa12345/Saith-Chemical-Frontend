'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLogo } from '@/context/LogoContext';
import '@/styles/login-styles.css';
import '@/styles/register-styles.css';

export default function RegisterForm() {
  const { websiteLogo } = useLogo();
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!agreeTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    try {
      await register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      toast.success('Registration successful! Welcome to the store.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="lg-container">
      <div className="lg-card" style={{ maxWidth: '650px' }}>
        <div className="lg-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={websiteLogo} alt="Logo" className="lg-main-logo" />
          <h1 className="lg-title">Create Account</h1>
          <p className="lg-subtitle">
            Join us today for a faster shopping experience and exclusive offers
          </p>
        </div>

        <form className="lg-form" onSubmit={handleSubmit}>
          <div
            className="lg-form-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
            }}
          >
            <div className="lg-form-group">
              <label className="lg-label">
                <User size={14} /> First Name
              </label>
              <input
                name="first_name"
                type="text"
                required
                className="lg-input"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="lg-form-group">
              <label className="lg-label">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                className="lg-input"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div
            className="lg-form-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <div className="lg-form-group">
              <label className="lg-label">
                <Mail size={14} /> Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="lg-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="lg-form-group">
              <label className="lg-label">
                <Phone size={14} /> Phone (Optional)
              </label>
              <input
                name="phone"
                type="tel"
                className="lg-input"
                placeholder="+92..."
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div
            className="lg-form-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '10px',
            }}
          >
            <div className="lg-form-group">
              <label className="lg-label">
                <Lock size={14} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="lg-input"
                  placeholder="••••••"
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
            <div className="lg-form-group">
              <label className="lg-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="lg-input"
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="lg-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg-options" style={{ margin: '20px 0' }}>
            <label className="lg-remember">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span style={{ fontSize: '0.85rem' }}>
                I agree to the{' '}
                <Link href="/return-policy" className="lg-forgot">
                  Terms
                </Link>{' '}
                &amp; Return Policy
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="lg-submit-btn"
          >
            {isLoading ? (
              <Loader2 className="lg-spin" />
            ) : (
              <>
                <UserPlus size={18} style={{ marginRight: '8px' }} /> Create My
                Account
              </>
            )}
          </button>
        </form>

        <div className="lg-footer-text">
          Already a member? <Link href="/login">Sign in here</Link>
        </div>

        <div className="reg-benefits">
          <div className="benefit-item">
            <CheckCircle size={16} className="benefit-icon" />{' '}
            <span>Express Checkout</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} className="benefit-icon" />{' '}
            <span>Order Tracking</span>
          </div>
          <div className="benefit-item">
            <CheckCircle size={16} className="benefit-icon" />{' '}
            <span>Member Discounts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
