import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/bootstrap.min.css';
import '../styles/style.css';
import '../styles/theme-fixes.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    absolute: 'Page Not Found | Saith Chemical',
  },
  description: 'The page you requested could not be found on Saith Chemical.',
  // Next injects noindex on 404; avoid a second robots meta here.
};

/**
 * Full HTML 404 for unmatched routes (experimental.globalNotFound).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <main className="container py-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
          <h1 className="display-6 fw-bold mb-3">Page not found</h1>
          <p className="text-muted mb-4">
            That URL does not exist. Browse our dishwash bars, washing powder
            and home-care products instead.
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
      </body>
    </html>
  );
}
