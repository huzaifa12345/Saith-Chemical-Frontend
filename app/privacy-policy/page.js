import LegalPage from '@/components/legal/LegalPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How Saith Chemical collects, uses and protects your personal information when you shop online.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        {
          heading: 'Information we collect',
          body: 'When you place an order or contact us, we may collect your name, phone number, email, delivery address and order details needed to fulfil purchases from Saith Chemical.',
        },
        {
          heading: 'How we use information',
          body: 'We use your details to process orders, arrange delivery, provide customer support, and improve our Grace Plus dishwash and washing powder product experience. We do not sell your personal data.',
        },
        {
          heading: 'Sharing',
          body: 'We may share limited information with delivery partners and payment processors solely to complete your order. Legal authorities may receive data when required by law.',
        },
        {
          heading: 'Contact',
          body: 'Questions about privacy? WhatsApp or call +92 322 7594213, or visit Shop No. D-2490, Near Mosque Qadir, Koocha Dogran, Alam Market, Lahore, Pakistan.',
        },
      ]}
    />
  );
}
