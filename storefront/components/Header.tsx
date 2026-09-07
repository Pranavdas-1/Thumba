"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function Header() {
  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ivory-200/80 bg-ivory-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide text-ink-900">
          Thumba
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-700 md:flex">
          <Link href="/shop" className="hover:text-gold-700">
            Shop
          </Link>
          <Link href="/collections" className="hover:text-gold-700">
            Collections
          </Link>
          <Link href="/cart" className="hover:text-gold-700">
            Cart
          </Link>
        </nav>
        <Link href="/cart" className="relative text-ink-800" aria-label="Open cart">
          <ShoppingBag className="h-5 w-5" />
          {count > 0 ? (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink-900 px-1 text-[10px] text-ivory-50">
              {count}
            </span>
          ) : null}
        </Link>
      </div>
    </header>
  );
}
