'use client';

import ProductPageChrome from '@/components/product/ProductPageChrome';

export default function AboutView() {
  return (
    <ProductPageChrome>
      <div
        style={{
          width: '100%',
          minHeight: '70vh',
          background:
            'linear-gradient(180deg, #fff7ed 0%, #f8fafc 55%, #eef2f7 100%)',
        }}
      >
        <section className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <h1 className="fw-bold mb-3" style={{ color: '#111827' }}>
                About <span style={{ color: '#E86C24' }}>Saith Chemical</span>
              </h1>
              <p className="lead" style={{ color: '#4b5563' }}>
                Saith Chemical is a trusted supplier of home care chemicals,
                detergents, and cleaning solutions serving businesses and
                households with dependable quality and consistent performance.
              </p>
            </div>
            <div className="col-lg-5">
              <div
                className="p-4 rounded-4 shadow-sm"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(232,108,36,0.1), rgba(251,191,36,0.15))',
                }}
              >
                <h5 className="fw-bold mb-3">At a Glance</h5>
                <ul className="list-unstyled mb-0" style={{ fontSize: 14 }}>
                  <li className="mb-2">
                    • Home care, commercial, and domestic chemical solutions
                  </li>
                  <li className="mb-2">
                    • Focused on quality, safety, and timely supply
                  </li>
                  <li>• Based in Pakistan — store + online ordering</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Our Story</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
                From detergents to specialized cleaning formulations, Saith
                Chemical supports everyday operations with products that
                professionals and households can rely on. We combine practical
                supply, transparent pricing, and responsive support across
                Lahore and beyond.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ProductPageChrome>
  );
}
