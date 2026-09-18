import { NextResponse } from "next/server";

export type ProductInput = {
  name: string;
  slug: string;
  subtitle: string | null;
  description: string;
  story: string | null;
  price: number;
  discountedPrice: number | null;
  images: string[];
  category: string;
  careInstructions: string | null;
  details: string[];
  stock: number;
  collectionId: string | null;
  featured: boolean;
  isNew: boolean;
};

export function validateProductInput(body: unknown):
  | { ok: true; value: ProductInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid product payload" };
  const value = body as Record<string, unknown>;
  for (const key of ["name", "description"]) {
    if (typeof value[key] !== "string" || !value[key].trim()) return { ok: false, error: `${key} is required` };
  }
  const price = Number(value.price);
  const stock = Number(value.stock);
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "price must be a positive number" };
  if (!Number.isInteger(stock) || stock < 0) return { ok: false, error: "stock must be a whole number" };
  const images = Array.isArray(value.images) ? value.images.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  if (images.length === 0) return { ok: false, error: "At least one image URL is required" };
  const discountedPrice = value.discountedPrice === null || value.discountedPrice === "" || value.discountedPrice === undefined ? null : Number(value.discountedPrice);
  if (discountedPrice !== null && (!Number.isFinite(discountedPrice) || discountedPrice < 0)) return { ok: false, error: "discountedPrice must be a positive number" };

  return {
    ok: true,
    value: {
      name: String(value.name).trim(),
      slug: typeof value.slug === "string" ? value.slug.trim() : "",
      subtitle: optionalText(value.subtitle),
      description: String(value.description).trim(),
      story: optionalText(value.story),
      price,
      discountedPrice,
      images,
      category: typeof value.category === "string" ? value.category : "necklaces",
      careInstructions: optionalText(value.careInstructions),
      details: Array.isArray(value.details) ? value.details.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [],
      stock,
      collectionId: optionalText(value.collectionId),
      featured: Boolean(value.featured),
      isNew: Boolean(value.isNew),
    },
  };
}
export function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function handlePrismaError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code === "P2002") return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  if (code === "P2025") return NextResponse.json({ error: "Product or collection not found" }, { status: 404 });
  console.error(error);
  return NextResponse.json({ error: "Database request failed" }, { status: 500 });
}
