import { NextResponse } from "next/server";
import { slugify } from "@thumba/shared";
import { mapPrismaCollection, prisma } from "@thumba/shared/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const collections = await prisma.collection.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ collections: collections.map(mapPrismaCollection) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body && typeof body === "object" ? String((body as Record<string, unknown>).name ?? "").trim() : "";
  if (!name) return NextResponse.json({ error: "Collection name is required" }, { status: 400 });

  const slug = slugify(name);
  if (!slug) return NextResponse.json({ error: "Collection name must contain letters or numbers" }, { status: 400 });

  try {
    const collection = await prisma.collection.create({ data: { name, slug } });
    return NextResponse.json({ collection: mapPrismaCollection(collection) }, { status: 201 });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "P2002") return NextResponse.json({ error: "A collection with that name already exists" }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: "Could not create collection" }, { status: 500 });
  }
}
