"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Collection, Product } from "@thumba/shared";
import { mapRealtimeProductRow } from "@thumba/shared";
import { CATEGORY_LABELS, formatCurrency, slugify } from "@thumba/shared";
import { ArrowDown, ArrowUp, Eye, EyeOff, Link2, Trash2, Upload } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type ProductForm = {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  story: string;
  price: string;
  discountedPrice: string;
  category: Product["category"];
  careInstructions: string;
  stock: string;
  collectionId: string;
  featured: boolean;
  isNew: boolean;
  images: string[];
  pendingImages: File[];
  externalImage: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  subtitle: "",
  description: "",
  story: "",
  price: "",
  discountedPrice: "",
  category: "necklaces",
  careInstructions: "",
  stock: "0",
  collectionId: "",
  featured: false,
  isNew: true,
  images: [],
  pendingImages: [],
  externalImage: "",
};

function toForm(product: Product): ProductForm {
  return {
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle ?? "",
    description: product.description,
    story: product.story ?? "",
    price: String(product.price),
    discountedPrice: product.discountedPrice ? String(product.discountedPrice) : "",
    category: product.category,
    careInstructions: product.careInstructions ?? "",
    stock: String(product.stock ?? 0),
    collectionId: product.collectionId ?? "",
    featured: product.featured ?? false,
    isNew: product.isNew ?? false,
    images: product.images,
    pendingImages: [],
    externalImage: "",
  };
}

