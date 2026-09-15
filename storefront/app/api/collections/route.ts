import { NextResponse } from "next/server";
import { collections } from "@/lib/products";

export async function GET() {
  return NextResponse.json({
    collections,
    total: collections.length,
  });
}
