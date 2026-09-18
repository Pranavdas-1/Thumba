import type { Product } from "./types";

export type ProductRealtimeFilter = {
  id?: string;
  category?: string;
  collectionId?: string;
  collectionSlug?: string;
  price?: string;
  search?: string;
  featured?: boolean;
  isNew?: boolean;
};

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function optionalString(value: unknown, fallback?: string) {
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function stringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

export function mapRealtimeProductRow(
  row: Record<string, unknown>,
  previous?: Product,
): Product | null {
  const id = stringValue(row.id, previous?.id);
  const slug = stringValue(row.slug, previous?.slug);
  const name = stringValue(row.name, previous?.name);
  const description = stringValue(row.description, previous?.description);
  if (!id || !slug || !name || !description) return previous ?? null;

  const stock = numberValue(row.stock, previous?.stock ?? 0);
  const collectionId = Object.prototype.hasOwnProperty.call(row, "collectionId")
    ? optionalString(row.collectionId)
    : previous?.collectionId;

  return {
    id,
    slug,
    name,
    subtitle: optionalString(row.subtitle, previous?.subtitle),
    description,
    story: optionalString(row.story, previous?.story),
    price: numberValue(row.price, previous?.price ?? 0),
    discountedPrice: row.discountedPrice === null
      ? undefined
      : numberValue(row.discountedPrice, previous?.discountedPrice ?? 0) || undefined,
    images: stringArray(row.images, previous?.images ?? []),
    category: stringValue(row.category, previous?.category ?? "others").toLowerCase() as Product["category"],
    careInstructions: optionalString(row.careInstructions, previous?.careInstructions),
    stock,
    inStock: booleanValue(row.inStock, stock > 0) && stock > 0,
    hidden: booleanValue(row.hidden, previous?.hidden ?? false),
    featured: booleanValue(row.featured, previous?.featured ?? false),
    isNew: booleanValue(row.isNew, previous?.isNew ?? false),
    collectionId: collectionId || undefined,
    collectionSlug: previous?.collectionSlug,
    details: stringArray(row.details, previous?.details ?? []),
    createdAt: stringValue(row.createdAt, previous?.createdAt ?? new Date(0).toISOString()),
    updatedAt: stringValue(row.updatedAt, previous?.updatedAt ?? new Date(0).toISOString()),
  };
}

export function isRealtimeProductPurchasable(product: Product) {
  return !product.hidden && product.inStock && (product.stock ?? 0) > 0;
}

export function matchesRealtimeProduct(
  product: Product,
  filter: ProductRealtimeFilter = {},
) {
  if (!isRealtimeProductPurchasable(product)) return false;
  if (filter.id && product.id !== filter.id) return false;
  if (filter.category && product.category !== filter.category) return false;
  if (filter.collectionId && product.collectionId !== filter.collectionId) return false;
  if (!filter.collectionId && filter.collectionSlug && product.collectionSlug !== filter.collectionSlug) return false;
  if (filter.featured !== undefined && product.featured !== filter.featured) return false;
  if (filter.isNew !== undefined && product.isNew !== filter.isNew) return false;

  const price = product.discountedPrice ?? product.price;
  if (filter.price === "under-6000" && price >= 6000) return false;
  if (filter.price === "6000-12000" && (price < 6000 || price > 12000)) return false;
  if (filter.price === "12000-20000" && (price < 12000 || price > 20000)) return false;
  if (filter.price === "above-20000" && price <= 20000) return false;

  const search = filter.search?.trim().toLowerCase();
  if (search) {
    const values = [product.name, product.description, product.category, product.subtitle].filter(Boolean);
    if (!values.some((value) => value!.toLowerCase().includes(search))) return false;
  }

  return true;
}
