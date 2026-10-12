/**
 * Shared SEO / metadata helpers for App Router generateMetadata.
 */

export const SITE_URL = 'https://www.saithchemicals.com';
export const SITE_NAME = 'Saith Chemical';

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function truncate(text, max) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Full product metadata — title, description, canonical, Open Graph, Twitter.
 * Title is set without the layout template suffix when `absolute` is used,
 * so the HTML <title> matches the Vite Helmet string exactly.
 */
export function buildProductMetadata(product, barcodeParam) {
  if (!product) {
    return {
      title: 'Product Not Found',
      description: `The requested product was not found on ${SITE_NAME}.`,
      robots: { index: false, follow: true },
    };
  }

  const barcode = product.barcode || barcodeParam;
  const path = `/product/${barcode}`;
  const canonical = absoluteUrl(path);
  const title = `${product.name} - Price & Specs | ${SITE_NAME}`;
  const description = truncate(
    `${product.name} in Pakistan at best price. ${
      product.description || 'Buy from Saith Chemical.'
    }`,
    160
  );
  const ogDescription = truncate(
    product.description ||
      `${product.name} — premium home-care product by ${SITE_NAME}.`,
    160
  );
  const image =
    product.images?.[0] ||
    product.image_url ||
    absoluteUrl('/placeholder.png');

  const price = product.discount_price || product.price;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_PK',
      type: 'website',
      images: [
        {
          url: image,
          alt: `${product.name} - ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description: ogDescription,
      images: [image],
    },
    other: {
      'product:brand': SITE_NAME,
      'product:availability':
        Number(product.stock_quantity) > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': String(price ?? ''),
      'product:price:currency': 'PKR',
      'product:retailer_item_id': String(
        product.sku || product.barcode || product.id
      ),
    },
  };
}

/** Static page metadata helper */
export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}) {
  const canonical = path ? absoluteUrl(path) : undefined;
  return {
    title,
    description,
    ...(canonical && {
      alternates: { canonical },
    }),
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_PK',
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}
