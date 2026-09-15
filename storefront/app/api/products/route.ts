import { NextResponse } from "next/server";
import { products, searchProducts, sortProducts } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "featured";

  let items = category && category !== "all"
    ? products.filter((p) => p.category === category)
    : products;

  if (search) {
    items = searchProducts(items, search);
  }

  items = sortProducts(items, sort);

  return NextResponse.json({
    products: items,
    total: items.length,
  });
}
