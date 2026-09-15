import type { Collection, Product, Review } from "@thumba/shared";
import {
  catalog,
  collections as catalogCollections,
  reviews,
  displayPrice,
  getReviewsForProduct,
  searchProducts as searchCatalog,
  sortProducts,
} from "@thumba/shared";
import { editorialImages, productImages } from './image-library';

export const products: Product[] = catalog.map((product, index) => ({
  ...product,
  images: productImages(index),
}));

export const collections: Collection[] = catalogCollections.map((collection) => {
  const image =
    collection.slug === 'timeless-gold'
      ? editorialImages.collections.gold
      : collection.slug === 'the-pearl-edit'
        ? editorialImages.collections.pearl
        : collection.slug === 'silver-moon'
          ? editorialImages.collections.silver
          : editorialImages.collections.heritage;

  return { ...collection, image, heroImage: image };
});

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getCollectionBySlug = (slug: string) =>
  collections.find((collection) => collection.slug === slug);

export const getProductsByCategory = (category: Product['category']) =>
  products.filter((product) => product.category === category);

export const getProductsByCollection = (collectionSlug: string) =>
  products.filter((product) => product.collectionSlug === collectionSlug);

export const searchProducts = (items: Product[], query: string) =>
  searchCatalog(items, query);

export {
  reviews,
  displayPrice,
  getReviewsForProduct,
  sortProducts,
};
export type { Collection, Product, Review };
