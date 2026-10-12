import CartView from '@/components/cart/CartView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cart',
  description: 'Your Saith Chemical shopping cart.',
  path: '/cart',
  noIndex: true,
});

export default function CartPage() {
  return <CartView />;
}
