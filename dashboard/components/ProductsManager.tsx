"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Collection, Product } from "@thumba/shared";
import { CATEGORY_LABELS, formatCurrency, slugify } from "@thumba/shared";
import { ArrowDown, ArrowUp, Link2, Trash2, Upload } from "lucide-react";

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
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const editingLabel = useMemo(() => (editingId ? "Edit product" : "Add product"), [editingId]);
  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

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
    if (!/^https?:\/\//i.test(url)) {
      setError("Paste a valid http(s) image URL.");
      return;
    }
    if (!form.images.includes(url)) updateForm("images", [...form.images, url]);
    updateForm("externalImage", "");
    setError("");
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/uploads", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not upload image");
        uploaded.push(data.url);
      }
      updateForm("images", [...form.images, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    updateForm("images", form.images.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= form.images.length) return;
    const next = [...form.images];
    [next[index], next[target]] = [next[target], next[index]];
    updateForm("images", next);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      subtitle: form.subtitle,
      description: form.description,
      story: form.story,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      images: form.images,
      category: form.category,
      careInstructions: form.careInstructions,
      stock: Number(form.stock),
      collectionId: form.collectionId || null,
      featured: form.featured,
      isNew: form.isNew,
    };

    try {
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
      setError(saveError instanceof Error ? saveError.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function updateStock(product: Product, stockValue: string) {
    const stock = Number(stockValue);
    if (!Number.isInteger(stock) || stock < 0) return;
    const response = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    const data = await response.json();
    if (response.ok) setProducts((current) => current.map((item) => item.id === product.id ? data.product : item));
    else setError(data.error || "Could not update stock");
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
            <label className="text-sm text-navy-700">Collection<select value={form.collectionId} onChange={(event) => updateForm("collectionId", event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5"><option value="">No collection</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></label>
            <TextArea label="Subtitle" value={form.subtitle} onChange={(value) => updateForm("subtitle", value)} />
            <TextArea label="Description" value={form.description} onChange={(value) => updateForm("description", value)} required />
            <TextArea label="Care instructions" value={form.careInstructions} onChange={(value) => updateForm("careInstructions", value)} />
            <TextArea label="Story" value={form.story} onChange={(value) => updateForm("story", value)} />
          </div>

          <div className="mt-6 rounded-lg border border-navy-200 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-medium text-navy-900">Product images</h3><p className="mt-1 text-xs text-navy-500">Upload to Supabase or add an external image URL. Drag-free arrow controls set gallery order.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-navy-300 px-3 py-2 text-xs font-medium text-navy-800 hover:bg-navy-50"><Upload className="h-4 w-4" />{uploading ? "Uploading…" : "Upload images"}<input type="file" accept="image/*" multiple className="sr-only" disabled={uploading} onChange={(event) => uploadImages(event.target.files)} /></label></div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={form.externalImage} onChange={(event) => updateForm("externalImage", event.target.value)} placeholder="https://example.com/image.jpg" className="min-w-0 flex-1 rounded-lg border border-navy-200 px-3 py-2.5 text-sm" /><button type="button" onClick={addExternalImage} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-100 px-3 py-2.5 text-sm text-navy-900 hover:bg-navy-200"><Link2 className="h-4 w-4" />Add URL</button></div>
            {form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.images.map((image, index) => <div key={`${image}-${index}`} className="relative overflow-hidden rounded-lg border border-navy-200 bg-navy-50"><div className="aspect-square">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={image} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" /></div><div className="flex items-center justify-between p-2"><span className="text-[10px] text-navy-500">#{index + 1}</span><div className="flex gap-1"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded p-1 text-navy-600 hover:bg-white disabled:opacity-30" aria-label="Move image left"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === form.images.length - 1} className="rounded p-1 text-navy-600 hover:bg-white disabled:opacity-30" aria-label="Move image right"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => removeImage(index)} className="rounded p-1 text-red-600 hover:bg-red-50" aria-label="Remove image"><Trash2 className="h-3.5 w-3.5" /></button></div></div></div>)}</div>}
            {form.images.length === 0 && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Add at least one image before creating a product.</p>}
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-navy-700"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(event) => updateForm("isNew", event.target.checked)} /> New arrival</label></div>
          <button disabled={saving || uploading || form.images.length === 0} className="mt-6 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 disabled:opacity-60">{saving ? "Saving…" : editingId ? "Save changes" : "Create product"}</button>
        </form>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-navy-50 text-navy-500"><tr><th className="px-4 py-3">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-navy-100"><td className="px-4 py-3 font-medium text-navy-900">{product.name}<span className="block text-xs text-navy-400">/{product.slug}</span></td><td className="capitalize">{product.category}</td><td>{formatCurrency(product.discountedPrice ?? product.price)}</td><td><input aria-label={`Stock for ${product.name}`} type="number" min="0" defaultValue={product.stock ?? 0} onBlur={(event) => updateStock(product, event.target.value)} className="w-20 rounded border border-navy-200 px-2 py-1" /></td><td className="space-x-3"><button type="button" onClick={() => openEdit(product)} className="text-navy-700 underline hover:text-navy-900">Edit</button><button type="button" onClick={() => deleteProduct(product)} className="text-red-600 underline hover:text-red-800">Delete</button></td></tr>)}</tbody></table>{products.length === 0 && <p className="p-8 text-center text-sm text-navy-500">No products yet. Add the first piece above.</p>}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", min, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; placeholder?: string; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<input required={required} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}
