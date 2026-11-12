import LegalPage from '@/components/legal/LegalPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shipping Policy',
  description:
    'Delivery times, areas and charges for Saith Chemical orders of dishwash bars and washing powder across Pakistan.',
  path: '/shipping-policy',
});

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated="November 2026"
      sections={[
        {
          heading: 'Coverage',
          body: 'We deliver across Pakistan. Lahore local orders are typically prepared the same day when placed before cut-off; other cities ship via courier partners.',
        },
        {
          heading: 'Dispatch times',
          body: 'In-stock Grace Plus products usually dispatch within 1–2 business days. You will receive updates by phone or WhatsApp when available.',
        },
        {
          heading: 'Charges',
          body: 'Shipping charges depend on location and order weight. Exact fee is confirmed at checkout or by our support team before dispatch.',
        },
        {
          heading: 'Issues',
          body: 'If a parcel is delayed or damaged, contact +92 322 7594213 with your order number. See also our Return Policy for eligible cases.',
        },
      ]}
    />
  );
}
