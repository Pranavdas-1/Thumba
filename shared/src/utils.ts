import type { Product } from "./types";

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function calculateDiscount(price: number, discountPercent: number): number {
  return Math.round(price - price * (discountPercent / 100));
}

export function discountPercentage(originalPrice: number, discountedPrice?: number): number {
  if (!discountedPrice || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function generateOrderId(): string {
  return `THB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function cartTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(amount: number, taxRate = 0.03): number {
  return Math.round(amount * taxRate);
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  const copy = [...products];
  switch (sortBy) {
    case "price-asc":
      return copy.sort(
        (a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price),
      );
    case "price-desc":
      return copy.sort(
        (a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price),
      );
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return copy.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q))
    );
  });
}
