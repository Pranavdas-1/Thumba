'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import {
  cartTotal,
  formatCurrency,
  calculateTax,
  BRAND,
  DEFAULT_PRICES,
} from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gold-600 border-t-transparent" />
      </main>
    );
  }

  const subtotal = cartTotal(items);
  const tax = calculateTax(subtotal, DEFAULT_PRICES.TAX_RATE);
  const isFreeShipping = subtotal >= BRAND.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : DEFAULT_PRICES.SHIPPING_FEE;
  const grandTotal = subtotal + tax + shippingFee;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ivory-200/70 text-ink-700">
          <ShoppingBag className="h-8 w-8 text-gold-700" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
          Your shopping bag is empty
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-600 leading-relaxed">
          Every piece is chosen to be an everyday signature. Explore our
          thoughtfully curated jewelry and find pieces meant for you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-ivory-50 transition hover:bg-ink-800 active:scale-97"
          >
            <span>Explore The Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="border-b border-ivory-200 pb-4">
        <p className="eyebrow text-gold-700">Your edit</p>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-6xl">
          Shopping Bag
        </h1>
        <p className="mt-1 text-xs text-ink-500">
          {items.reduce((s, i) => s + i.quantity, 0)} items in your bag
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Cart Item List (8 cols) */}
        <div className="lg:col-span-8">
          <ul className="divide-y divide-ivory-200">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 py-6 sm:gap-6"
              >
                {/* Product thumbnail */}
                <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden bg-ivory-100 sm:h-32 sm:w-28">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : null}
                </div>

                {/* Details & controls */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-serif text-lg font-medium text-ink-900 hover:text-gold-700 sm:text-xl"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <span className="font-serif text-base font-semibold text-ink-900 sm:text-lg">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>

                  {/* Quantity & Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center border border-ivory-300 bg-white px-2 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            item.productId,
                            item.quantity - 1,
                          )
                        }
                        className="px-2 text-sm text-ink-600 hover:text-ink-900 active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-xs font-semibold text-ink-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            item.productId,
                            item.quantity + 1,
                          )
                        }
                        className="px-2 text-sm text-ink-600 hover:text-ink-900 active:scale-95"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-4 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.productId)
                        }
                        className="inline-flex items-center gap-1 text-ink-400 hover:text-ink-900"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/shop"
              className="text-xs font-medium text-gold-700 underline hover:text-gold-900"
            >
              ← Continue browsing pieces
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="border border-ivory-200 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-ink-900">
              Order Summary
            </h2>

            <dl className="mt-6 space-y-3.5 border-b border-ivory-200 pb-6 text-xs sm:text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-ink-900">
                  {formatCurrency(subtotal)}
                </dd>
              </div>

              <div className="flex justify-between text-ink-600">
                <dt>GST (3% fine jewelry)</dt>
                <dd className="font-medium text-ink-900">
                  {formatCurrency(tax)}
                </dd>
              </div>

              <div className="flex justify-between text-ink-600">
                <dt>Delivery</dt>
                <dd className="font-medium text-gold-700">
                  {isFreeShipping
                    ? 'Complimentary'
                    : formatCurrency(shippingFee)}
                </dd>
              </div>
            </dl>

            <div className="flex justify-between py-6">
              <span className="font-serif text-lg font-semibold text-ink-900">
                Grand Total
              </span>
              <span className="font-serif text-2xl font-bold text-ink-900">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="btn-press flex w-full items-center justify-center gap-2 bg-ink-900 py-4 text-sm font-medium text-ivory-50 transition-colors hover:bg-ink-800"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-6 text-center text-xs text-ink-500">
              Payment is handled securely by Razorpay.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
