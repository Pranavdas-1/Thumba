import { NextResponse } from "next/server";
import { deleteSupabaseImages } from "@/lib/storage";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const candidateUrls = body && typeof body === "object" ? (body as { urls?: unknown }).urls : undefined;
  const urls = Array.isArray(candidateUrls)
    ? candidateUrls.filter((url): url is string => typeof url === "string")
    : [];
  await deleteSupabaseImages(urls);
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file to upload" }, { status: 400 });
  }
  if (!new Set(["image/jpeg", "image/webp"]).has(file.type)) {
    return NextResponse.json({ error: "Only JPEG and WebP product images are supported" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be 10 MB or smaller" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "product-images";
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to dashboard/.env.local." },
      { status: 503 },
    );
  }

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  let response: Response;
  try {
    response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": file.type,
        "x-upsert": "true",
        "cache-control": "31536000",
      },
      body: await file.arrayBuffer(),
    });
  } catch (error) {
    console.error("Supabase upload request failed", error);
    return NextResponse.json({ error: "Could not reach Supabase storage" }, { status: 502 });
  }

  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase upload failed", detail);
    return NextResponse.json({ error: "Supabase storage rejected the image upload" }, { status: 502 });
  }

  return NextResponse.json({ url: `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}` });
}
