import ProductPageChrome from '@/components/product/ProductPageChrome';

export default function LegalPage({ title, updated, sections = [] }) {
  return (
    <ProductPageChrome>
      <main className="container py-5" style={{ maxWidth: 860 }}>
        <h1 className="h2 fw-bold mb-2">{title}</h1>
        {updated ? (
          <p className="text-muted small mb-4">Last updated: {updated}</p>
        ) : null}
        {sections.map((section) => (
          <section key={section.heading} className="mb-4">
            <h2 className="h5 fw-bold">{section.heading}</h2>
            <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
              {section.body}
            </p>
          </section>
        ))}
      </main>
    </ProductPageChrome>
  );
}
