import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/all-products', label: 'All Products' },
  { href: '/product/demo-barcode', label: 'Product PDP' },
  { href: '/category/demo', label: 'Category' },
  { href: '/cart', label: 'Cart' },
  { href: '/checkout', label: 'Checkout' },
  { href: '/about', label: 'About' },
  { href: '/return-policy', label: 'Return Policy' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
  { href: '/change-password', label: 'Change Password' },
  { href: '/admin', label: 'Admin' },
];

export default function RoutePlaceholder({
  title,
  path,
  description = 'Route scaffolded in Phase 1. Full page UI will be ported in later phases.',
  params = null,
}) {
  return (
    <div className="phase-shell">
      <header className="phase-shell__header">
        <div className="phase-shell__brand">
          Saith <span>Chemical</span> — Next.js
        </div>
        <nav className="phase-shell__nav" aria-label="Phase 1 route map">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="phase-shell__main">
        <div className="phase-shell__badge">Phase 0 &amp; 1 scaffold</div>
        <h1 className="phase-shell__title">{title}</h1>
        <p className="phase-shell__text">{description}</p>
        <div className="phase-shell__meta">
          <div>path: {path}</div>
          {params && (
            <div style={{ marginTop: '0.5rem' }}>
              params: {JSON.stringify(params)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
