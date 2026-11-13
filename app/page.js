import HomeView from '@/components/home/HomeView';
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd';
import { getHomePageData } from '@/lib/api-server';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

const HOME_TITLE =
  'Saith Chemical – Dishwash Bar & Washing Powder in Lahore';
const HOME_DESC =
  'Buy Grace Plus dishwash bars and washing powder from Saith Chemical in Lahore. Quality home-care detergents with fast delivery across Pakistan.';

export const metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESC,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_PK',
    images: [
      {
        url: absoluteUrl('/og-default.jpg'),
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESC,
    images: [absoluteUrl('/og-default.jpg')],
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
    <>
      <OrganizationJsonLd />
      <HomeView
        heroSlides={heroSlides}
        categories={categories}
        productsByCategory={productsByCategory}
      />
    </>
  );
}
