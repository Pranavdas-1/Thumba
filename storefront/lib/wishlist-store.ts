"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@thumba/shared";
import { displayPrice } from "./products";

type WishlistState = {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().isInWishlist(product.id)) return;
        const newItem: WishlistItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: displayPrice(product),
          image: product.images[0] ?? "",
          category: product.category,
          inStock: product.inStock,
          addedAt: new Date().toISOString(),
        };
        set({ items: [...get().items, newItem] });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      toggleItem: (product) => {
        const inList = get().isInWishlist(product.id);
        if (inList) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
      clear: () => set({ items: [] }),
    }),
    { name: "thumba-wishlist-v1" },
  ),
);
