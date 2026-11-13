import AboutView from '@/components/about/AboutView';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Us',
  description:
    'Saith Chemical supplies Grace Plus dishwash bars and washing powder from Alam Market, Lahore — trusted home-care detergents across Pakistan.',
  path: '/about',
  image: 'https://www.saithchemicals.com/og-default.jpg',
});

export default function AboutPage() {
  return (
    <>
      <OrganizationJsonLd />
      <AboutView />
    </>
  );
}
