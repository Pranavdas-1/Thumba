"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@thumba/shared";
import { displayPrice } from "@thumba/shared";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const existingIndex = get().items.findIndex(
          (item) => item.productId === product.id,
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
        };

        set({ items: [...get().items, newItem] });
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId
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
