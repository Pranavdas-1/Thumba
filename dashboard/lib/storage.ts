const supportedBucket = () => process.env.SUPABASE_STORAGE_BUCKET || "product-images";

export async function deleteSupabaseImages(images: string[]) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey || images.length === 0) return;

  const bucket = supportedBucket();
  const publicPrefix = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/`;
  const paths = images
    .filter((image) => image.startsWith(publicPrefix))
    .map((image) => decodeURIComponent(image.slice(publicPrefix.length)))
    .filter(Boolean);

  await Promise.all(paths.map(async (path) => {
    const encodedPath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${encodedPath}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey },
      });
      if (!response.ok) console.error("Supabase image deletion failed", await response.text());
    } catch (error) {
      console.error("Supabase image deletion request failed", error);
    }
  }));
}
