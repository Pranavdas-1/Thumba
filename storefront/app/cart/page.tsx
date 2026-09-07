"use client";

import Link from "next/link";
import Image from "next/image";
import { cartTotal, formatCurrency } from "@thumba/shared";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-ink-900">Your bag is empty</h1>
        <p className="mt-3 text-ink-700">Start with a piece you would actually wear tomorrow.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink-900 px-8 py-3 text-ivory-50">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink-900">Bag</h1>
      <ul className="mt-10 divide-y divide-ivory-200">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-ivory-100">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
              <div>
                <Link href={`/products/${item.slug}`} className="font-serif text-xl text-ink-900">
                  {item.name}
                </Link>
                <p className="text-sm text-gold-700">{formatCurrency(item.price)}</p>
              </div>
              <div className="mt-3 flex items-center gap-3 sm:mt-0">
                <label className="sr-only" htmlFor={`qty-${item.productId}`}>
                  Quantity
                </label>
                <input
                  id={`qty-${item.productId}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                  className="w-16 rounded-lg border border-ivory-200 bg-white px-2 py-1"
                />
                <button
                  type="button"
                  className="text-sm text-ink-700 underline"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between border-t border-ivory-200 pt-6">
        <p className="text-lg">Total {formatCurrency(total)}</p>
        <Link href="/checkout" className="rounded-full bg-ink-900 px-8 py-3 text-ivory-50">
          Checkout
        </Link>
      </div>
    </main>
  );
}
