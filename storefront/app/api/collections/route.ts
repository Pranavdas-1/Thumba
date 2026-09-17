import { NextResponse } from "next/server";
import { getCollections } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const collections = await getCollections();
  return NextResponse.json({
    collections,
    total: collections.length,
  });
}
