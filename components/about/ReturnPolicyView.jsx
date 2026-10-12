'use client';

import { FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import ProductPageChrome from '@/components/product/ProductPageChrome';
import '@/styles/ReturnPolicy.css';

export default function ReturnPolicyView() {
  return (
    <ProductPageChrome>
      <div className="return-policy-page">
        <main>
          <section className="return-policy-hero">
            <div className="container">
              <div className="return-policy-hero-content">
                <span className="return-policy-eyebrow">
                  <FaShieldAlt /> Customer care &amp; transparency
                </span>
                <h1>Return &amp; Refund Policy</h1>
                <p>
                  We want every Saith Chemical order to arrive safely and meet
                  your expectations.
                </p>
                <span className="return-policy-updated">
                  Last updated: September 17, 2026
                </span>
              </div>
            </div>
          </section>

          <section className="return-policy-content container">
            <div className="return-policy-intro">
              <span className="return-policy-kicker">Simple process</span>
              <h2>What happens if something is not right?</h2>
              <p>
                Contact our support team as soon as possible. We will review the
                order details and guide you through the next step.
              </p>
            </div>

            <div className="return-policy-grid">
              <article className="return-policy-card return-policy-card-featured">
                <span className="return-policy-number">01</span>
                <h3>Returns &amp; Exchange</h3>
                <p>
                  If you receive a damaged, defective, or incorrect product, you
                  are eligible for a return or exchange within{' '}
                  <strong>7 days</strong> of delivery.
                </p>
              </article>

              <article className="return-policy-card">
                <span className="return-policy-number">02</span>
                <h3>Conditions for Return</h3>
                <ul>
                  <li>
                    <FaCheckCircle /> Unused, sealed, original packaging
                  </li>
                  <li>
                    <FaCheckCircle /> Proof of purchase / order number
                  </li>
                  <li>
                    <FaCheckCircle /> Reported within 7 days of delivery
                  </li>
                </ul>
              </article>

              <article className="return-policy-card">
                <span className="return-policy-number">03</span>
                <h3>Contact Support</h3>
                <p>
                  WhatsApp / Call:{' '}
                  <a href="https://wa.me/923227594213">+92 322 7594213</a>
                </p>
              </article>
            </div>
          </section>
        </main>
      </div>
    </ProductPageChrome>
  );
}
