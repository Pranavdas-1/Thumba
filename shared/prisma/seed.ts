import { PrismaClient, Category } from "@prisma/client";
import { collections, products } from "./seed-data";
import { productImages, editorialImages } from "../../storefront/lib/image-library";

const prisma = new PrismaClient();
const outOfStockSlugs = new Set([
  "nila-pearl-necklace",
  "aruna-sculpted-hoops",
  "soma-moon-pendant",
]);

async function main() {
  const collectionIds = new Map<string, string>();

  for (const collection of collections) {
    const image =
      collection.slug === "timeless-gold"
        ? editorialImages.collections.gold
        : collection.slug === "the-pearl-edit"
          ? editorialImages.collections.pearl
          : collection.slug === "silver-moon"
            ? editorialImages.collections.silver
            : editorialImages.collections.heritage;

    const saved = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: { ...collection, image, heroImage: image },
      create: { ...collection, image, heroImage: image },
    });
    collectionIds.set(collection.slug, saved.id);
  }

  for (const [index, product] of products.entries()) {
    const { collectionSlug, ...productData } = product;
    const collectionId = collectionIds.get(collectionSlug);
    const unavailable = outOfStockSlugs.has(product.slug);
    const data = {
      ...productData,
      images: productImages(index),
      category: product.category.toUpperCase() as Category,
      stock: unavailable ? 0 : 10,
      inStock: !unavailable,
      ...(collectionId ? { collection: { connect: { id: collectionId } } } : {}),
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
