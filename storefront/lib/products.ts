import type { Collection, Product } from "@thumba/shared";
import {
  findCollectionBySlug,
  findProductBySlug,
  listCollections,
  listProducts,
  listProductsByCategory,
  listProductsByCollection,
} from "@thumba/shared/db";
import { displayPrice, sortProducts } from "@thumba/shared";

export {
  displayPrice,
  sortProducts,
};
export type { Collection, Product };

const isAvailable = (product: Product) =>
  !product.hidden && product.inStock && (product.stock ?? 0) > 0;

export async function getProducts(options?: { search?: string }) {
  const products = (await listProducts()).filter(isAvailable);
  const query = options?.search?.trim().toLowerCase();
  if (!query) return products;

  return products.filter((product) =>
    [product.name, product.description, product.category, product.subtitle]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query)),
  );
}
export const getCollections = listCollections;
export async function getProductBySlug(slug: string) {
  const product = await findProductBySlug(slug);
  return product && !product.hidden ? product : undefined;
}
export const getCollectionBySlug = findCollectionBySlug;

export async function getProductsByCategory(category: string) {
  return (await listProductsByCategory(category)).filter(isAvailable);
}

export async function getProductsByCollection(collectionSlug: string) {
  return (await listProductsByCollection(collectionSlug)).filter(isAvailable);
}
