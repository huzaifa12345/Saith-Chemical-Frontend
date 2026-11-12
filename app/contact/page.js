import ContactView from '@/components/legal/ContactView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact Saith Chemical',
  description:
    'Visit Saith Chemical in Alam Market, Lahore or WhatsApp +92 322 7594213 for dishwash bars, washing powder and bulk orders.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactView />;
}
