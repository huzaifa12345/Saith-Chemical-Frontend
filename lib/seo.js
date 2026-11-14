/**
 * Shared SEO / metadata helpers for App Router generateMetadata.
 */

import {
  getProductPrimaryImage,
  toAbsoluteImageUrl,
} from '@/lib/images';

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

function metaOfferPrice(product) {
  return Number(product?.discount_price || product?.price) || 0;
}

function metaInStock(product) {
  if (!product) return false;
  if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
    return Number(product.stock_quantity) > 0;
  }
  if (product.stock !== undefined) {
    return Number(product.stock) > 0;
  }
  return true;
}

/**
 * Price + stock first, then short product line (~155 chars).
 * Same string for meta description and og:description.
 */
export function buildProductMetaDescription(product) {
  const stockLabel = metaInStock(product) ? 'In stock' : 'Out of stock';
  const priceLabel = `Rs ${metaOfferPrice(product)}`;
  const name = String(product?.name || 'Product').trim();
  const full = `${priceLabel} · ${stockLabel} · ${name} by Grace Plus. Order online from Saith Chemical, Lahore. Cash on delivery across Pakistan.`;
  return truncate(full, 155);
}

/**
 * Full product metadata — title, description, canonical, Open Graph, Twitter.
 * Title is set without the layout template suffix when `absolute` is used,
 * so the HTML <title> matches the Vite Helmet string exactly.
 */
export function buildProductMetadata(product, barcodeParam) {
  if (!product) {
    return {
      title: {
        absolute: `Product Not Found | ${SITE_NAME}`,
      },
      description: `The requested product was not found on ${SITE_NAME}.`,
      robots: 'noindex, nofollow',
    };
  }

  const barcode = product.barcode || barcodeParam;
  const path = `/product/${barcode}`;
  const canonical = absoluteUrl(path);
  const title = `${product.name} - Price & Specs | ${SITE_NAME}`;
  const description = buildProductMetaDescription(product);
  // Keep OG / JSON-LD / gallery on the same primary URL (seo_image preferred)
  const image = toAbsoluteImageUrl(getProductPrimaryImage(product));

  const price = metaOfferPrice(product);

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
      description,
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
      description,
      images: [image],
    },
    other: {
      'product:brand': 'Grace Plus',
      'product:availability': metaInStock(product)
        ? 'in stock'
        : 'out of stock',
      'product:condition': 'new',
      'product:price:amount': String(price),
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
  image = absoluteUrl('/og-default.jpg'),
}) {
  const canonical = path ? absoluteUrl(path) : undefined;
  const ogTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    ...(canonical && {
      alternates: { canonical },
    }),
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_PK',
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: 'noindex, nofollow',
    }),
  };
}
