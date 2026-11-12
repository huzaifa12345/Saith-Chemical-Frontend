import { buildOrganizationJsonLd } from '@/lib/schema';

export default function OrganizationJsonLd() {
  const jsonLd = buildOrganizationJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
