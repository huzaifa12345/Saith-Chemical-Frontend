import { buildProductJsonLd } from '@/lib/schema';

/** Server-only JSON-LD — present in View Source without client JS. */
export default function ProductJsonLd({ product, reviews, isAvailable }) {
  const jsonLd = buildProductJsonLd(product, reviews, isAvailable);
  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
