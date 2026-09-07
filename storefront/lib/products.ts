import type { Product } from "@thumba/shared";
import { catalog, displayPrice, getProductBySlug, getProductsByCategory } from "@thumba/shared";

export const products: Product[] = catalog;

export { displayPrice, getProductBySlug, getProductsByCategory };
