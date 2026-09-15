'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@thumba/shared';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { products } from '@/lib/products';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clear);
  const addItemToCart = useCartStore((state) => state.addItem);

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

  const handleMoveToBag = (item: (typeof items)[0]) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      addItemToCart(product);
      removeItem(item.productId);
      toast.success(`Moved ${item.name} to your shopping bag`);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
          Your wishlist is empty
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-600 leading-relaxed">
          Save pieces that speak to you as you explore our collections. Return
          whenever you are ready to curate your jewelry box.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-3.5 text-sm font-medium text-ivory-50 transition hover:bg-ink-800 active:scale-97"
          >
            <span>Explore Pieces</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-ivory-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-gold-700">Your saved edit</p>
          <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-ink-900 sm:text-6xl">
            Your Wishlist
          </h1>
          <p className="mt-1 text-xs text-ink-500">
            {items.length} saved {items.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearWishlist();
            toast.info('Cleared all items from wishlist');
          }}
          className="text-xs text-ink-500 hover:text-brand-700 underline"
        >
          Clear entire wishlist
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative flex flex-col justify-between border border-ivory-200 bg-white p-4 transition-colors hover:border-gold-500"
          >
            <div>
              {/* Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ivory-100">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    removeItem(item.productId);
                    toast.info(`Removed ${item.name} from wishlist`);
                  }}
                  className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center border border-ink-900/15 bg-ivory-50/90 text-ink-600 backdrop-blur transition-colors hover:bg-white hover:text-brand-700 active:scale-95"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Info */}
              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-editorial text-gold-700 font-medium">
                  {item.category}
                </span>
                <Link
                  href={`/products/${item.slug}`}
                  className="mt-0.5 block font-serif text-lg font-medium text-ink-900 hover:text-gold-700 line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="mt-1 font-serif text-base font-semibold text-ink-900">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 border-t border-ivory-200 pt-3">
              <button
                type="button"
                onClick={() => handleMoveToBag(item)}
                className="btn-press flex w-full items-center justify-center gap-2 bg-ink-900 py-2.5 text-xs font-medium text-ivory-50 transition-colors hover:bg-ink-800"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
