/** URL slug helpers for category names (DB has no slug column). */

export function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryPath(category) {
  if (!category) return '/all-products';
  const slug = category.slug || slugify(category.name);
  return slug ? `/category/${slug}` : `/category/${category.id}`;
}

export function findCategoryBySlug(categories, slugOrId) {
  if (!Array.isArray(categories) || !slugOrId) return null;
  const key = decodeURIComponent(String(slugOrId)).trim();
  if (/^\d+$/.test(key)) {
    return categories.find((c) => String(c.id) === key) || null;
  }
  const want = slugify(key);
  return (
    categories.find((c) => slugify(c.name) === want || c.slug === want) || null
  );
}
