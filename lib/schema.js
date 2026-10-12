/**
 * JSON-LD builders for Product pages (GEO / AEO / rich results).
 */

export function isProductAvailable(product) {
  if (!product) return false;
  if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
    return Number(product.stock_quantity) > 0;
  }
  if (product.stock !== undefined) {
    return Number(product.stock) > 0;
  }
  return true;
}

export function getStockQuantity(product) {
  if (!product) return 0;
  if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
    return Math.max(0, Number(product.stock_quantity) || 0);
  }
  if (product.stock !== undefined) {
    return Math.max(0, Number(product.stock) || 0);
  }
  return 0;
}

export function buildProductJsonLd(product, reviews = [], isAvailable = null) {
  if (!product) return null;

  const available =
    isAvailable === null ? isProductAvailable(product) : Boolean(isAvailable);
  const stockQty = getStockQuantity(product);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const images =
    product.images && product.images.length > 0
      ? product.images.filter(Boolean)
      : [product.image_url || 'https://www.saithchemicals.com/placeholder.png'];

  const barcode = product.barcode;
  const offerUrl = barcode
    ? `https://www.saithchemicals.com/product/${barcode}`
    : `https://www.saithchemicals.com/product/${product.id}`;

  const categoryName =
    product.category_relation?.name || product.category || 'Home Care';

  const reviewNodes = reviews.slice(0, 5).map((r) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: r.customer_name || 'Verified Buyer',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: r.comment || '',
  }));

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: images,
    description:
      product.description ||
      `${product.name} - Premium quality chemical & cleaning product by Saith Chemical.`,
    sku: product.sku || product.barcode || `SKU-${product.id}`,
    mpn: product.sku || product.barcode || String(product.id),
    ...(product.barcode && { gtin13: String(product.barcode) }),
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: 'Saith Chemical',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Brand',
        value: 'Saith Chemical',
      },
      {
        '@type': 'PropertyValue',
        name: 'Barcode (GTIN)',
        value: product.barcode || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'SKU',
        value: product.sku || product.barcode || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Availability',
        value: available ? 'In Stock' : 'Out of Stock',
      },
      {
        '@type': 'PropertyValue',
        name: 'Stock Quantity',
        value: String(stockQty),
      },
    ],
    offers: {
      '@type': 'Offer',
      url: offerUrl,
      priceCurrency: 'PKR',
      price: Number(product.discount_price || product.price) || 0,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Saith Chemical',
        url: 'https://www.saithchemicals.com',
      },
    },
    ...(avgRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: reviews.length,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(reviewNodes.length > 0 && { review: reviewNodes }),
  };
}
