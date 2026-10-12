import AboutView from '@/components/about/AboutView';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About',
  description:
    'Learn about Saith Chemical — trusted supplier of home-care and cleaning chemicals in Pakistan.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutView />;
}