export function ProductsManager({
  initialProducts,
  collections,
}: {
  initialProducts: Product[];
  collections: Collection[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [availableCollections, setAvailableCollections] = useState(collections);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel("admin-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const row = payload.eventType === "DELETE" ? payload.old : payload.new;
          const productId = typeof row.id === "string" ? row.id : "";
          setProducts((current) => {
            if (payload.eventType === "DELETE") {
              return current.filter((product) => product.id !== productId);
            }

            const existing = current.find((product) => product.id === productId);
            const next = mapRealtimeProductRow(row as Record<string, unknown>, existing);
            if (!next) return current;
            if (existing && existing.stock === next.stock && existing.hidden === next.hidden && existing.updatedAt === next.updatedAt) return current;
            if (existing) return current.map((product) => product.id === next.id ? next : product);
            return [next, ...current];
          });
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[thumba] admin product Realtime channel status:", status);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const pendingPreviewUrls = useMemo(
    () => form.pendingImages.map((file) => URL.createObjectURL(file)),
    [form.pendingImages],
  );
  useEffect(() => () => pendingPreviewUrls.forEach((url) => URL.revokeObjectURL(url)), [pendingPreviewUrls]);
  const galleryImages = useMemo(
    () => [
      ...form.images.map((src) => ({ kind: "stored" as const, src })),
      ...form.pendingImages.map((file, index) => ({ kind: "pending" as const, file, src: pendingPreviewUrls[index] })),
    ],
    [form.images, form.pendingImages, pendingPreviewUrls],
  );
  const visibleProducts = products.filter((product) => !product.hidden);
  const hiddenProducts = products.filter((product) => product.hidden);

  const editingLabel = useMemo(() => (editingId ? "Edit product" : "Add product"), [editingId]);
  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function createCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!collectionName.trim()) return;
    setCreatingCollection(true);
    setError("");
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: collectionName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create collection");
      setAvailableCollections((current) => [...current, data.collection]);
      setCollectionName("");
      updateForm("collectionId", data.collection.id);
    } catch (collectionError) {
      setError(collectionError instanceof Error ? collectionError.message : "Could not create collection");
    } finally {
      setCreatingCollection(false);
    }
  }

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(toForm(product));
    setError("");
    setShowForm(true);
  };

  function addExternalImage() {
    const url = form.externalImage.trim();
    if (!/^https?:\/\//i.test(url) || /\.svg(?:$|[?#])/i.test(url)) {
      setError("Paste a valid non-SVG http(s) image URL.");
      return;
    }
    if (!form.images.includes(url)) updateForm("images", [...form.images, url]);
    updateForm("externalImage", "");
    setError("");
  }

  function selectImages(files: FileList | null) {
    if (!files?.length) return;
    updateForm("pendingImages", [...form.pendingImages, ...Array.from(files)]);
    setError("");
  }

  function removeImage(index: number) {
    const next = galleryImages.filter((_, imageIndex) => imageIndex !== index);
    setForm((current) => ({
      ...current,
      images: next.filter((image) => image.kind === "stored").map((image) => image.src),
      pendingImages: next.filter((image) => image.kind === "pending").map((image) => image.file),
    }));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= galleryImages.length) return;
    const next = [...galleryImages];
    [next[index], next[target]] = [next[target], next[index]];
    setForm((current) => ({
      ...current,
      images: next.filter((image) => image.kind === "stored").map((image) => image.src),
      pendingImages: next.filter((image) => image.kind === "pending").map((image) => image.file),
    }));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const uploadedImages: string[] = [];
    try {
      const uploadedByFile = new Map<File, string>();
      setUploading(form.pendingImages.length > 0);
      for (const file of form.pendingImages) {
        const body = new FormData();
        body.append("file", file);
        const uploadResponse = await fetch("/api/uploads", { method: "POST", body });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.error || "Could not upload image");
        uploadedImages.push(uploadData.url);
        uploadedByFile.set(file, uploadData.url);
      }
      const images = galleryImages.map((image) => image.kind === "stored" ? image.src : uploadedByFile.get(image.file)).filter((image): image is string => Boolean(image));
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        subtitle: form.subtitle,
        description: form.description,
        story: form.story,
        price: Number(form.price),
        discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
        images,
        category: form.category,
        careInstructions: form.careInstructions,
        stock: Number(form.stock),
        collectionId: form.collectionId || null,
        featured: form.featured,
        isNew: form.isNew,
      };
      const response = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save product");
      setProducts((current) => editingId
        ? current.map((product) => product.id === editingId ? data.product : product)
        : [data.product, ...current]);
      setShowForm(false);
    } catch (saveError) {
      if (uploadedImages.length > 0) {
        await fetch("/api/uploads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ urls: uploadedImages }) }).catch(() => undefined);
      }
      setError(saveError instanceof Error ? saveError.message : "Could not save product");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  async function toggleHidden(product: Product) {
    setError("");
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !product.hidden }),
    });
    const data = await response.json();
    if (response.ok) setProducts((current) => current.map((item) => item.id === product.id ? data.product : item));
    else setError(data.error || "Could not update product visibility");
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not delete product");
      return;
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><h1 className="font-serif text-3xl text-navy-900">Products</h1><p className="mt-2 text-sm text-navy-500">Live catalog from PostgreSQL.</p></div>
        <button type="button" onClick={openCreate} className="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800">Add product</button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={createCollection} className="mt-6 flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-sm text-navy-700">Create collection<input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="e.g. Monsoon Edit" className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>
        <button type="submit" disabled={creatingCollection || !collectionName.trim()} className="rounded-lg border border-navy-900 px-4 py-2.5 text-sm font-medium text-navy-900 hover:bg-navy-50 disabled:opacity-50">{creatingCollection ? "Creating…" : "Create Collection"}</button>
      </form>

      {showForm && (
        <form onSubmit={saveProduct} className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy-900">{editingLabel}</h2><button type="button" onClick={() => setShowForm(false)} className="text-sm text-navy-500 hover:text-navy-900">Close</button></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(value) => updateForm("name", value)} required />
            <Field label="Slug" value={form.slug} onChange={(value) => updateForm("slug", value)} placeholder="Auto-generated if blank" />
            <Field label="Price (INR)" type="number" value={form.price} onChange={(value) => updateForm("price", value)} required />
            <Field label="Discounted price (INR)" type="number" value={form.discountedPrice} onChange={(value) => updateForm("discountedPrice", value)} />
            <Field label="Stock count" type="number" min="0" value={form.stock} onChange={(value) => updateForm("stock", value)} required />
            <label className="text-sm text-navy-700">Category<select value={form.category} onChange={(event) => updateForm("category", event.target.value as Product["category"])} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5">{Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="text-sm text-navy-700">Collection<select value={form.collectionId} onChange={(event) => updateForm("collectionId", event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5"><option value="">No collection</option>{availableCollections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></label>
            <TextArea label="Subtitle" value={form.subtitle} onChange={(value) => updateForm("subtitle", value)} />
            <TextArea label="Description" value={form.description} onChange={(value) => updateForm("description", value)} required />
            <TextArea label="Care instructions" value={form.careInstructions} onChange={(value) => updateForm("careInstructions", value)} />
            <TextArea label="Story" value={form.story} onChange={(value) => updateForm("story", value)} />
          </div>

          <div className="mt-6 rounded-lg border border-navy-200 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-medium text-navy-900">Product images</h3><p className="mt-1 text-xs text-navy-500">Select JPEG or WebP files; they upload to Supabase only when you save. Arrow controls set gallery order.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy-300 px-3 py-2 text-xs font-medium text-navy-800 hover:bg-navy-50"><Upload className="h-4 w-4" />{uploading ? "Uploading…" : "Select images"}<input type="file" accept="image/jpeg,image/webp" multiple className="sr-only" disabled={uploading} onChange={(event) => selectImages(event.target.files)} /></label></div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={form.externalImage} onChange={(event) => updateForm("externalImage", event.target.value)} placeholder="https://example.com/image.jpg" className="min-w-0 flex-1 rounded-lg border border-navy-200 px-3 py-2.5 text-sm" /><button type="button" onClick={addExternalImage} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-100 px-3 py-2.5 text-sm text-navy-900 hover:bg-navy-200"><Link2 className="h-4 w-4" />Add URL</button></div>
            {galleryImages.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{galleryImages.map((image, index) => <div key={`${image.src}-${index}`} className="relative overflow-hidden rounded-lg border border-navy-200 bg-navy-50"><div className="aspect-square">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={image.src} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between p-2"><span className="text-[10px] text-navy-500">#{index + 1}{image.kind === "pending" ? " · pending" : ""}</span><div className="flex gap-1"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded p-1 text-navy-600 hover:bg-white disabled:opacity-30" aria-label="Move image left"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === galleryImages.length - 1} className="rounded p-1 text-navy-600 hover:bg-white disabled:opacity-30" aria-label="Move image right"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => removeImage(index)} className="rounded p-1 text-red-600 hover:bg-red-50" aria-label="Remove image"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>)}</div>}
            {galleryImages.length === 0 && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Add at least one image before creating a product.</p>}
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-navy-700"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(event) => updateForm("isNew", event.target.checked)} /> New arrival</label></div>
          <button disabled={saving || uploading || galleryImages.length === 0} className="mt-6 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 disabled:opacity-60">{saving ? "Saving…" : editingId ? "Save changes" : "Create product"}</button>
        </form>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-navy-50 text-navy-500"><tr><th className="px-4 py-3">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{visibleProducts.map((product) => <tr key={product.id} className="border-t border-navy-100"><td className="px-4 py-3 font-medium text-navy-900">{product.name}<span className="block text-xs text-navy-400">/{product.slug}</span></td><td className="capitalize">{product.category}</td><td>{formatCurrency(product.discountedPrice ?? product.price)}</td><td className="text-sm text-navy-700">{product.stock ?? 0}</td><td className="space-x-3"><button type="button" onClick={() => openEdit(product)} className="text-navy-700 underline hover:text-navy-900">Edit</button><button type="button" onClick={() => toggleHidden(product)} className="inline-flex items-center gap-1 text-navy-700 underline hover:text-navy-900" aria-label={`Hide ${product.name}`}><EyeOff className="h-3.5 w-3.5" />Hide</button><button type="button" onClick={() => deleteProduct(product)} className="text-red-600 underline hover:text-red-800">Delete</button></td></tr>)}</tbody></table>{visibleProducts.length === 0 && <p className="p-8 text-center text-sm text-navy-500">No visible products yet. Add a product or unhide one below.</p>}</div>

      <section className="mt-10"><h2 className="font-serif text-2xl text-navy-900">Hidden Products</h2><p className="mt-1 text-sm text-navy-500">Hidden products stay in the catalog for admin use but never appear on the storefront.</p><div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-navy-50 text-navy-500"><tr><th className="px-4 py-3">Name</th><th>Category</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{hiddenProducts.map((product) => <tr key={product.id} className="border-t border-navy-100"><td className="px-4 py-3 font-medium text-navy-900">{product.name}<span className="block text-xs text-navy-400">/{product.slug}</span></td><td className="capitalize">{product.category}</td><td>{product.stock ?? 0}</td><td className="space-x-3"><button type="button" onClick={() => openEdit(product)} className="text-navy-700 underline hover:text-navy-900">Edit</button><button type="button" onClick={() => toggleHidden(product)} className="inline-flex items-center gap-1 text-navy-700 underline hover:text-navy-900" aria-label={`Unhide ${product.name}`}><Eye className="h-3.5 w-3.5" />Unhide</button></td></tr>)}</tbody></table>{hiddenProducts.length === 0 && <p className="p-8 text-center text-sm text-navy-500">No hidden products.</p>}</div></section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", min, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; placeholder?: string; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<input required={required} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}
