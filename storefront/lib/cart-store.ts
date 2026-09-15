"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@thumba/shared";
import { displayPrice } from "./products";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantName?: string) => void;
  removeItem: (productId: string, variantName?: string) => void;
  setQuantity: (productId: string, quantity: number, variantName?: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variantName) => {
        const existingIndex = get().items.findIndex(
          (item) => item.productId === product.id && item.variantName === variantName,
        );

        if (existingIndex > -1) {
          const updated = [...get().items];
          updated[existingIndex].quantity += quantity;
          set({ items: updated });
          return;
        }

        const price = displayPrice(product);
        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price,
          quantity,
          image: product.images[0] ?? "",
          variantName,
        };

        set({ items: [...get().items, newItem] });
      },
      removeItem: (productId, variantName) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variantName === variantName),
          ),
        });
      },
      setQuantity: (productId, quantity, variantName) => {
        if (quantity < 1) {
          get().removeItem(productId, variantName);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantName === variantName
              ? { ...item, quantity }
              : item,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "thumba-cart-v2" },
  ),
);
