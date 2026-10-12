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

/**
 * Normalize product-provided FAQs into { question, answer } pairs.
 * Accepts: faqs[], faq[], or a single faq object.
 */
function normalizeProductFaqs(product) {
  const raw = product?.faqs ?? product?.faq ?? null;
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : [raw];
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const question = String(
        item.question || item.q || item.title || ''
      ).trim();
      const answer = String(
        item.answer || item.a || item.body || item.content || ''
      ).trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean);
}

/**
 * Smart default FAQs for GEO / AEO when the product has no custom FAQs.
 * Covers category, usage, safety, warranty, and purchase intent.
 */
export function buildDefaultProductFaqs(product) {
  if (!product) return [];

  const name = product.name || 'this product';
  const category =
    product.category_relation?.name || product.category || 'home care';
  const available = isProductAvailable(product);
  const price = Number(product.discount_price || product.price) || null;
  const priceLabel =
    price != null
      ? `Rs. ${price.toLocaleString('en-PK', { minimumFractionDigits: 0 })}`
      : null;
  const description = String(product.description || '')
    .replace(/\s+/g, ' ')
    .trim();

  const faqs = [
    {
      question: `What is ${name}?`,
      answer: description
        ? `${name} is a ${category} product from Saith Chemical. ${description}`
        : `${name} is a premium ${category} product from Saith Chemical, formulated for reliable home and professional cleaning performance.`,
    },
    {
      question: `How do I use ${name}?`,
      answer: `Follow the directions on the ${name} label. For best results, use the recommended amount for your surface or application, avoid mixing with incompatible chemicals, and rinse or wipe as instructed for ${category} products.`,
    },
    {
      question: `Is ${name} safe to use at home?`,
      answer: `${name} is intended for ${category} use when handled as directed. Keep out of reach of children, wear gloves if you have sensitive skin, store upright in a cool dry place, and never ingest or inhale concentrated product.`,
    },
    {
      question: `Does Saith Chemical offer a warranty or authenticity guarantee on ${name}?`,
      answer: `Yes. ${name} sold on saithchemicals.com is an authentic Saith Chemical product. If you receive a damaged or incorrect item, contact support within the return-policy window for replacement or resolution.`,
    },
    {
      question: `Is ${name} available to buy online in Pakistan?`,
      answer: available
        ? `Yes. ${name} is currently in stock on Saith Chemical${
            priceLabel ? ` and priced at ${priceLabel}` : ''
          }. You can order online for delivery across Pakistan.`
        : `${name} is temporarily out of stock. Check back soon on saithchemicals.com or contact Saith Chemical support for restock updates.`,
    },
  ];

  return faqs;
}

/**
 * Product-specific FAQs when present; otherwise smart defaults.
 */
export function getProductFaqs(product) {
  const custom = normalizeProductFaqs(product);
  if (custom.length > 0) return custom;
  return buildDefaultProductFaqs(product);
}

/**
 * FAQPage JSON-LD for AI search / rich results (alongside Product schema).
 */
export function buildFaqPageJsonLd(faqs) {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}
