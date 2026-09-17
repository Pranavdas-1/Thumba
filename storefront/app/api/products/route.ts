import { NextResponse } from "next/server";
import { getProducts, sortProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search") ?? undefined;
  const sort = searchParams.get("sort") || "featured";

  const products = await getProducts({ search });
  let items = category && category !== "all"
    ? products.filter((p) => p.category === category)
    : products;

  items = sortProducts(items, sort);

  return NextResponse.json({
    products: items,
    total: items.length,
  });
}
