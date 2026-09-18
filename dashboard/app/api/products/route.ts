import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { categoryToPrismaCategory, listProducts, mapPrismaProduct, prisma } from "@thumba/shared/db";
import { slugify } from "@thumba/shared";
import { handlePrismaError, validateProductInput } from "@/lib/product-input";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ products: await listProducts() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateProductInput(body);
  if (!validation.ok) return NextResponse.json({ error: validation.error }, { status: 400 });

  const input = validation.value;
  try {
    const row = await prisma.product.create({
      data: {
        slug: input.slug || slugify(input.name),
        name: input.name,
        subtitle: input.subtitle,
        description: input.description,
        story: input.story,
        price: input.price,
        discountedPrice: input.discountedPrice,
        images: input.images,
        category: categoryToPrismaCategory(input.category),
        careInstructions: input.careInstructions,
        details: input.details,
        stock: input.stock,
        inStock: input.stock > 0,
        featured: input.featured,
        isNew: input.isNew,
        ...(input.collectionId ? { collection: { connect: { id: input.collectionId } } } : {}),
      },
      include: { collection: true },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ product: mapPrismaProduct(row) }, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
