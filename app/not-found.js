import Link from 'next/link';
import ProductPageChrome from '@/components/product/ProductPageChrome';

export const metadata = {
  title: {
    absolute: 'Page Not Found | Saith Chemical',
  },
  description: 'The page you requested could not be found on Saith Chemical.',
  // Do NOT set robots here — Next.js already injects noindex on HTTP 404.
  // Setting it again creates duplicate tags (noindex + noindex,nofollow).
};

export default function NotFound() {
  return (
    <ProductPageChrome>
      <main className="container py-5 text-center">
        <h1 className="display-6 fw-bold mb-3">Page not found</h1>
        <p className="text-muted mb-4">
          That URL does not exist. Browse our dishwash bars, washing powder and
          home-care products instead.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/all-products" className="btn btn-outline-dark">
            All products
          </Link>
          <Link href="/contact" className="btn btn-outline-dark">
            Contact us
          </Link>
        </div>
      </main>
    </ProductPageChrome>
  );
}
