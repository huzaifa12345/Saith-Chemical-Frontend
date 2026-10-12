import {
  buildProductJsonLd,
  buildFaqPageJsonLd,
  getProductFaqs,
} from '@/lib/schema';

/** Server-only JSON-LD — Product + FAQPage in initial HTML for crawlers / AI. */
export default function ProductJsonLd({ product, reviews, isAvailable }) {
  const productLd = buildProductJsonLd(product, reviews, isAvailable);
  const faqLd = buildFaqPageJsonLd(getProductFaqs(product));

  if (!productLd && !faqLd) return null;

  return (
    <>
      {productLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      ) : null}
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
    </>
  );
}
