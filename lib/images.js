const SITE_URL = 'https://www.saithchemicals.com';

function abs(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Cloudinary URL transform helper — f_auto,q_auto + width.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeImageUrl(url, { width = 600 } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }
  if (/\/upload\/[^/]*f_auto/.test(url)) {
    return url.replace(/\/upload\/[^/]+\//, `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

/**
 * Primary product image for PDP / OG / JSON-LD.
 * Prefer seo_image / primary_image when you upload the new 1200×1200 shots.
 */
export function getProductPrimaryImage(product) {
  if (!product) return abs('/placeholder.png');
  const raw =
    product.seo_image ||
    product.primary_image ||
    product.images?.[0] ||
    product.image_url ||
    abs('/placeholder.png');
  return optimizeImageUrl(raw, { width: 1200 });
}

export function getProductImageList(product) {
  if (!product) return [abs('/placeholder.png')];
  const primary = getProductPrimaryImage(product);
  const rest = (product.images || [])
    .filter(Boolean)
    .map((u) => optimizeImageUrl(u, { width: 1200 }));
  const merged = [primary, ...rest.filter((u) => u !== primary)];
  return merged.length ? merged : [abs('/placeholder.png')];
}

export function getCardImage(product) {
  const raw =
    product?.seo_image ||
    product?.primary_image ||
    product?.images?.[0] ||
    product?.image_url ||
    '/placeholder.png';
  return optimizeImageUrl(raw, { width: 600 });
}

export function toAbsoluteImageUrl(url) {
  if (!url) return abs('/placeholder.png');
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return abs(url.startsWith('/') ? url : `/${url}`);
}
