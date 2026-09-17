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

export function cartTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(amount: number, taxRate = 0.03): number {
  return Math.round(amount * taxRate);
}

export function displayPrice(product: Pick<Product, "price" | "discountedPrice">): number {
  return product.discountedPrice ?? product.price;
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
    case "featured":
    default:
      return copy.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}
