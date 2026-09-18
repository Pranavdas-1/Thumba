import { PrismaClient, Category as PrismaCategory, type Prisma } from "@prisma/client";
import type { Category, Collection, OrderStatus, Product } from "./types";

const globalForPrisma = globalThis as unknown as {
  thumbaPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.thumbaPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.thumbaPrisma = prisma;
}

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { collection: true };
}>;

export const prismaCategoryToCategory = (category: string): Category =>
  category.toLowerCase() as Category;

export const categoryToPrismaCategory = (category: Category | string) =>
  category.toUpperCase() as PrismaCategory;

export const prismaOrderStatusToOrderStatus = (status: string): OrderStatus =>
  status.toLowerCase() as OrderStatus;

export function mapPrismaProduct(product: ProductWithRelations): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle ?? undefined,
    description: product.description,
    story: product.story ?? undefined,
    price: product.price,
    discountedPrice: product.discountedPrice ?? undefined,
    images: product.images,
    category: prismaCategoryToCategory(product.category),
    careInstructions: product.careInstructions ?? undefined,
    stock: product.stock,
    inStock: product.stock > 0 && product.inStock,
    featured: product.featured,
    isNew: product.isNew,
    collectionId: product.collectionId ?? undefined,
    collectionSlug: product.collection?.slug,
    details: product.details,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function mapPrismaCollection(
  collection: Prisma.CollectionGetPayload<{}>,
): Collection {
  return {
    id: collection.id,
    slug: collection.slug,
    name: collection.name,
    tagline: collection.tagline ?? "A considered edit",
    description: collection.description ?? "A considered edit from Thumba.",
    image: collection.image ?? "",
    heroImage: collection.heroImage ?? collection.image ?? undefined,
    featured: collection.featured,
  };
}

export async function listProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaProduct);
}

export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { collection: true },
  });
  return row ? mapPrismaProduct(row) : undefined;
}

export async function findProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({
    where: { id },
    include: { collection: true },
  });
  return row ? mapPrismaProduct(row) : undefined;
}

export async function listCollections(): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(mapPrismaCollection);
}

export async function findCollectionBySlug(
  slug: string,
): Promise<Collection | undefined> {
  const row = await prisma.collection.findUnique({ where: { slug } });
  return row ? mapPrismaCollection(row) : undefined;
}

export async function listProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { collection: { slug: collectionSlug } },
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaProduct);
}

export async function listProductsByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { category: categoryToPrismaCategory(category) },
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaProduct);
}
