'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { CATEGORY_LABELS, BRAND } from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';

export function MobileNav({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open mobile menu"
          className={`flex h-10 w-10 items-center justify-center transition-colors md:hidden active:scale-95 ${overlay ? 'text-ivory-50 hover:bg-white/10' : 'text-ink-800 hover:bg-ivory-100'}`}
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-200" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col border-r border-ivory-200 bg-ivory-50 p-6 shadow-2xl transition-transform duration-250 ease-drawer focus:outline-none">
          <Dialog.Title className="sr-only">Thumba navigation</Dialog.Title>
          <div className="flex items-center justify-between border-b border-ivory-200 pb-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-serif text-2xl font-semibold tracking-wide text-ink-900"
            >
              {BRAND.name}
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-2 text-ink-600 hover:bg-ivory-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto">
            {/* Primary navigation links */}
            <div className="space-y-4">
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between font-serif text-2xl text-ink-900 hover:text-gold-700"
              >
                <span>Shop all pieces</span>
                <ArrowRight className="h-4 w-4 text-gold-600" />
              </Link>
              <Link
                href="/new-arrivals"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between font-serif text-2xl text-ink-900 hover:text-gold-700"
              >
                <span>New arrivals</span>
                <ArrowRight className="h-4 w-4 text-gold-600" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between font-serif text-xl text-ink-800 hover:text-gold-700"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-ink-800" />
                  <span>Your Bag</span>
                </span>
                {cartCount > 0 && (
                  <span className="rounded-full bg-ink-900 px-2 py-0.5 text-xs text-ivory-50">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Categories list */}
            <div className="mt-8 border-t border-ivory-200 pt-6">
              <p className="text-xs uppercase tracking-editorial text-gold-700">
                Categories
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/shop?category=${key}`}
                    onClick={() => setOpen(false)}
                    className="border-b border-ivory-200/70 py-2 text-sm text-ink-700 hover:text-ink-900"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-ivory-200 pt-4 text-xs text-ink-500">
            <p className="font-serif text-ink-800 italic">
              Quiet luxury, selected with intention.
            </p>
            <p className="mt-1">Bengaluru, India</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
