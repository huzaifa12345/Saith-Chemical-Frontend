import 'server-only';

/**
 * Server-only Express API helpers for SSR / generateMetadata.
 * Uses API_URL (preferred) or NEXT_PUBLIC_API_URL.
 * Never import this file from Client Components.
 */

function getBaseUrl() {
  const base =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    // Prefer 127.0.0.1 — Node fetch on Windows often fails on localhost (::1)
    'http://127.0.0.1:3000/api';

  // Normalize localhost → 127.0.0.1 for reliable SSR fetch on Windows
  return base.replace(/\/$/, '').replace('://localhost', '://127.0.0.1');
}

/**
 * @param {string} path - path under /api (e.g. "/products/123")
 * @param {RequestInit & { next?: { revalidate?: number | false }, cache?: RequestCache }} [init]
 */
async function serverFetch(path, init = {}) {
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const { next, cache, headers, ...rest } = init;

  const response = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    ...(cache ? { cache } : {}),
    ...(next ? { next } : { next: { revalidate: 60 } }),
  });

  return response;
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

/** Product by barcode (preferred) or numeric id — Express GET /products/:id */
export async function getProductByBarcode(barcode, options = {}) {
  const res = await serverFetch(`/products/${encodeURIComponent(barcode)}`, {
    next: { revalidate: options.revalidate ?? 60 },
    ...(options.cache ? { cache: options.cache } : {}),
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`);
  }
  return res.json();
}

/** Approved reviews for a product — Express GET /reviews/product/:productId */
export async function getProductReviews(productId, options = {}) {
  if (!productId) return { reviews: [] };

  const res = await serverFetch(`/reviews/product/${encodeURIComponent(productId)}`, {
    next: { revalidate: options.revalidate ?? 60 },
    ...(options.cache ? { cache: options.cache } : {}),
  });

  if (!res.ok) return { reviews: [] };
  return res.json();
}

/** Product + reviews in parallel for PDP SSR */
export async function getProductPageData(barcode, options = {}) {
  const product = await getProductByBarcode(barcode, options);
  if (!product) {
    return { product: null, reviews: [] };
  }

  const reviewsData = await getProductReviews(product.id, options);
  return {
    product,
    reviews: reviewsData?.reviews || [],
  };
}

/** Catalog list — Express GET /products */
export async function getProducts(params = {}, options = {}) {
  const res = await serverFetch(`/products${buildQuery(params)}`, {
    next: { revalidate: options.revalidate ?? 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }
  return res.json();
}

/** Products by category — Express GET /products/category/:category */
export async function getProductsByCategory(category, params = {}, options = {}) {
  const res = await serverFetch(
    `/products/category/${encodeURIComponent(category)}${buildQuery(params)}`,
    { next: { revalidate: options.revalidate ?? 60 } }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch category products (${res.status})`);
  }
  return res.json();
}

/** Categories — Express GET /categories */
export async function getCategories(options = {}) {
  const res = await serverFetch('/categories', {
    next: { revalidate: options.revalidate ?? 120 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

/** Website settings (CMS logo/hero) — Express GET /website-settings */
export async function getWebsiteSettings(options = {}) {
  try {
    const res = await serverFetch('/website-settings', {
      next: { revalidate: options.revalidate ?? 120 },
    });
    if (!res.ok) return { success: false, data: null };
    return res.json();
  } catch {
    return { success: false, data: null, error: 'API_UNAVAILABLE' };
  }
}

const DEFAULT_HERO_SLIDES = [
  {
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxNjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjgwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IZXJvIFNsaWRlPC90ZXh0Pjwvc3ZnPg==',
    title: 'Industrial Chemical Supply',
    description:
      'Reliable detergents and chemical essentials for business and household needs.',
  },
];

/** Parse CMS hero slides from website settings response */
export function parseHeroSlides(settingsResponse) {
  try {
    const heroSettings = settingsResponse?.data?.hero;
    if (!Array.isArray(heroSettings)) return DEFAULT_HERO_SLIDES;

    const slides = [];
    for (let i = 1; i <= 4; i++) {
      const imageSetting = heroSettings.find((s) => s.key === `hero_slide_${i}`);
      const titleSetting = heroSettings.find((s) => s.key === `hero_title_${i}`);
      const descSetting = heroSettings.find(
        (s) => s.key === `hero_description_${i}`
      );
      if (imageSetting?.value) {
        slides.push({
          image: imageSetting.value,
          title: titleSetting?.value || `Slide ${i}`,
          description: descSetting?.value || '',
        });
      }
    }
    return slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}

/** Home page SSR payload: hero + categories + up to 4 products each */
export async function getHomePageData(options = {}) {
  const [settings, categoriesRaw] = await Promise.all([
    getWebsiteSettings(options),
    getCategories(options).catch(() => []),
  ]);

  const heroSlides = parseHeroSlides(settings);
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw.filter((cat) => cat.is_active !== false)
    : [];

  const productsByCategory = {};
  await Promise.all(
    categories.map(async (category) => {
      try {
        const response = await getProductsByCategory(
          category.id,
          { limit: 4 },
          options
        );
        const products = response.products || response || [];
        productsByCategory[category.id] = Array.isArray(products)
          ? products.slice(0, 4)
          : [];
      } catch {
        productsByCategory[category.id] = [];
      }
    })
  );

  return { heroSlides, categories, productsByCategory };
}

/** Category by id — Express GET /categories/:id */
export async function getCategoryById(id, options = {}) {
  const res = await serverFetch(`/categories/${encodeURIComponent(id)}`, {
    next: { revalidate: options.revalidate ?? 120 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch category (${res.status})`);
  return res.json();
}

export { getBaseUrl, serverFetch };
