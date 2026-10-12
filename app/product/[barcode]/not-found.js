import Link from 'next/link';

export const metadata = {
  title: {
    absolute: 'Product Not Found | Saith Chemical',
  },
  robots: { index: false, follow: true },
};

export default function ProductNotFound() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
      <h1 className="h3 mb-3">Product not found</h1>
      <p className="text-muted mb-4">
        We couldn&apos;t find a product for this barcode. It may be inactive or
        removed.
      </p>
      <Link href="/all-products" className="btn btn-primary">
        Browse all products
      </Link>
    </div>
  );
}
