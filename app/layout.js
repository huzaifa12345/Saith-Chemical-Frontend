import { Inter } from 'next/font/google';
import Providers from './providers';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import './globals.css';
import '../styles/bootstrap.min.css';
import '../styles/style.css';
import '../styles/theme-fixes.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Saith Chemical — premium home-care and cleaning chemical products across Pakistan.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: true,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      'Premium home-care and cleaning chemical products across Pakistan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description:
      'Premium home-care and cleaning chemical products across Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/SaithChemicalLogo.png', type: 'image/png' }],
    shortcut: '/SaithChemicalLogo.png',
    apple: '/SaithChemicalLogo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
