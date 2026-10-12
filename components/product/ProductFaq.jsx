import { getProductFaqs } from '@/lib/schema';

/**
 * Server Component — GEO / AEO FAQ accordion.
 * Uses native <details> so answers stay in HTML for crawlers & AI engines.
 */
export default function ProductFaq({ product }) {
  const faqs = getProductFaqs(product);
  if (!faqs.length) return null;

  return (
    <section
      className="faq-card mt-5 mb-4"
      aria-labelledby="product-faq-heading"
    >
      <h2 id="product-faq-heading" className="h5 text-navy fw-bold mb-3">
        Frequently Asked Questions
      </h2>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <details
            key={`${index}-${item.question.slice(0, 40)}`}
            className="faq-item"
            {...(index === 0 ? { open: true } : {})}
          >
            <summary className="faq-question">
              <span>{item.question}</span>
            </summary>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
