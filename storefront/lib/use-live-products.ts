"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, ProductRealtimeFilter } from "@thumba/shared";
import {
  mapRealtimeProductRow,
  matchesRealtimeProduct,
} from "@thumba/shared";
import { getSupabaseBrowserClient } from "./supabase-browser";

function sameProduct(left: Product, right: Product) {
  return left.stock === right.stock &&
    left.inStock === right.inStock &&
    left.hidden === right.hidden &&
    left.updatedAt === right.updatedAt;
}

export function useLiveProducts(
  initialProducts: Product[],
  filter: ProductRealtimeFilter = {},
) {
  const [products, setProducts] = useState(initialProducts);
  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const activeFilter = JSON.parse(filterKey) as ProductRealtimeFilter;

    const channel = supabase
      .channel(`storefront-products-${filterKey}`)
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

            if (!matchesRealtimeProduct(next, activeFilter)) {
              return current.filter((product) => product.id !== next.id);
            }

            if (existing) {
              if (sameProduct(existing, next)) return current;
              return current.map((product) => product.id === next.id ? next : product);
            }

            return [...current, next];
          });
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[thumba] storefront product Realtime channel status:", status);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [filterKey]);

  return products;
}

export function useLiveProduct(initialProduct: Product) {
  const [product, setProduct] = useState<Product | null>(initialProduct);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`storefront-product-${initialProduct.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `id=eq.${initialProduct.id}` },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setProduct(null);
            return;
          }
          setProduct((current) => mapRealtimeProductRow(payload.new as Record<string, unknown>, current ?? initialProduct));
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("[thumba] storefront product detail Realtime channel status:", status);
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [initialProduct]);

  return product;
}
