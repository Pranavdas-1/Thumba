import { NextResponse } from "next/server";
import { getReviewsForProduct } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const reviews = getReviewsForProduct(productId);
  return NextResponse.json({ reviews });
}
