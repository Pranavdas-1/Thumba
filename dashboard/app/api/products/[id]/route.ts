import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { categoryToPrismaCategory, mapPrismaProduct, prisma } from "@thumba/shared/db";
import { handlePrismaError, optionalText } from "@/lib/product-input";
import { deleteSupabaseImages } from "@/lib/storage";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
  }

  const value = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  const textFields = [
    "name",
    "slug",
    "subtitle",
    "description",
    "story",
    "careInstructions",
  ];
  for (const field of textFields) {
    if (field in value) {
      if (field === "name" || field === "description") {
        if (typeof value[field] !== "string" || !value[field].trim()) {
          return NextResponse.json({ error: `${field} cannot be empty` }, { status: 400 });
        }
        data[field] = value[field].trim();
      } else {
        data[field] = optionalText(value[field]);
      }
    }
  }
  if ("price" in value) {
    const price = Number(value.price);
    if (!Number.isFinite(price) || price < 0) return NextResponse.json({ error: "price must be a positive number" }, { status: 400 });
    data.price = price;
  }
  if ("discountedPrice" in value) {
    data.discountedPrice = value.discountedPrice === null || value.discountedPrice === "" ? null : Number(value.discountedPrice);
  }
  if ("stock" in value) {
    const stock = Number(value.stock);
    if (!Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: "stock must be a whole number" }, { status: 400 });
    data.stock = stock;
    data.inStock = stock > 0;
  }
  if ("images" in value) {
    if (!Array.isArray(value.images)) return NextResponse.json({ error: "images must be an array" }, { status: 400 });
    data.images = value.images.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  if ("details" in value) {
    data.details = Array.isArray(value.details) ? value.details.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
  }
  if ("category" in value) data.category = categoryToPrismaCategory(String(value.category));
  if ("featured" in value) data.featured = Boolean(value.featured);
  if ("isNew" in value) data.isNew = Boolean(value.isNew);
  if ("collectionId" in value) {
    data.collection = value.collectionId
      ? { connect: { id: String(value.collectionId) } }
      : { disconnect: true };
  }

  try {
    const previous = "images" in value
      ? await prisma.product.findUnique({ where: { id }, select: { images: true } })
      : null;
    const row = await prisma.product.update({
      where: { id },
      data,
      include: { collection: true },
    });
    if (previous) {
      const removedImages = previous.images.filter((image) => !row.images.includes(image));
      await deleteSupabaseImages(removedImages);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ product: mapPrismaProduct(row) });
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id }, select: { images: true } });
    await prisma.product.delete({ where: { id } });
    if (product) await deleteSupabaseImages(product.images);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2003") {
      return NextResponse.json({ error: "This product is part of an order and cannot be deleted" }, { status: 409 });
    }
    return handlePrismaError(error);
  }
}
