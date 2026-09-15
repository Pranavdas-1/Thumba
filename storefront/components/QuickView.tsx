'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency, discountPercentage } from '@thumba/shared';
import type { Product } from '@thumba/shared';
import { useCartStore } from '@/lib/cart-store';
import { displayPrice } from '@/lib/products';
import { RatingStars } from './RatingStars';

export function QuickView({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product.variants?.[0]?.name,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const price = displayPrice(product);
  const discountPct = discountPercentage(
    product.price,
    product.discountedPrice,
  );

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    setAdded(true);
    toast.success(`Added ${product.name} to your bag`);
    setTimeout(() => {
      setAdded(false);
      setOpen(false);
    }, 900);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label={`Quick view ${product.name}`}
          className="flex items-center gap-1.5 bg-ivory-50/95 px-3 py-1.5 text-xs font-medium text-ink-800 backdrop-blur transition-[background-color,color,transform] duration-160 hover:bg-white hover:text-ink-900 active:scale-95"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Quick View</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 border border-ivory-200 bg-ivory-50 p-6 shadow-2xl transition-transform duration-200 ease-out-cubic focus:outline-none md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ivory-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 400px, 90vw"
                />
              ) : null}
              {discountPct > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-ivory-50">
                  {discountPct}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-editorial text-gold-700">
                  {product.category}
                </p>
                <Dialog.Title className="mt-1 font-serif text-2xl font-semibold text-ink-900 md:text-3xl">
                  {product.name}
                </Dialog.Title>

                <div className="mt-2">
                  <RatingStars
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                </div>

                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="text-xl font-medium text-ink-900">
                    {formatCurrency(price)}
                  </span>
                  {product.discountedPrice &&
                    product.discountedPrice < product.price && (
                      <span className="text-sm text-ink-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-600">
                  {product.description}
                </p>

                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5">
                    <label className="text-xs font-medium uppercase tracking-wider text-ink-700">
                      Select Option
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant.name)}
                          className={`rounded-lg border px-3 py-1.5 text-xs transition-all duration-160 ${
                            selectedVariant === variant.name
                              ? 'border-ink-900 bg-ink-900 text-ivory-50'
                              : 'border-ivory-200 bg-white text-ink-700 hover:border-gold-500'
                          }`}
                        >
                          {variant.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-ivory-200 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm text-ink-700 hover:text-ink-900 active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-ink-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-sm text-ink-700 hover:text-ink-900 active:scale-95"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={added}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-ivory-50 transition-all duration-160 hover:bg-ink-800 active:scale-97 disabled:bg-gold-700"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <span>Add to Bag</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-ivory-200 pt-4 text-center">
                <Link
                  href={`/products/${product.slug}`}
                  className="text-xs font-medium tracking-wide text-gold-700 underline underline-offset-4 hover:text-gold-800"
                  onClick={() => setOpen(false)}
                >
                  View full piece details & specifications →
                </Link>
              </div>
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full p-2 text-ink-500 transition-colors hover:bg-ivory-200 hover:text-ink-900"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
