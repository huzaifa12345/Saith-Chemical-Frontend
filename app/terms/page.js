import LegalPage from '@/components/legal/LegalPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms of Service',
  description:
    'Terms for shopping Grace Plus dishwash bars and washing powder at Saith Chemical online and in Lahore.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="November 2026"
      sections={[
        {
          heading: 'Products & pricing',
          body: 'All prices on saithchemicals.com are listed in PKR and may change without notice. Product images are illustrative; packaging may vary slightly while quality remains consistent.',
        },
        {
          heading: 'Orders',
          body: 'Placing an order constitutes an offer to buy. Saith Chemical may cancel or refuse orders due to stock, pricing errors, or suspected misuse. You will be notified if that happens.',
        },
        {
          heading: 'Acceptable use',
          body: 'You agree not to misuse the site, attempt unauthorized access, or submit false order information.',
        },
        {
          heading: 'Governing law',
          body: 'These terms are governed by the laws of Pakistan. Disputes will first be addressed through our Lahore store support channel (+92 322 7594213).',
        },
      ]}
    />
  );
}
