import CheckoutView from '@/components/checkout/CheckoutView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Checkout',
  description: 'Complete your Saith Chemical order.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutView />;
}
