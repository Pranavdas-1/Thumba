"use client";

import { useState } from "react";
import type { Product } from "@thumba/shared";
import { useCartStore } from "@/lib/cart-store";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={!product.inStock}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className="rounded-full bg-ink-900 px-8 py-3 text-sm text-ivory-50 transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {product.inStock ? (added ? "Added to bag" : "Add to bag") : "Sold out"}
    </button>
  );
}
