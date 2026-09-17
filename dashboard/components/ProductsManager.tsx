"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Collection, Product } from "@thumba/shared";
import { CATEGORY_LABELS, formatCurrency, slugify } from "@thumba/shared";

type ProductForm = {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  story: string;
  price: string;
  discountedPrice: string;
  images: string;
  category: Product["category"];
  material: string;
  weight: string;
  dimensions: string;
  careInstructions: string;
  details: string;
  stock: string;
  collectionId: string;
  featured: boolean;
  isNew: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  subtitle: "",
  description: "",
  story: "",
  price: "",
  discountedPrice: "",
  images: "",
  category: "necklaces",
  material: "",
  weight: "",
  dimensions: "",
  careInstructions: "",
  details: "",
  stock: "0",
  collectionId: "",
  featured: false,
  isNew: true,
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
    images: product.images.join("\n"),
    category: product.category,
    material: product.material,
    weight: product.weight,
    dimensions: product.dimensions ?? "",
    careInstructions: product.careInstructions ?? "",
    details: product.details?.join("\n") ?? "",
    stock: String(product.stock ?? (product.inStock ? 1 : 0)),
    collectionId: product.collectionId ?? "",
    featured: product.featured ?? false,
    isNew: product.isNew ?? false,
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
  const [error, setError] = useState("");

  const editingLabel = useMemo(
    () => (editingId ? "Edit product" : "Add product"),
    [editingId],
  );

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

  const updateForm = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      images: form.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean),
      details: form.details
        .split("\n")
        .map((detail) => detail.trim())
        .filter(Boolean),
      stock: Number(form.stock),
      collectionId: form.collectionId || null,
    };

    try {
      const response = await fetch(
        editingId ? `/api/products/${editingId}` : "/api/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save product");

      setProducts((current) =>
        editingId
          ? current.map((product) => (product.id === editingId ? data.product : product))
          : [data.product, ...current],
      );
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
    if (response.ok) {
      setProducts((current) =>
        current.map((item) => (item.id === product.id ? data.product : item)),
      );
    }
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
        <div>
          <h1 className="font-serif text-3xl text-navy-900">Products</h1>
          <p className="mt-2 text-sm text-navy-500">Live products from PostgreSQL.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          Add product
        </button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {showForm && (
        <form onSubmit={saveProduct} className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-navy-900">{editingLabel}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-navy-500 hover:text-navy-900">
              Close
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(value) => updateForm("name", value)} required />
            <Field label="Slug" value={form.slug} onChange={(value) => updateForm("slug", value)} placeholder="Auto-generated if blank" />
            <Field label="Price (INR)" type="number" value={form.price} onChange={(value) => updateForm("price", value)} required />
            <Field label="Discounted price (INR)" type="number" value={form.discountedPrice} onChange={(value) => updateForm("discountedPrice", value)} />
            <Field label="Material" value={form.material} onChange={(value) => updateForm("material", value)} required />
            <Field label="Weight" value={form.weight} onChange={(value) => updateForm("weight", value)} required />
            <Field label="Dimensions" value={form.dimensions} onChange={(value) => updateForm("dimensions", value)} />
            <Field label="Stock count" type="number" min="0" value={form.stock} onChange={(value) => updateForm("stock", value)} required />
            <label className="text-sm text-navy-700">
              Category
              <select value={form.category} onChange={(event) => updateForm("category", event.target.value as Product["category"])} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5">
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="text-sm text-navy-700">
              Collection
              <select value={form.collectionId} onChange={(event) => updateForm("collectionId", event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5">
                <option value="">No collection</option>
                {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}
              </select>
            </label>
            <TextArea label="Subtitle" value={form.subtitle} onChange={(value) => updateForm("subtitle", value)} />
            <TextArea label="Description" value={form.description} onChange={(value) => updateForm("description", value)} required />
            <TextArea label="Images (one URL per line)" value={form.images} onChange={(value) => updateForm("images", value)} required />
            <TextArea label="Details (one per line)" value={form.details} onChange={(value) => updateForm("details", value)} />
            <TextArea label="Care instructions" value={form.careInstructions} onChange={(value) => updateForm("careInstructions", value)} />
            <TextArea label="Story" value={form.story} onChange={(value) => updateForm("story", value)} />
          </div>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-navy-700">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(event) => updateForm("featured", event.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(event) => updateForm("isNew", event.target.checked)} /> New arrival</label>
          </div>
          <button disabled={saving} className="mt-6 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 disabled:opacity-60">
            {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
          </button>
        </form>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-navy-50 text-navy-500"><tr><th className="px-4 py-3">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-navy-100">
                <td className="px-4 py-3 font-medium text-navy-900">{product.name}<span className="block text-xs text-navy-400">/{product.slug}</span></td>
                <td className="capitalize">{product.category}</td>
                <td>{formatCurrency(product.discountedPrice ?? product.price)}</td>
                <td><input aria-label={`Stock for ${product.name}`} type="number" min="0" defaultValue={product.stock ?? (product.inStock ? 1 : 0)} onBlur={(event) => updateStock(product, event.target.value)} className="w-20 rounded border border-navy-200 px-2 py-1" /></td>
                <td className="space-x-3"><button type="button" onClick={() => openEdit(product)} className="text-navy-700 underline hover:text-navy-900">Edit</button><button type="button" onClick={() => deleteProduct(product)} className="text-red-600 underline hover:text-red-800">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-sm text-navy-500">No products yet. Add the first piece above.</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", min, placeholder, required }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; placeholder?: string; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<input required={required} type={type} min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}

function TextArea({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm text-navy-700">{label}<textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5" /></label>;
}
