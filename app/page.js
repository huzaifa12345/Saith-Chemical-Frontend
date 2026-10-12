import HomeView from '@/components/home/HomeView';
import { getHomePageData } from '@/lib/api-server';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata = {
  title: {
    absolute: `${SITE_NAME} | Quality Detergents & Cleaning Chemicals`,
  },
  description:
    'Shop home cleaning detergents, chemicals, and supplies directly from Saith Chemical.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Quality Detergents & Cleaning Chemicals`,
    description:
      'Shop home cleaning detergents, chemicals, and supplies directly from Saith Chemical.',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_PK',
  },
};

export default async function HomePage() {
  let heroSlides = [];
  let categories = [];
  let productsByCategory = {};

  try {
    const data = await getHomePageData();
    heroSlides = data.heroSlides;
    categories = data.categories;
    productsByCategory = data.productsByCategory;
  } catch {
    // HomeView shows fallback UI when slides empty
  }

  return (
    <HomeView
      heroSlides={heroSlides}
      categories={categories}
      productsByCategory={productsByCategory}
    />
  );
}
